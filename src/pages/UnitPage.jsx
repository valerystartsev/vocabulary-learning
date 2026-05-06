import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnit, units } from '../data/courseData';
import { useProgress } from '../context/ProgressContext';
import { getSectionStatus, getNextRecommendedSection, getSectionSummary } from '../utils/sectionStatus';
import { useMode } from '../context/ModeContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { computeUnitProgress } from '../context/ProgressContext';

import UnitHeader from '../components/unit/UnitHeader';
import KeyIdeas from '../components/unit/KeyIdeas';
import Dictionary from '../components/unit/Dictionary';
import ComicsBlock from '../components/unit/ComicsBlock';
import ReadingSection from '../components/unit/ReadingSection';
import ComprehensionQuestions from '../components/unit/ComprehensionQuestions';
import MediaLab from '../components/unit/MediaLab';
import MediaQuest from '../components/unit/MediaQuest';
import DialogueBlock from '../components/unit/DialogueBlock';
import WritingBlock from '../components/unit/WritingBlock';
import TotalTest from '../components/unit/TotalTest';
import ExerciseEngine from '../components/exercises/ExerciseEngine';
import VocabularyRadar from '../components/unit/VocabularyRadar';
import ScenarioLoop from '../components/unit/ScenarioLoop';
import CrosswordChallenge from '../components/unit/CrosswordChallenge';
import Unit2Crossword from '../components/unit/Unit2Crossword';
import SectionBanner from '../components/unit/SectionBanner';
import GrowthImpactMap from '../components/unit/GrowthImpactMap';
import GrowthTimeline from '../components/unit/GrowthTimeline';
import MemoSection from '../components/unit/MemoSection';
import LabourMarketSection from '../components/unit/LabourMarketSection';
import CaseStudySection from '../components/unit/CaseStudySection';
import RolePerspectives from '../components/unit/RolePerspectives';
import GrammarSection from '../components/unit/GrammarSection';
import PeopleProgressCards from '../components/unit/PeopleProgressCards';
import EmploymentSnapshot from '../components/unit/EmploymentSnapshot';

const SECTIONS_UNIT1 = [
  { id: 'header',      label: 'Intro',       labelRu: '' },
  { id: 'keyideas',    label: 'Key Ideas',   labelRu: 'Идеи' },
  { id: 'dictionary',  label: 'Dictionary',  labelRu: 'Словарь' },
  { id: 'comics',      label: 'Comics',      labelRu: 'Комикс' },
  { id: 'exercises',   label: 'Exercises',   labelRu: 'Задания' },
  { id: 'reading',     label: 'Reading',     labelRu: 'Чтение' },
  { id: 'comprehension', label: 'Questions', labelRu: 'Вопросы' },
  { id: 'media',       label: 'Media Lab',   labelRu: 'Медиа' },
  { id: 'mediaquest',  label: 'Media Quest', labelRu: 'Квест' },
  { id: 'crossword',   label: 'Crossword',   labelRu: 'Кроссворд' },
  { id: 'dialogue',    label: 'Dialogue',    labelRu: 'Диалог' },
  { id: 'writing',     label: 'Writing',     labelRu: 'Письмо' },
  { id: 'scenario',    label: 'Scenario',    labelRu: 'Сценарий' },
  { id: 'totaltest',   label: 'Total Test',  labelRu: 'Тест' },
  { id: 'answerkey',   label: 'Answer Key',  labelRu: 'Ответы' },
  { id: 'summary',     label: 'Summary',     labelRu: 'Итог' },
];

