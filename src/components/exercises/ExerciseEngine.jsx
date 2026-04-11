import React, { useState, useEffect } from 'react';
import { useMode } from '../../context/ModeContext';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff, BookOpen, AlertTriangle } from 'lucide-react';
import MatchExercise from './MatchExercise';
import TrueFalseExercise from './TrueFalseExercise';
import FillGapExercise from './FillGapExercise';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import ConceptMatchExercise from './ConceptMatchExercise';

export default function ExerciseEngine({ exercise, unitId }) {
  const { isTeacherMode } = useMode();
  const { markExerciseComplete, markSectionComplete, addWeakWordsFromExercise, progress } = useProgress();
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wrongWordIds, setWrongWordIds] = useState([]);

  useEffect(() => {
    setSubmitted(false);
    setAnswers({});
    setResults(null);
    setShowAnswers(isTeacherMode);
    setShowExplanation(isTeacherMode);
    setWrongWordIds([]);
  }, [exercise.id, isTeacherMode]);

  const handleCheck = (res) => {
    setResults(res);
    setSubmitted(true);
    const score = Math.round((res.correct / res.total) * 100);
    markExerciseComplete(exercise.id, score);
    // Mark the exercises section as visited for badge display
    if (unitId) markSectionComplete(unitId, 'exercises');
    if (res.wrongWordIds?.length > 0) {
      setWrongWordIds(res.wrongWordIds);
      addWeakWordsFromExercise(res.wrongWordIds);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setAnswers({});
    setResults(null);
    setShowAnswers(isTeacherMode);
    setShowExplanation(isTeacherMode);
    setWrongWordIds([]);
  };

  const previousScore = progress.exerciseScores[exercise.id];

  const exerciseProps = {
    exercise, answers, setAnswers, submitted, results,
    showAnswers, showExplanation, onCheck: handleCheck, isTeacherMode,
  };

  const renderExercise = () => {
    switch (exercise.type) {
      case 'match':         return <MatchExercise {...exerciseProps} />;
      case 'trueFalse':     return <TrueFalseExercise {...exerciseProps} />;
      case 'fillGap':       return <FillGapExercise {...exerciseProps} />;
      case 'multipleChoice':return <MultipleChoiceExercise {...exerciseProps} />;
      case 'conceptMatch':  return <ConceptMatchExercise {...exerciseProps} />;
      default:              return <p style={{ color: 'var(--col-muted)' }}>Unknown exercise type.</p>;
    }
  };

  const scoreColor = results
    ? results.correct === results.total ? 'var(--col-correct)'
      : results.correct >= results.total / 2 ? 'var(--col-warning)'
      : 'var(--col-incorrect)'
    : 'var(--col-accent)';

  return (
    <div
      className="mb-5 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--col-surface)',
        border: isTeacherMode ? '1px solid var(--col-divider)' : '1px solid var(--col-border)',
        outline: isTeacherMode ? '2px solid var(--col-accent-light)' : 'none',
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--col-border)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <div className="min-w-0">
              <h3 className="font-semibold" style={{ fontSize: 15, color: 'var(--col-heading)' }}>
                {exercise.title}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)', lineHeight: 1.5 }}>
                {exercise.instruction}
              </p>
              {exercise.instructionRu && (
                <p className="text-xs mt-0.5 italic" style={{ color: 'var(--col-muted)', lineHeight: 1.5 }}>
                  {exercise.instructionRu}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {previousScore !== undefined && !submitted && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-secondary)', border: '1px solid var(--col-border)' }}
              >
                Last: {previousScore}%
              </span>
            )}
            {isTeacherMode && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)' }}
              >
                Teacher Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Exercise body */}
      <div className="px-5 py-4">
        {renderExercise()}

        {/* Results */}
        {submitted && results && (
          <div
            className="mt-4 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: results.correct === results.total ? '#F0FAF5'
                : results.correct >= results.total / 2 ? '#FFF8E7' : '#FFF0F0',
              border: `1px solid ${results.correct === results.total ? '#A8D5BA'
                : results.correct >= results.total / 2 ? '#ECD9A0' : '#F0CECE'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {results.correct === results.total
                ? <CheckCircle className="h-4 w-4" style={{ color: 'var(--col-correct)' }} />
                : <XCircle className="h-4 w-4" style={{ color: scoreColor }} />
              }
              <span className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
                Score: {results.correct}/{results.total} ({Math.round((results.correct / results.total) * 100)}%)
              </span>
            </div>
            {results.correct === results.total ? (
              <p className="text-xs" style={{ color: 'var(--col-correct)' }}>Perfect — all answers correct.</p>
            ) : (
              <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>
                {results.total - results.correct} mistake{results.total - results.correct !== 1 ? 's' : ''}.
                Use "Show Answers" to review.
              </p>
            )}
            {wrongWordIds.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" style={{ color: 'var(--col-warning)' }} />
                <span className="text-xs font-medium" style={{ color: '#6B4C00' }}>
                  {wrongWordIds.length} word{wrongWordIds.length !== 1 ? 's' : ''} added to Weak Words.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        {submitted && (
          <div className="grid grid-cols-2 gap-2 mt-4 sm:flex sm:flex-wrap">
            {[
              { icon: showAnswers ? EyeOff : Eye, label: showAnswers ? 'Hide Answers' : 'Show Answers', fn: () => setShowAnswers(!showAnswers) },
              { icon: Eye, label: showExplanation ? 'Hide Notes' : 'Show Notes', fn: () => setShowExplanation(!showExplanation) },
              { icon: RotateCcw, label: 'Try Again', fn: handleRetry, full: true },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.fn}
                className={`flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors ${btn.full ? 'col-span-2' : ''}`}
                style={{ minHeight: 48, backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
              >
                <btn.icon className="h-4 w-4 shrink-0" />
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}