// src/context/ProgressContext.jsx

import { supabase } from '../lib/supabaseClient';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { calculateNextReview, getDefaultCard } from '../utils/spacedRepetition';

const ProgressContext = createContext();

const TEACHER_EMAIL = 'emzakhtser@mail.ru';

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

const storageKey = (userId) => `adaptation_progress_${userId}`;

function loadProgress(userId) {
  if (!userId) return DEFAULT_PROGRESS;
  try {
    const userKey = storageKey(userId);
    const saved = localStorage.getItem(userKey);
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
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

export function computeUnitProgress(prog, unitId, unit) {
  if (!unit) return 0;
  const exerciseIds = (unit.exercises || []).map(e => e.id);
  const mediaIds = (unit.media || []).map(m =>
    m.mediaId || `${unitId}_media_${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`
  );
  let completed = 0;
  let total = 0;
  exerciseIds.forEach(id => { total += 1; if (prog.completedExercises.includes(id)) completed += 1; });
  mediaIds.forEach(id => { total += 1; if (prog.completedMedia.includes(id)) completed += 1; });
  total += 3;
  if (prog.totalTestScores?.[unitId] !== undefined) completed += 3;
  if (unit.scenario) { total += 1; if (prog.scenarioScores?.[unitId] !== undefined) completed += 1; }
  total += 1;
  if (prog.crosswordScores?.[unitId] !== undefined) completed += 1;
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function ProgressProvider({ children, user, courseUnits }) {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const syncTimeoutRef = useRef(null);
  const currentUserIdRef = useRef(null);

  const userId = user && user.email?.toLowerCase().trim() !== TEACHER_EMAIL
    ? (user.id || user.email) : null;

  useEffect(() => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    currentUserIdRef.current = userId;
    if (userId) {
      const local = loadProgress(userId);
      const hasLocalProgress =
        local.completedExercises.length > 0 || local.learnedWords.length > 0 ||
        Object.keys(local.totalTestScores || {}).length > 0 || local.completedMedia.length > 0;
      setProgress(local);
      if (!hasLocalProgress) hydrateFromDB();
    } else {
      setProgress(DEFAULT_PROGRESS);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Загружает прогресс из Supabase когда localStorage пуст.
  // Нужно для нового устройства или очищенного браузера.
  // Раньше: пустая функция с комментарием «DB hydration disabled».
  const hydrateFromDB = async () => {
    if (!userId) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('saved_progress')
        .eq('id', userId)
        .single();
      if (profile?.saved_progress && Object.keys(profile.saved_progress).length > 0) {
        setProgress(prev => ({ ...DEFAULT_PROGRESS, ...profile.saved_progress, ...prev }));
      }
    } catch (e) {
      console.error('hydrateFromDB error:', e);
    }
  };

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(storageKey(userId), JSON.stringify(progress));
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => syncProgressToUser(progress), 2000);
    return () => { if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current); };
  }, [progress, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Записывает прогресс в Supabase через 2 сек после каждого изменения.
  // Сохраняет: progress (сводка для Teacher Dashboard) и saved_progress (полный снимок).
  // Раньше: пустая функция с комментарием «DB sync disabled».
  const syncProgressToUser = async (prog) => {
    if (!userId) return;
    try {
      const units = courseUnitsRef.current || [];
      const unit1 = units[0];
      const unit2 = units[1];
      const u1pct = unit1 ? computeUnitProgress(prog, 1, unit1) : 0;
      const u2pct = unit2 ? computeUnitProgress(prog, 2, unit2) : 0;
      const overallPct = units.length > 0
        ? Math.round(units.reduce((sum, u) => sum + computeUnitProgress(prog, u.id, u), 0) / units.length)
        : 0;

      const progressSummary = {
        overallPercent: overallPct,
        unit1Percent: u1pct,
        unit2Percent: u2pct,
        wordsLearnedCount: (prog.learnedWords || []).length,
        weakWordsCount: (prog.weakWords || []).length,
        testsDoneCount: Object.keys(prog.totalTestScores || {}).length,
        completedExercisesCount: (prog.completedExercises || []).length,
        mediaCompleted: (prog.completedMedia || []).length,
        exerciseScores: prog.exerciseScores || {},
        exerciseBestScores: prog.exerciseBestScores || {},
        exerciseAttempts: prog.exerciseAttempts || {},
        scenarioScores: prog.scenarioScores || {},
        crosswordScores: prog.crosswordScores || {},
        learnedWords: prog.learnedWords || [],
        weakWords: prog.weakWords || [],
        lastActiveAt: new Date().toISOString(),
      };

      const savedProgressSnapshot = { ...prog };
      delete savedProgressSnapshot.errorLog;

      await supabase.from('profiles').upsert({
        id: userId,
        progress: progressSummary,
        saved_progress: savedProgressSnapshot,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('syncProgressToUser error:', e);
    }
  };

  const courseUnitsRef = useRef(courseUnits || []);
  useEffect(() => { courseUnitsRef.current = courseUnits || []; }, [courseUnits]);

  const markWordLearned = useCallback((wordId) => {
    setProgress(p => {
      const newAddedAt = { ...p.weakWordsAddedAt };
      delete newAddedAt[wordId];
      return { ...p, learnedWords: p.learnedWords.includes(wordId) ? p.learnedWords : [...p.learnedWords, wordId], weakWords: p.weakWords.filter(w => w !== wordId), weakWordsAddedAt: newAddedAt };
    });
  }, []);

  const markWordWeak = useCallback((wordId) => {
    setProgress(p => ({
      ...p,
      weakWords: p.weakWords.includes(wordId) ? p.weakWords : [...p.weakWords, wordId],
      weakWordsAddedAt: p.weakWordsAddedAt[wordId] ? p.weakWordsAddedAt : { ...p.weakWordsAddedAt, [wordId]: new Date().toISOString() },
    }));
  }, []);

  const updateSRS = useCallback((wordId, quality) => {
    setProgress(p => {
      const existing = p.srsData[wordId] || getDefaultCard();
      return { ...p, srsData: { ...p.srsData, [wordId]: calculateNextReview(existing, quality) } };
    });
  }, []);

  const logError = useCallback((errorData) => {
    setProgress(p => ({ ...p, errorLog: [...p.errorLog, { ...errorData, timestamp: new Date().toISOString() }].slice(-200) }));
  }, []);

  const addWeakWordsFromExercise = useCallback((wordIds) => {
    setProgress(p => ({ ...p, weakWords: [...new Set([...p.weakWords, ...wordIds])] }));
  }, []);

  const markExerciseComplete = useCallback((exId, score) => {
    setProgress(p => {
      const prevBest = p.exerciseBestScores?.[exId];
      const newBest = prevBest === undefined ? score : Math.max(prevBest, score);
      return {
        ...p,
        completedExercises: p.completedExercises.includes(exId) ? p.completedExercises : [...p.completedExercises, exId],
        exerciseScores: { ...p.exerciseScores, [exId]: score },
        exerciseBestScores: { ...p.exerciseBestScores, [exId]: newBest },
        exerciseAttempts: { ...p.exerciseAttempts, [exId]: (p.exerciseAttempts?.[exId] || 0) + 1 },
      };
    });
  }, []);

  const markSectionComplete = useCallback((unitId, section) => {
    setProgress(p => ({ ...p, completedSections: { ...p.completedSections, [unitId]: { ...(p.completedSections[unitId] || {}), [section]: true } } }));
  }, []);

  const saveTotalTestScore = useCallback((unitId, score) => {
    setProgress(p => ({ ...p, totalTestScores: { ...p.totalTestScores, [unitId]: score } }));
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
    setProgress(p => ({ ...p, vocabRadar: { ...p.vocabRadar, [wordId]: { ...(p.vocabRadar[wordId] || {}), [field]: value } } }));
  }, []);

  const saveScenarioScore = useCallback((unitId, score, result) => {
    setProgress(p => ({ ...p, scenarioScores: { ...p.scenarioScores, [unitId]: { score, result } } }));
  }, []);

  const saveCrosswordScore = useCallback((unitId, scoreData) => {
    setProgress(p => ({ ...p, crosswordScores: { ...p.crosswordScores, [unitId]: scoreData } }));
  }, []);

  const saveMediaQuestScore = useCallback((key, score) => {
    setProgress(p => ({ ...p, mediaQuestScores: { ...p.mediaQuestScores, [key]: score } }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    if (userId) localStorage.removeItem(storageKey(userId));
  }, [userId]);

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