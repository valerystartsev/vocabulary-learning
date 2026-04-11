import React, { useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, DollarSign, BarChart2, AlertTriangle, RefreshCw } from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

const STAGE_ICONS = {
  1: TrendingUp,
  2: BarChart2,
  3: DollarSign,
  4: AlertTriangle,
  5: RefreshCw
};

const STAGES = [
  {
    id: 1,
    label: 'Investment',
    labelRu: 'Инвестиции',
    keyword: 'capital goods',
    color: '#5E9E89',
    en: 'A company saves money and invests in capital goods — new machines and tools.',
    ru: 'Компания откладывает деньги и вкладывает в основные фонды — новые машины и оборудование.',
    task: {
      type: 'trueFalse',
      q: 'Capital goods are used to produce other goods.',
      answer: true,
      explanation: 'Correct — capital goods (machines, buildings, tools) are used to produce other goods.'
    }
  },
  {
    id: 2,
    label: 'Growth',
    labelRu: 'Рост',
    keyword: 'standard of living',
    color: '#3B6EA5',
    en: 'The company produces more goods. Workers earn higher wages. The standard of living goes up.',
    ru: 'Компания производит больше товаров. Рабочие зарабатывают больше. Уровень жизни растёт.',
    task: {
      type: 'fillGap',
      q: 'As more goods are produced, the average _______ of living goes up.',
      answer: 'standard',
      explanation: '"Standard of living" — the level of comfort and quality of life that people enjoy.'
    }
  },
  {
    id: 3,
    label: 'Revenue',
    labelRu: 'Доходы',
    keyword: 'tax revenues',
    color: '#6A5ACD',
    en: 'The government collects more tax revenues. It spends money on education and healthcare.',
    ru: 'Правительство собирает больше налоговых поступлений. Оно тратит деньги на образование и здравоохранение.',
    task: {
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['Economic', 'growth', 'provides', 'the', 'government', 'with', 'additional', 'tax', 'revenues', 'spends', 'factories', 'money'],
      answer: ['Economic', 'growth', 'provides', 'the', 'government', 'with', 'additional', 'tax', 'revenues']
    }
  },
  {
    id: 4,
    label: 'Costs',
    labelRu: 'Издержки',
    keyword: 'redundant',
    color: '#C0943A',
    en: 'Growth has costs too. Natural resources are used up. Some workers lose their jobs.',
    ru: 'Рост тоже имеет издержки. Природные ресурсы истощаются. Некоторые рабочие теряют работу.',
    task: {
      type: 'trueFalse',
      q: 'Economic growth has only positive effects.',
      answer: false,
      explanation: 'False — growth also has costs: pollution, resource depletion, and some workers become redundant.'
    }
  },
  {
    id: 5,
    label: 'Retraining',
    labelRu: 'Переобучение',
    keyword: 'retrain',
    color: '#C05050',
    en: 'Redundant workers retrain to find new jobs. The economy changes, and people must adapt.',
    ru: 'Сокращённые работники проходят переподготовку, чтобы найти новую работу. Экономика меняется, и люди должны адаптироваться.',
    task: {
      type: 'sentenceBuilder',
      q: 'Build the sentence:',
      tiles: ['Workers', 'who', 'lose', 'jobs', 'because', 'of', 'new', 'technology', 'need', 'to', 'retrain', 'retire', 'complain'],
      answer: ['Workers', 'who', 'lose', 'jobs', 'because', 'of', 'new', 'technology', 'need', 'to', 'retrain']
    }
  }
];

