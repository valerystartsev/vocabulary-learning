import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnit, units } from '../data/courseData';
import { useProgress } from '../context/ProgressContext';
import { getSectionStatus, getNextRecommendedSection, getSectionSummary } from '../utils/sectionStatus';
import { useMode } from '../context/ModeContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { computeUnitProgress, VISIT_TRACKED_SECTIONS } from '../context/ProgressContext';

// Sections that DON'T track themselves via their own markSectionComplete
// call. For these the page auto-marks completion once the student has
// spent a few seconds with the section in view (IntersectionObserver
// based — pure scrolling past does NOT count). All the interactive
// widgets (compass, calculators, sliders) keep their own stricter
// completion criteria and are not in this set.
// AUTO_MARK is reserved for pure-content sections without any interaction.
// Reading and Comprehension are intentionally excluded because they now
// score themselves on the Check My Answers / Check buttons — auto-marking
// them on top would let a student get credit without engaging with the
// quiz at the bottom of each section.
const AUTO_MARK_SECTIONS = new Set([
  'keyideas', 'dictionary',
  'dialogue', 'writing', 'memo', 'grammar',
  'casestudy', 'roleperspectives', 'labourmarket',
  'timeline', 'impactmap', 'mediaquest',
]);

// AutoSectionMarker — invisible 1px tracker placed inside the section
// container. Marks the section as completed only when:
//   (1) at least 40% of the marker has been visible in the viewport
//   (2) for a continuous 10 seconds
//   (3) AND the user has interacted with the page during that window
//       (scroll, click, key press)
// Without (3) a student who briefly glanced at the page on the way to
// another unit could accidentally trigger completion for sections they
// never actually engaged with — the source of the cross-unit
// "appears done" perception. With all three guards in place a
// completion fire requires deliberate engagement on the current page.
function AutoSectionMarker({ unitId, sectionId, dwellMs = 10000 }) {
  const { progress, markSectionComplete } = useProgress();
  const ref = useRef(null);
  const firedRef = useRef(false);
  const interactedRef = useRef(false);
  const already = !!progress?.completedSections?.[unitId]?.[sectionId];

  useEffect(() => {
    if (already || firedRef.current || !ref.current) return;

    // Track any meaningful user interaction on the page
    const markInteraction = () => { interactedRef.current = true; };
    window.addEventListener('scroll', markInteraction, { passive: true });
    window.addEventListener('click', markInteraction);
    window.addEventListener('keydown', markInteraction);
    window.addEventListener('pointermove', markInteraction);

    let timer = null;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timer = setTimeout(() => {
          if (firedRef.current) return;
          // Hard requirement: deliberate engagement on this page
          if (!interactedRef.current) return;
          firedRef.current = true;
          markSectionComplete?.(unitId, sectionId);
        }, dwellMs);
      } else if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }, { threshold: 0.4 });
    obs.observe(ref.current);

    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', markInteraction);
      window.removeEventListener('click', markInteraction);
      window.removeEventListener('keydown', markInteraction);
      window.removeEventListener('pointermove', markInteraction);
    };
  }, [already, unitId, sectionId, dwellMs, markSectionComplete]);

  return <div ref={ref} aria-hidden style={{ width: 1, height: 1 }} />;
}

import SectionBanner from '../components/unit/SectionBanner';
import LabBanner from '../components/unit/LabBanner';
import ExerciseEngine from '../components/exercises/ExerciseEngine';
import {
  SECTION_COMPONENTS,
  SECTION_LABELS,
  PeopleProgressCards,
  EmploymentSnapshot,
  VocabularyRadar,
} from '../components/unit/sectionRegistry';

// Pull specific components from the registry for use in inline JSX
const UnitHeader              = SECTION_COMPONENTS.header;
const KeyIdeas                = SECTION_COMPONENTS.keyideas;
const Dictionary              = SECTION_COMPONENTS.dictionary;
const ComicsBlock             = SECTION_COMPONENTS.comics;
const ReadingSection          = SECTION_COMPONENTS.reading;
const ComprehensionQuestions  = SECTION_COMPONENTS.comprehension;
const MediaLab                = SECTION_COMPONENTS.media;
const MediaQuest              = SECTION_COMPONENTS.mediaquest;
const DialogueBlock           = SECTION_COMPONENTS.dialogue;
const WritingBlock            = SECTION_COMPONENTS.writing;
const TotalTest               = SECTION_COMPONENTS.totaltest;
const ScenarioLoop            = SECTION_COMPONENTS.scenario;
const CrosswordChallenge      = SECTION_COMPONENTS.crossword;
const MoneyCompass            = SECTION_COMPONENTS.moneycompass;
const GrowthTimeline          = SECTION_COMPONENTS.timeline;
const MemoSection             = SECTION_COMPONENTS.memo;
const LabourMarketSection     = SECTION_COMPONENTS.labourmarket;
const CaseStudySection        = SECTION_COMPONENTS.casestudy;
const RolePerspectives        = SECTION_COMPONENTS.roleperspectives;
const GrammarSection          = SECTION_COMPONENTS.grammar;

