import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, useScroll, useTransform, useInView,
  useMotionValue, useSpring, AnimatePresence,
} from 'framer-motion';
import {
  BookOpen, Brain, Headphones, FileText, CheckCircle,
  ArrowRight, MessageSquare, Lock, X, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { units } from '../data/courseData';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE — matches every CSS variable in index.css exactly
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  dark:    '#2C3B3C',   // --col-sidebar
  darker:  '#1e2a2b',
  accent:  '#5E9E89',   // --col-accent
  accentH: '#548E7B',   // --col-accent-hover
  accentL: '#E5F0EC',   // --col-accent-light
  pageBg:  '#F4F5F3',   // --col-page-bg
  surface: '#FCFCFA',   // --col-surface
  border:  '#E2E8E6',   // --col-border
  heading: '#1A2828',   // --col-heading
  body:    '#3A4A48',   // --col-body
  muted:   '#79A08C',   // --col-muted
};

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING ORB — ambient background particle
// ─────────────────────────────────────────────────────────────────────────────
function FloatingOrb({ x, y, size, delay, opacity }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        background: `radial-gradient(circle, ${C.accent}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
        filter: 'blur(2px)',
      }}
      animate={{
        y:       [0, -28, 4, -12, 0],
        x:       [0, 10, -8, 5, 0],
        scale:   [1, 1.1, 0.95, 1.05, 1],
        opacity: [opacity*0.6, opacity, opacity*0.45, opacity*0.85, opacity*0.6],
      }}
      transition={{ duration: 9 + Math.random()*5, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER with count-up
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1.8 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL REVEAL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGGER CONTAINER
// ─────────────────────────────────────────────────────────────────────────────
function StaggerContainer({ children, className = '', stagger = 0.1, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const item = {
    hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
    show:   { opacity: 1, y: 0, filter: 'blur(0px)',
              transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
  };
  return (
    <motion.div ref={ref} className={className}
      variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH GATE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthGateModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="rounded-2xl p-7 max-w-sm w-full relative"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, color: C.muted, backgroundColor: '#f0f0ee' }}>
          <X className="h-4 w-4" />
        </button>
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: C.accentL, border: `1px solid ${C.accentH}40` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="h-5 w-5" style={{ color: C.accent }} />
        </motion.div>
        <h3 className="font-bold text-lg text-center mb-1" style={{ color: C.heading }}>
          Registration Required
        </h3>
        <p className="text-xs text-center mb-1" style={{ color: C.muted }}>Требуется регистрация</p>
        <p className="text-sm text-center mb-2 leading-relaxed" style={{ color: C.body }}>
          To access course materials, please register or sign in.
        </p>
        <p className="text-xs text-center mb-5 italic" style={{ color: C.muted }}>
          Для доступа к материалам зарегистрируйтесь или войдите.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link to="/login" onClick={onClose}>
            <motion.button
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: C.accent }}
              whileHover={{ backgroundColor: C.accentH, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Log In / Register · Войти / Регистрация
            </motion.button>
          </Link>
          <motion.button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{ border: `1px solid ${C.border}`, color: C.body, backgroundColor: C.surface }}
            whileHover={{ backgroundColor: '#f0f0ee' }}
            whileTap={{ scale: 0.97 }}
          >
            Not now · Позже
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const practiceItems = [
  { icon: BookOpen,      text: "Key business and Economics terms at B1: supply, demand, profit, merger, inflation" },
  { icon: FileText,      text: "Adapted reading texts with parallel bilingual paragraph support" },
  { icon: Brain,         text: "Vocabulary dictionary with memory tricks and Russian translations" },
  { icon: MessageSquare, text: "Comics, dialogues, and scenario decision exercises" },
  { icon: Headphones,    text: "Curated videos with guided listening tasks" },
  { icon: CheckCircle,   text: "Full unit test with answer key and weak-word review" },
];

const howItWorks = [
  { step:'01', title:'Open a unit',          titleRu:'Откройте раздел',       desc:'Start with Unit 1. Read the intro and study key ideas.',                         path:'/unit/1' },
  { step:'02', title:'Learn the vocabulary', titleRu:'Изучите лексику',        desc:'Use the dictionary — translations, definitions, memory tricks.',                 path:'/unit/1' },
  { step:'03', title:'Complete the exercises',titleRu:'Выполните задания',     desc:'Practice: matching, gap-fill, reading, comics, crossword, scenario.',          path:'/unit/1' },
  { step:'04', title:'Take the Total Test',  titleRu:'Пройдите итоговый тест', desc:'Check your knowledge. Weak words are tracked automatically.',                   path:'/unit/1' },
];

// Hero stats — derived from real course data so they update automatically
// when units, vocabulary or exercises are added/removed.
const totalVocabCount = units.reduce((acc, u) => acc + (u.vocabulary?.length || 0), 0);
const totalExerciseCount = units.reduce((acc, u) => acc + (u.exercises?.length || 0), 0);
const roundDown = (n, step) => Math.floor(n / step) * step;

const stats = [
  { value: units.length,                       suffix: ' units', label: 'Course Content', labelRu: 'Раздела курса' },
  { value: roundDown(totalVocabCount, 50),     suffix: '+',      label: 'Key Terms',      labelRu: 'Ключевых слов' },
  { value: roundDown(totalExerciseCount, 10),  suffix: '+',      label: 'Exercises',      labelRu: 'Упражнений'    },
  { value: 100,                                suffix: '%',      label: 'Bilingual',      labelRu: 'Двуязычный'    },
];

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [showGate, setShowGate] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax: hero content drifts up as user scrolls
  const heroY       = useTransform(scrollYProgress, [0, 0.3], [0, -55]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  // Sticky progress bar
  const barScaleX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { stiffness: 100, damping: 20 }
  );

  const handleLockedClick = (e) => {
    if (!isAuthenticated) { e.preventDefault(); setShowGate(true); }
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: C.pageBg }}>

      {/* ── Progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[100] origin-left"
        style={{ right: 0, background: C.accent, scaleX: barScaleX }}
      />

      <AnimatePresence>
        {showGate && <AuthGateModal onClose={() => setShowGate(false)} />}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: C.dark, minHeight: '92vh', display: 'flex', alignItems: 'center' }}
      >
        {/* ── Layered background ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Primary gradient mesh */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 90% 65% at 15% 35%, ${C.accent}26 0%, transparent 58%),
                radial-gradient(ellipse 55% 55% at 85% 18%, ${C.accentH}1A 0%, transparent 52%),
                radial-gradient(ellipse 65% 80% at 55% 88%, #1b2728 0%, transparent 62%)
              `,
            }}
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Fine grain texture */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px',
            }}
          />

          {/* Animated grid lines */}
          {[0, 20, 40, 60, 80, 100].map(p => (
            <motion.div key={`v${p}`}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${p}%`, background: `linear-gradient(to bottom, transparent, ${C.accent}22, transparent)` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.3, delay: 0.2 + p * 0.007, ease: 'easeOut' }}
            />
          ))}
          {[0, 25, 50, 75, 100].map(p => (
            <motion.div key={`h${p}`}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${p}%`, background: `linear-gradient(to right, transparent, ${C.accent}18, transparent)` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3 + p * 0.008, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* ── Floating orbs ── */}
        <FloatingOrb x={6}  y={18} size={200} delay={0}   opacity={0.18} />
        <FloatingOrb x={82} y={12} size={140} delay={1.6} opacity={0.14} />
        <FloatingOrb x={72} y={68} size={220} delay={0.9} opacity={0.11} />
        <FloatingOrb x={16} y={72} size={110} delay={2.4} opacity={0.17} />
        <FloatingOrb x={48} y={42} size={90}  delay={3.2} opacity={0.09} />
        <FloatingOrb x={35} y={8}  size={60}  delay={1.1} opacity={0.12} />

        {/* ── Accent top-border ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${C.accent}99, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.25 }}
        />

        {/* ── Hero content (parallax wrapper) ── */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-5 md:px-10 py-24"
          style={{ y: heroY, opacity: heroOpacity }}
        >

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-10"
            style={{
              backgroundColor: `${C.accent}20`,
              color: C.accent,
              border: `1px solid ${C.accent}40`,
              letterSpacing: '0.06em',
              backdropFilter: 'blur(6px)',
            }}
            initial={{ opacity: 0, y: -18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: C.accent }}
              animate={{ opacity: [1, 0.25, 1], scale: [1, 0.75, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            Level B1 · For Russian-speaking students
          </motion.div>

          {/* ── Main title — line-by-line reveal ── */}
          <div className="mb-4 overflow-hidden" style={{ letterSpacing: '-0.045em' }}>
            <h1 className="font-bold leading-none" style={{ fontSize: 'clamp(56px, 10vw, 100px)' }}>
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-white"
                  initial={{ y: '115%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
                >
                  Adaptation
                </motion.span>
              </span>
            </h1>
          </div>

          {/* ── Subtitle with gradient sweep ── */}
          <div className="mb-9 overflow-hidden">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            >
              <motion.p
                className="font-medium"
                style={{
                  fontSize: 'clamp(17px, 2.8vw, 26px)',
                  letterSpacing: '-0.02em',
                }}
              >
                {/* Animated gradient text */}
                <motion.span
                  style={{
                    background: `linear-gradient(100deg, rgba(255,255,255,0.9) 0%, ${C.accent} 35%, rgba(255,255,255,0.85) 55%, ${C.accentH} 75%, rgba(255,255,255,0.9) 100%)`,
                    backgroundSize: '250% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  animate={{ backgroundPosition: ['0% center', '200% center'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                >
                  Business English Course — Economics &amp; Finance
                </motion.span>
              </motion.p>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            className="mb-2 leading-relaxed"
            style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 560, lineHeight: 1.8 }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.65 }}
          >
            This course exists because English textbooks on Economics are difficult to
            follow — not because Economics itself is hard, but because the language in
            them has never been made accessible enough. We changed that.
          </motion.p>

          <motion.p
            className="mb-11 italic"
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.33)', maxWidth: 540, lineHeight: 1.7 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.78 }}
          >
            «Этот курс появился потому, что учебники по экономическому английскому трудно
            воспринимать — мы изменили это.»
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.88 }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button
                  className="group relative flex items-center justify-center gap-2 font-semibold rounded-full overflow-hidden"
                  style={{
                    backgroundColor: C.accent, color: 'white',
                    minHeight: 52, paddingLeft: 32, paddingRight: 32, fontSize: 15,
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: C.accentH }}
                  whileTap={{ scale: 0.96 }}
                >
                  {/* Sweep highlight */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%)',
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ backgroundPosition: '200% center' }}
                    whileHover={{ backgroundPosition: '-50% center' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  <span className="relative">Go to Dashboard</span>
                  <motion.span
                    className="relative"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.button>
              </Link>
            ) : (
              <Link to="/login">
                <motion.button
                  className="group relative flex items-center justify-center gap-2 font-semibold rounded-full overflow-hidden"
                  style={{
                    backgroundColor: C.accent, color: 'white',
                    minHeight: 52, paddingLeft: 32, paddingRight: 32, fontSize: 15,
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: C.accentH }}
                  whileTap={{ scale: 0.96 }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%)',
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ backgroundPosition: '200% center' }}
                    whileHover={{ backgroundPosition: '-50% center' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  <span className="relative">Register / Log In</span>
                  <motion.span
                    className="relative"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.button>
              </Link>
            )}

            <Link to="/glossary" onClick={handleLockedClick}>
              <motion.button
                className="flex items-center justify-center gap-2 font-medium rounded-full"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.78)',
                  minHeight: 52, paddingLeft: 28, paddingRight: 28, fontSize: 15,
                }}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderColor: 'rgba(255,255,255,0.45)',
                  color: '#fff',
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {!isAuthenticated && <Lock className="h-3.5 w-3.5" />}
                Open Glossary
              </motion.button>
            </Link>
          </motion.div>

          {/* ── Stats row ── */}
          <motion.div
            className="mt-14 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.0 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="text-center sm:text-left"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.05 + i * 0.09 }}
                whileHover={{ y: -3 }}
              >
                <p
                  className="font-bold leading-none mb-1"
                  style={{ fontSize: 'clamp(24px, 3.8vw, 34px)', color: C.accent, letterSpacing: '-0.03em' }}
                >
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.48)', lineHeight: 1.4 }}>
                  {s.label}
                  <span className="block" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{s.labelRu}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>scroll</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.28)' }} />
          </motion.div>
        </motion.div>

        {/* Bottom blend into page bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.pageBg})` }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-16">
          <Reveal>
            <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: C.heading, letterSpacing: '-0.2px' }}>
              About this course
            </h2>
            <p className="mb-7 text-sm" style={{ color: C.muted }}>О курсе</p>
          </Reveal>
          <Reveal delay={0.12} y={20}>
            <motion.blockquote
              className="rounded-xl"
              style={{ backgroundColor: C.accentL, borderLeft: `3px solid ${C.accent}`, padding: '20px 24px' }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <p className="mb-4 leading-relaxed" style={{ fontSize: 15, color: C.body, lineHeight: 1.8, fontFamily: 'Lora, Georgia, serif' }}>
                "We spent weeks working through a university Economics textbook — selecting the vocabulary that matters most, rebuilding exercises from scratch at B1 level, and writing bilingual explanations so that students with no prior background could engage with the material without opening a translator."
              </p>
              <p className="italic" style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75 }}>
                «Мы провели недели, работая с университетским учебником — отбирая лексику и создавая двуязычные объяснения.»
              </p>
              <p className="mt-4 font-semibold text-sm" style={{ color: C.accent }}>— Команда Adaptation</p>
            </motion.blockquote>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRACTICE + HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-5 md:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">

          {/* What you practise */}
          <div>
            <Reveal>
              <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: C.heading, letterSpacing: '-0.2px' }}>
                What You Will Practise
              </h2>
              <p className="mb-7 text-sm" style={{ color: C.muted }}>Что вы будете изучать</p>
            </Reveal>
            <StaggerContainer className="space-y-4" stagger={0.09} delay={0.1}>
              {practiceItems.map((item, i) => (
                <motion.div key={i} className="flex items-start gap-3.5"
                  whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                    style={{ width: 32, height: 32, backgroundColor: C.accentL, border: `1px solid ${C.accent}30` }}
                    whileHover={{ scale: 1.15, backgroundColor: `${C.accent}25` }}
                  >
                    <item.icon className="h-3.5 w-3.5" style={{ color: C.accent }} />
                  </motion.div>
                  <p style={{ fontSize: 14, color: C.body, lineHeight: 1.65 }}>{item.text}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>

          {/* How it works */}
          <div>
            <Reveal>
              <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: C.heading, letterSpacing: '-0.2px' }}>
                How It Works
              </h2>
              <p className="mb-7 text-sm" style={{ color: C.muted }}>Как использовать курс</p>
            </Reveal>
            <StaggerContainer className="space-y-5" stagger={0.1} delay={0.1}>
              {howItWorks.map((item) => (
                <Link key={item.step} to={isAuthenticated ? item.path : '#'} onClick={handleLockedClick}>
                  <motion.div className="flex gap-4"
                    whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="shrink-0 flex items-center justify-center rounded-lg font-bold text-xs text-white"
                      style={{ width: 36, height: 36, backgroundColor: C.dark, minWidth: 36, letterSpacing: '0.05em' }}
                      whileHover={{ backgroundColor: C.accent, scale: 1.1 }}
                      transition={{ duration: 0.18 }}
                    >
                      {item.step}
                    </motion.div>
                    <div className="pt-0.5">
                      <p className="font-semibold" style={{ fontSize: 15, color: C.heading }}>
                        {item.title}
                        <span className="font-normal ml-2 text-xs" style={{ color: C.muted }}>{item.titleRu}</span>
                      </p>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COURSE CONTENTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-16">
          <Reveal>
            <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: C.heading, letterSpacing: '-0.2px' }}>
              Course Contents
            </h2>
            <p className="mb-8 text-sm" style={{ color: C.muted }}>Содержание курса</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {units.map((unit, idx) => (
              <Reveal key={unit.id} delay={idx * 0.13} y={24}>
                <motion.div
                  className="rounded-xl p-6 flex flex-col h-full"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                  whileHover={{
                    y: -6,
                    boxShadow: `0 20px 48px ${C.accent}1A, 0 4px 12px rgba(0,0,0,0.05)`,
                    borderColor: `${C.accent}55`,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="shrink-0 flex items-center justify-center rounded-lg font-bold text-white text-base"
                      style={{ width: 44, height: 44, backgroundColor: C.dark, letterSpacing: '-0.5px' }}
                      whileHover={{ backgroundColor: C.accent, scale: 1.07 }}
                      transition={{ duration: 0.18 }}
                    >
                      {unit.id}
                    </motion.div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base leading-tight" style={{ color: C.heading, letterSpacing: '-0.1px' }}>
                        {unit.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>
                        {unit.vocabulary.length} words · 16 sections
                      </p>
                    </div>
                  </div>

                  <p className="mb-1 leading-relaxed" style={{ fontSize: 14, color: C.body, lineHeight: 1.65 }}>
                    {unit.description}
                  </p>
                  {unit.descriptionRu && (
                    <p className="mb-5 italic" style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>
                      {unit.descriptionRu}
                    </p>
                  )}

                  <div className="mt-auto pt-3">
                    <Link to={isAuthenticated ? `/unit/${unit.id}` : '#'} onClick={handleLockedClick}>
                      <motion.button
                        className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold"
                        style={{
                          minHeight: 48,
                          border: `1.5px solid ${C.accent}`,
                          color: C.accent,
                          backgroundColor: 'transparent',
                          fontSize: 14,
                        }}
                        whileHover={{ backgroundColor: C.accentL }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {!isAuthenticated && <Lock className="h-3.5 w-3.5" />}
                        {isAuthenticated ? `Open Unit ${unit.id}` : `Unit ${unit.id} — Register to Access`}
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </motion.span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <Reveal>
        <footer className="py-10 text-center relative overflow-hidden" style={{ backgroundColor: C.dark }}>
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${C.accent}66, transparent)` }}
          />
          <motion.p
            className="text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.36)', letterSpacing: '0.07em', textTransform: 'uppercase' }}
            animate={{ opacity: [0.36, 0.5, 0.36] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Adaptation · Business English · Economics &amp; Finance · Level B1
          </motion.p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Designed for Russian-speaking university students
          </p>
        </footer>
      </Reveal>

    </div>
  );
}