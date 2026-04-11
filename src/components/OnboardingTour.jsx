import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const STEPS = [
  { title: 'Welcome to Adaptation', body: 'This is your Business English course dashboard. Here you track your progress, vocabulary, and test scores.', target: 'header' },
  { title: 'Course Units', body: 'Start with Unit 1 (Markets & Monopolies) and progress to Unit 2. Complete exercises and tests to advance.', target: 'units' },
  { title: 'Smart Vocabulary Tools', body: 'Use the Glossary to study words, the Smart Review for spaced repetition, and the Memory Palace for visual learning.', target: 'vocab' },
  { title: 'Track Your Mistakes', body: 'The My Mistakes page shows which words and exercises you find hardest, so you can focus your study.', target: 'mistakes' },
  { title: 'Trade Simulator', body: 'Practice real-world vocabulary by simulating international trade deals in the Trade Simulator.', target: 'trade' },
  { title: 'Listening Lab', body: 'Improve your listening and spelling with audio dictation exercises in the Listening Lab.', target: 'listening' },
  { title: 'You are ready!', body: 'Start with Unit 1 and work your way through. Good luck with your studies!', target: 'done' },
];

export function shouldShowTour() {
  return !localStorage.getItem('adaptation_onboarding_done');
}

export default function OnboardingTour({ onDone }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('adaptation_onboarding_done', '1');
      onDone();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('adaptation_onboarding_done', '1');
    onDone();
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: 'var(--col-surface)', border: '2px solid var(--col-accent)' }}>
        {/* Step dots */}
        <div className="flex gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{ backgroundColor: i <= step ? 'var(--col-accent)' : 'var(--col-divider)' }} />
          ))}
        </div>

        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--col-heading)' }}>{current.title}</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--col-body)', lineHeight: 1.65 }}>{current.body}</p>

        <div className="flex gap-2">
          <button onClick={handleSkip} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 44 }}>
            Skip Tour
          </button>
          <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--col-accent)', minHeight: 44 }}>
            {step === STEPS.length - 1 ? 'Start Learning' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}