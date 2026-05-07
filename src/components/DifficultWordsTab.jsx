import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, X, BookText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DIFFICULT_WORDS } from '../data/difficultWordsData';
import PronounceButton from './PronounceButton';

const DIFFICULTY_STYLES = {
  easy:   { bg: '#E8F5EE', color: '#1F5E3A', label: 'Easy' },
  medium: { bg: '#FFF8E7', color: '#6B4C00', label: 'Medium' },
  hard:   { bg: '#FEF2F2', color: '#7F2020', label: 'Hard' },
};

function DiffBadge({ difficulty }) {
  const s = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.medium;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function WordCard({ word }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-shadow"
      style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left gap-2"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold" style={{ fontSize: 15, color: 'var(--col-heading)' }}>{word.term}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
            style={{ backgroundColor: 'var(--col-tag-bg)', color: 'var(--col-tag-text)' }}>
            {word.pos}
          </span>
          <span className="text-sm truncate" style={{ color: 'var(--col-secondary)' }}>— {word.translationRu}</span>
          <DiffBadge difficulty={word.difficulty} />
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
          : <ChevronDown className="h-4 w-4 shrink-0 ml-2" style={{ color: 'var(--col-muted)' }} />
        }
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: 'var(--col-border)', paddingTop: 12 }}>

          {/* Term + pronunciation */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: 'var(--col-heading)' }}>{word.term}</span>
            <PronounceButton term={word.term} audioUrl={word.audioUrl} size="sm" />
          </div>

          {/* Definitions */}
          <div className="grid md:grid-cols-2 gap-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
              <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>English definition</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{word.meaningEn}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
              <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--col-muted)' }}>Русское значение</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>{word.meaningRu}</p>
            </div>
          </div>

          {/* Example */}
          <div className="px-4 py-2.5 rounded-lg"
            style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)', border: '1px solid var(--col-divider)' }}>
            <p className="text-xs italic font-lora" style={{ color: 'var(--col-accent-text)' }}>"{word.example}"</p>
          </div>

          {/* Source */}
          <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {word.sourceLabel}
          </p>
        </div>
      )}
    </div>
  );
}

export default function DifficultWordsTab() {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [expandedAll, setExpandedAll] = useState(false);

  // Stats
  const easy = DIFFICULT_WORDS.filter(w => w.difficulty === 'easy').length;
  const medium = DIFFICULT_WORDS.filter(w => w.difficulty === 'medium').length;
  const hard = DIFFICULT_WORDS.filter(w => w.difficulty === 'hard').length;
  const total = DIFFICULT_WORDS.length;

  // Filter
  const filtered = DIFFICULT_WORDS.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q || w.term.toLowerCase().includes(q) || w.translationRu.toLowerCase().includes(q);
    const matchDiff = diffFilter === 'all' || w.difficulty === diffFilter;
    const matchSource = sourceFilter === 'all' || w.source === sourceFilter;
    return matchSearch && matchDiff && matchSource;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'var(--col-accent-light)' }}>
          <BookText className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        </div>
        <div>
          <h2 className="font-semibold text-xl" style={{ color: 'var(--col-heading)' }}>
            Difficult Words — Скрытый словарь курса
          </h2>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--col-secondary)', maxWidth: 560 }}>
            Words you may meet in readings, exercises, dialogues, and case studies — but they are not part of the main course vocabulary list.
          </p>
          <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
            Слова, встречающиеся в текстах, заданиях, диалогах и разборах дел — вне основного словаря курса.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <p className="text-sm font-semibold" style={{ color: 'var(--col-heading)' }}>
            {total} words
          </p>
          <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
            <span style={{ color: '#1F5E3A', backgroundColor: '#E8F5EE', padding: '2px 8px', borderRadius: 20 }}>Easy: {easy}</span>
            <span style={{ color: '#6B4C00', backgroundColor: '#FFF8E7', padding: '2px 8px', borderRadius: 20 }}>Medium: {medium}</span>
            <span style={{ color: '#7F2020', backgroundColor: '#FEF2F2', padding: '2px 8px', borderRadius: 20 }}>Hard: {hard}</span>
          </div>
        </div>
        {/* Segmented difficulty bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-px" style={{ backgroundColor: 'var(--col-divider)' }}>
          <div style={{ width: `${(easy / total) * 100}%`, backgroundColor: '#5E9E89' }} />
          <div style={{ width: `${(medium / total) * 100}%`, backgroundColor: '#C79A4A' }} />
          <div style={{ width: `${(hard / total) * 100}%`, backgroundColor: '#E57373' }} />
        </div>
        <div className="flex gap-4 mt-1.5 text-[10px]" style={{ color: 'var(--col-muted)' }}>
          <span>■ Easy</span><span>■ Medium</span><span>■ Hard</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--col-muted)' }} />
          <Input
            placeholder="Search words / перевод..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
            style={{ minHeight: 40 }}
          />
        </div>
        <Select value={diffFilter} onValueChange={setDiffFilter}>
          <SelectTrigger className="w-32" style={{ minHeight: 40 }}><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40" style={{ minHeight: 40 }}><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Unit 1">Unit 1</SelectItem>
            <SelectItem value="Unit 2">Unit 2</SelectItem>
            <SelectItem value="Economic World">Economic World</SelectItem>
          </SelectContent>
        </Select>
        {(search || diffFilter !== 'all' || sourceFilter !== 'all') && (
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--col-secondary)', border: '1px solid var(--col-border)', minHeight: 40 }}
            onClick={() => { setSearch(''); setDiffFilter('all'); setSourceFilter('all'); }}
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--col-muted)' }}>
        {filtered.length} word{filtered.length !== 1 ? 's' : ''} shown
      </p>

      {/* Word list */}
      <div className="space-y-2">
        {filtered.map(word => (
          <WordCard key={word.id} word={word} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--col-muted)' }}>
            <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No words match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}