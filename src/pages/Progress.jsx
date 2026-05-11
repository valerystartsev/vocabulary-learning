import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { units, getAllVocabulary } from '../data/courseData';
import LearningAnalytics from '../components/progress/LearningAnalytics';
import ReviewSchedule from '../components/progress/ReviewSchedule';
import { useProgress, computeUnitProgress } from '../context/ProgressContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, AlertTriangle, Trophy, BookOpen, RotateCcw, Trash2, Video, Zap, BookText, CheckCircle } from 'lucide-react';

const SECTION_LABELS = {
  header: 'Header', keyideas: 'Key Ideas', dictionary: 'Dictionary',
  comics: 'Comics', exercises: 'Exercises', reading: 'Reading',
  comprehension: 'Questions', media: 'Media', dialogue: 'Dialogue',
  writing: 'Writing', scenario: 'Scenario', totaltest: 'Total Test',
};

function StatCard({ icon: Icon, value, sub, label, color, bar, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  // Count-up
  const [displayVal, setDisplayVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const n = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return;
    const dur = 1.1;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const p = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayVal(Math.round(eased * n));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  const displayValue = typeof value === 'string' && value.includes('%')
    ? `${displayVal}%`
    : displayVal || value;

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl p-5 card-elevated hover-glow"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${color}18` }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 320 }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </motion.div>
        <p className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>{label}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-bold count-up-number"
          style={{ fontSize: 32, color: 'var(--col-heading)', lineHeight: 1 }}>
          {inView ? displayValue : 0}
        </span>
        {sub && <span className="text-sm" style={{ color: 'var(--col-muted)' }}>{sub}</span>}
      </div>
      {bar !== undefined && (
        <div className="mt-3 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--col-divider)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={inView ? { width: `${Math.min(bar, 100)}%` } : {}}
            transition={{ duration: 1.0, delay: delay + 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      )}
    </motion.div>
  );
}

function UnitProgressCard({ unit, unitProg, testScore, scenarioScore, unitSections, completedMediaForUnit, mediaForUnit, unitWeakWords, allVocab, progress }) {
  const sectionKeys = Object.keys(SECTION_LABELS);
  // Compute completed exercises for this unit
  const unitExerciseIds = (unit.exercises || []).map(e => e.id);
  const completedExercisesForUnit = unitExerciseIds.filter(id => progress.completedExercises.includes(id));
  const totalExercises = unitExerciseIds.length;

  const scoreColor = testScore === undefined ? 'var(--col-muted)'
    : testScore >= 80 ? '#4A8C6A'
    : testScore >= 60 ? '#B87820'
    : '#C05050';

  return (
    <div className="rounded-2xl overflow-hidden card-elevated" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      {/* Header */}
      <div
        className="px-6 py-5 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid var(--col-border)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl font-bold text-white text-xl shrink-0"
            style={{ width: 52, height: 52, backgroundColor: 'var(--col-sidebar)' }}
          >
            {unit.id}
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--col-heading)', letterSpacing: '-0.1px' }}>{unit.title}</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>
              {completedExercisesForUnit.length}/{totalExercises} exercises · {completedMediaForUnit}/{mediaForUnit} media
            </p>
          </div>
        </div>
        {testScore !== undefined ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: testScore >= 80 ? '#D8EDDE' : testScore >= 60 ? '#FEF3C7' : '#FEE2E2',
              border: `1px solid ${scoreColor}40`,
            }}
          >
            <Trophy className="h-3.5 w-3.5" style={{ color: scoreColor }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor }}>Test: {testScore}%</span>
          </div>
        ) : (
          <span
            className="px-3 py-1.5 rounded-full text-xs"
            style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-muted)', border: '1px solid var(--col-border)' }}
          >
            No test yet
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between mb-2" style={{ fontSize: 12, color: 'var(--col-muted)' }}>
            <span>Unit Progress</span>
            <span className="font-semibold" style={{ color: unitProg === 100 ? '#4A8C6A' : 'var(--col-heading)' }}>{unitProg}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
            <div
              className="h-full rounded-full progress-bar-animate"
              style={{ width: `${unitProg}%`, backgroundColor: unitProg === 100 ? '#4A8C6A' : '#C9955A' }}
            />
          </div>
        </div>

        {/* Task completion summary */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>Task completion</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Exercises', done: completedExercisesForUnit.length, total: totalExercises },
              { label: 'Media', done: completedMediaForUnit, total: mediaForUnit },
              { label: 'Total Test', done: testScore !== undefined ? 1 : 0, total: 1 },
              { label: 'Scenario', done: scenarioScore !== undefined ? 1 : 0, total: 1 },
            ].map(({ label, done, total }) => (
              <div
                key={label}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
                style={{
                  backgroundColor: done === total && total > 0 ? '#D0EDD8' : 'var(--col-surface-secondary)',
                  border: `1px solid ${done === total && total > 0 ? '#7ABD90' : 'var(--col-border)'}`,
                }}
              >
                <span style={{ color: done === total && total > 0 ? '#2A6A40' : 'var(--col-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ color: done === total && total > 0 ? '#2A6A40' : 'var(--col-secondary)', fontWeight: 700 }}>{done}/{total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak words */}
        {unitWeakWords.length > 0 && (
          <div className="mb-5 p-3.5 rounded-xl" style={{ backgroundColor: '#FEF3C720', border: '1px solid #B8782040' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#B87820' }}>
              <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
              {unitWeakWords.length} weak word{unitWeakWords.length !== 1 ? 's' : ''} in this unit
            </p>
            <div className="flex flex-wrap gap-1">
              {unitWeakWords.map(w => (
                <Badge key={w.id} variant="outline" className="text-[10px]" style={{ borderColor: '#B87820', color: '#B87820' }}>{w.term}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Link to={`/unit/${unit.id}`}>
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: 'var(--col-sidebar)', color: 'white', minHeight: 44 }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <BookOpen className="h-3.5 w-3.5" />
              {unitProg === 100 ? 'Review' : unitProg > 0 ? 'Continue' : 'Start'}
            </button>
          </Link>
          {(testScore === undefined || testScore < 70) && (
            <Link to={`/unit/${unit.id}#section-totaltest`}>
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1.5px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'transparent', minHeight: 44 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trophy className="h-3.5 w-3.5" />
                {testScore === undefined ? 'Take Test' : 'Retry Test'}
              </button>
            </Link>
          )}
          {testScore !== undefined && testScore < 70 && (
            <Link to={`/glossary?unit=${unit.id}&filter=weak`}>
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: '1.5px solid #B87820', color: '#B87820', backgroundColor: 'transparent', minHeight: 44 }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Review Vocab
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Progress() {
  const { progress, resetProgress } = useProgress();
  const allVocab = getAllVocabulary();
  const totalVocab = allVocab.length;
  const courseProgress = units.length > 0
    ? Math.round(units.reduce((acc, u) => acc + computeUnitProgress(progress, u.id, u), 0) / units.length)
    : 0;
  const totalMedia = units.reduce((acc, u) => acc + u.media.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-bold mb-1" style={{ fontSize: 28, color: 'var(--col-heading)', letterSpacing: '-0.5px' }}>My Progress</h1>
        <p style={{ fontSize: 14, color: 'var(--col-muted)' }}>Мой прогресс · Track your learning journey</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={BarChart3} value={`${courseProgress}%`} label="Overall Progress" color="#4A7FA8" bar={courseProgress} />
        <StatCard icon={Brain} value={progress.learnedWords.length} sub={`/${totalVocab}`} label="Words Learned" color="#4A8C6A" bar={(progress.learnedWords.length / totalVocab) * 100} />
        <StatCard icon={AlertTriangle} value={progress.weakWords.length} label="Weak Words" color="#B87820" />
        <StatCard icon={Video} value={progress.completedMedia.length} sub={`/${totalMedia}`} label="Media Done" color="#C9955A" bar={(progress.completedMedia.length / (totalMedia || 1)) * 100} />
      </div>

      {/* Vocabulary breakdown */}
      <div className="rounded-2xl overflow-hidden card-elevated mb-7" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
        <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--col-border)' }}>
          <BookText className="h-4.5 w-4.5" style={{ color: '#4A8C6A' }} />
          <h2 className="font-bold text-base" style={{ color: 'var(--col-heading)' }}>Vocabulary Progress</h2>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Learned', value: progress.learnedWords.length, bg: '#D0EDD8', text: '#2A6A40', border: '#7ABD90' },
              { label: 'Weak — review', value: progress.weakWords.length, bg: '#FEF3C7', text: '#B87820', border: '#D4A820' },
              { label: 'Not studied', value: Math.max(0, totalVocab - progress.learnedWords.length - progress.weakWords.length), bg: 'var(--col-surface-secondary)', text: 'var(--col-muted)', border: 'var(--col-border)' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
                <p className="font-bold text-2xl" style={{ color: s.text }}>{s.value}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: s.text, opacity: 0.8 }}>{s.label}</p>
              </div>
            ))}
          </div>
          {progress.weakWords.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2.5" style={{ color: '#B87820' }}>Words needing review:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {progress.weakWords.slice(0, 20).map(wId => {
                  const w = allVocab.find(v => v.id === wId);
                  return w ? (
                    <span key={wId} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#FEF3C7', color: '#B87820', border: '1px solid #D4A82040' }}>
                      {w.term}
                    </span>
                  ) : null;
                })}
                {progress.weakWords.length > 20 && (
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ color: 'var(--col-muted)' }}>+{progress.weakWords.length - 20} more</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to="/glossary?filter=weak">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ backgroundColor: '#B87820', color: 'white', minHeight: 44 }}>
                    <RotateCcw className="h-3.5 w-3.5" /> Flash Review
                  </button>
                </Link>
                <Link to="/glossary">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ border: '1.5px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'transparent', minHeight: 44 }}>
                    <BookOpen className="h-3.5 w-3.5" /> Open Glossary
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Per-unit progress */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold" style={{ fontSize: 20, color: 'var(--col-heading)', letterSpacing: '-0.2px' }}>Unit Progress</h2>
          <p className="text-sm" style={{ color: 'var(--col-muted)' }}>Прогресс по разделам</p>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        {units.map(unit => {
          const unitProg = computeUnitProgress(progress, unit.id, unit);
          const testScore = progress.totalTestScores[unit.id];
          const scenarioScore = progress.scenarioScores?.[unit.id];
          const unitSections = progress.completedSections[unit.id] || {};
          // Use the same ID generation as computeUnitProgress to ensure counts match
          const unitMediaIds = (unit.media || []).map(m =>
            m.mediaId || `${unit.id}_media_${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`
          );
          const completedMediaForUnit = unitMediaIds.filter(id => progress.completedMedia.includes(id)).length;
          const unitWeakWords = allVocab.filter(v => v.unitId === unit.id && progress.weakWords.includes(v.id));
          return (
            <UnitProgressCard
              key={unit.id}
              unit={unit}
              unitProg={unitProg}
              testScore={testScore}
              scenarioScore={scenarioScore}
              unitSections={unitSections}
              completedMediaForUnit={completedMediaForUnit}
              mediaForUnit={unit.media.length}
              unitWeakWords={unitWeakWords}
              allVocab={allVocab}
              progress={progress}
            />
          );
        })}
      </div>

      {/* Learning Analytics */}
      <LearningAnalytics />

      {/* Review Schedule */}
      <ReviewSchedule />

      {/* Exercise scores */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--col-surface)', border: '1.5px solid #F0CECE' }}
      >
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>Reset All Progress</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>This will clear all learning data permanently.</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          style={{ backgroundColor: '#C05050', color: 'white', minHeight: 44 }}
          onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#A03030'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#C05050'}
        >
          <Trash2 className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}