function StageTask({ stage, stageColor }) {
  const { task } = stage;
  const [tfAnswer, setTfAnswer] = useState(null);
  const [tfChecked, setTfChecked] = useState(false);
  const [fillValue, setFillValue] = useState('');
  const [fillChecked, setFillChecked] = useState(false);
  const [sbDone, setSbDone] = useState(false);

  if (task.type === 'trueFalse') {
    const correct = tfChecked && tfAnswer === task.answer;
    const wrong   = tfChecked && tfAnswer !== task.answer;
    return (
      <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)' }}>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--col-heading)' }}>
          True or False: "{task.q}"
        </p>
        <div className="flex gap-2 mb-2">
          {[true, false].map(v => {
            const sel = tfAnswer === v;
            const isRight = tfChecked && v === task.answer;
            const isWrong = tfChecked && sel && v !== task.answer;
            return (
              <button key={String(v)} disabled={tfChecked}
                onClick={() => setTfAnswer(v)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  minHeight: 44,
                  border: isRight ? '2px solid var(--col-correct)' : isWrong ? '2px solid var(--col-incorrect)' : sel ? `2px solid ${stageColor}` : '1px solid var(--col-border)',
                  backgroundColor: isRight ? '#F0FAF5' : isWrong ? '#FEF2F2' : sel ? `${stageColor}15` : 'var(--col-surface)',
                  color: isRight ? '#1F5E3A' : isWrong ? '#7F2020' : 'var(--col-body)',
                }}>
                {v ? 'True' : 'False'}
              </button>
            );
          })}
        </div>
        {!tfChecked && tfAnswer !== null && (
          <button onClick={() => setTfChecked(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: stageColor, minHeight: 44 }}>
            Check
          </button>
        )}
        {tfChecked && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ backgroundColor: correct ? '#E8F5EE' : '#FEF2F2', color: correct ? '#1F5E3A' : '#7F2020' }}>
            {correct ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
            {task.explanation}
          </div>
        )}
      </div>
    );
  }

  if (task.type === 'fillGap') {
    const trimmed = fillValue.trim().toLowerCase();
    const isCorrect = fillChecked && trimmed === task.answer.toLowerCase();
    const isWrong   = fillChecked && trimmed !== task.answer.toLowerCase();
    return (
      <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--col-dict-bg)', border: '1px solid var(--col-border)' }}>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--col-heading)' }}>{task.q}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={fillValue}
            onChange={e => setFillValue(e.target.value)}
            disabled={fillChecked}
            placeholder="Type the missing word…"
            className="flex-1 px-3 rounded-xl text-sm"
            style={{
              minHeight: 44, border: isCorrect ? '2px solid var(--col-correct)' : isWrong ? '2px solid var(--col-incorrect)' : '1px solid var(--col-border)',
              backgroundColor: 'var(--col-surface)', color: 'var(--col-body)',
            }}
          />
          {!fillChecked && (
            <button onClick={() => setFillChecked(true)}
              className="px-4 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: stageColor, minHeight: 44 }}>
              Check
            </button>
          )}
        </div>
        {fillChecked && (
          <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2', color: isCorrect ? '#1F5E3A' : '#7F2020' }}>
            {isCorrect ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
            {isCorrect ? 'Correct!' : `Answer: "${task.answer}". ${task.explanation}`}
          </div>
        )}
      </div>
    );
  }

  if (task.type === 'sentenceBuilder') {
    return (
      <div className="mt-3">
        <SentenceBuilder
          prompt={task.q}
          tiles={task.tiles}
          answer={task.answer}
          onComplete={(ok) => setSbDone(ok)}
        />
      </div>
    );
  }

  return null;
}

