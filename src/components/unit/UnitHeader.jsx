import React from 'react';

export default function UnitHeader({ unit }) {
  return (
    <div
      id="section-header"
      className="rounded-2xl overflow-hidden mb-2"
      style={{ backgroundColor: 'var(--col-sidebar)', boxShadow: '0 4px 24px rgba(31,45,71,0.15)' }}
    >
      {/* Amber accent strip */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #C9955A 0%, #E0B07A 100%)' }} />

      <div className="px-7 py-7 flex items-start gap-5">
        <div
          className="shrink-0 flex items-center justify-center rounded-2xl font-bold text-white"
          style={{ width: 62, height: 62, backgroundColor: 'rgba(201,149,90,0.18)', border: '1.5px solid rgba(201,149,90,0.35)', fontSize: 26, letterSpacing: '-1px' }}
        >
          {unit.id}
        </div>
        <div className="min-w-0">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2.5"
            style={{ backgroundColor: 'rgba(201,149,90,0.18)', color: '#C9955A', border: '1px solid rgba(201,149,90,0.3)', letterSpacing: '0.04em' }}
          >
            Unit {unit.id}
          </div>
          <h1
            className="font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', letterSpacing: '-0.5px' }}
          >
            {unit.title}
          </h1>
          {unit.subtitle && (
            <p className="mt-1.5" style={{ fontSize: 14, color: 'rgba(176,196,220,0.75)', lineHeight: 1.5 }}>
              {unit.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}