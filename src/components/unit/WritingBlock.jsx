import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import { Pencil, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SentenceBuilder from '../exercises/SentenceBuilder';

/**
 * WritingBlock
 * If writing.sentenceTargets exists, renders a multi-sentence SentenceBuilder.
 * Otherwise renders the classic free-write textarea (only allowed for Unit 1 open writing).
 */
export default function WritingBlock({ writing }) {
  const { isTeacherMode } = useMode();
  const [text, setText] = useState('');
  const [showSample, setShowSample] = useState(false);

  if (writing.sentenceTargets?.length) {
    return <SentenceBuilderWriting writing={writing} isTeacherMode={isTeacherMode} />;
  }

  // Classic free-write (Unit 1 open task)
  return (
    <div className="mb-8 rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-5 py-4">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--col-heading)' }}>
          <Pencil className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          {writing.title}
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--col-secondary)' }}>{writing.instruction}</p>
        <p className="text-xs italic mb-3" style={{ color: 'var(--col-muted)' }}>{writing.instructionRu}</p>

        {writing.wordBank?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-xs font-medium" style={{ color: 'var(--col-muted)' }}>Word bank:</span>
            {writing.wordBank.map(w => (
              <Badge key={w} variant="secondary" className="text-xs">{w}</Badge>
            ))}
          </div>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write here…"
          rows={5}
          className="w-full px-3 py-2 rounded-xl text-sm mb-3"
          style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-dict-bg)', color: 'var(--col-body)', resize: 'vertical', minHeight: 100, fontSize: 14 }}
        />

        <button onClick={() => setShowSample(s => !s)}
          className="flex items-center gap-2 text-sm px-4 rounded-xl"
          style={{ minHeight: 44, border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)' }}>
          {showSample ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showSample ? 'Hide Sample Answer' : 'Show Sample Answer'}
        </button>

        {(showSample || isTeacherMode) && (
          <div className="mt-3 p-4 rounded-xl text-sm" style={{ backgroundColor: '#F0FAF5', border: '1px solid #A8D5BA' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#1F5E3A' }}>Sample Answer:</p>
            <p style={{ color: '#1F5E3A' }}>{writing.sampleAnswer}</p>
            {isTeacherMode && writing.teacherNotes && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #A8D5BA' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--col-secondary)' }}>Teacher Notes:</p>
                <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>{writing.teacherNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SentenceBuilderWriting({ writing, isTeacherMode }) {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="mb-8 rounded-xl overflow-hidden" style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-surface)' }}>
      <div className="px-5 py-4">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--col-heading)' }}>
          <Pencil className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          {writing.title}
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--col-secondary)' }}>{writing.instruction}</p>
        <p className="text-xs italic mb-4" style={{ color: 'var(--col-muted)' }}>{writing.instructionRu}</p>

        <div className="space-y-4">
          {writing.sentenceTargets.map((target, i) => (
            <div key={i}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
                Sentence {i + 1}: {target.prompt}
              </p>
              {target.tiles && target.answer ? (
                <SentenceBuilder
                  prompt={target.prompt}
                  tiles={target.tiles}
                  answer={target.answer}
                />
              ) : (
                // Fallback textarea for personal/open sentence targets
                <textarea
                  rows={2}
                  placeholder={target.hint || 'Write your sentence here…'}
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ border: '1px solid var(--col-border)', backgroundColor: 'var(--col-dict-bg)', color: 'var(--col-body)', resize: 'vertical', minHeight: 60, fontSize: 14 }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button onClick={() => setShowSample(s => !s)}
            className="flex items-center gap-2 text-sm px-4 rounded-xl"
            style={{ minHeight: 44, border: '1px solid var(--col-border)', color: 'var(--col-secondary)', backgroundColor: 'var(--col-surface-secondary)' }}>
            {showSample ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showSample ? 'Hide Sample Answer' : 'Show Sample Answer'}
          </button>
          {(showSample || isTeacherMode) && (
            <div className="mt-3 p-4 rounded-xl text-sm" style={{ backgroundColor: '#F0FAF5', border: '1px solid #A8D5BA' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#1F5E3A' }}>Sample Answer:</p>
              <p style={{ color: '#1F5E3A' }}>{writing.sampleAnswer}</p>
              {isTeacherMode && writing.teacherNotes && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #A8D5BA' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--col-secondary)' }}>Teacher Notes:</p>
                  <p className="text-xs" style={{ color: 'var(--col-secondary)' }}>{writing.teacherNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}