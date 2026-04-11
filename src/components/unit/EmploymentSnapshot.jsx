import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

/* ─── Snapshot panels data ───────────────────────────────────────────────── */
const PANELS = [
  {
    id: 'unemployment',
    icon: TrendingDown,
    color: '#3B6EA5',
    label: 'Unemployment Rate',
    labelRu: 'Уровень безработицы',
    visual: { low: 4, high: 8, unit: '%' },
    fact: 'When the economy grows, the unemployment rate usually falls.',
    factRu: 'Когда экономика растёт, уровень безработицы обычно снижается.',
    trend: 'falls with growth'
  },
  {
    id: 'young',
    icon: TrendingUp,
    color: '#4A8C6A',
    label: 'Young Workers',
    labelRu: 'Молодые работники',
    visual: { stat: 'Adapt faster', icon: '🎓' },
    fact: 'Young workers often adapt to new technology faster and retrain more easily.',
    factRu: 'Молодые работники быстрее адаптируются к технологиям.',
    trend: 'faster retraining'
  },
  {
    id: 'older',
    icon: AlertTriangle,
    color: '#C0943A',
    label: 'Older Workers',
    labelRu: 'Работники старшего возраста',
    visual: { stat: 'Harder to retrain', icon: '👷' },
    fact: 'Older workers may find retraining harder. This is a social cost of rapid technological change.',
    factRu: 'Пожилым работникам переобучение даётся труднее — это социальные издержки.',
    trend: 'higher social cost'
  },
  {
    id: 'uneven',
    icon: Users,
    color: '#C05050',
    label: 'Uneven Growth',
    labelRu: 'Неравномерный рост',
    visual: { stat: 'Not everyone benefits equally', icon: '⚖️' },
    fact: 'In uneven growth, some groups benefit much more than others. Some workers may lose jobs while company profits rise.',
    factRu: 'При неравномерном росте одни выигрывают больше, другие — меньше.',
    trend: 'inequality risk'
  }
];

/* ─── Mini task ──────────────────────────────────────────────────────────── */
const SNAPSHOT_TASK = {
  type: 'trueFalse',
  q: 'When the economy grows, the unemployment rate usually falls.',
  answer: true,
  explanation: 'Correct — economic growth creates more jobs, so the unemployment rate typically decreases.'
};

const SNAPSHOT_SB = {
  q: 'Build the sentence about growth and unemployment:',
  tiles: ['When', 'the', 'economy', 'grows', 'the', 'unemployment', 'rate', 'usually', 'falls', 'rises', 'stops', 'doubles'],
  answer: ['When', 'the', 'economy', 'grows', 'the', 'unemployment', 'rate', 'usually', 'falls']
};

/* ─── Single panel ───────────────────────────────────────────────────────── */
function SnapshotPanel({ panel }) {
  const Icon = panel.icon;
  return (
    <div
      className="flex flex-col p-4 rounded-xl"
      style={{
        backgroundColor: `${panel.color}08`,
        border: `1px solid ${panel.color}25`,
        minHeight: 120
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 28, height: 28, backgroundColor: `${panel.color}18` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: panel.color }} />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight" style={{ color: panel.color }}>{panel.label}</p>
          <p className="text-[10px]" style={{ color: 'var(--col-muted)' }}>{panel.labelRu}</p>
        </div>
      </div>

      {/* Visual element */}
      {panel.visual.low !== undefined ? (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px]" style={{ color: 'var(--col-muted)' }}>Low (growth)</span>
            <span className="text-[10px]" style={{ color: 'var(--col-muted)' }}>High (recession)</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs font-bold" style={{ color: panel.color }}>{panel.visual.low}{panel.visual.unit}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
              <div className="h-full rounded-full" style={{ width: '30%', backgroundColor: panel.color, opacity: 0.7 }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#C05050' }}>{panel.visual.high}{panel.visual.unit}</span>
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <span className="text-2xl">{panel.visual.icon}</span>
        </div>
      )}

      {/* Fact */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--col-body)' }}>{panel.fact}</p>
      <p className="text-[10px] italic mt-1" style={{ color: 'var(--col-muted)' }}>{panel.factRu}</p>

      {/* Trend tag */}
      <div className="mt-2">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${panel.color}15`, color: panel.color }}
        >
          {panel.trend}
        </span>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function EmploymentSnapshot() {
  const [tfAnswer, setTfAnswer] = useState(null);
  const [tfChecked, setTfChecked] = useState(false);

  const isCorrect = tfChecked && tfAnswer === SNAPSHOT_TASK.answer;
  const isWrong = tfChecked && tfAnswer !== SNAPSHOT_TASK.answer;

  return (
    <div
      className="mb-6 rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--col-heading)' }}>
            Employment Snapshot
          </h3>
          <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Обзор рынка труда</p>
          <p className="text-sm mt-1" style={{ color: 'var(--col-secondary)' }}>
            Economic growth affects employment differently for different groups of workers.
          </p>
        </div>

        {/* 2×2 grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {PANELS.map(panel => (
            <SnapshotPanel key={panel.id} panel={panel} />
          ))}
        </div>

        {/* Mini tasks */}
        <div style={{ borderTop: '1px solid var(--col-border)', paddingTop: 16 }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>
            Quick Check
          </p>

          {/* True / False */}
          <div
            className="p-4 rounded-xl mb-3"
            style={{
              border: isCorrect ? '1.5px solid var(--col-correct)' : isWrong ? '1.5px solid var(--col-incorrect)' : '1px solid var(--col-border)',
              backgroundColor: isCorrect ? '#F0FAF5' : isWrong ? '#FEF2F2' : 'var(--col-dict-bg)'
            }}
          >
            <p className="text-sm font-medium mb-2.5" style={{ color: 'var(--col-heading)' }}>
              True or False: "{SNAPSHOT_TASK.q}"
            </p>
            <div className="flex gap-2">
              {[true, false].map(v => {
                const sel = tfAnswer === v;
                const correct = tfChecked && v === SNAPSHOT_TASK.answer;
                const wrong = tfChecked && sel && v !== SNAPSHOT_TASK.answer;
                return (
                  <button key={String(v)} disabled={tfChecked} onClick={() => setTfAnswer(v)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      minHeight: 44,
                      border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? '2px solid var(--col-accent)' : '1px solid var(--col-border)',
                      backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? 'var(--col-accent-light)' : 'var(--col-surface)',
                      color: correct ? '#1F5E3A' : wrong ? '#7F2020' : sel ? 'var(--col-accent-text)' : 'var(--col-secondary)'
                    }}>
                    {v ? 'True' : 'False'}
                  </button>
                );
              })}
            </div>
            {!tfChecked && tfAnswer !== null && (
              <button onClick={() => setTfChecked(true)}
                className="mt-2.5 w-full rounded-xl text-sm font-semibold text-white"
                style={{ minHeight: 44, backgroundColor: 'var(--col-accent)' }}>
                Check
              </button>
            )}
            {tfChecked && (
              <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2', color: isCorrect ? '#1F5E3A' : '#7F2020' }}>
                {isCorrect ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                {SNAPSHOT_TASK.explanation}
              </div>
            )}
          </div>

          {/* Sentence builder */}
          <SentenceBuilder
            prompt={SNAPSHOT_SB.q}
            tiles={SNAPSHOT_SB.tiles}
            answer={SNAPSHOT_SB.answer}
          />
        </div>
      </div>
    </div>
  );
}