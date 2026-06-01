import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '../../context/ProgressContext';
import { Radio, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_OPTIONS = [
  { key: 'seen', label: 'I saw it', labelRu: 'Я видел(а) это', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { key: 'heard', label: 'I heard it', labelRu: 'Я слышал(а) это', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { key: 'understand', label: 'I understand it', labelRu: 'Я понимаю это', color: 'bg-green-100 border-green-300 text-green-700' },
  { key: 'canUse', label: 'I can use it', labelRu: 'Я могу использовать', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  { key: 'difficult', label: 'Still difficult', labelRu: 'Ещё сложно', color: 'bg-red-100 border-red-300 text-red-700' },
];

export default function VocabularyRadar({ words, contextLabel, unitId }) {
  const { progress, updateVocabRadar, markWordWeak, markWordLearned } = useProgress();
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);

  // Scope radar state by both wordId and unitId. Previously the state
  // was keyed only by word.id, so marking a word in Unit 1 lit up the
  // same word in Unit 3's radar — which made the section look
  // pre-completed even though the student never touched it there.
  // The fallback (no unitId) keeps backward compatibility with any
  // legacy data that was stored under the raw word.id key.
  const radarKey = (wordId) => unitId ? `u${unitId}_${wordId}` : wordId;

  const handleStatus = (wordId, key) => {
    updateVocabRadar(radarKey(wordId), key, true);
    // weak/learned remain global because they describe knowledge of
    // the word itself, not per-unit visibility
    if (key === 'difficult') {
      markWordWeak(wordId);
    }
    if (key === 'canUse') {
      markWordLearned(wordId);
    }
  };

  const handleSave = () => {
    setSaved(true);
    // mark difficult ones as weak
    words.forEach(w => {
      const radar = progress.vocabRadar[radarKey(w.id)] || {};
      if (radar.difficult) markWordWeak(w.id);
      if (radar.canUse) markWordLearned(w.id);
    });
  };

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            Vocabulary Radar — {contextLabel}
          </CardTitle>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <p className="text-xs text-muted-foreground mt-1">
          Mark each word: how well do you know it now?
          <span className="italic ml-1 text-muted-foreground/70">(Отметьте каждое слово)</span>
        </p>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-3">
            {words.map(word => {
              const radar = progress.vocabRadar[radarKey(word.id)] || {};
              const isWeak = progress.weakWords.includes(word.id);
              const isLearned = progress.learnedWords.includes(word.id);
              return (
                <div key={word.id} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-foreground">{word.term}</span>
                    <span className="text-xs text-muted-foreground">{word.translationRu}</span>
                    {isLearned && <CheckCircle className="h-3.5 w-3.5 text-green-600 ml-auto" />}
                    {isWeak && !isLearned && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 ml-auto" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => handleStatus(word.id, opt.key)}
                        className={`text-[11px] px-2 py-1 rounded-full border transition-all ${
                          radar[opt.key]
                            ? opt.color + ' font-semibold'
                            : 'bg-muted border-border text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!saved ? (
            <Button className="mt-4 w-full" size="sm" onClick={handleSave}>
              Save Radar — Update My Weak Words List
            </Button>
          ) : (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="h-4 w-4 text-green-600 inline mr-1" />
              <span className="text-sm text-green-700 font-medium">Saved! Difficult words added to your Weak Words list.</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}