import React, { useState, useEffect } from 'react';
import { getAllVocabulary } from '../data/courseData';
import PronounceButton from '../components/PronounceButton';
import DifficultWordsTab from '../components/DifficultWordsTab';
import { useProgress } from '../context/ProgressContext';
import { Input } from '@/components/ui/input';
import WordMorphologyBlock from '../components/unit/WordMorphologyBlock';
import { wordMorphology } from '../data/wordMorphology';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookText, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Zap, RotateCcw, X, ArrowRight, BookOpen } from 'lucide-react';

/* ── Flash card ── */
function FlashCard({ word, onKnow, onStillWeak }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="text-center">
      <div
        className="cursor-pointer rounded-xl mb-4 min-h-[140px] flex flex-col items-center justify-center transition-colors"
        style={{
          backgroundColor: flipped ? 'var(--col-dict-bg)' : 'var(--col-surface)',
          border: `2px solid ${flipped ? 'var(--col-accent)' : 'var(--col-border)'}`,
          padding: '24px 20px',
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {!flipped ? (
          <>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--col-heading)' }}>{word.term}</p>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Нажмите, чтобы увидеть значение</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold mb-1" style={{ color: 'var(--col-accent)' }}>{word.translationRu}</p>
            <p className="text-sm mb-2" style={{ color: 'var(--col-body)' }}>{word.meaningEn}</p>
            <p className="text-xs italic" style={{ color: 'var(--col-secondary)' }}>"{word.example}"</p>
          </>
        )}
      </div>
      {flipped && (
        <div className="flex gap-3 justify-center">
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--col-correct)', minHeight: 40 }}
            onClick={onKnow}
          >
            <CheckCircle className="h-3.5 w-3.5" /> I got it
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--col-warning)',
              color: 'var(--col-warning)',
              minHeight: 40,
            }}
            onClick={onStillWeak}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Still unsure
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Micro quiz ── */
function MicroQuiz({ words, onDone }) {
  const quiz = words.slice(0, 6).map(w => {
    const wrong = words.filter(x => x.id !== w.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...wrong.map(x => x.translationRu), w.translationRu].sort(() => Math.random() - 0.5);
    return { word: w, options: opts, answer: w.translationRu };
  });

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const pick = (opt) => {
    setSelected(opt);
    if (opt === quiz[idx].answer) setScore(s => s + 1);
    setTimeout(() => {
      if (idx < quiz.length - 1) { setIdx(i => i + 1); setSelected(null); }
      else setDone(true);
    }, 900);
  };

  if (done) return (
    <div className="text-center p-6">
      <p className="text-3xl font-bold mb-2" style={{ color: 'var(--col-heading)' }}>{score}/{quiz.length}</p>
      <p className="text-sm mb-5" style={{ color: 'var(--col-secondary)' }}>
        {score === quiz.length ? 'Отлично! Все правильно.' : 'Хорошая попытка. Повторите пропущенные.'}
      </p>
      <button
        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: 'var(--col-accent)' }}
        onClick={onDone}
      >
        Back to Glossary
      </button>
    </div>
  );

  const q = quiz[idx];
  return (
    <div>
      <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--col-muted)' }}>
        <span>Question {idx + 1} of {quiz.length}</span>
        <span>Score: {score}</span>
      </div>
      <p className="text-xl font-bold text-center mb-2" style={{ color: 'var(--col-heading)' }}>{q.word.term}</p>
      <p className="text-xs text-center mb-5" style={{ color: 'var(--col-muted)' }}>
        Выберите правильный перевод на русский:
      </p>
      <div className="space-y-2">
        {q.options.map(opt => {
          let bg = 'var(--col-surface)';
          let border = 'var(--col-border)';
          let color = 'var(--col-body)';
          if (selected) {
            if (opt === q.answer) { bg = 'var(--col-accent-light)'; border = 'var(--col-accent)'; color = 'var(--col-accent-text)'; }
            else if (selected === opt) { bg = '#FFF0F0'; border = 'var(--col-incorrect)'; color = '#C62828'; }
          }
          return (
            <button
              key={opt}
              disabled={!!selected}
              onClick={() => pick(opt)}
              className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
              style={{ backgroundColor: bg, border: `1px solid ${border}`, color, minHeight: 48 }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Glossary ── */
export default function Glossary() {
  const allVocab = getAllVocabulary();
  const { progress, markWordLearned, markWordWeak } = useProgress();
  const [activeTab, setActiveTab] = useState('vocab');
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posFilter, setPosFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [reviewMode, setReviewMode] = useState(null);
  const [flashIdx, setFlashIdx] = useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get('filter');
  useEffect(() => {
    if (initialFilter === 'weak') setStatusFilter('weak');
    if (initialFilter === 'learned') setStatusFilter('learned');
  }, []);

  const allPos = [...new Set(allVocab.map(v => v.pos))];
  const filtered = allVocab.filter(v => {
    const matchSearch = v.term.toLowerCase().includes(search.toLowerCase()) || v.translationRu.toLowerCase().includes(search.toLowerCase());
    const matchUnit = unitFilter === 'all' || v.unitId === Number(unitFilter);
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'learned' && progress.learnedWords.includes(v.id)) ||
      (statusFilter === 'weak' && progress.weakWords.includes(v.id)) ||
      (statusFilter === 'new' && !progress.learnedWords.includes(v.id) && !progress.weakWords.includes(v.id));
    const matchPos = posFilter === 'all' || v.pos === posFilter;
    return matchSearch && matchUnit && matchStatus && matchPos;
  });

  const weakWords = allVocab.filter(v => progress.weakWords.includes(v.id));

  /* ── Flash review mode ── */
  if (reviewMode === 'flash' && weakWords.length > 0) {
    const word = weakWords[flashIdx % weakWords.length];
    return (
      <div className="max-w-lg mx-auto px-5 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg" style={{ color: 'var(--col-heading)' }}>Flash Review</h2>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Слабые слова — {flashIdx + 1} of {weakWords.length}</p>
          </div>
          <button
            onClick={() => setReviewMode(null)}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 36, height: 36, border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="mb-6 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(100, (flashIdx / weakWords.length) * 100)}%`, backgroundColor: 'var(--col-accent)' }}
          />
        </div>
        <FlashCard
          word={word}
          onKnow={() => { markWordLearned(word.id); setFlashIdx(i => i + 1); }}
          onStillWeak={() => setFlashIdx(i => i + 1)}
        />
        {flashIdx >= weakWords.length && (
          <div className="text-center mt-6">
            <p className="text-sm mb-3" style={{ color: 'var(--col-secondary)' }}>
              All weak words reviewed! Все слабые слова повторены.
            </p>
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--col-accent)' }}
              onClick={() => setReviewMode(null)}
            >
              Back to Glossary
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Micro quiz mode ── */
  if (reviewMode === 'quiz' && weakWords.length >= 4) {
    return (
      <div className="max-w-lg mx-auto px-5 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg" style={{ color: 'var(--col-heading)' }}>Micro Quiz</h2>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>Слабые слова</p>
          </div>
          <button
            onClick={() => setReviewMode(null)}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 36, height: 36, border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <MicroQuiz words={weakWords} onDone={() => setReviewMode(null)} />
      </div>
    );
  }

  /* ── Main view ── */
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'vocab', label: 'Course Vocabulary', labelRu: 'Словарь курса', icon: BookText },
          { id: 'difficult', label: 'Difficult Words', labelRu: 'Трудные слова', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--col-accent)' : 'var(--col-surface)',
              color: activeTab === tab.id ? 'white' : 'var(--col-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
              minHeight: 44,
            }}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            <span className="text-xs opacity-70 hidden sm:inline">· {tab.labelRu}</span>
          </button>
        ))}
      </div>

      {/* Difficult Words tab */}
      {activeTab === 'difficult' && <DifficultWordsTab />}

      {/* Course Vocabulary tab — header */}
      {activeTab === 'vocab' && <>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl shrink-0"
            style={{ backgroundColor: 'var(--col-accent-light)' }}
          >
            <BookText className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          </div>
          <div>
            <h1 className="font-semibold text-2xl" style={{ color: 'var(--col-heading)' }}>Glossary</h1>
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
              Словарь · {allVocab.length} words ·{' '}
              <span style={{ color: 'var(--col-correct)' }}>{progress.learnedWords.length} learned</span>
              {' '}·{' '}
              <span style={{ color: 'var(--col-warning)' }}>{progress.weakWords.length} weak</span>
            </p>
          </div>
        </div>

        {weakWords.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--col-warning)',
                color: 'var(--col-warning)',
                minHeight: 40,
              }}
              onClick={() => { setFlashIdx(0); setReviewMode('flash'); }}
            >
              <Zap className="h-3.5 w-3.5" /> Flash Review ({weakWords.length})
            </button>
            {weakWords.length >= 4 && (
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--col-warning)',
                  color: 'var(--col-warning)',
                  minHeight: 40,
                }}
                onClick={() => setReviewMode('quiz')}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Micro Quiz
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weak words banner */}
      {weakWords.length > 0 && (
        <div
          className="rounded-lg mb-5 px-4 py-3"
          style={{ backgroundColor: '#FFF8E7', border: '1px solid #ECD9A0' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-warning)' }} />
              <span className="text-sm font-medium" style={{ color: '#6B4C00' }}>
                You have {weakWords.length} weak word{weakWords.length !== 1 ? 's' : ''}. Review them now →
              </span>
              <div className="flex flex-wrap gap-1">
                {weakWords.slice(0, 6).map(w => (
                  <span
                    key={w.id}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: '#FFF3CD', color: '#856404', border: '1px solid #ECD9A0' }}
                  >
                    {w.term}
                  </span>
                ))}
                {weakWords.length > 6 && (
                  <span className="text-xs" style={{ color: 'var(--col-muted)' }}>+{weakWords.length - 6} more</span>
                )}
              </div>
            </div>
            <button
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
              style={{ backgroundColor: 'var(--col-warning)', minHeight: 32 }}
              onClick={() => { setFlashIdx(0); setReviewMode('flash'); }}
            >
              Start Review
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--col-muted)' }} />
          <Input
            placeholder="Search words / слова..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
            style={{ minHeight: 40 }}
          />
        </div>
        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="w-28" style={{ minHeight: 40 }}><SelectValue placeholder="Unit" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            <SelectItem value="1">Unit 1</SelectItem>
            <SelectItem value="2">Unit 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28" style={{ minHeight: 40 }}><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="learned">Learned</SelectItem>
            <SelectItem value="weak">Weak</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
        <Select value={posFilter} onValueChange={setPosFilter}>
          <SelectTrigger className="w-36" style={{ minHeight: 40 }}><SelectValue placeholder="Part of speech" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {allPos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || unitFilter !== 'all' || statusFilter !== 'all' || posFilter !== 'all') && (
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 40 }}
            onClick={() => { setSearch(''); setUnitFilter('all'); setStatusFilter('all'); setPosFilter('all'); }}
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--col-muted)' }}>
        {filtered.length} word{filtered.length !== 1 ? 's' : ''} shown
      </p>

      {/* Word list */}
      <div className="space-y-2">
        {filtered.map(word => {
          const isExpanded = expandedId === word.id;
          const isLearned = progress.learnedWords.includes(word.id);
          const isWeak = progress.weakWords.includes(word.id);

          let cardBg = 'var(--col-surface)';
          let cardBorder = 'var(--col-border)';
          if (isLearned) { cardBg = '#F0FAF5'; cardBorder = '#A8D5BA'; }
          else if (isWeak) { cardBg = '#FFFBF0'; cardBorder = '#E8D08A'; }

          return (
            <div
              key={word.id}
              className="rounded-xl overflow-hidden transition-shadow"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : word.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left gap-2"
              >
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-semibold" style={{ fontSize: 15, color: 'var(--col-heading)' }}>
                    {word.term}
                  </span>
                  <PronounceButton term={word.term} audioUrl={word.audioUrl} size="xs" />
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}
                  >
                    {word.pos}
                  </span>
                  <span className="text-sm truncate" style={{ color: 'var(--col-secondary)' }}>
                    — {word.translationRu}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-tertiary)', border: '1px solid var(--col-border)' }}
                  >
                    U{word.unitId}
                  </span>
                  {isLearned && <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-correct)' }} />}
                  {isWeak && !isLearned && <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-warning)' }} />}
                </div>
                {isExpanded
                  ? <ChevronUp className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
                  : <ChevronDown className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
                }
              </button>

              {isExpanded && (
              <div
                className="px-4 pb-4 border-t"
                style={{ borderColor: cardBorder }}
              >
                <div className="space-y-3 mt-3">
                  {/* Morphology: IPA + forms */}
                  <WordMorphologyBlock morphology={wordMorphology[word.id]} derivedForms={wordMorphology[word.id]?.derivedForms} />

                    {/* Memory trick */}
                    <div
                      className="rounded-lg px-4 py-3"
                      style={{
                        backgroundColor: 'var(--col-dict-bg)',
                        borderLeft: '3px solid var(--col-accent)',
                      }}
                    >
                      <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>
                        Memory Trick · Мнемоника
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{word.trick}</p>
                    </div>

                    {/* Definitions */}
                    <div className="grid md:grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                        <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>English definition</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{word.meaningEn}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                        <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>Русское значение</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{word.meaningRu}</p>
                      </div>
                    </div>

                    {/* Collocations */}
                    {word.collocations && word.collocations.length > 0 && (
                      <div
                        className="rounded-lg px-4 py-3"
                        style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
                      >
                        <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: 'var(--col-muted)', letterSpacing: '0.06em' }}>
                          Collocations · Сочетания
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {word.collocations.map((col, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)', border: '1px solid var(--col-divider)' }}
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example */}
                    <div
                      className="px-4 py-2.5 rounded-lg"
                      style={{ backgroundColor: 'var(--col-surface)', borderLeft: '2px solid var(--col-accent)', border: '1px solid var(--col-border)' }}
                    >
                      <p className="text-xs italic" style={{ color: 'var(--col-accent-text)' }}>"{word.example}"</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isLearned ? 'var(--col-correct)' : 'transparent',
                          border: isLearned ? 'none' : '1px solid var(--col-correct)',
                          color: isLearned ? 'white' : 'var(--col-correct)',
                          minHeight: 40,
                        }}
                        onClick={() => markWordLearned(word.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {isLearned ? 'Learned ✓' : 'Mark Learned'}
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: isWeak ? '#FFF8E7' : 'transparent',
                          border: `1px solid ${isWeak ? 'var(--col-warning)' : 'var(--col-border)'}`,
                          color: isWeak ? 'var(--col-warning)' : 'var(--col-secondary)',
                          minHeight: 40,
                        }}
                        onClick={() => markWordWeak(word.id)}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {isWeak ? 'Weak ⚠' : 'Mark Weak'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-14" style={{ color: 'var(--col-muted)' }}>
            <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No words match your filters.</p>
            <button
              className="mt-3 text-sm px-4 py-2 rounded-lg"
              style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
              onClick={() => { setSearch(''); setUnitFilter('all'); setStatusFilter('all'); setPosFilter('all'); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      </> }
    </div>
  );
}