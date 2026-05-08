import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateNextReview, getDefaultCard } from '../utils/spacedRepetition';

const ProgressContext = createContext();

const TEACHER_EMAIL = 'emzakhtser@mail.ru'; // canonical — used for normalized comparison

export const DEFAULT_PROGRESS = {
  learnedWords: [],
  weakWords: [],
  weakWordsAddedAt: {},
  completedExercises: [],
  exerciseScores: {},
  exerciseBestScores: {},
  exerciseAttempts: {},
  completedSections: {},
  totalTestScores: {},
  completedMedia: [],
  mediaTaskScores: {},
  vocabRadar: {},
  lastOpenedUnit: null,
  lastOpenedSection: null,
  scenarioScores: {},
  crosswordScores: {},
  mediaQuestScores: {},
  srsData: {},
  errorLog: [],
};

// localStorage key scoped to a specific user so no cross-user leakage
const storageKey = (userId) => `adaptation_progress_${userId}`;

function loadProgress(userId) {
  if (!userId) return DEFAULT_PROGRESS;
  try {
    const userKey = storageKey(userId);
    const saved = localStorage.getItem(userKey);
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };

    // One-time migration: if old unscoped key exists, adopt it and clear it
    const legacyKey = 'adaptation_progress';
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      const parsed = { ...DEFAULT_PROGRESS, ...JSON.parse(legacy) };
      localStorage.setItem(userKey, JSON.stringify(parsed));
      localStorage.removeItem(legacyKey);
      return parsed;
    }
  } catch {}
  return DEFAULT_PROGRESS;
}

// ─── Progress calculation model ───────────────────────────────────────────────
//
// Progress is computed from REAL completed actions, not passive section visits.
//
// For each unit, the "trackable task slots" are:
//   • Each exercise in unit.exercises  (weight: 1 each)
//   • Each media item in unit.media    (weight: 1 each)
//   • Total Test completion             (weight: 3 — counts as 3 slots)
//   • Scenario completion              (weight: 1)
//   • Crossword completion             (weight: 1)
//
// This means a student who completes even ONE exercise immediately shows progress.
//
// getUnitProgress(unitId, unitData) → 0-100
// unitData is the full unit object from courseData (passed in by the consumer).
//
// We also keep markSectionComplete for section visited tracking (used for badges/display),
// but it no longer drives the progress percentage.