export default function GrowthTimeline() {
  const [activeStage, setActiveStage] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());

  const markComplete = (stageId) => {
    setCompletedStages(prev => new Set([...prev, stageId]));
  };

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--col-heading)' }}>Timeline: The Story of Growth</h2>
          <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Временная шкала: история экономического роста</p>
          <p className="text-sm mt-1" style={{ color: 'var(--col-secondary)' }}>
            Follow the 5 stages of economic growth. Click each stage to read, translate, and complete a mini-task.
          </p>
          {completedStages.size > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--col-divider)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(completedStages.size / STAGES.length) * 100}%`, backgroundColor: 'var(--col-accent)' }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--col-muted)' }}>{completedStages.size}/{STAGES.length}</span>
            </div>
          )}
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-start gap-0 mb-6 overflow-x-auto pb-2">
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            const isDone = completedStages.has(stage.id);
            const StageIcon = STAGE_ICONS[stage.id];
            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center" style={{ minWidth: 120, maxWidth: 160, flex: '1 0 120px' }}>
                  <button
                    onClick={() => setActiveStage(isActive ? null : stage.id)}
                    className="flex items-center justify-center rounded-full transition-all mb-2 shrink-0"
                    style={{
                      width: 48, height: 48,
                      backgroundColor: isDone ? 'var(--col-accent)' : isActive ? stage.color : `${stage.color}15`,
                      color: isDone || isActive ? 'white' : stage.color,
                      border: isDone ? '2px solid var(--col-accent)' : `2px solid ${stage.color}`,
                      boxShadow: isActive ? `0 0 0 4px ${stage.color}20` : 'none'
                    }}
                  >
                    {isDone ? <CheckCircle className="h-5 w-5" /> : <StageIcon className="h-4.5 w-4.5" />}
                  </button>
                  <div className="text-center px-1">
                    <p className="text-xs font-semibold" style={{ color: isActive ? stage.color : isDone ? 'var(--col-accent-text)' : 'var(--col-heading)' }}>{stage.label}</p>
                    <p className="text-[10px]" style={{ color: 'var(--col-muted)' }}>{stage.labelRu}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${stage.color}15`, color: stage.color }}>
                      {stage.keyword}
                    </span>
                  </div>
                </div>
                {idx < STAGES.length - 1 && (
                  <div className="self-start shrink-0 flex items-center" style={{ marginTop: 22 }}>
                    <div style={{ width: 20, height: 2, backgroundColor: idx < completedStages.size ? 'var(--col-accent)' : 'var(--col-divider)' }} />
                    <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `5px solid ${idx < completedStages.size ? 'var(--col-accent)' : 'var(--col-divider)'}` }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-2 md:hidden mb-4">
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            const isDone = completedStages.has(stage.id);
            const StageIcon = STAGE_ICONS[stage.id];
            return (
              <div key={stage.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <button
                    onClick={() => setActiveStage(isActive ? null : stage.id)}
                    className="flex items-center justify-center rounded-full transition-all"
                    style={{
                      width: 38, height: 38,
                      backgroundColor: isDone ? 'var(--col-accent)' : isActive ? stage.color : `${stage.color}15`,
                      color: isDone || isActive ? 'white' : stage.color,
                      border: isDone ? '2px solid var(--col-accent)' : `2px solid ${stage.color}`,
                    }}
                  >
                    {isDone ? <CheckCircle className="h-4 w-4" /> : <StageIcon className="h-3.5 w-3.5" />}
                  </button>
                  {idx < STAGES.length - 1 && (
                    <div style={{ width: 2, height: 14, backgroundColor: idx < completedStages.size ? 'var(--col-accent)' : 'var(--col-divider)' }} />
                  )}
                </div>
                <button
                  onClick={() => setActiveStage(isActive ? null : stage.id)}
                  className="flex-1 text-left pt-1"
                >
                  <p className="text-sm font-semibold" style={{ color: stage.color }}>{stage.label} <span className="text-xs font-normal" style={{ color: 'var(--col-muted)' }}>· {stage.labelRu}</span></p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5"
                    style={{ backgroundColor: `${stage.color}15`, color: stage.color }}>
                    {stage.keyword}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Active stage detail */}
        {activeStage !== null && (() => {
          const stage = STAGES.find(s => s.id === activeStage);
          if (!stage) return null;
          const isDone = completedStages.has(stage.id);
          const StageIcon = STAGE_ICONS[stage.id];
          return (
            <div className="rounded-2xl p-4 transition-all"
              style={{ backgroundColor: `${stage.color}08`, border: `1.5px solid ${stage.color}30` }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-lg"
                    style={{ width: 28, height: 28, backgroundColor: `${stage.color}20` }}>
                    <StageIcon className="h-3.5 w-3.5" style={{ color: stage.color }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>
                    Stage {stage.id} — {stage.label}
                  </span>
                </div>
                {isDone && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)', border: '1px solid var(--col-divider)' }}>
                    <CheckCircle className="h-3 w-3" /> Done
                  </span>
                )}
              </div>
              {/* EN + RU bilingual */}
              <div className="space-y-2 mb-3">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{stage.en}</p>
                <p className="text-sm leading-relaxed italic" style={{ color: 'var(--col-secondary)' }}>{stage.ru}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>Key word:</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${stage.color}15`, color: stage.color }}>
                  {stage.keyword}
                </span>
              </div>
              <StageTask stage={stage} stageColor={stage.color} />
              {!isDone && (
                <button
                  onClick={() => markComplete(stage.id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ minHeight: 44, border: `1.5px solid ${stage.color}`, color: stage.color, backgroundColor: `${stage.color}10` }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark stage complete
                </button>
              )}
            </div>
          );
        })()}

        {activeStage === null && (
          <p className="text-xs text-center py-3" style={{ color: 'var(--col-muted)' }}>
            Click any stage above to expand its content and complete the mini-task.
          </p>
        )}
      </div>
    </div>
  );
}