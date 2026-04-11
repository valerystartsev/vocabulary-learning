import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import ExerciseEngine from '../exercises/ExerciseEngine';

export default function GrammarSection({ data, unitId }) {
  const [showRules, setShowRules] = useState(true);

  if (!data) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <BookOpen className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--col-accent)' }}>{data.subtitle}</p>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
        </div>

        {/* Rules */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-heading)', minHeight: 48 }}
          onClick={() => setShowRules(!showRules)}
        >
          <span>Modal Verb Reference</span>
          {showRules ? <ChevronUp className="h-4 w-4" style={{ color: 'var(--col-muted)' }} /> : <ChevronDown className="h-4 w-4" style={{ color: 'var(--col-muted)' }} />}
        </button>

        {showRules && (
          <div className="space-y-2 mb-4">
            {data.rules.map(rule => (
              <div
                key={rule.modal}
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                    style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', minWidth: 80, textAlign: 'center' }}
                  >
                    {rule.modal}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--col-heading)' }}>{rule.meaning}</p>
                    <p className="text-xs italic" style={{ color: 'var(--col-secondary)' }}>"{rule.example}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks */}
        {data.tasks.map(task => (
          <ExerciseEngine key={task.id} exercise={task} unitId={unitId} />
        ))}
      </div>
    </div>
  );
}