import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import ExerciseEngine from '../exercises/ExerciseEngine';

const CHARACTER_COLORS = ['#3B6EA5', '#C05050', '#4A8C6A', '#7A6A2E'];

function CharacterCard({ character, color }) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ border: `1.5px solid ${color}30`, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {character.name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>{character.name}</p>
          {character.age && <p className="text-[10px]" style={{ color: 'var(--col-muted)' }}>Age {character.age}</p>}
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--col-body)' }}>{character.situation}</p>
    </div>
  );
}

export default function CaseStudySection({ data, unitId }) {
  const [showChars, setShowChars] = useState(true);

  if (!data) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Users className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--col-accent)' }}>{data.subtitle}</p>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
        </div>

        {/* Case story */}
        <div
          className="mb-4 p-4 rounded-xl"
          style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)', lineHeight: 1.85, fontSize: 14 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>Case Story</p>
          <p style={{ color: 'var(--col-body)' }}>{data.caseText}</p>
        </div>

        {/* Characters */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3 text-sm font-semibold"
          style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)', color: 'var(--col-heading)', minHeight: 48 }}
          onClick={() => setShowChars(!showChars)}
        >
          <span>People in the Story</span>
          {showChars ? <ChevronUp className="h-4 w-4" style={{ color: 'var(--col-muted)' }} /> : <ChevronDown className="h-4 w-4" style={{ color: 'var(--col-muted)' }} />}
        </button>

        {showChars && (
          <div className="grid sm:grid-cols-2 gap-2 mb-4">
            {data.characters.map((ch, i) => (
              <CharacterCard key={ch.name} character={ch} color={CHARACTER_COLORS[i % CHARACTER_COLORS.length]} />
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