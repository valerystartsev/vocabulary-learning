import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function UnitHeader({ unit }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      id="section-header"
      className="rounded-2xl overflow-hidden mb-2"
      style={{ backgroundColor: 'var(--col-sidebar)', boxShadow: '0 4px 32px rgba(31,45,71,0.18)' }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Amber accent strip — draws from left */}
      <div className="relative overflow-hidden" style={{ height: 4 }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #C9955A 0%, #E0B07A 100%)', opacity: 0.35 }} />
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, #C9955A 0%, #E0B07A 100%)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
        {/* Moving shimmer on the strip */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% center', '300% center'] }}
          transition={{ duration: 2.2, delay: 0.9, ease: 'easeOut', repeat: Infinity, repeatDelay: 4 }}
        />
      </div>

      <div className="px-7 py-7 flex items-start gap-5">
        {/* Animated unit number badge */}
        <motion.div
          className="shrink-0 flex items-center justify-center rounded-2xl font-bold text-white relative overflow-hidden"
          style={{
            width: 62, height: 62,
            backgroundColor: 'rgba(201,149,90,0.18)',
            border: '1.5px solid rgba(201,149,90,0.35)',
            fontSize: 26,
            letterSpacing: '-1px',
          }}
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.22 }}
          whileHover={{ scale: 1.06, backgroundColor: 'rgba(201,149,90,0.28)' }}
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: '1.5px solid rgba(201,149,90,0.6)' }}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.12, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {unit.id}
        </motion.div>

        {/* Text block */}
        <div className="min-w-0">
          {/* Unit badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2.5"
            style={{
              backgroundColor: 'rgba(201,149,90,0.18)',
              color: '#C9955A',
              border: '1px solid rgba(201,149,90,0.3)',
              letterSpacing: '0.04em',
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#C9955A' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Unit {unit.id}
          </motion.div>

          {/* Title with shimmer sweep */}
          <div className="relative overflow-hidden">
            <motion.h1
              className="font-bold text-white leading-tight relative"
              style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {unit.title}
            </motion.h1>
            {/* Single shimmer pass over the title */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)',
                backgroundSize: '200% 100%',
              }}
              initial={{ backgroundPosition: '200% center' }}
              animate={inView ? { backgroundPosition: '-100% center' } : {}}
              transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
            />
          </div>

          {unit.subtitle && (
            <motion.p
              className="mt-1.5"
              style={{ fontSize: 14, color: 'rgba(176,196,220,0.75)', lineHeight: 1.5 }}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.5 }}
            >
              {unit.subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}