const SECTIONS_UNIT2 = [
  { id: 'header',      label: 'Intro',       labelRu: '' },
  { id: 'keyideas',    label: 'Key Ideas',   labelRu: 'Идеи' },
  { id: 'dictionary',  label: 'Dictionary',  labelRu: 'Словарь' },
  { id: 'impactmap',   label: 'Timeline',    labelRu: 'Шкала' },
  { id: 'exercises',   label: 'Exercises',   labelRu: 'Задания' },
  { id: 'reading',     label: 'Reading',     labelRu: 'Чтение' },
  { id: 'comprehension', label: 'Questions', labelRu: 'Вопросы' },
  { id: 'media',       label: 'Media Lab',   labelRu: 'Медиа' },
  { id: 'crossword',   label: 'Crossword',   labelRu: 'Кроссворд' },
  { id: 'casestudy',   label: 'Case Study',  labelRu: 'Кейс' },
  { id: 'roleperspectives', label: 'Perspectives', labelRu: 'Роли' },
  { id: 'labourmarket', label: 'Labour',     labelRu: 'Труд' },
  { id: 'dialogue',    label: 'Dialogue',    labelRu: 'Диалог' },
  { id: 'memo',        label: 'Memo',        labelRu: 'Меморандум' },
  { id: 'grammar',     label: 'Grammar',     labelRu: 'Грамматика' },
  { id: 'writing',     label: 'Writing',     labelRu: 'Письмо' },
  { id: 'scenario',    label: 'Scenario',    labelRu: 'Сценарий' },
  { id: 'totaltest',   label: 'Total Test',  labelRu: 'Тест' },
  { id: 'answerkey',   label: 'Answer Key',  labelRu: 'Ответы' },
  { id: 'summary',     label: 'Summary',     labelRu: 'Итог' },
];

function SectionDivider({ id, isDone }) {
  return (
    <div id={`section-${id}`} className="mt-10 mb-0">
      <SectionBanner sectionId={id} isDone={isDone} />
    </div>
  );
}

