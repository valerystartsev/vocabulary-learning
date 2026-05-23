/**
 * Computes the 4-state status for a given section based on real progress data.
 *
 * States: 'not_started' | 'in_progress' | 'completed' | 'review_needed'
 *
 * Rules:
 * - Task sections (exercises, totaltest, scenario, crossword, media, mediaquest):
 *   status is derived from actual submission/completion data.
 * - Content sections (dictionary, reading, etc.):
 *   completed if the student visited the section (completedSections flag).
 *   in_progress is not used for pure content sections.
 *
 * review_needed:
 * - exercises: all done but any bestScore < 70, OR unit has weak words from that unit
 * - totaltest: score < 70
 * - scenario: score < 60
 * - media: all completed but any mediaTaskScore < 60
 */
export function getSectionStatus(sectionId, unitId, progress, unit) {
  if (!progress || !unit) return 'not_started';

  const visited = !!progress.completedSections?.[unitId]?.[sectionId];

  switch (sectionId) {

    // ── Interactive task sections ───────────────────────────────────────────

    case 'exercises': {
      const exIds = (unit.exercises || []).map(e => e.id);
      if (exIds.length === 0) return visited ? 'completed' : 'not_started';
      const doneIds = exIds.filter(id => progress.completedExercises?.includes(id));
      if (doneIds.length === 0) return 'not_started';
      const allDone = doneIds.length === exIds.length;
      if (!allDone) return 'in_progress';
      // All done — check quality
      const anyWeak = exIds.some(id => {
        const best = progress.exerciseBestScores?.[id];
        return best !== undefined && best < 70;
      });
      return anyWeak ? 'review_needed' : 'completed';
    }

    case 'totaltest': {
      const score = progress.totalTestScores?.[unitId];
      if (score === undefined) return visited ? 'in_progress' : 'not_started';
      return score >= 70 ? 'completed' : 'review_needed';
    }

    case 'scenario': {
      const sc = progress.scenarioScores?.[unitId];
      if (!sc) return visited ? 'in_progress' : 'not_started';
      return (sc.score ?? 0) >= 60 ? 'completed' : 'review_needed';
    }

    case 'crossword': {
      const cw = progress.crosswordScores?.[unitId];
      if (!cw) return visited ? 'in_progress' : 'not_started';
      return 'completed';
    }

    case 'media': {
      const mediaIds = (unit.media || []).map(m =>
        m.mediaId || `${unitId}_media_${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`
      );
      if (mediaIds.length === 0) return visited ? 'completed' : 'not_started';
      const doneCount = mediaIds.filter(id => progress.completedMedia?.includes(id)).length;
      if (doneCount === 0) return visited ? 'in_progress' : 'not_started';
      if (doneCount < mediaIds.length) return 'in_progress';
      // All done — check task scores
      const anyWeakMedia = mediaIds.some(id => {
        const s = progress.mediaTaskScores?.[id];
        return s !== undefined && s < 60;
      });
      return anyWeakMedia ? 'review_needed' : 'completed';
    }

    case 'mediaquest': {
      const mqScores = progress.mediaQuestScores || {};
      const hasAny = Object.keys(mqScores).some(k => k.startsWith(`${unitId}_`) || k.includes('mediaquest'));
      if (!hasAny && !visited) return 'not_started';
      if (!hasAny && visited) return 'in_progress';
      return 'completed';
    }

    // ── Content sections — visit-based ─────────────────────────────────────

    case 'dictionary':
    case 'reading':
    case 'comprehension':
    case 'dialogue':
    case 'writing':
    case 'keyideas':
    case 'comics':
    case 'impactmap':
    case 'casestudy':
    case 'roleperspectives':
    case 'labourmarket':
    case 'memo':
    case 'grammar':
    // ── Unit 3 new feature section IDs ─────────────────────────────────────
    case 'moneycompass':       // moneyFunctionsCompass — 4 functions of money
    case 'bankaccounts':       // bankAccountSection — current/checking/time/bond
    case 'loansimulator':      // loanSimulator — Arthur's car loan
    case 'currencycomparator': // currencyComparator — £ vs $
    // ── Unit 4 new feature section IDs ─────────────────────────────────────
    case 'gdpapproaches':      // gdpTwoApproaches — earnings vs flow-of-product
    case 'telephoneetiquette': // telephoneEtiquetteSection — phone phrases
    case 'indicators':         // economicIndicatorsDashboard — leading/coincident/lagging
    case 'annualreport':       // annualReportReader — RusTech Solutions tabs
    case 'policymap':          // economicPolicyMap — 5 countries
    case 'governmentpolicy': { // governmentPolicySection — fiscal vs monetary
      return visited ? 'completed' : 'not_started';
    }

    // ── Non-tracked sections ────────────────────────────────────────────────

    case 'header':
    case 'answerkey':
    case 'summary':
    default:
      return 'not_started'; // no status displayed for these
  }
}

/**
 * Returns the first incomplete section the student should visit next.
 * Priority: task sections before content sections.
 */
export function getNextRecommendedSection(sections, unitId, progress, unit) {
  // Skip decorative sections
  const SKIP = new Set(['header', 'answerkey', 'summary']);
  // Task sections get priority
  const TASK_SECTIONS = new Set(['exercises', 'totaltest', 'scenario', 'crossword', 'media', 'mediaquest']);

  const trackable = sections.filter(s => !SKIP.has(s.id));

  // First: find an in_progress task section
  const inProgress = trackable.find(s => {
    if (!TASK_SECTIONS.has(s.id)) return false;
    return getSectionStatus(s.id, unitId, progress, unit) === 'in_progress';
  });
  if (inProgress) return inProgress;

  // Second: find a not_started task section
  const notStartedTask = trackable.find(s => {
    if (!TASK_SECTIONS.has(s.id)) return false;
    return getSectionStatus(s.id, unitId, progress, unit) === 'not_started';
  });
  if (notStartedTask) return notStartedTask;

  // Third: find a review_needed section
  const reviewNeeded = trackable.find(s =>
    getSectionStatus(s.id, unitId, progress, unit) === 'review_needed'
  );
  if (reviewNeeded) return reviewNeeded;

  // Fourth: any not_started content section
  const notStartedContent = trackable.find(s =>
    getSectionStatus(s.id, unitId, progress, unit) === 'not_started'
  );
  if (notStartedContent) return notStartedContent;

  return null; // all done
}

/**
 * Returns summary counts for a unit's trackable sections.
 */
export function getSectionSummary(sections, unitId, progress, unit) {
  const SKIP = new Set(['header', 'answerkey', 'summary']);
  const trackable = sections.filter(s => !SKIP.has(s.id));
  const counts = { completed: 0, in_progress: 0, review_needed: 0, not_started: 0, total: trackable.length };
  trackable.forEach(s => {
    const st = getSectionStatus(s.id, unitId, progress, unit);
    counts[st] = (counts[st] || 0) + 1;
  });
  return counts;
}