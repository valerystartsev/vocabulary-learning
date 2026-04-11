import React from 'react';
import { BarChart2 } from 'lucide-react';
import ExerciseEngine from '../exercises/ExerciseEngine';

export default function LabourMarketSection({ data, unitId }) {
  if (!data) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
        </div>

        {/* Key vocabulary */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>Key Terms</p>
          <div className="space-y-1.5">
            {data.keyVocab.map(v => (
              <div
                key={v.term}
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
              >
                <span className="text-xs font-bold shrink-0" style={{ color: 'var(--col-accent)', minWidth: 160 }}>{v.term}</span>
                <span className="text-xs" style={{ color: 'var(--col-body)' }}>{v.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reading passage */}
        <div
          className="mb-4 p-4 rounded-xl reading-text"
          style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)', fontSize: 14, lineHeight: 1.8 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>Reading</p>
          <p style={{ color: 'var(--col-body)' }}>{data.readingText}</p>
        </div>

        {/* Tasks */}
        {data.tasks.map(task => (
          <ExerciseEngine key={task.id} exercise={task} unitId={unitId} />
        ))}
      </div>
    </div>
  );
}