// Build the section navigation list.
// Preferred path (Phase 3 / R3): the unit's data file declares
// `sections: ['header', 'keyideas', ...]` — we map IDs to labels via the
// shared SECTION_LABELS registry.
// Legacy fallback: synthesize the list from optional-field flags. Both
// paths produce identical output for the existing Units 1 / 2.
function buildSections(unit) {
  const s = (id, label, labelRu) => ({ id, label, labelRu });

  // R3 path — declarative list from unit data
  if (Array.isArray(unit.sections) && unit.sections.length > 0) {
    return unit.sections
      .map(id => {
        // Lab-pointer banners use the pattern "labbanner:<tool-id>".
        // They have no nav label — the nav strip filters them out.
        if (id.startsWith('labbanner:')) return s(id, '', '');
        const meta = SECTION_LABELS[id];
        if (!meta) {
          console.warn(`[UnitPage] Unknown section id "${id}" for unit ${unit.id}`);
          return null;
        }
        return s(id, meta.label, meta.labelRu);
      })
      .filter(Boolean);
  }

  // Legacy fallback — keeps behaviour identical for any unit lacking `sections`.
  // Course-wide rule: dictionary always appears immediately after keyideas.
  return [
    s('header',           'Intro',        ''),
    s('keyideas',         'Key Ideas',    'Идеи'),
    s('dictionary',       'Dictionary',   'Словарь'),
    ...(unit.moneyCompass  ? [s('moneycompass',   'Money Compass', 'Компас денег')] : []),
    ...(unit.moneyForms    ? [s('moneyforms',     'Money Forms',   'Формы денег')]  : []),
    ...(unit.comics && unit.comics.length > 0 ? [s('comics',     'Comics',       'Комикс')]      : []),
    ...(unit.timeline             ? [s('impactmap',        'Timeline',     'Шкала')]       : []),
    s('exercises',        'Exercises',    'Задания'),
    s('reading',          'Reading',      'Чтение'),
    s('comprehension',    'Questions',    'Вопросы'),
    s('media',            'Media Lab',    'Медиа'),
    ...(unit.mediaQuest           ? [s('mediaquest',       'Media Quest',  'Квест')]       : []),
    s('crossword',        'Crossword',    'Кроссворд'),
    ...(unit.caseStudy            ? [s('casestudy',        'Case Study',   'Кейс')]        : []),
    ...(unit.rolePerspectives     ? [s('roleperspectives', 'Perspectives', 'Роли')]        : []),
    ...(unit.labourMarketSection  ? [s('labourmarket',     'Labour',       'Труд')]        : []),
    s('dialogue',         'Dialogue',     'Диалог'),
    ...(unit.memoSection          ? [s('memo',             'Memo',         'Меморандум')]  : []),
    ...(unit.grammarSection       ? [s('grammar',          'Grammar',      'Грамматика')]  : []),
    s('writing',          'Writing',      'Письмо'),
    s('scenario',         'Scenario',     'Сценарий'),
    s('totaltest',        'Total Test',   'Тест'),
    s('answerkey',        'Answer Key',   'Ответы'),
    s('summary',          'Summary',      'Итог'),
  ];
}

