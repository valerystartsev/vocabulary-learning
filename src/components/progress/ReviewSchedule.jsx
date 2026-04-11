import React, { useMemo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { getAllVocabulary } from '../../data/courseData';
import { getDefaultCard } from '../../utils/spacedRepetition';
import { Calendar, RotateCcw, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function getUpcomingReviews(srsData, allVocab, days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const schedule = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    const words = allVocab.filter(v => {
      const card = srsData[v.id];
      if (!card) return i === 0; // unreviewed = due today
      const nr = new Date(card.nextReview);
      return nr >= day && nr <= dayEnd;
    });
    schedule.push({ day, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }), words, count: words.length, isToday: i === 0 });
  }
  return schedule;
}

function getDayLoad(count) {
  if (count === 0) return { color: 'var(--col-divider)', label: '' };
  if (count <= 5) return { color: '#5E9E89', label: 'Light' };
  if (count <= 15) return { color: '#C79A4A', label: 'Moderate' };
  return { color: '#E57373', label: 'Heavy' };
}

export default function ReviewSchedule() {
  const { progress } = useProgress();
  const allVocab = getAllVocabulary();
  const srsData = progress.srsData || {};

  const schedule = useMemo(() => getUpcomingReviews(srsData, allVocab, 7), [srsData, allVocab]);
  const todayCount = schedule[0]?.count || 0;
  const totalThisWeek = schedule.reduce((a, d) => a + d.count, 0);
  const reviewedCount = Object.values(srsData).filter(c => c.repetitions > 0).length;
  const masteredCount = Object.values(srsData).filter(c => c.interval >= 21).length;

  return (
    <div className="rounded-2xl overflow-hidden card-elevated mb-7" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--col-border)' }}>
        <Calendar className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
        <h2 className="font-bold text-base" style={{ color: 'var(--col-heading)' }}>Review Schedule</h2>
        <span className="text-xs ml-auto" style={{ color: 'var(--col-muted)' }}>График повторений</span>
      </div>

      <div className="px-6 py-5">
        {/* Header stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { label: 'Due Today', value: todayCount, color: todayCount > 0 ? '#E57373' : '#4A8C6A', icon: Clock },
            { label: 'This Week', value: totalThisWeek, color: '#C79A4A', icon: Calendar },
            { label: 'Mastered', value: masteredCount, color: '#4A8C6A', icon: CheckCircle },
          ].map(s => (
            <div key={s.label} className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
              <s.icon className="h-4 w-4 mx-auto mb-1" style={{ color: s.color }} />
              <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--col-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* 7-day schedule */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>7-Day Forecast</p>
        <div className="space-y-2 mb-5">
          {schedule.map((day, i) => {
            const load = getDayLoad(day.count);
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{ backgroundColor: day.isToday ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)', border: `1px solid ${day.isToday ? 'var(--col-accent)' : 'var(--col-border)'}` }}>
                <span className="text-xs font-semibold w-20 shrink-0" style={{ color: day.isToday ? 'var(--col-accent-text)' : 'var(--col-secondary)' }}>{day.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
                  {day.count > 0 && (
                    <div className="h-full rounded-full" style={{ width: `${Math.min((day.count / 30) * 100, 100)}%`, backgroundColor: load.color }} />
                  )}
                </div>
                <span className="text-xs font-semibold w-16 text-right shrink-0" style={{ color: day.count > 0 ? load.color : 'var(--col-muted)' }}>
                  {day.count > 0 ? `${day.count} word${day.count !== 1 ? 's' : ''}` : 'Rest day'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Today's words preview */}
        {schedule[0]?.words.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--col-muted)' }}>Due Today — word preview</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {schedule[0].words.slice(0, 12).map(w => {
                const card = srsData[w.id];
                const isNew = !card || card.repetitions === 0;
                return (
                  <span key={w.id} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: isNew ? '#E8F5EE' : '#FFF8E7',
                      color: isNew ? '#2A6A40' : '#6B4C00',
                      border: `1px solid ${isNew ? '#7ABD9040' : '#D4A82040'}`,
                    }}>
                    {w.term}
                    {isNew && <span className="ml-1 text-[9px] opacity-70">new</span>}
                  </span>
                );
              })}
              {schedule[0].words.length > 12 && (
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ color: 'var(--col-muted)', backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
                  +{schedule[0].words.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* SRS progress overview */}
        <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>SRS Progress — all vocabulary</p>
          {(() => {
            const total = allVocab.length;
            const neverReviewed = total - reviewedCount;
            const learning = Object.values(srsData).filter(c => c.repetitions > 0 && c.interval < 7).length;
            const consolidating = Object.values(srsData).filter(c => c.interval >= 7 && c.interval < 21).length;
            const stages = [
              { label: 'Not started', count: neverReviewed, color: 'var(--col-divider)' },
              { label: 'Learning', count: learning, color: '#C79A4A' },
              { label: 'Consolidating', count: consolidating, color: '#4A7FA8' },
              { label: 'Mastered', count: masteredCount, color: '#4A8C6A' },
            ];
            return (
              <>
                <div className="flex h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--col-divider)' }}>
                  {stages.filter(s => s.count > 0).map(s => (
                    <div key={s.label} style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {stages.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color, border: '1px solid var(--col-border)' }} />
                      <span style={{ color: 'var(--col-secondary)' }}>{s.label}</span>
                      <span className="font-semibold ml-auto" style={{ color: 'var(--col-heading)' }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        {/* CTA */}
        {todayCount > 0 ? (
          <Link to="/review">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ backgroundColor: 'var(--col-accent)', minHeight: 48 }}>
              <RotateCcw className="h-4 w-4" /> Start Today's Review ({todayCount} words) <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#E8F5EE', border: '1px solid #A8D5BA' }}>
            <CheckCircle className="h-5 w-5 shrink-0" style={{ color: '#4A8C6A' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2A6A40' }}>All caught up for today.</p>
              <p className="text-xs" style={{ color: '#4A8C6A', opacity: 0.8 }}>Next reviews: {schedule.find(d => d.count > 0 && !d.isToday)?.label || 'none scheduled'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}