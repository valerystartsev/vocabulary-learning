import React, { useState } from 'react';
import { TrendingUp, Cpu, ThumbsUp, AlertTriangle, Shield, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

const ICON_MAP = {
  TrendingUp, Cpu, ThumbsUp, AlertTriangle, Shield,
  UserMinus: ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" x2="16" y1="11" y2="11"/>
    </svg>
  )
};

function StageCard({ node, index, isExpanded, onToggle, isTeacherMode }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const Icon = ICON_MAP[node.icon] || TrendingUp;

  const check = () => setChecked(true);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ border: `1.5px solid ${node.color}30`, backgroundColor: 'var(--col-surface)' }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
        style={{ minHeight: 64 }}
      >
        <div
          className="shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, backgroundColor: `${node.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: node.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${node.color}15`, color: node.color }}
            >
              Stage {index + 1}
            </span>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>{node.stage}</h3>
          </div>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--col-secondary)' }}>{node.description}</p>
        </div>
        <div style={{ color: 'var(--col-muted)', flexShrink: 0 }}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0" style={{ borderTop: `1px solid ${node.color}20` }}>
          {/* Vocab chips */}
          <div className="mb-3 mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--col-muted)' }}>
              Key vocabulary at this stage
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.vocab.map(v => (
                <span
                  key={v}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${node.color}15`, color: node.color, border: `1px solid ${node.color}30` }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Question */}
          <div
            className="p-3 rounded-xl mb-3"
            style={{
              backgroundColor: checked && (answer === node.answer) ? '#F0FAF5' : checked && answer !== node.answer ? '#FEF2F2' : 'var(--col-dict-bg)',
              border: checked && (answer === node.answer) ? '1px solid var(--col-correct)' : checked && answer !== node.answer ? '1px solid var(--col-incorrect)' : '1px solid var(--col-border)'
            }}
          >
            <p className="text-sm font-medium mb-2.5" style={{ color: 'var(--col-heading)' }}>{node.question}</p>
            <div className="space-y-2">
              {node.options.map(opt => {
                const isSelected = answer === opt;
                const isCorrectOpt = checked && opt === node.answer;
                const isWrong = checked && isSelected && opt !== node.answer;
                return (
                  <button
                    key={opt}
                    disabled={checked && !isTeacherMode}
                    onClick={() => { if (!checked || isTeacherMode) setAnswer(opt); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all"
                    style={{
                      minHeight: 44,
                      border: isCorrectOpt ? '1.5px solid var(--col-correct)' : isWrong ? '1.5px solid var(--col-incorrect)' : isSelected ? `1.5px solid ${node.color}` : '1px solid var(--col-border)',
                      backgroundColor: isCorrectOpt ? '#F0FAF5' : isWrong ? '#FEF2F2' : isSelected ? `${node.color}10` : 'var(--col-surface)',
                      color: isCorrectOpt ? '#1F5E3A' : isWrong ? 'var(--col-incorrect)' : isSelected ? node.color : 'var(--col-body)',
                      fontWeight: isSelected || isCorrectOpt ? 600 : 400,
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {!checked && answer !== null && (
              <button
                onClick={check}
                className="mt-3 w-full rounded-xl text-xs font-semibold text-white py-2.5"
                style={{ backgroundColor: node.color, minHeight: 44 }}
              >
                Check Answer
              </button>
            )}
            {checked && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: answer === node.answer ? '#E8F5EE' : '#FEF2F2' }}>
                <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: answer === node.answer ? 'var(--col-correct)' : 'var(--col-incorrect)' }} />
                <p className="text-xs" style={{ color: answer === node.answer ? '#1F5E3A' : '#7F2020' }}>
                  {answer === node.answer ? '✓ Correct. ' : `✗ Answer: ${node.answer}. `}
                  {node.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrowthImpactMap({ data }) {
  const { isTeacherMode } = useMode();
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!data) return null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
        </div>

        {/* Chain connector */}
        <div className="space-y-2">
          {data.chain.map((node, idx) => (
            <div key={node.id}>
              <StageCard
                node={node}
                index={idx}
                isExpanded={expandedIdx === idx}
                onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                isTeacherMode={isTeacherMode}
              />
              {idx < data.chain.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-0.5 h-4" style={{ backgroundColor: 'var(--col-divider)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}