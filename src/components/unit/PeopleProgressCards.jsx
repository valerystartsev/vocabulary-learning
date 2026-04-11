import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import SentenceBuilder from '../exercises/SentenceBuilder';

/* ─── Character data ─────────────────────────────────────────────────────── */
const CHARACTERS = [
  {
    id: 'manager',
    role: 'Company Manager',
    roleRu: 'Менеджер компании',
    initials: 'CM',
    color: '#3B6EA5',
    icon: '💼',
    statement: '"We need new technology to stay competitive. Output must increase — but we must support our workers too."',
    statementRu: '«Нам нужны новые технологии. Но мы должны поддержать наших сотрудников.»',
    vocabChips: ['capital goods', 'output', 'retrain', 'enlist'],
    task: {
      type: 'choice',
      q: 'The manager wants to buy new machines. What should they also do for workers?',
      options: ['Fire all older workers immediately', 'Enlist a retraining agency to support displaced workers', 'Ignore the social costs', 'Stop all investment'],
      answer: 'Enlist a retraining agency to support displaced workers',
      explanation: 'Enlisting a retraining agency is the responsible way to manage technology-driven change.'
    }
  },
  {
    id: 'older_worker',
    role: 'Older Worker',
    roleRu: 'Работник старшего возраста',
    initials: 'OW',
    color: '#C05050',
    icon: '👷',
    statement: '"I worked here for 25 years. Now machines do my job. I was made redundant. Retraining is very difficult at my age."',
    statementRu: '«Я работал здесь 25 лет. Теперь машины делают мою работу. Я был уволен. Переобучение очень трудно в моём возрасте.»',
    vocabChips: ['redundant', 'retrain', 'job insecurity', 'social costs'],
    task: {
      type: 'trueFalse',
      q: 'Older workers usually find it easier to retrain than younger workers.',
      answer: false,
      explanation: 'False — older workers often find retraining more difficult. This is one of the social costs of technological change.'
    }
  },
  {
    id: 'younger_worker',
    role: 'Younger Worker',
    roleRu: 'Молодой работник',
    initials: 'YW',
    color: '#4A8C6A',
    icon: '🎓',
    statement: '"I lost my old job but I enrolled in a computer course. Within 6 months, I found a new job using the new technology."',
    statementRu: '«Я потерял старую работу, но прошёл компьютерные курсы. Через 6 месяцев я нашёл новую работу.»',
    vocabChips: ['retrain', 'employment', 'replace', 'adapt'],
    task: {
      type: 'sentenceBuilder',
      q: 'Build the sentence about younger workers:',
      tiles: ['Younger', 'workers', 'can', 'retrain', 'more', 'easily', 'and', 'find', 'new', 'employment', 'older', 'retire', 'slowly', 'refuse'],
      answer: ['Younger', 'workers', 'can', 'retrain', 'more', 'easily', 'and', 'find', 'new', 'employment']
    }
  },
  {
    id: 'government',
    role: 'Government Official',
    roleRu: 'Государственный чиновник',
    initials: 'GO',
    color: '#6A5ACD',
    icon: '🏛️',
    statement: '"The government will support retraining programmes for redundant workers. Economic growth must benefit everyone."',
    statementRu: '«Правительство поддержит программы переобучения. Экономический рост должен приносить пользу всем.»',
    vocabChips: ['support', 'retraining', 'economic growth', 'benefit'],
    task: {
      type: 'choice',
      q: 'Why should the government support retraining programmes?',
      options: [
        'To increase pollution levels',
        'To help redundant workers find new jobs and reduce social costs',
        'To make companies pay more taxes',
        'To stop economic growth'
      ],
      answer: 'To help redundant workers find new jobs and reduce social costs',
      explanation: 'Government retraining support reduces long-term unemployment and the social costs of technological change.'
    }
  },
  {
    id: 'researcher',
    role: 'Economic Researcher',
    roleRu: 'Экономический исследователь',
    initials: 'ER',
    color: '#C0943A',
    icon: '📊',
    statement: '"Technological advances create short-term social costs but long-term economic benefits. We must measure both carefully."',
    statementRu: '«Технологический прогресс создаёт краткосрочные социальные издержки, но долгосрочные экономические выгоды.»',
    vocabChips: ['social costs', 'benefit', 'opportunity cost', 'standard of living'],
    task: {
      type: 'trueFalse',
      q: 'Economic growth brings only long-term benefits with no social costs.',
      answer: false,
      explanation: 'False — growth creates both benefits AND social costs. Researchers measure the full picture.'
    }
  },
  {
    id: 'family',
    role: 'Family Member',
    roleRu: 'Член семьи',
    initials: 'FM',
    color: '#5E9E89',
    icon: '🏠',
    statement: '"My husband lost his job. We worry about paying the rent and supporting our children. The stress is very difficult."',
    statementRu: '«Мой муж потерял работу. Мы беспокоимся об аренде и детях. Это очень тяжело.»',
    vocabChips: ['social costs', 'rental', 'redundant', 'support'],
    task: {
      type: 'choice',
      q: 'What word describes the family\'s experience of losing income and housing costs?',
      options: ['capital goods', 'social costs', 'revenue', 'output'],
      answer: 'social costs',
      explanation: '"Social costs" describes the negative human effects of economic change — financial stress, family difficulties, and uncertainty.'
    }
  }
];

