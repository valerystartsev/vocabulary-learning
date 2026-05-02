import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { units } from '../data/courseData';
import { BookOpen, Brain, Headphones, FileText, CheckCircle, ArrowRight, MessageSquare, BarChart3, Lock, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const practiceItems = [
  { icon: BookOpen,      text: "Key business and Economics terms at B1 level: supply, demand, profit, merger, inflation" },
  { icon: FileText,      text: "Adapted reading texts with parallel bilingual paragraph support" },
  { icon: Brain,         text: "Vocabulary dictionary with memory tricks and Russian translations" },
  { icon: MessageSquare, text: "Comics, dialogues, and scenario decision exercises" },
  { icon: Headphones,    text: "Curated videos and podcasts with guided listening tasks" },
  { icon: CheckCircle,   text: "Full unit test with answer key and weak-word review after each unit" },
];

const howItWorks = [
  { step: '01', title: 'Open a unit', titleRu: 'Откройте раздел', desc: 'Start with Unit 1. Read the intro and study the key ideas before moving to vocabulary.', path: '/unit/1' },
  { step: '02', title: 'Learn the vocabulary', titleRu: 'Изучите лексику', desc: 'Use the dictionary — translations, definitions, and memory tricks for each term.', path: '/unit/1' },
  { step: '03', title: 'Complete the exercises', titleRu: 'Выполните задания', desc: 'Practice through matching, gap-fill, reading, comics, crossword, and scenario modes.', path: '/unit/1' },
  { step: '04', title: 'Take the Total Test', titleRu: 'Пройдите итоговый тест', desc: 'Check your knowledge. Review mistakes. Weak words are tracked automatically.', path: '/unit/1' },
];

function AuthGateModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div
        className="rounded-2xl p-7 max-w-sm w-full relative"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, color: 'var(--col-muted)', backgroundColor: 'var(--col-surface-secondary)' }}
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
        >
          <Lock className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        </div>
        <h3 className="font-bold text-lg text-center mb-1" style={{ color: 'var(--col-heading)' }}>
          Registration Required
        </h3>
        <p className="text-xs text-center mb-1" style={{ color: 'var(--col-muted)' }}>Требуется регистрация</p>
        <p className="text-sm text-center mb-2 leading-relaxed" style={{ color: 'var(--col-body)' }}>
          To access course materials, please register or sign in.
        </p>
        <p className="text-xs text-center mb-5 italic" style={{ color: 'var(--col-secondary)' }}>
          Для доступа к материалам курса, пожалуйста, зарегистрируйтесь или войдите в аккаунт.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              console.log('Landing modal login disabled in local migration mode');
              onClose();
            }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--col-accent)' }}
          >
            Log In / Register · Войти / Регистрация
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)' }}
          >
            Not now · Позже
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [showGate, setShowGate] = useState(false);

  const handleLockedClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowGate(true);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      {showGate && <AuthGateModal onClose={() => setShowGate(false)} />}

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--col-sidebar)', paddingTop: 64, paddingBottom: 72 }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded mb-8"
            style={{ backgroundColor: 'rgba(94,158,137,0.18)', color: 'var(--col-accent)', border: '1px solid rgba(94,158,137,0.3)', letterSpacing: '0.04em' }}
          >
            Level B1 · For Russian-speaking students
          </div>

          <h1
            className="font-bold text-white mb-2 leading-tight tracking-tight"
            style={{ fontSize: 'clamp(30px, 5.5vw, 48px)', letterSpacing: '-0.5px' }}
          >
            Adaptation
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', color: 'rgba(255,255,255,0.65)', fontWeight: 400, marginBottom: 20 }}>
            Business English Course — Economics &amp; Finance
          </p>

          <p className="mb-2 leading-relaxed" style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', maxWidth: 560, lineHeight: 1.8 }}>
            This course exists because English textbooks on Economics are difficult to follow — not because Economics itself is hard, but because the language in them has never been made accessible enough. We changed that.
          </p>
          <p className="mb-10 italic" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', maxWidth: 560, lineHeight: 1.7 }}>
            «Этот курс появился потому, что учебники по экономическому английскому трудно воспринимать — не потому что Экономика сложна, а потому что её язык никогда не был достаточно доступным. Мы изменили это.»
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button
                  className="flex items-center justify-center gap-2 font-semibold rounded-lg transition-all w-full sm:w-auto"
                  style={{ backgroundColor: 'var(--col-accent)', color: 'white', minHeight: 52, paddingLeft: 32, paddingRight: 32, fontSize: 15 }}
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  console.log('Landing hero login disabled in local migration mode');
                  setShowGate(true);
                }}
                className="flex items-center justify-center gap-2 font-semibold rounded-lg transition-all"
                style={{ backgroundColor: 'var(--col-accent)', color: 'white', minHeight: 52, paddingLeft: 32, paddingRight: 32, fontSize: 15 }}
              >
                Register / Log In <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <Link to="/glossary" onClick={handleLockedClick}>
              <button
                className="flex items-center justify-center gap-2 font-medium rounded-lg transition-all w-full sm:w-auto"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', minHeight: 52, paddingLeft: 28, paddingRight: 28, fontSize: 15 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {!isAuthenticated && <Lock className="h-3.5 w-3.5" />}
                Open Glossary
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section style={{ backgroundColor: 'var(--col-surface)', borderBottom: '1px solid var(--col-border)' }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-14">
          <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>
            About this course
          </h2>
          <p className="mb-7 text-sm" style={{ color: 'var(--col-muted)' }}>О курсе</p>

          <blockquote
            className="rounded-lg"
            style={{ backgroundColor: 'var(--col-dict-bg)', borderLeft: '3px solid var(--col-accent)', padding: '20px 24px' }}
          >
            <p className="mb-4 leading-relaxed" style={{ fontSize: 15, color: 'var(--col-body)', lineHeight: 1.8, fontFamily: 'var(--font-lora)' }}>
              "We spent weeks working through a university Economics textbook — selecting the vocabulary that matters most, rebuilding exercises from scratch at B1 level, and writing bilingual explanations so that students with no prior background could engage with the material without opening a translator. The AI helped to structure and scale what human expertise had selected. Neither could have produced this result alone."
            </p>
            <p className="italic" style={{ fontSize: 13.5, color: 'var(--col-secondary)', lineHeight: 1.75 }}>
              «Мы провели недели, работая с университетским учебником по Экономике — отбирая наиболее важную лексику, создавая задания заново на уровне B1 и составляя двуязычные объяснения, чтобы студенты без предварительной подготовки могли работать с материалом без переводчика. Искусственный интеллект помог структурировать и масштабировать то, что было отобрано человеческой экспертизой. По отдельности ни то ни другое не смогло бы создать этот результат.»
            </p>
            <p className="mt-4 font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>— Команда Adaptation</p>
          </blockquote>
        </div>
      </section>

      {/* ── What you practise + How it works ── */}
      <section className="max-w-4xl mx-auto px-5 md:px-10 py-14">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">

          <div>
            <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>
              What You Will Practise
            </h2>
            <p className="mb-7 text-sm" style={{ color: 'var(--col-muted)' }}>Что вы будете изучать</p>
            <div className="space-y-4">
              {practiceItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                    style={{ width: 32, height: 32, backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
                  >
                    <item.icon className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--col-body)', lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>
              How It Works
            </h2>
            <p className="mb-7 text-sm" style={{ color: 'var(--col-muted)' }}>Как использовать курс</p>
            <div className="space-y-5">
              {howItWorks.map((item) => (
                <Link key={item.step} to={isAuthenticated ? item.path : '#'} onClick={handleLockedClick} className="flex gap-4 group">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-lg font-bold text-xs text-white transition-all"
                    style={{ width: 36, height: 36, backgroundColor: 'var(--col-sidebar)', minWidth: 36, letterSpacing: '0.05em' }}
                  >
                    {item.step}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-semibold" style={{ fontSize: 15, color: 'var(--col-heading)' }}>
                      {item.title}
                      <span className="font-normal ml-2 text-xs" style={{ color: 'var(--col-muted)' }}>{item.titleRu}</span>
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--col-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Course Contents ── */}
      <section style={{ backgroundColor: 'var(--col-surface)', borderTop: '1px solid var(--col-border)', borderBottom: '1px solid var(--col-border)' }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-14">
          <h2 className="font-semibold mb-1" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>
            Course Contents
          </h2>
          <p className="mb-8 text-sm" style={{ color: 'var(--col-muted)' }}>Содержание курса</p>

          <div className="grid md:grid-cols-2 gap-5">
            {units.map(unit => (
              <div
                key={unit.id}
                className="rounded-xl p-6 flex flex-col card-elevated"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-lg font-bold text-white text-base"
                    style={{ width: 44, height: 44, backgroundColor: 'var(--col-sidebar)', letterSpacing: '-0.5px' }}
                  >
                    {unit.id}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base leading-tight" style={{ color: 'var(--col-heading)', letterSpacing: '-0.1px' }}>
                      {unit.title}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>
                      {unit.vocabulary.length} words · 16 sections
                    </p>
                  </div>
                </div>

                <p className="mb-1 leading-relaxed" style={{ fontSize: 14, color: 'var(--col-body)', lineHeight: 1.65 }}>
                  {unit.description}
                </p>
                {unit.descriptionRu && (
                  <p className="mb-5 italic" style={{ fontSize: 12.5, color: 'var(--col-secondary)', lineHeight: 1.65 }}>
                    {unit.descriptionRu}
                  </p>
                )}

                <div className="mt-auto pt-3">
                  <Link to={isAuthenticated ? `/unit/${unit.id}` : '#'} onClick={handleLockedClick}>
                    <button
                      className="w-full flex items-center justify-center gap-2 rounded-lg font-semibold transition-all"
                      style={{ minHeight: 48, border: '1.5px solid var(--col-accent)', color: 'var(--col-accent)', backgroundColor: 'transparent', fontSize: 14 }}
                      onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--col-accent-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}
                    >
                      {!isAuthenticated && <Lock className="h-3.5 w-3.5" />}
                      {isAuthenticated ? `Open Unit ${unit.id}` : `Unit ${unit.id} — Register to Access`}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center" style={{ backgroundColor: 'var(--col-sidebar)' }}>
        <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Adaptation · Business English · Economics &amp; Finance · Level B1
        </p>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Designed for Russian-speaking university students
        </p>
      </footer>
    </div>
  );
}