// R4: declarative section renderer.
// Each case below is a self-contained JSX block for one section ID.
// Adding a new section means: 1) build the component, 2) register it in
// sectionRegistry, 3) add a case here, 4) add the ID to a unit's sections.
function renderSection(id, unit, ctx) {
  // Lab pointer banners — handled before the switch because the section
  // ID is dynamic (labbanner:<tool-id>). No SectionDivider above; the
  // banner is intentionally subtle and isn't a unit section in its own right.
  if (id.startsWith('labbanner:')) {
    const toolId = id.slice('labbanner:'.length);
    return <LabBanner toolId={toolId} />;
  }

  const { isTeacherMode, sectionDone, radarWords, radarWordsMedia } = ctx;
  const Banner = <SectionDivider id={id} isDone={sectionDone(id)} />;

  switch (id) {
    case 'header':
      return <div id="section-header"><UnitHeader unit={unit} /></div>;

    case 'keyideas':
      return <>{Banner}<KeyIdeas unit={unit} /></>;

    case 'marketstructures':
      if (!unit.marketStructures) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.marketstructures, {
            data: unit.marketStructures,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'complaintpath':
      if (!unit.complaintPath) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.complaintpath, {
            data: unit.complaintPath,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'growthdrivers':
      if (!unit.growthDrivers) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.growthdrivers, {
            data: unit.growthDrivers,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'techjobsflow':
      if (!unit.techJobsFlow) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.techjobsflow, {
            data: unit.techJobsFlow,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'moneycompass':
      if (!unit.moneyCompass) return null;
      return (
        <>
          {Banner}
          <MoneyCompass data={unit.moneyCompass} unitId={unit.id} isTeacherMode={isTeacherMode} />
        </>
      );

    case 'moneyforms':
      if (!unit.moneyForms) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.moneyforms, {
            data: unit.moneyForms,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'currency':
      if (!unit.currencyComparator) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.currency, {
            data: unit.currencyComparator,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'centralbank':
      if (!unit.centralBankWheel) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.centralbank, {
            data: unit.centralBankWheel,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'bankaccounts':
      if (!unit.bankAccountSection) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.bankaccounts, {
            data: unit.bankAccountSection,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'worldbanking':
      if (!unit.worldBankingMap) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.worldbanking, {
            data: unit.worldBankingMap,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'loansim':
      if (!unit.loanSimulator) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.loansim, {
            data: unit.loanSimulator,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'gdpcalc':
      if (!unit.gdpTwoApproaches) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.gdpcalc, {
            data: unit.gdpTwoApproaches,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'indicators':
      if (!unit.economicIndicatorsDashboard) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.indicators, {
            data: unit.economicIndicatorsDashboard,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'businesscycle':
      if (!unit.businessCycle) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.businesscycle, {
            data: unit.businessCycle,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'balancesheet': {
      // Prefer the new drag-and-drop data shape (`balanceSheet`), fall back
      // to the legacy editable-inputs shape (`balanceSheetBuilder`) for any
      // unit data file that hasn't been migrated yet.
      const bsData = unit.balanceSheet || unit.balanceSheetBuilder;
      if (!bsData) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.balancesheet, {
            data: bsData,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );
    }

    case 'annualreport':
      if (!unit.annualReportReader) return null;
      return (
        <>
          {Banner}
          {React.createElement(SECTION_COMPONENTS.annualreport, {
            data: unit.annualReportReader,
            unitId: unit.id,
            isTeacherMode,
          })}
        </>
      );

    case 'dictionary':
      return (
        <>
          {Banner}
          <Dictionary vocabulary={unit.vocabulary} />
          {unit.radarAfterDictionary && (
            <VocabularyRadar
              words={unit.vocabulary.slice(0, 8)}
              contextLabel={`After Dictionary — Unit ${unit.id}`}
              unitId={unit.id}
            />
          )}
        </>
      );

    case 'comics':
      if (!unit.comics || unit.comics.length === 0) return null;
      return (
        <>
          {Banner}
          <ComicsBlock comics={unit.comics} unitId={unit.id} />
          <VocabularyRadar
            words={unit.vocabulary.filter(v => unit.comics.flatMap(c => c.vocabTags || []).includes(v.term)).slice(0, 8)}
            contextLabel="After Comics"
            unitId={unit.id}
          />
        </>
      );

    case 'impactmap':
    case 'timeline':
      if (!unit.timeline) return null;
      return <>{Banner}<GrowthTimeline /></>;

    case 'exercises':
      return (
        <>
          {Banner}
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
        </>
      );

    case 'reading':
      return <>{Banner}<ReadingSection reading={unit.reading} unitId={unit.id} /></>;

    case 'comprehension':
      return <>{Banner}<ComprehensionQuestions questions={unit.comprehension} unitId={unit.id} /></>;

    case 'media':
      return (
        <>
          {Banner}
          <MediaLab media={unit.media} unitId={unit.id} />
          {unit.media && unit.media.length > 0 && (
            <VocabularyRadar words={radarWordsMedia} contextLabel="After Media Lab" unitId={unit.id} />
          )}
        </>
      );

    case 'mediaquest':
      if (!unit.mediaQuest || !unit.media || unit.media.length === 0) return null;
      return <>{Banner}<MediaQuest media={unit.media} unitId={unit.id} /></>;

    case 'crossword':
      return <>{Banner}<CrosswordChallenge unit={unit} unitId={unit.id} isTeacherMode={isTeacherMode} /></>;

    case 'casestudy':
      if (!unit.caseStudy) return null;
      return <>{Banner}<CaseStudySection data={unit.caseStudy} unitId={unit.id} /></>;

    case 'roleperspectives':
      if (!unit.rolePerspectives) return null;
      return <>{Banner}<PeopleProgressCards /><RolePerspectives data={unit.rolePerspectives} /></>;

    case 'labourmarket':
      if (!unit.labourMarketSection) return null;
      return <>{Banner}<EmploymentSnapshot /><LabourMarketSection data={unit.labourMarketSection} unitId={unit.id} /></>;

    case 'dialogue':
      return <>{Banner}<DialogueBlock dialogue={unit.dialogue} /></>;

    case 'memo':
      if (!unit.memoSection) return null;
      return <>{Banner}<MemoSection data={unit.memoSection} unitId={unit.id} /></>;

    case 'grammar':
      if (!unit.grammarSection) return null;
      return <>{Banner}<GrammarSection data={unit.grammarSection} unitId={unit.id} /></>;

    case 'writing':
      return <>{Banner}<WritingBlock writing={unit.writing} /></>;

    case 'scenario':
      return (
        <>
          {Banner}
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
        </>
      );

    case 'totaltest':
      return (
        <>
          {Banner}
          <TotalTest totalTest={unit.totalTest} unitId={unit.id} />
          <VocabularyRadar words={radarWords} contextLabel="After Total Test — Self Assessment" unitId={unit.id} />
        </>
      );

    default:
      console.warn(`[UnitPage] No render handler for section "${id}"`);
      return null;
  }
}

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
  // Dedupe terms before lookup — a single vocab word can appear in
  // vocabToListen across multiple media items, which used to produce the
  // same vocabulary object twice and trigger a React duplicate-key warning
  // inside VocabularyRadar.
  const radarWordsMedia = [...new Set(unit.media?.flatMap(m => m.vocabToListen || []) || [])]
    .map(term => unit.vocabulary.find(v => v.term === term))
    .filter(Boolean).slice(0, 8);
  const radarWordsMediaFinal = radarWordsMedia.length > 0 ? radarWordsMedia : radarWords.slice(0, 6);

  const sectionDone = (secId) => !!progress.completedSections[unit.id]?.[secId];
  const unitProg = computeUnitProgress(progress, unit.id, unit);

  const SECTIONS = buildSections(unit);

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
          {SECTIONS.filter(sec => !sec.id.startsWith('labbanner:')).map((sec) => {
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
        // Banners are decorative pointers, not tracked sections — exclude
        // them from the progress summary and "next recommended" pick.
        const trackedSections = SECTIONS.filter(s => !s.id.startsWith('labbanner:'));
        const summary = getSectionSummary(trackedSections, unit.id, progress, unit);
        const next = getNextRecommendedSection(trackedSections, unit.id, progress, unit);
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

      {/* R4: declarative render loop — one entry per section.
          AnswerKey and Summary are still rendered inline below because
          they are not standalone components. */}
      {SECTIONS
        .filter(({ id }) => id !== 'answerkey' && id !== 'summary')
        .map(({ id }) => (
          // Key MUST combine unit.id with section id. Without the unit
          // prefix React reconciles the Fragment from the previous unit
          // with the same section id (e.g. 'media' in both Unit 1 and
          // Unit 2) and reuses the inner component instance — that's
          // how local state like MediaLab's `stages` carried "done"
          // pills across units, making unrelated items look completed.
          // Per-unit keys force a full remount on unit navigation.
          <React.Fragment key={`u${unit.id}-${id}`}>
            {renderSection(id, unit, { isTeacherMode, sectionDone, radarWords, radarWordsMedia: radarWordsMediaFinal })}
            {AUTO_MARK_SECTIONS.has(id) && VISIT_TRACKED_SECTIONS.has(id) && (
              <AutoSectionMarker unitId={unit.id} sectionId={id} />
            )}
          </React.Fragment>
        ))}

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