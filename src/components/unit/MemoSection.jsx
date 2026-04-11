import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import ExerciseEngine from '../exercises/ExerciseEngine';

function MemoExample({ example }) {
  return (
    <div
      className="rounded-xl overflow-hidden mb-4"
      style={{ border: '1.5px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}
    >
      <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: 'var(--col-sidebar)', borderBottom: '1px solid var(--col-border)' }}>
        <FileText className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Sample Memo
        </span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1.5" style={{ color: 'var(--col-body)' }}>
        <div className="flex gap-4">
          <span className="font-bold w-20 shrink-0" style={{ color: 'var(--col-muted)' }}>TO:</span>
          <span>{example.to}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-bold w-20 shrink-0" style={{ color: 'var(--col-muted)' }}>FROM:</span>
          <span>{example.from}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-bold w-20 shrink-0" style={{ color: 'var(--col-muted)' }}>DATE:</span>
          <span>{example.date}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-bold w-20 shrink-0" style={{ color: 'var(--col-muted)' }}>RE:</span>
          <span className="font-semibold">{example.subject}</span>
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--col-border)' }}>
          <p className="font-sans leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>{example.body}</p>
        </div>
      </div>
    </div>
  );
}

function MemoStructure({ structure }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
        Standard Memo Structure
      </p>
      <div className="space-y-1.5">
        {structure.parts.map(part => (
          <div
            key={part}
            className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}
          >
            <span
              className="text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5"
              style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', minWidth: 70, textAlign: 'center' }}
            >
              {part}
            </span>
            <span className="text-xs" style={{ color: 'var(--col-body)' }}>
              {structure.descriptions[part]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MemoSection({ data, unitId }) {
  const [showStructure, setShowStructure] = useState(true);

  if (!data) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
        </div>

        {/* Collapsible structure */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-heading)', minHeight: 48 }}
          onClick={() => setShowStructure(!showStructure)}
        >
          <span>Memo Structure — How It Works</span>
          {showStructure ? <ChevronUp className="h-4 w-4" style={{ color: 'var(--col-muted)' }} /> : <ChevronDown className="h-4 w-4" style={{ color: 'var(--col-muted)' }} />}
        </button>

        {showStructure && <MemoStructure structure={data.structure} />}

        {/* Sample memos */}
        <p className="text-xs font-bold uppercase tracking-wider mb-2 mt-4" style={{ color: 'var(--col-muted)' }}>Example Memo</p>
        {data.examples.map((ex, i) => (
          <MemoExample key={i} example={ex} />
        ))}

        {/* Tasks */}
        <div className="mt-2 space-y-0">
          {data.tasks.map(task => (
            <ExerciseEngine key={task.id} exercise={task} unitId={unitId} />
          ))}
        </div>
      </div>
    </div>
  );
}