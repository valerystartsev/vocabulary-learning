// src/pages/Landing.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { units } from '../data/courseData';
import { ArrowRight, Lock, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

function AuthGateModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
      <div className="rounded-2xl p-7 max-w-sm w-full relative"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, color: 'var(--col-muted)', backgroundColor: 'var(--col-surface-secondary)' }}>
          <X className="h-4 w-4" />
        </button>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
          <Lock className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        </div>
        <h3 className="font-bold text-lg text-center mb-1" style={{ color: 'var(--col-heading)' }}>
          Registration Required
        </h3>
        <p className="text-xs text-center mb-1" style={{ color: 'var(--col-muted)' }}>
          Требуется регистрация
        </p>
        <p className="text-sm text-center mb-2 leading-relaxed" style={{ color: 'var(--col-body)' }}>
          To access course materials, please register or sign in.
        </p>
        <p className="text-xs text-center mb-5 italic" style={{ color: 'var(--col-secondary)' }}>
          Для доступа к материалам курса зарегистрируйтесь или войдите.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link to="/login" onClick={onClose}>
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--col-accent)' }}>
              Log In / Register · Войти / Регистрация
            </button>
          </Link>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)' }}>
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

  const handleLockedClick = e => {
    if (!isAuthenticated) { e.preventDefault(); setShowGate(true); }
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      {showGate && <AuthGateModal onClose={() => setShowGate(false)} />}

      <section style={{ backgroundColor: 'var(--col-sidebar)', paddingTop: 64, paddingBottom: 72 }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded mb-8"
            style={{ backgroundColor: 'rgba(94,158,137,0.18)', color: 'var(--col-accent)', border: '1px solid rgba(94,158,137,0.3)' }}>
            Level B1 · For Russian-speaking students
          </div>
          <h1 className="font-bold text-white mb-2 leading-tight"
            style={{ fontSize: 'clamp(30px,5vw,48px)' }}>
            Adaptation
          </h1>
          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
            Business English Course — Economics & Finance
          </p>
          <p className="mb-10" style={{ maxWidth: 560, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)' }}>
            This course exists because English textbooks on Economics are difficult to follow —
            not because Economics itself is hard, but because the language in them has never been
            made accessible enough. We changed that.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="rounded-lg px-8 h-12 text-white font-semibold flex items-center gap-2"
                  style={{ backgroundColor: 'var(--col-accent)' }}>
                  Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="rounded-lg px-8 h-12 text-white font-semibold flex items-center gap-2"
                  style={{ backgroundColor: 'var(--col-accent)' }}>
                  Register / Log In <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            )}
            <Link to="/glossary" onClick={handleLockedClick}>
              <button className="rounded-lg px-8 h-12 flex items-center gap-2"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                {!isAuthenticated && <Lock className="h-4 w-4" />} Glossary
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-10 py-14">
        <div className="grid md:grid-cols-2 gap-5">
          {units.map(unit => (
            <div key={unit.id} className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--col-heading)' }}>
                Unit {unit.id}: {unit.title}
              </h3>
              <p className="mb-5" style={{ color: 'var(--col-body)', lineHeight: 1.6 }}>
                {unit.description}
              </p>
              <Link to={isAuthenticated ? `/unit/${unit.id}` : '#'} onClick={handleLockedClick}>
                <button className="w-full h-11 rounded-lg font-semibold flex items-center justify-center gap-2"
                  style={{ border: '1px solid var(--col-accent)', color: 'var(--col-accent)' }}>
                  {!isAuthenticated && <Lock className="h-4 w-4" />} Open Unit
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center" style={{ backgroundColor: 'var(--col-sidebar)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Adaptation · Business English</p>
      </footer>
    </div>
  );
}