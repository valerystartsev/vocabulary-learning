import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { units, getAllVocabulary } from '../data/courseData';
import { useProgress, computeUnitProgress } from '../context/ProgressContext';
import { useMode } from '../context/ModeContext';
import { useAuth } from '../lib/AuthContext';
import { BookOpen, ArrowRight, Brain, AlertTriangle, Trophy, BarChart3, BookText, RotateCcw, Eye, Play } from 'lucide-react';
import WeakWordsRescue from '../components/WeakWordsRescue';
import OnboardingTour, { shouldShowTour } from '../components/OnboardingTour';
import { getDueWords } from '../utils/spacedRepetition';

const TEACHER_EMAIL = 'emzakhtser@mail.ru';
// Normalized comparison — prevents whitespace/case-variant exploits
const isTeacherUser = (u) => u?.email?.toLowerCase().trim() === TEACHER_EMAIL;

export default function Dashboard() {
  const { progress, getUnitProgress } = useProgress();
  const { isTeacherMode } = useMode();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect teacher accounts to teacher dashboard
  useEffect(() => {
    if (user && isTeacherUser(user)) {
      navigate('/teacher', { replace: true });
    }
  }, [user]);
  const allVocab = getAllVocabulary();
  const [showRescue, setShowRescue] = useState(false);
  const [showTour, setShowTour] = useState(() => shouldShowTour());

  // Stale weak words: weak for more than 3 days
  const staleWeakWords = useMemo(() => {
    const addedAt = progress.weakWordsAddedAt || {};
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return progress.weakWords.filter(id => {
      const ts = addedAt[id];
      if (!ts) return true; // no timestamp = treat as stale
      return new Date(ts).getTime() < threeDaysAgo;
    });
  }, [progress.weakWords, progress.weakWordsAddedAt]);

  // SRS due words
  const srsData = progress.srsData || {};
  const allVocabIds = allVocab.map(v => v.id);
  const dueCount = useMemo(() => getDueWords(srsData, allVocabIds).length, [srsData]);

  const totalVocab = allVocab.length;
  const learnedCount = progress.learnedWords.length;
  const weakCount = progress.weakWords.length;
  const courseProgress = units.length > 0
    ? Math.round(units.reduce((acc, u) => acc + computeUnitProgress(progress, u.id, u), 0) / units.length)
    : 0;
  const testsDone = Object.keys(progress.totalTestScores).length;

  const lastUnit = progress.lastOpenedUnit
    ? units.find(u => u.id === progress.lastOpenedUnit)
    : null;
  const untakedTestUnit = units.find(u => progress.totalTestScores[u.id] === undefined);
  const failedTestUnit = units.find(u => progress.totalTestScores[u.id] !== undefined && progress.totalTestScores[u.id] < 70);

  const metricCards = [
    {
      label: 'Course Progress',
      labelRu: 'Прогресс',
      value: `${courseProgress}%`,
      icon: BarChart3,
      onClick: () => navigate('/progress'),
      hasBar: true, barValue: courseProgress,
    },
    {
      label: 'Words Learned',
      labelRu: 'Слов изучено',
      value: learnedCount,
      sub: `of ${totalVocab}`,
      icon: Brain,
      onClick: () => navigate('/glossary?filter=learned'),
      hasBar: true, barValue: totalVocab > 0 ? (learnedCount / totalVocab) * 100 : 0,
    },
    {
      label: 'Weak Words',
      labelRu: 'Слабые слова',
      value: weakCount,
      sub: weakCount > 0 ? 'need review' : 'none yet',
      icon: AlertTriangle,
      onClick: () => navigate('/glossary?filter=weak'),
      alert: weakCount > 0,
    },
    {
      label: 'Tests Done',
      labelRu: 'Тестов пройдено',
      value: testsDone,
      sub: `of ${units.length}`,
      icon: Trophy,
      onClick: () => {
        if (failedTestUnit) navigate(`/unit/${failedTestUnit.id}#section-totaltest`);
        else if (untakedTestUnit) navigate(`/unit/${untakedTestUnit.id}#section-totaltest`);
        else navigate('/progress');
      },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>

      {showTour && <OnboardingTour onDone={() => setShowTour(false)} />}
      {showRescue && <WeakWordsRescue staleWords={staleWeakWords} onClose={() => setShowRescue(false)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold" style={{ fontSize: 28, color: 'var(--col-heading)', letterSpacing: '-0.5px' }}>
          Course Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--col-muted)', marginTop: 4 }}>
          Business English — Adaptation · A1–A2
        </p>
        {isTeacherMode && (
          <div
            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--col-sec-teacher-bg)', color: 'var(--col-sec-teacher-text)', border: '1px solid rgba(160,176,192,0.2)' }}
          >
            <Eye className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            Teacher Mode is ON — all answers are visible in unit pages.
            <div className="ml-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--col-accent)' }} />
          </div>
        )}
      </div>

      {/* ── Metric cards 2×2 ── */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {metricCards.map((card, i) => (
          <button
            key={i}
            onClick={card.onClick}
            className="rounded-2xl p-5 text-left transition-all focus-visible:outline-none card-elevated"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--col-surface)'; e.currentTarget.style.transform = 'none'; }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="uppercase tracking-widest font-semibold" style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.08em' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: 10, color: 'var(--col-tertiary)' }}>{card.labelRu}</p>
              </div>
              <div
                className="p-2 rounded-xl shrink-0"
                style={{ backgroundColor: card.alert ? 'rgba(199,154,74,0.12)' : 'var(--col-accent-light)' }}
              >
                <card.icon
                  className="h-4 w-4"
                  style={{ color: card.alert ? 'var(--col-warning)' : 'var(--col-accent)' }}
                />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold" style={{ fontSize: 30, color: 'var(--col-heading)', lineHeight: 1 }}>
                {card.value}
              </span>
              {card.sub && (
                <span style={{ fontSize: 12, color: 'var(--col-secondary)' }}>{card.sub}</span>
              )}
            </div>
            {card.hasBar && (
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
                <div
                  className="h-full rounded-full progress-bar-animate"
                  style={{ width: `${card.barValue}%`, backgroundColor: 'var(--col-accent)' }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* SRS due banner */}
      {dueCount > 0 && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3" style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--col-accent-text)' }}>{dueCount} word{dueCount !== 1 ? 's' : ''} are due for review today.</p>
            <p className="text-xs italic" style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}>{dueCount} слов ждут повторения сегодня.</p>
          </div>
          <button onClick={() => navigate('/review')} className="px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0" style={{ backgroundColor: 'var(--col-accent)', minHeight: 40 }}>Start Review</button>
        </div>
      )}

      {/* Stale weak words rescue banner */}
      {staleWeakWords.length > 0 && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3" style={{ backgroundColor: '#FFF8E7', border: '1px solid #ECD9A0' }}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--col-warning)' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#6B4C00' }}>You have {staleWeakWords.length} weak word{staleWeakWords.length !== 1 ? 's' : ''} waiting for review. Start a rescue session.</p>
              <p className="text-xs italic" style={{ color: '#6B4C00', opacity: 0.8 }}>У вас {staleWeakWords.length} слабых слов ждут повторения. Начните сессию повторения.</p>
            </div>
          </div>
          <button onClick={() => setShowRescue(true)} className="px-4 py-2 rounded-xl text-sm font-semibold shrink-0" style={{ backgroundColor: 'var(--col-warning)', color: 'white', minHeight: 40 }}>Start Rescue</button>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <h2 className="font-semibold mb-3" style={{ fontSize: 11, color: 'var(--col-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Quick Actions
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-9">

        {/* Continue / Start */}
        {lastUnit ? (
          <Link to={`/unit/${lastUnit.id}`}>
            <div
              className="rounded-lg p-4 flex items-start gap-3 transition-colors cursor-pointer h-full"
              style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#D4EAE4'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-accent-light)'}
            >
              <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent)' }}>
                <Play className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>Continue Learning</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                  Unit {lastUnit.id}: {lastUnit.title}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--col-accent-text)' }}>
                  {getUnitProgress(lastUnit.id)}% complete →
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/unit/1">
            <div
              className="rounded-xl p-4 flex items-start gap-3 transition-colors cursor-pointer h-full"
              style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
            >
              <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent)' }}>
                <Play className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>Start the Course</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>Begin Unit 1: Markets & Monopolies</p>
              </div>
            </div>
          </Link>
        )}

        {/* Weak words */}
        <Link to="/glossary?filter=weak">
        <div
          className="rounded-lg p-4 flex items-start gap-3 cursor-pointer h-full transition-colors"
          style={{
            backgroundColor: weakCount > 0 ? 'rgba(199,154,74,0.08)' : 'var(--col-surface)',
            border: `1px solid ${weakCount > 0 ? 'rgba(199,154,74,0.3)' : 'var(--col-border)'}`,
            opacity: weakCount > 0 ? 1 : 0.65,
          }}
        >
          <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: weakCount > 0 ? 'rgba(199,154,74,0.15)' : 'var(--col-surface-secondary)' }}>
            <AlertTriangle className="h-4 w-4" style={{ color: weakCount > 0 ? 'var(--col-warning)' : 'var(--col-tertiary)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Review Weak Words</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                {weakCount > 0 ? `${weakCount} word${weakCount !== 1 ? 's' : ''} need attention` : 'No weak words yet'}
              </p>
              {weakCount > 0 && (
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--col-warning)' }}>Review in Glossary →</p>
              )}
            </div>
          </div>
        </Link>

        {/* Test action */}
        {failedTestUnit ? (
          <Link to={`/unit/${failedTestUnit.id}#section-totaltest`}>
            <div
              className="rounded-lg p-4 flex items-start gap-3 cursor-pointer h-full transition-colors"
              style={{ backgroundColor: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.25)' }}
            >
              <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(229,115,115,0.15)' }}>
                <RotateCcw className="h-4 w-4" style={{ color: 'var(--col-incorrect)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Retry Total Test</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                  Unit {failedTestUnit.id}: {failedTestUnit.title}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--col-incorrect)' }}>Score: {progress.totalTestScores[failedTestUnit.id]}% — aim for 70%+ →</p>
              </div>
            </div>
          </Link>
        ) : untakedTestUnit ? (
          <Link to={`/unit/${untakedTestUnit.id}#section-totaltest`}>
            <div
              className="rounded-xl p-4 flex items-start gap-3 cursor-pointer h-full"
              style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
            >
              <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent-light)' }}>
                <Trophy className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Take the Total Test</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                  Unit {untakedTestUnit.id}: {untakedTestUnit.title}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--col-accent)' }}>Not taken yet →</p>
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/progress">
            <div
              className="rounded-xl p-4 flex items-start gap-3 cursor-pointer h-full"
              style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
            >
              <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent)' }}>
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>All Tests Done!</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>View your scores and progress</p>
              </div>
            </div>
          </Link>
        )}

        {/* Glossary */}
        <Link to="/glossary">
          <div
            className="rounded-xl p-4 flex items-start gap-3 cursor-pointer h-full transition-colors"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-surface)'}
          >
            <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent-light)' }}>
              <BookText className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Full Glossary</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                {totalVocab} words · search & filter
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>{learnedCount} learned →</p>
            </div>
          </div>
        </Link>

        {/* Progress */}
        <Link to="/progress">
          <div
            className="rounded-xl p-4 flex items-start gap-3 cursor-pointer h-full transition-colors"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-surface)'}
          >
            <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent-light)' }}>
              <BarChart3 className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>My Progress</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>
                Course completion · scores · activity
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>{courseProgress}% overall →</p>
            </div>
          </div>
        </Link>

        {/* Teacher */}
        {isTeacherMode && (
          <div
            className="rounded-xl p-4 flex items-start gap-3 h-full"
            style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-divider)' }}
          >
            <div className="p-2 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: 'var(--col-accent-light)' }}>
              <Eye className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)' }}>Teacher Review</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>All answers visible in unit pages</p>
              <div className="flex flex-col gap-1 mt-2">
                {units.map(u => (
                  <Link key={u.id} to={`/unit/${u.id}#section-answerkey`}
                    className="text-xs font-medium hover:underline"
                    style={{ color: 'var(--col-accent)' }}>
                    → Unit {u.id} Answer Key
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Course Units ── */}
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-bold" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>Course Units</h2>
        <span className="text-sm" style={{ color: 'var(--col-muted)' }}>Разделы курса</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {units.map(unit => {
          const unitProg = computeUnitProgress(progress, unit.id, unit);
          const testScore = progress.totalTestScores[unit.id];
          const scenarioScore = progress.scenarioScores?.[unit.id];
          const scoreColor = testScore === undefined ? null : testScore >= 80 ? 'var(--col-correct)' : testScore >= 60 ? 'var(--col-warning)' : 'var(--col-incorrect)';
          return (
            <div
              key={unit.id}
              className="rounded-2xl p-5 card-elevated"
              style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-xl font-bold text-lg text-white"
                    style={{ width: 50, height: 50, backgroundColor: 'var(--col-sidebar)' }}
                  >
                    {unit.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--col-heading)', letterSpacing: '-0.1px' }}>
                      {unit.title}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>
                      {unit.vocabulary.length} words · {unit.exercises.length} exercises
                    </p>
                  </div>
                </div>
                {testScore !== undefined && (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shrink-0 ml-2"
                    style={{ backgroundColor: `${scoreColor}18`, border: `1px solid ${scoreColor}40` }}
                  >
                    <span className="text-xs font-bold" style={{ color: scoreColor }}>Test: {testScore}%</span>
                  </div>
                )}
              </div>

              <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--col-body)', lineHeight: 1.65 }}>
                {unit.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between mb-1.5" style={{ fontSize: 12, color: 'var(--col-muted)' }}>
                  <span>Progress</span>
                  <span className="font-semibold" style={{ color: unitProg === 100 ? 'var(--col-correct)' : 'var(--col-secondary)' }}>{unitProg}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
                  <div
                    className="h-full rounded-full progress-bar-animate"
                    style={{ width: `${unitProg}%`, backgroundColor: unitProg === 100 ? 'var(--col-correct)' : 'var(--col-accent)' }}
                  />
                </div>
              </div>

              <Link to={`/unit/${unit.id}`}>
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    minHeight: 48,
                    backgroundColor: unitProg > 0 ? 'var(--col-accent)' : 'transparent',
                    border: unitProg > 0 ? 'none' : '1.5px solid var(--col-accent)',
                    color: unitProg > 0 ? 'white' : 'var(--col-accent)',
                  }}
                  onMouseOver={e => {
                    if (unitProg > 0) { e.currentTarget.style.backgroundColor = 'var(--col-accent-hover)'; }
                    else e.currentTarget.style.backgroundColor = 'var(--col-accent-light)';
                  }}
                  onMouseOut={e => {
                    if (unitProg > 0) { e.currentTarget.style.backgroundColor = 'var(--col-accent)'; }
                    else e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  {unitProg === 100 ? 'Review Unit' : unitProg > 0 ? 'Continue Unit' : 'Start Unit'}
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}