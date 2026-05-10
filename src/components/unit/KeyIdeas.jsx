import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Store, Swords, Crown, TrendingUp, ThumbsUp, AlertTriangle } from 'lucide-react';

const iconMap = { Store, Swords, Crown, TrendingUp, ThumbsUp, AlertTriangle };

// Accent colours that stay in brand
const CARD_TINTS = [
  { glow: 'rgba(94,158,137,0.12)',  border: 'rgba(94,158,137,0.28)' },
  { glow: 'rgba(201,149,90,0.10)', border: 'rgba(201,149,90,0.26)' },
  { glow: 'rgba(94,158,137,0.09)', border: 'rgba(94,158,137,0.22)' },
];

function GlowCard({ idea, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = iconMap[idea.icon] || Store;
  const tint = CARD_TINTS[index % CARD_TINTS.length];

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--col-surface)',
        border: `1.5px solid var(--col-border)`,
      }}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{
        y: -6,
        borderColor: tint.border,
        boxShadow: `0 16px 40px ${tint.glow}, 0 4px 12px rgba(0,0,0,0.06)`,
        transition: { duration: 0.28, ease: 'easeOut' },
      }}
    >
      {/* Subtle ambient glow behind card (appears on hover via parent) */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ background: tint.glow, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-5 flex flex-col h-full">
        {/* Icon + term row */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 38, height: 38,
              backgroundColor: 'var(--col-accent-light)',
              border: '1px solid var(--col-divider)',
            }}
            whileHover={{ scale: 1.12, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: 'var(--col-accent)', width: 18, height: 18 }} />
          </motion.div>

          <div>
            <h4 className="font-bold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>
              {idea.term}
            </h4>
            <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>{idea.termRu}</p>
          </div>
        </div>

        {/* Meaning */}
        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)', lineHeight: 1.65 }}>
          {idea.meaning}
        </p>
        {idea.meaningRu && (
          <p className="text-xs italic mt-2" style={{ color: 'var(--col-secondary)', lineHeight: 1.6 }}>
            {idea.meaningRu}
          </p>
        )}

        {/* Bottom accent line (reveals on hover) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl"
          style={{
            background: index % 2 === 0
              ? 'linear-gradient(90deg, var(--col-accent), transparent)'
              : 'linear-gradient(90deg, #C9955A, transparent)',
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function KeyIdeas({ unit }) {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-50px' });

  return (
    <div className="mb-8" id="section-keyideas">
      {/* Section header */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 18 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2
          className="font-bold mb-1 leading-tight"
          style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}
        >
          What is this unit about?
        </h2>
        <p className="text-sm mb-1 leading-relaxed" style={{ color: 'var(--col-body)' }}>
          {unit.description}
        </p>
        <p className="text-xs italic mb-6" style={{ color: 'var(--col-muted)', lineHeight: 1.6 }}>
          {unit.descriptionRu}
        </p>
      </motion.div>

      {/* Three Key Ideas label */}
      <motion.h3
        className="font-semibold mb-4"
        style={{ fontSize: 16, color: 'var(--col-heading)', letterSpacing: '-0.1px' }}
        initial={{ opacity: 0, x: -12 }}
        animate={titleInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        Three Key Ideas
      </motion.h3>

      {/* Cards grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {unit.keyIdeas.map((idea, i) => (
          <GlowCard key={i} idea={idea} index={i} />
        ))}
      </div>
    </div>
  );
}