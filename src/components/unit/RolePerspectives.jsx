import React, { useState } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';

export default function RolePerspectives({ data }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(null);

  if (!data) return null;

  const checkAll = () => {
    let correct = 0;
    data.statements.forEach((s, i) => {
      if (answers[i] === s.role) correct++;
    });
    setScore({ correct, total: data.statements.length });
    setChecked(true);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setScore(null);
  };

  return (
    <div className="mb-8 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--col-heading)' }}>{data.title}</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>{data.description}</p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>{data.descriptionRu}</p>
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {data.roles.map(role => (
            <span
              key={role.id}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${role.color}15`, color: role.color, border: `1px solid ${role.color}30` }}
            >
              {role.label}
            </span>
          ))}
        </div>

        {/* Statements */}
        <div className="space-y-3">
          {data.statements.map((statement, i) => {
            const isCorrect = checked && answers[i] === statement.role;
            const isWrong = checked && answers[i] !== undefined && answers[i] !== statement.role;
            const correctRole = data.roles.find(r => r.id === statement.role);

            return (
              <div
                key={i}
                className="p-3 rounded-xl"
                style={{
                  border: isCorrect ? '1.5px solid var(--col-correct)' : isWrong ? '1.5px solid var(--col-incorrect)' : '1px solid var(--col-border)',
                  backgroundColor: isCorrect ? '#F0FAF5' : isWrong ? '#FEF2F2' : 'var(--col-surface-secondary)',
                }}
              >
                <p className="text-sm italic mb-2.5" style={{ color: 'var(--col-heading)' }}>
                  "{statement.text}"
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.roles.map(role => {
                    const selected = answers[i] === role.id;
                    return (
                      <button
                        key={role.id}
                        disabled={checked}
                        onClick={() => setAnswers(a => ({ ...a, [i]: role.id }))}
                        className="text-xs px-2.5 py-1.5 rounded-full transition-all"
                        style={{
                          minHeight: 36,
                          border: selected ? `1.5px solid ${role.color}` : '1px solid var(--col-border)',
                          backgroundColor: selected ? `${role.color}15` : 'var(--col-surface)',
                          color: selected ? role.color : 'var(--col-secondary)',
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
                {isWrong && correctRole && (
                  <p className="text-xs mt-2" style={{ color: '#7F2020' }}>
                    ✗ This would be said by: <strong>{correctRole.label}</strong>
                  </p>
                )}
                {isCorrect && (
                  <p className="text-xs mt-2" style={{ color: '#1F5E3A' }}>✓ Correct</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {!checked ? (
          <button
            onClick={checkAll}
            className="mt-4 w-full rounded-xl text-sm font-semibold text-white"
            style={{ minHeight: 52, backgroundColor: 'var(--col-accent)' }}
          >
            Check All Answers
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <div
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: score.correct >= score.total * 0.7 ? '#F0FAF5' : '#FFF8E7',
                border: `1.5px solid ${score.correct >= score.total * 0.7 ? 'var(--col-correct)' : 'var(--col-warning)'}`,
              }}
            >
              <CheckCircle className="h-7 w-7 mx-auto mb-1.5" style={{ color: score.correct >= score.total * 0.7 ? 'var(--col-correct)' : 'var(--col-warning)' }} />
              <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
                {score.correct}/{score.total} correct
              </p>
            </div>
            <button
              onClick={reset}
              className="w-full rounded-xl text-sm font-medium"
              style={{ minHeight: 48, border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}