/* ─── Mini task component ────────────────────────────────────────────────── */
function CardTask({ task, accentColor }) {
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (task.type === 'sentenceBuilder') {
    return (
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--col-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>Mini Task</p>
        <SentenceBuilder prompt={task.q} tiles={task.tiles} answer={task.answer} />
      </div>
    );
  }

  const isCorrect = submitted && String(answer) === String(task.answer);
  const isWrong = submitted && String(answer) !== String(task.answer);

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--col-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>Mini Task</p>
      <p className="text-sm font-medium mb-2.5" style={{ color: 'var(--col-heading)' }}>{task.q}</p>

      {task.type === 'trueFalse' && (
        <div className="flex gap-2">
          {[true, false].map(v => {
            const sel = answer === v;
            const correct = submitted && v === task.answer;
            const wrong = submitted && sel && v !== task.answer;
            return (
              <button key={String(v)} disabled={submitted} onClick={() => setAnswer(v)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? `2px solid ${accentColor}` : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? `${accentColor}15` : 'var(--col-surface)',
                  color: correct ? '#1F5E3A' : wrong ? '#7F2020' : 'var(--col-body)'
                }}>
                {v ? 'True' : 'False'}
              </button>
            );
          })}
        </div>
      )}

      {task.type === 'choice' && (
        <div className="space-y-1.5">
          {task.options.map(opt => {
            const sel = answer === opt;
            const correct = submitted && opt === task.answer;
            const wrong = submitted && sel && opt !== task.answer;
            return (
              <button key={opt} disabled={submitted} onClick={() => setAnswer(opt)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  minHeight: 44,
                  border: correct ? '2px solid var(--col-correct)' : wrong ? '2px solid var(--col-incorrect)' : sel ? `2px solid ${accentColor}` : '1px solid var(--col-border)',
                  backgroundColor: correct ? '#F0FAF5' : wrong ? '#FEF2F2' : sel ? `${accentColor}15` : 'var(--col-surface-secondary)',
                  color: correct ? '#1F5E3A' : wrong ? '#7F2020' : 'var(--col-body)',
                  fontWeight: (sel || correct) ? 600 : 400
                }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {!submitted && answer !== null && (
        <button onClick={() => setSubmitted(true)}
          className="mt-2.5 w-full rounded-xl text-sm font-semibold text-white"
          style={{ minHeight: 44, backgroundColor: accentColor }}>
          Check
        </button>
      )}

      {submitted && task.explanation && (
        <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: isCorrect ? '#E8F5EE' : '#FEF2F2',
            color: isCorrect ? '#1F5E3A' : '#7F2020',
            borderLeft: `3px solid ${isCorrect ? 'var(--col-correct)' : 'var(--col-incorrect)'}`
          }}>
          {isCorrect ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
          <span>{isCorrect ? '✓ Correct. ' : `Answer: ${task.answer === true ? 'True' : task.answer === false ? 'False' : task.answer}. `}{task.explanation}</span>
        </div>
      )}

      {submitted && (
        <button onClick={() => { setAnswer(null); setSubmitted(false); }}
          className="mt-2 text-xs px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
          Try again
        </button>
      )}
    </div>
  );
}

/* ─── Single character card ──────────────────────────────────────────────── */
function PersonCard({ char }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--col-surface)',
        border: `1px solid ${char.color}25`,
        borderLeft: `3px solid ${char.color}`
      }}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
        style={{ minHeight: 64 }}
      >
        {/* Avatar */}
        <div
          className="shrink-0 flex items-center justify-center rounded-xl font-bold text-sm"
          style={{
            width: 40, height: 40,
            backgroundColor: `${char.color}18`,
            color: char.color,
            border: `1.5px solid ${char.color}30`,
            fontSize: 20,
            lineHeight: 1
          }}
        >
          {char.icon}
        </div>

        {/* Name + statement preview */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--col-heading)' }}>{char.role}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--col-muted)' }}>{char.roleRu}</p>
        </div>

        {/* Chevron */}
        <div className="shrink-0" style={{ color: 'var(--col-muted)' }}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--col-border)' }}>
          {/* Statement */}
          <div
            className="mt-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: `${char.color}08`, borderLeft: `3px solid ${char.color}` }}
          >
            <p className="text-sm italic leading-relaxed" style={{ color: 'var(--col-heading)' }}>
              {char.statement}
            </p>
            <p className="text-xs italic mt-1.5" style={{ color: 'var(--col-muted)' }}>
              {char.statementRu}
            </p>
          </div>

          {/* Vocab chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {char.vocabChips.map(chip => (
              <span
                key={chip}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${char.color}12`, color: char.color, border: `1px solid ${char.color}25` }}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Mini task */}
          <CardTask task={char.task} accentColor={char.color} />
        </div>
      )}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function PeopleProgressCards() {
  return (
    <div
      className="mb-8 rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-1">
          <div
            className="shrink-0 flex items-center justify-center rounded-xl"
            style={{ width: 40, height: 40, backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <Users className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>People and Progress</h2>
            <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>Люди и прогресс</p>
          </div>
        </div>

        <p className="text-sm mb-1 mt-2" style={{ color: 'var(--col-secondary)' }}>
          Economic growth affects different people in different ways. Read each person's story, learn their vocabulary, and complete the mini-task.
        </p>
        <p className="text-xs italic mb-5" style={{ color: 'var(--col-muted)' }}>
          Экономический рост влияет на разных людей по-разному. Прочитайте историю каждого человека.
        </p>

        {/* Cards */}
        <div className="space-y-2.5">
          {CHARACTERS.map(char => (
            <PersonCard key={char.id} char={char} />
          ))}
        </div>
      </div>
    </div>
  );
}