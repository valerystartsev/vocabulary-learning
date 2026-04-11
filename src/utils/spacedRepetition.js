// SM-2 spaced repetition algorithm

export function getDefaultCard() {
  return { interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString() };
}

export function calculateNextReview(card, quality) {
  // quality: 0-5 (0=complete blackout, 5=perfect)
  let { interval, repetitions, easeFactor } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, repetitions, easeFactor, nextReview: nextReview.toISOString() };
}

export function getDueWords(srsData, allWordIds) {
  const now = new Date();
  return allWordIds.filter(id => {
    const card = srsData[id];
    if (!card) return true; // never reviewed = due
    return new Date(card.nextReview) <= now;
  });
}