export function computeUnitProgress(prog, unitId, unit) {
  if (!unit) return 0;

  const exerciseIds = (unit.exercises || []).map(e => e.id);
  const mediaIds = (unit.media || []).map(m =>
    m.mediaId || `${unitId}_media_${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`
  );

  let completed = 0;
  let total = 0;

  // Exercises (1 slot each)
  exerciseIds.forEach(id => {
    total += 1;
    if (prog.completedExercises.includes(id)) completed += 1;
  });

  // Media items (1 slot each)
  mediaIds.forEach(id => {
    total += 1;
    if (prog.completedMedia.includes(id)) completed += 1;
  });

  // Total Test (3 slots — significant milestone)
  total += 3;
  if (prog.totalTestScores?.[unitId] !== undefined) completed += 3;

  // Scenario (1 slot)
  if (unit.scenario) {
    total += 1;
    if (prog.scenarioScores?.[unitId] !== undefined) completed += 1;
  }

  // Crossword (1 slot)
  total += 1;
  if (prog.crosswordScores?.[unitId] !== undefined) completed += 1;

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// ProgressProvider receives user from parent (bridged from AuthContext)
export function ProgressProvider({ children, user, courseUnits }) {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const syncTimeoutRef = useRef(null);
  const currentUserIdRef = useRef(null);

  // Derive a stable userId from the user object
  // Normalize teacher email comparison to prevent whitespace/case leakage
  const userId = user && user.email?.toLowerCase().trim() !== TEACHER_EMAIL ? (user.id || user.email) : null;

  // Re-load progress whenever the authenticated userId changes (login / account switch / logout)
  useEffect(() => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    currentUserIdRef.current = userId;
    if (userId) {
      // Step 1: Load local data immediately (no network, instant render)
      const local = loadProgress(userId);
      setProgress(local);
      // Step 2: Always fetch from DB to merge — handles cross-device sync.
      // Even if local data exists, DB may have newer progress from another device.
      hydrateFromDB(local);
    } else {
      setProgress(DEFAULT_PROGRESS);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore and MERGE progress from Supabase.
  // Called on every login — merges DB state with local state so no progress is ever lost.
  // Merge strategy: take the UNION of all arrays and the MAXIMUM of all numeric scores.
  const hydrateFromDB = async (localSnapshot) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('saved_progress')
        .eq('id', userId)
        .single();

      if (error || !data?.saved_progress) return;
      const db = data.saved_progress;
      if (!db || Object.keys(db).length === 0) return;

      // Merge: union of arrays, best scores, most complete maps
      setProgress(prev => {
        const merged = {
          ...DEFAULT_PROGRESS,
          ...prev,
          // Arrays: union (never lose any completed item)
          learnedWords:        [...new Set([...(prev.learnedWords || []),        ...(db.learnedWords || [])])],
          weakWords:           [...new Set([...(prev.weakWords || []),           ...(db.weakWords || [])])],
          completedExercises:  [...new Set([...(prev.completedExercises || []),  ...(db.completedExercises || [])])],
          completedMedia:      [...new Set([...(prev.completedMedia || []),       ...(db.completedMedia || [])])],
          // Scores: keep best score across devices
          exerciseScores:      { ...(db.exerciseScores || {}), ...(prev.exerciseScores || {}) },
          exerciseBestScores:  mergeScores(db.exerciseBestScores, prev.exerciseBestScores),
          exerciseAttempts:    { ...(db.exerciseAttempts || {}), ...(prev.exerciseAttempts || {}) },
          totalTestScores:     mergeScores(db.totalTestScores, prev.totalTestScores),
          // Maps: union
          completedSections:   deepMerge(db.completedSections, prev.completedSections),
          vocabRadar:          { ...(db.vocabRadar || {}), ...(prev.vocabRadar || {}) },
          weakWordsAddedAt:    { ...(db.weakWordsAddedAt || {}), ...(prev.weakWordsAddedAt || {}) },
          scenarioScores:      { ...(db.scenarioScores || {}), ...(prev.scenarioScores || {}) },
          crosswordScores:     { ...(db.crosswordScores || {}), ...(prev.crosswordScores || {}) },
          mediaTaskScores:     { ...(db.mediaTaskScores || {}), ...(prev.mediaTaskScores || {}) },
          mediaQuestScores:    { ...(db.mediaQuestScores || {}), ...(prev.mediaQuestScores || {}) },
          srsData:             { ...(db.srsData || {}), ...(prev.srsData || {}) },
        };
        // Persist the merged result to localStorage immediately
        localStorage.setItem(storageKey(userId), JSON.stringify(merged));
        return merged;
      });
    } catch (e) {
      // DB unavailable — local data is still shown, no crash
      console.error('hydrateFromDB error:', e.message);
    }
  };

  // Helpers for merge logic
  function mergeScores(a, b) {
    const result = { ...(a || {}) };
    Object.entries(b || {}).forEach(([k, v]) => {
      result[k] = result[k] !== undefined ? Math.max(result[k], v) : v;
    });
    return result;
  }
  function deepMerge(a, b) {
    const result = { ...(a || {}) };
    Object.entries(b || {}).forEach(([k, v]) => {
      result[k] = typeof v === 'object' && !Array.isArray(v)
        ? { ...(result[k] || {}), ...v }
        : v;
    });
    return result;
  }

  // Persist to localStorage and debounce sync to DB whenever progress changes
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(storageKey(userId), JSON.stringify(progress));
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => syncProgressToUser(progress), 2000);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [progress, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncProgressToUser = async (prog) => {
    if (!userId) return;
    try {
      const snapshot = { ...prog };
      delete snapshot.errorLog; // Don't store error logs in DB (keeps payload small)
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          saved_progress: snapshot,
          updated_at: new Date().toISOString(),
        });
    } catch (e) {
      // Sync failed silently — local data is safe, will retry on next change
      console.error('syncProgressToUser error:', e.message);
    }
  };

  // Keep a ref to courseUnits so syncProgressToUser can access it without stale closure
  const courseUnitsRef = useRef(courseUnits || []);
  useEffect(() => {
    courseUnitsRef.current = courseUnits || [];
  }, [courseUnits]);

  const markWordLearned = useCallback((wordId) => {
    setProgress(p => {
      const newAddedAt = { ...p.weakWordsAddedAt };
      delete newAddedAt[wordId];
      return {
        ...p,
        learnedWords: p.learnedWords.includes(wordId) ? p.learnedWords : [...p.learnedWords, wordId],
        weakWords: p.weakWords.filter(w => w !== wordId),
        weakWordsAddedAt: newAddedAt,
      };
    });
  }, []);

  const markWordWeak = useCallback((wordId) => {
    setProgress(p => ({
      ...p,
      weakWords: p.weakWords.includes(wordId) ? p.weakWords : [...p.weakWords, wordId],
      weakWordsAddedAt: p.weakWordsAddedAt[wordId]
        ? p.weakWordsAddedAt
        : { ...p.weakWordsAddedAt, [wordId]: new Date().toISOString() },
    }));
  }, []);

  const updateSRS = useCallback((wordId, quality) => {
    setProgress(p => {
      const existing = p.srsData[wordId] || getDefaultCard();
      const updated = calculateNextReview(existing, quality);
      return { ...p, srsData: { ...p.srsData, [wordId]: updated } };
    });
  }, []);

  const logError = useCallback((errorData) => {
    setProgress(p => {
      const newLog = [
        ...p.errorLog,
        { ...errorData, timestamp: new Date().toISOString() },
      ].slice(-200);
      return { ...p, errorLog: newLog };
    });
  }, []);

  const addWeakWordsFromExercise = useCallback((wordIds) => {
    setProgress(p => ({
      ...p,
      weakWords: [...new Set([...p.weakWords, ...wordIds])],
    }));
  }, []);

  const markExerciseComplete = useCallback((exId, score) => {
    setProgress(p => {
      const prevBest = p.exerciseBestScores?.[exId];
      const newBest = prevBest === undefined ? score : Math.max(prevBest, score);
      const prevAttempts = p.exerciseAttempts?.[exId] || 0;
      return {
        ...p,
        completedExercises: p.completedExercises.includes(exId) ? p.completedExercises : [...p.completedExercises, exId],
        exerciseScores: { ...p.exerciseScores, [exId]: score },         // latest score
        exerciseBestScores: { ...p.exerciseBestScores, [exId]: newBest }, // best score
        exerciseAttempts: { ...p.exerciseAttempts, [exId]: prevAttempts + 1 }, // attempt count
      };
    });
  }, []);

  // Section visited — kept for display badges, does NOT drive progress %
  const markSectionComplete = useCallback((unitId, section) => {
    setProgress(p => ({
      ...p,
      completedSections: {
        ...p.completedSections,
        [unitId]: { ...(p.completedSections[unitId] || {}), [section]: true }
      }
    }));
  }, []);

  const saveTotalTestScore = useCallback((unitId, score) => {
    setProgress(p => ({
      ...p,
      totalTestScores: { ...p.totalTestScores, [unitId]: score },
    }));
  }, []);

  const markMediaComplete = useCallback((mediaId, taskScore) => {
    setProgress(p => ({
      ...p,
      completedMedia: p.completedMedia.includes(mediaId) ? p.completedMedia : [...p.completedMedia, mediaId],
      mediaTaskScores: taskScore !== undefined ? { ...p.mediaTaskScores, [mediaId]: taskScore } : p.mediaTaskScores,
    }));
  }, []);

  const setLastOpened = useCallback((unitId, section) => {
    setProgress(p => ({ ...p, lastOpenedUnit: unitId, lastOpenedSection: section }));
  }, []);

  const updateVocabRadar = useCallback((wordId, field, value) => {
    setProgress(p => ({
      ...p,
      vocabRadar: {
        ...p.vocabRadar,
        [wordId]: { ...(p.vocabRadar[wordId] || {}), [field]: value }
      }
    }));
  }, []);

  const saveScenarioScore = useCallback((unitId, score, result) => {
    setProgress(p => ({
      ...p,
      scenarioScores: { ...p.scenarioScores, [unitId]: { score, result } }
    }));
  }, []);

  const saveCrosswordScore = useCallback((unitId, scoreData) => {
    setProgress(p => ({
      ...p,
      crosswordScores: { ...p.crosswordScores, [unitId]: scoreData },
    }));
  }, []);

  const saveMediaQuestScore = useCallback((key, score) => {
    setProgress(p => ({
      ...p,
      mediaQuestScores: { ...p.mediaQuestScores, [key]: score },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    if (userId) {
      localStorage.removeItem(storageKey(userId));
      // Also clear from DB
      supabase.from('profiles').upsert({
        id: userId,
        saved_progress: {},
        updated_at: new Date().toISOString(),
      }).catch(e => console.error('resetProgress DB clear error:', e.message));
    }
  }, [userId]);

  // getUnitProgress requires the unit data to compute correctly.
  // Components that call this must also pass the unit object.
  // For backward compatibility, this version uses courseUnitsRef.
  const getUnitProgress = useCallback((unitId) => {
    const unit = (courseUnitsRef.current || []).find(u => u.id === unitId);
    return computeUnitProgress(progress, unitId, unit);
  }, [progress]);

  return (
    <ProgressContext.Provider value={{
      progress, markWordLearned, markWordWeak, addWeakWordsFromExercise,
      markExerciseComplete, markSectionComplete, saveTotalTestScore,
      markMediaComplete, setLastOpened, resetProgress, getUnitProgress,
      updateVocabRadar, saveScenarioScore, saveCrosswordScore, saveMediaQuestScore,
      updateSRS, logError,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);