export default function UnitPage() {
  const { id } = useParams();
  const unit = getUnit(id);
  const { setLastOpened, markSectionComplete, progress } = useProgress();
  const { isTeacherMode } = useMode();

  useEffect(() => {
    if (unit) {
      setLastOpened(unit.id, 'header');
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!unit) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--col-heading)' }}>Unit not found</h1>
        <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    );
  }

  const nextUnit = units.find(u => u.id === unit.id + 1);
  const prevUnit = units.find(u => u.id === unit.id - 1);
  const radarWords = unit.vocabulary.slice(0, 8);
  const radarWordsMedia = unit.media?.flatMap(m => m.vocabToListen || [])
    .map(term => unit.vocabulary.find(v => v.term === term))
    .filter(Boolean).slice(0, 8) || radarWords.slice(0, 6);

  const sectionDone = (secId) => !!progress.completedSections[unit.id]?.[secId];
  const unitProg = computeUnitProgress(progress, unit.id, unit);

  const SECTIONS = unit.id === 2 ? SECTIONS_UNIT2 : SECTIONS_UNIT1;

  return (
    <div
      className="max-w-5xl mx-auto px-4 md:px-8 py-6 overflow-x-guard"
      style={{ backgroundColor: 'var(--col-page-bg)' }}
    >
      {/* Top nav bar */}
      <div className="flex items-center justify-between mb-5">
        <Link to="/dashboard">
          <button
            className="flex items-center gap-2 px-4 rounded-xl text-sm font-medium transition-all"
            style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 48, backgroundColor: 'var(--col-surface)' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-surface-secondary)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--col-surface)'}
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="text-xs font-semibold" style={{ color: unitProg === 100 ? '#4A8C6A' : 'var(--col-secondary)' }}>{unitProg}%</span>
            <div className="w-28 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${unitProg}%`, backgroundColor: unitProg === 100 ? '#4A8C6A' : '#C9955A' }} />
            </div>
          </div>
          {isTeacherMode && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--col-sec-teacher-bg)', color: '#C9955A', border: '1px solid rgba(201,149,90,0.25)', minHeight: 44 }}>
              <GraduationCap className="h-3.5 w-3.5" /> Teacher
            </span>
          )}
        </div>
      </div>

      {/* Teacher banner */}
      {isTeacherMode && (
        <div
          className="mb-5 flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium"
          style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)', color: 'var(--col-accent-text)' }}
        >
          <GraduationCap className="h-5 w-5 shrink-0" style={{ color: '#C9955A' }} />
          <span>Teacher Mode active — all correct answers, model answers, and explanations are immediately visible.</span>
        </div>
      )}

      {/* ── Section navigation strip ── */}
      <div
        className="mb-2 rounded-xl overflow-x-auto"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <div className="flex gap-0 min-w-max px-2 py-2">
          {SECTIONS.map((sec) => {
            const SKIP_STATUS = new Set(['header', 'answerkey', 'summary']);
            const status = SKIP_STATUS.has(sec.id)
              ? null
              : getSectionStatus(sec.id, unit.id, progress, unit);

            // Dot colors per status
            const dotStyle = (() => {
              if (!status || status === 'not_started') return null;
              if (status === 'completed') return { bg: 'var(--col-accent)', border: 'var(--col-accent)' };
              if (status === 'in_progress') return { bg: 'transparent', border: 'var(--col-accent)', half: true };
              if (status === 'review_needed') return { bg: 'var(--col-warning)', border: 'var(--col-warning)' };
              return null;
            })();

            const labelColor = (() => {
              if (!status || status === 'not_started') return 'var(--col-secondary)';
              if (status === 'completed') return 'var(--col-accent-text)';
              if (status === 'in_progress') return 'var(--col-accent-text)';
              if (status === 'review_needed') return 'var(--col-warning)';
              return 'var(--col-secondary)';
            })();

            const bottomLineColor = (() => {
              if (status === 'completed') return 'var(--col-accent)';
              if (status === 'in_progress') return 'var(--col-accent)';
              if (status === 'review_needed') return 'var(--col-warning)';
              return 'transparent';
            })();

            return (
              <a
                key={sec.id}
                href={`#section-${sec.id}`}
                className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors text-center relative whitespace-nowrap"
                style={{ minHeight: 48, minWidth: 60 }}
              >
                {/* Status dot — top right */}
                {dotStyle && (
                  <span
                    className="absolute top-1.5 right-1.5 rounded-full shrink-0"
                    style={{
                      width: 6, height: 6,
                      backgroundColor: dotStyle.bg,
                      border: `1.5px solid ${dotStyle.border}`,
                    }}
                  />
                )}
                <span className="text-[11px] font-medium" style={{ color: labelColor }}>
                  {sec.label}
                </span>
                {sec.labelRu && (
                  <span className="text-[9px]" style={{ color: 'var(--col-muted)' }}>{sec.labelRu}</span>
                )}
                {/* Bottom status line */}
                {status && status !== 'not_started' && (
                  <div
                    className="absolute bottom-0 left-2 right-2 rounded-full"
                    style={{
                      height: status === 'in_progress' ? 2 : 2,
                      backgroundColor: bottomLineColor,
                      opacity: status === 'in_progress' ? 0.5 : 1,
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Next recommended + section summary ── */}
      {(() => {
        const summary = getSectionSummary(SECTIONS, unit.id, progress, unit);
        const next = getNextRecommendedSection(SECTIONS, unit.id, progress, unit);
        const allDone = summary.not_started === 0 && summary.in_progress === 0 && summary.review_needed === 0;
        const hasStarted = summary.completed > 0 || summary.in_progress > 0;
        if (!hasStarted && !next) return null;
        return (
          <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
              {summary.completed} of {summary.total} sections complete
              {summary.review_needed > 0 && (
                <span style={{ color: 'var(--col-warning)', marginLeft: 6 }}>
                  · {summary.review_needed} need{summary.review_needed === 1 ? 's' : ''} review
                </span>
              )}
            </p>
            {!allDone && next && (
              <a
                href={`#section-${next.id}`}
                className="text-xs font-medium transition-colors"
                style={{ color: 'var(--col-accent)', textDecoration: 'none' }}
              >
                Next: {next.label} &rarr;
              </a>
            )}
          </div>
        );
      })()}

      {/* ══ SECTION 1: Header ══ */}
      <div id="section-header">
        <UnitHeader unit={unit} />
      </div>

      {/* ══ SECTION 2: Key Ideas ══ */}
      <SectionDivider id="keyideas" isDone={sectionDone('keyideas')} />
      <KeyIdeas unit={unit} />

      {/* ══ SECTION 3: Dictionary ══ */}
      <SectionDivider id="dictionary" isDone={sectionDone('dictionary')} />
      <Dictionary vocabulary={unit.vocabulary} />

      {/* VocabularyRadar after Dictionary for Unit 2 (requested in доработки) */}
      {unit.id === 2 && (
        <VocabularyRadar
          words={unit.vocabulary.slice(0, 8)}
          contextLabel="After Dictionary — Unit 2"
        />
      )}

      {/* ══ SECTION 4: Comics (Unit 1) / Growth Impact Map (Unit 2) ══ */}
      {unit.id === 1 ? (
        <>
          <SectionDivider id="comics" isDone={sectionDone('comics')} />
          <ComicsBlock comics={unit.comics} />
          <VocabularyRadar
            words={unit.vocabulary.filter(v => unit.comics.flatMap(c => c.vocabTags || []).includes(v.term)).slice(0, 8)}
            contextLabel="After Comics"
          />
        </>
      ) : (
        <>
          <SectionDivider id="impactmap" isDone={sectionDone('impactmap')} />
          <GrowthTimeline />
        </>
      )}

      {/* ══ SECTION 5: Exercises ══ */}
      <SectionDivider id="exercises" isDone={sectionDone('exercises')} />
      <p className="text-sm mb-5" style={{ color: 'var(--col-secondary)' }}>
        Complete all exercises. After each one, review your score and check the correct answers.
        Mistakes are automatically added to your Weak Words list.
      </p>
      <p className="text-xs mb-6 italic" style={{ color: 'var(--col-muted)' }}>
        Выполните все задания. Ошибки добавляются в список слабых слов.
      </p>
      {unit.exercises.map(ex => (
        <ExerciseEngine key={ex.id} exercise={ex} unitId={unit.id} />
      ))}

      {/* ══ SECTION 6: Reading ══ */}
      <SectionDivider id="reading" isDone={sectionDone('reading')} />
      <ReadingSection reading={unit.reading} />

      {/* ══ SECTION 7: Comprehension ══ */}
      <SectionDivider id="comprehension" isDone={sectionDone('comprehension')} />
      <ComprehensionQuestions questions={unit.comprehension} />

      {/* ══ SECTION 8: Media Lab ══ */}
      <SectionDivider id="media" isDone={sectionDone('media')} />
      <MediaLab media={unit.media} unitId={unit.id} />
      {unit.media && unit.media.length > 0 && (
        <VocabularyRadar words={radarWordsMedia} contextLabel="After Media Lab" />
      )}

      {/* ══ SECTION 9: Media Quest (Unit 1 only) ══ */}
      {unit.id === 1 && unit.media && unit.media.length > 0 && (
        <>
          <SectionDivider id="mediaquest" isDone={sectionDone('mediaquest')} />
          <MediaQuest media={unit.media} unitId={unit.id} />
        </>
      )}

      {/* ══ SECTION 10: Crossword ══ */}
      <SectionDivider id="crossword" isDone={sectionDone('crossword')} />
      {unit.id === 2
        ? <Unit2Crossword isTeacherMode={isTeacherMode} />
        : <CrosswordChallenge unitId={unit.id} isTeacherMode={isTeacherMode} />
      }

      {/* ══ Unit 2 extra sections: Case Study, Role Perspectives, Labour Market ══ */}
      {unit.id === 2 && (
        <>
          <SectionDivider id="casestudy" isDone={sectionDone('casestudy')} />
          <CaseStudySection data={unit.caseStudy} unitId={unit.id} />

          <SectionDivider id="roleperspectives" isDone={sectionDone('roleperspectives')} />
          <PeopleProgressCards />
          <RolePerspectives data={unit.rolePerspectives} />

          <SectionDivider id="labourmarket" isDone={sectionDone('labourmarket')} />
          <EmploymentSnapshot />
          <LabourMarketSection data={unit.labourMarketSection} unitId={unit.id} />
        </>
      )}

      {/* ══ SECTION 11: Dialogue ══ */}
      <SectionDivider id="dialogue" isDone={sectionDone('dialogue')} />
      <DialogueBlock dialogue={unit.dialogue} />

      {/* ══ Unit 2 Memo & Grammar sections ══ */}
      {unit.id === 2 && (
        <>
          <SectionDivider id="memo" isDone={sectionDone('memo')} />
          <MemoSection data={unit.memoSection} unitId={unit.id} />

          <SectionDivider id="grammar" isDone={sectionDone('grammar')} />
          <GrammarSection data={unit.grammarSection} unitId={unit.id} />
        </>
      )}

      {/* ══ SECTION 12: Writing ══ */}
      <SectionDivider id="writing" isDone={sectionDone('writing')} />
      <WritingBlock writing={unit.writing} />

      {/* ══ SECTION 13: Scenario ══ */}
      <SectionDivider id="scenario" isDone={sectionDone('scenario')} />
      {unit.scenario ? (
        <ScenarioLoop scenario={unit.scenario} unitId={unit.id} />
      ) : (
        <div
          className="mb-8 p-4 rounded-lg text-center text-sm"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', color: 'var(--col-muted)' }}
        >
          Scenario Loop coming soon for this unit.
        </div>
      )}

      {/* ══ SECTION 14: Total Test ══ */}
      <SectionDivider id="totaltest" isDone={sectionDone('totaltest')} />
      <TotalTest totalTest={unit.totalTest} unitId={unit.id} />
      <VocabularyRadar words={radarWords} contextLabel="After Total Test — Self Assessment" />

      {/* ══ SECTION 15: Answer Key (Teacher Only) ══ */}
      <div id="section-answerkey">
        {isTeacherMode && (
          <div
            className="mb-8 p-6 rounded-xl"
            style={{ backgroundColor: 'var(--col-dict-bg)', border: '2px solid var(--col-divider)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--col-heading)' }}>
                Teacher Answer Key — Unit {unit.id}
              </h2>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--col-secondary)' }}>
              All correct answers are shown inline above in Teacher Mode. This is a quick-reference summary.
            </p>
            <div className="space-y-5">
              {unit.exercises.map(ex => (
                <div key={ex.id} className="border-b pb-4" style={{ borderColor: 'var(--col-border)' }}>
                  <h3 className="font-medium text-sm mb-2" style={{ color: 'var(--col-heading)' }}>{ex.title}</h3>
                  <div
                    className="text-xs space-y-1 rounded-lg p-3"
                    style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', color: 'var(--col-secondary)' }}
                  >
                    {ex.type === 'match' && ex.pairs.map((p, i) => <p key={i}><strong>{p.en}</strong> → {p.ru}</p>)}
                    {ex.type === 'trueFalse' && ex.items.map((it, i) => (
                      <p key={i}>{i+1}. "{it.statement.slice(0,50)}..." — <strong>{it.answer ? 'TRUE' : 'FALSE'}</strong>
                        {it.explanation && <span className="italic ml-2 opacity-70">({it.explanation})</span>}
                      </p>
                    ))}
                    {ex.type === 'fillGap' && ex.items.map((it, i) => <p key={i}>{i+1}. Answer: <strong>{it.answer}</strong></p>)}
                    {ex.type === 'multipleChoice' && ex.items.map((it, i) => <p key={i}>{i+1}. Answer: <strong>{it.answer}</strong></p>)}
                    {ex.type === 'conceptMatch' && ex.pairs.map((p, i) => <p key={i}>{p.description} → <strong>{p.term}</strong></p>)}
                  </div>
                </div>
              ))}
              <div>
                <h3 className="font-medium text-sm mb-3" style={{ color: 'var(--col-heading)' }}>Total Test Answer Key</h3>
                <div className="space-y-3">
                  {unit.totalTest.parts.map(part => (
                    <div key={part.id} className="rounded-lg p-3" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
                      <p className="text-xs font-medium mb-2" style={{ color: 'var(--col-heading)' }}>{part.title}:</p>
                      <div className="text-xs space-y-1" style={{ color: 'var(--col-secondary)' }}>
                        {part.type === 'match' && part.pairs.map((p, i) => <p key={i}><strong>{p.en}</strong> → {p.ru}</p>)}
                        {part.type === 'trueFalse' && part.items.map((it, i) => (
                          <p key={i}>{i+1}. <strong>{it.answer ? 'TRUE' : 'FALSE'}</strong> — {it.explanation}</p>
                        ))}
                        {part.type === 'fillGap' && part.items.map((it, i) => <p key={i}>{i+1}. <strong>{it.answer}</strong></p>)}
                        {part.type === 'multipleChoice' && part.items.map((it, i) => <p key={i}>{i+1}. <strong>{it.answer}</strong></p>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {unit.writing && (
                <div>
                  <h3 className="font-medium text-sm mb-2" style={{ color: 'var(--col-heading)' }}>Writing — Sample Answer</h3>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
                  >
                    <p className="text-xs" style={{ color: 'var(--col-accent-text)' }}>{unit.writing.sampleAnswer}</p>
                    {unit.writing.teacherNotes && (
                      <p className="text-xs mt-2 italic" style={{ color: 'var(--col-secondary)' }}>
                        Teacher notes: {unit.writing.teacherNotes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ SECTION 16: Summary ══ */}
      <div
        id="section-summary"
        className="mb-8 p-6 rounded-xl text-center"
        style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
          style={{ backgroundColor: 'var(--col-accent-light)' }}
        >
          <span className="text-2xl font-bold" style={{ color: 'var(--col-accent)' }}>{unit.id}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--col-heading)' }}>
          Unit {unit.id} Complete!
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--col-secondary)' }}>
          {unit.title} — you have reached the end of this unit.
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--col-muted)' }}>
          Review any section using the navigation above, or move to the next unit.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {prevUnit && (
            <Link to={`/unit/${prevUnit.id}`}>
              <button
                className="flex items-center gap-2 px-5 rounded-xl text-sm font-semibold transition-colors"
                style={{ minHeight: 48, border: '1.5px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)' }}
              >
                <ArrowLeft className="h-4 w-4" /> Unit {prevUnit.id}
              </button>
            </Link>
          )}
          {nextUnit && (
            <Link to={`/unit/${nextUnit.id}`}>
              <button
                className="flex items-center gap-2 px-5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ minHeight: 48, backgroundColor: '#C9955A' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--col-accent-hover)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#C9955A'}
              >
                Unit {nextUnit.id}: {nextUnit.title} <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          )}
          <Link to="/dashboard">
            <button
              className="px-5 rounded-xl text-sm font-semibold transition-colors"
              style={{ minHeight: 48, border: '1.5px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface)' }}
            >
              Dashboard
            </button>
          </Link>
          <Link to="/glossary">
            <button
              className="px-5 rounded-xl text-sm font-semibold transition-colors"
              style={{ minHeight: 48, border: '1.5px solid #C9955A', color: '#C9955A' }}
            >
              Review Glossary
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}