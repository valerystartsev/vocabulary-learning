import React, { useMemo } from 'react';
import { units, getAllVocabulary } from '../../data/courseData';
import { useProgress } from '../../context/ProgressContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, Target, Zap, BookOpen } from 'lucide-react';

function MiniStat({ label, value, color }) {
  return (
    <div className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
      <p className="font-bold text-xl mb-0.5" style={{ color }}>{value}</p>
      <p className="text-[11px]" style={{ color: 'var(--col-muted)' }}>{label}</p>
    </div>
  );
}

export default function LearningAnalytics() {
  const { progress } = useProgress();
  const allVocab = getAllVocabulary();

  // Per-unit accuracy from exercise scores
  const unitAccuracy = useMemo(() => units.map(unit => {
    const exIds = (unit.exercises || []).map(e => e.id);
    const scores = exIds.map(id => progress.exerciseBestScores?.[id]).filter(s => s !== undefined);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const attempts = exIds.reduce((acc, id) => acc + (progress.exerciseAttempts?.[id] || 0), 0);
    const learnedInUnit = allVocab.filter(v => v.unitId === unit.id && progress.learnedWords.includes(v.id)).length;
    const totalInUnit = allVocab.filter(v => v.unitId === unit.id).length;
    const testScore = progress.totalTestScores?.[unit.id];
    return { name: `Unit ${unit.id}`, unitId: unit.id, accuracy: avg, attempts, learnedPct: totalInUnit ? Math.round((learnedInUnit / totalInUnit) * 100) : 0, testScore: testScore ?? null };
  }), [progress]);

  // Radar data: multi-dimension strength profile per unit
  const radarData = useMemo(() => {
    return units.map(unit => {
      const exIds = (unit.exercises || []).map(e => e.id);
      const scores = exIds.map(id => progress.exerciseBestScores?.[id]).filter(s => s !== undefined);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const learnedInUnit = allVocab.filter(v => v.unitId === unit.id && progress.learnedWords.includes(v.id)).length;
      const totalInUnit = allVocab.filter(v => v.unitId === unit.id).length;
      const vocabPct = totalInUnit ? Math.round((learnedInUnit / totalInUnit) * 100) : 0;
      const mediaIds = (unit.media || []).map(m => m.mediaId || `${unit.id}_media_${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`);
      const mediaPct = mediaIds.length ? Math.round((mediaIds.filter(id => progress.completedMedia?.includes(id)).length / mediaIds.length) * 100) : 0;
      const testScore = progress.totalTestScores?.[unit.id] ?? 0;
      const scenarioDone = progress.scenarioScores?.[unit.id] !== undefined ? 100 : 0;
      return {
        subject: `Unit ${unit.id}`,
        Exercises: avgScore,
        Vocabulary: vocabPct,
        Media: mediaPct,
        Test: testScore,
        Scenario: scenarioDone,
      };
    });
  }, [progress, allVocab]);

  // Overall stats
  const totalAttempts = Object.values(progress.exerciseAttempts || {}).reduce((a, b) => a + b, 0);
  const allScores = Object.values(progress.exerciseBestScores || {});
  const overallAccuracy = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  const srsReviewed = Object.values(progress.srsData || {}).filter(c => c.repetitions > 0).length;

  const barColor = (accuracy) => accuracy >= 75 ? '#5E9E89' : accuracy >= 50 ? '#C79A4A' : '#E57373';

  return (
    <div className="rounded-2xl overflow-hidden card-elevated mb-7" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--col-border)' }}>
        <TrendingUp className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
        <h2 className="font-bold text-base" style={{ color: 'var(--col-heading)' }}>Learning Analytics</h2>
        <span className="text-xs ml-auto" style={{ color: 'var(--col-muted)' }}>Анализ обучения</span>
      </div>

      <div className="px-6 py-5">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <MiniStat label="Avg. Accuracy" value={overallAccuracy ? `${overallAccuracy}%` : '—'} color="var(--col-accent)" />
          <MiniStat label="Total Attempts" value={totalAttempts || 0} color="#4A7FA8" />
          <MiniStat label="SRS Reviewed" value={srsReviewed} color="#C79A4A" />
          <MiniStat label="Tests Taken" value={Object.keys(progress.totalTestScores || {}).length} color="#4A8C6A" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar chart: accuracy per unit */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>Exercise Accuracy per Unit</p>
            {allScores.length === 0 ? (
              <div className="flex items-center justify-center h-36 rounded-xl" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Complete exercises to see accuracy data.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={unitAccuracy} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--col-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--col-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Best Score Avg']}
                    contentStyle={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                    {unitAccuracy.map((entry, i) => (
                      <Cell key={i} fill={barColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Radar: multi-dimension profile */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>Skill Profile (by dimension)</p>
            {radarData.every(d => d.Exercises === 0 && d.Vocabulary === 0) ? (
              <div className="flex items-center justify-center h-36 rounded-xl" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Start learning to build your skill profile.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={[
                  { dim: 'Exercises', value: Math.round(radarData.reduce((a, d) => a + d.Exercises, 0) / radarData.length) },
                  { dim: 'Vocabulary', value: Math.round(radarData.reduce((a, d) => a + d.Vocabulary, 0) / radarData.length) },
                  { dim: 'Media', value: Math.round(radarData.reduce((a, d) => a + d.Media, 0) / radarData.length) },
                  { dim: 'Test', value: Math.round(radarData.reduce((a, d) => a + d.Test, 0) / radarData.length) },
                  { dim: 'Scenario', value: Math.round(radarData.reduce((a, d) => a + d.Scenario, 0) / radarData.length) },
                ]}>
                  <PolarGrid stroke="var(--col-divider)" />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: 'var(--col-muted)' }} />
                  <Radar name="You" dataKey="value" stroke="var(--col-accent)" fill="var(--col-accent)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Per-unit strength/weakness breakdown */}
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Strengths and Weaknesses by Unit</p>
          {unitAccuracy.map(u => {
            const isStrong = u.accuracy >= 75;
            const isWeak = u.accuracy > 0 && u.accuracy < 55;
            const label = isStrong ? 'Strong' : isWeak ? 'Needs work' : u.accuracy === 0 ? 'Not started' : 'Developing';
            const labelColor = isStrong ? '#4A8C6A' : isWeak ? '#C05050' : u.accuracy === 0 ? 'var(--col-muted)' : '#C79A4A';
            return (
              <div key={u.unitId} className="flex items-center gap-3">
                <span className="text-xs font-semibold w-14 shrink-0" style={{ color: 'var(--col-secondary)' }}>{u.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${u.accuracy}%`, backgroundColor: barColor(u.accuracy) }} />
                </div>
                <span className="text-xs w-10 text-right font-semibold" style={{ color: barColor(u.accuracy) }}>{u.accuracy ? `${u.accuracy}%` : '—'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: `${labelColor}18`, color: labelColor, border: `1px solid ${labelColor}30` }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}