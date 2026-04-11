import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMode } from '../../context/ModeContext';
import { useProgress } from '../../context/ProgressContext';
import { Star, Trophy, RotateCcw, AlertTriangle, Eye } from 'lucide-react';
import TotalTestPart from './TotalTestPart';

export default function TotalTest({ totalTest, unitId }) {
  const { isTeacherMode } = useMode();
  const { progress, saveTotalTestScore, markSectionComplete, addWeakWordsFromExercise } = useProgress();
  const [partScores, setPartScores] = useState({});
  const [testDone, setTestDone] = useState(false);
  const [weakWordsAdded, setWeakWordsAdded] = useState([]);

  const existingScore = progress.totalTestScores[unitId];

  const handlePartComplete = (partId, result) => {
    setPartScores(prev => {
      const next = { ...prev, [partId]: result };
      const allParts = totalTest.parts.map(p => p.id);
      const allDone = allParts.every(pid => next[pid] !== undefined);
      if (allDone) {
        const totalCorrect = Object.values(next).reduce((a, s) => a + (s?.correct || 0), 0);
        const totalItems = Object.values(next).reduce((a, s) => a + (s?.total || 0), 0);
        const pct = totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0;
        saveTotalTestScore(unitId, pct);
        markSectionComplete(unitId, 'totaltest');
        setTestDone(true);

        // collect all wrong word IDs
        const allWrongIds = Object.values(next).flatMap(s => s?.wrongWordIds || []);
        if (allWrongIds.length > 0) {
          setWeakWordsAdded(allWrongIds);
          addWeakWordsFromExercise(allWrongIds);
        }
      }
      return next;
    });
  };

  const totalCorrect = Object.values(partScores).reduce((a, s) => a + (s?.correct || 0), 0);
  const totalItems = Object.values(partScores).reduce((a, s) => a + (s?.total || 0), 0);
  const overallPct = totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0;

  const handleRetakeAll = () => {
    setPartScores({});
    setTestDone(false);
    setWeakWordsAdded([]);
  };

  return (
    <div className="mb-8">
      {/* Test Header */}
      <div className={`rounded-xl p-6 mb-6 ${isTeacherMode ? 'bg-accent/10 border-2 border-accent/30' : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Star className={`h-6 w-6 ${isTeacherMode ? 'text-accent' : 'text-accent'}`} />
          <h2 className={`text-xl font-bold ${isTeacherMode ? 'text-foreground' : ''}`}>{totalTest.title}</h2>
        </div>
        <p className={`text-sm mb-3 ${isTeacherMode ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
          Complete all {totalTest.parts.length} parts to get your final score.
          {isTeacherMode && <span className="ml-1 text-accent font-medium">Teacher: all answers visible.</span>}
        </p>
        {isTeacherMode && (
          <Badge className="bg-accent/20 text-accent-foreground border border-accent/30 text-xs">
            <Eye className="mr-1 h-3 w-3" /> Teacher Mode — All answer keys visible
          </Badge>
        )}
        {existingScore !== undefined && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${isTeacherMode ? 'text-foreground/70' : 'text-primary-foreground/80'}`}>
            <Trophy className="h-4 w-4 text-accent" />
            Previous best score: <span className="font-bold text-accent">{existingScore}%</span>
          </div>
        )}
      </div>

      {/* Parts */}
      {totalTest.parts.map((part, idx) => (
        <TotalTestPart
          key={part.id}
          part={part}
          partNumber={idx + 1}
          isTeacherMode={isTeacherMode}
          onComplete={(result) => handlePartComplete(part.id, result)}
          score={partScores[part.id]}
        />
      ))}

      {/* Final Score */}
      {testDone && (
        <Card className={`border-2 mt-4 ${overallPct >= 70 ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
          <CardContent className="p-6 text-center">
            <Trophy className={`h-12 w-12 mx-auto mb-3 ${overallPct >= 70 ? 'text-green-600' : 'text-amber-500'}`} />
            <h3 className="text-3xl font-bold mb-2">Final Score: {overallPct}%</h3>
            <p className="text-muted-foreground mb-4">{totalCorrect} correct out of {totalItems} items</p>

            {/* Part breakdown */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {totalTest.parts.map(part => {
                const s = partScores[part.id];
                if (!s) return null;
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <Badge key={part.id} className={`text-xs ${pct === 100 ? 'bg-green-100 text-green-800 border-green-200' : pct >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {part.title}: {s.correct}/{s.total} ({pct}%)
                  </Badge>
                );
              })}
            </div>

            {/* Weak words added */}
            {weakWordsAdded.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-800">
                    {weakWordsAdded.length} word{weakWordsAdded.length !== 1 ? 's' : ''} added to your Weak Words list.
                  </span>
                </div>
                <p className="text-xs text-amber-700">Review them in the Glossary — use Flash Review or Micro Quiz.</p>
              </div>
            )}

            <p className="text-sm font-medium mb-5">
              {overallPct >= 90 ? '⭐ Excellent! You know this unit very well.' :
               overallPct >= 70 ? '✅ Good job! You understand most of the material.' :
               overallPct >= 50 ? '📖 Not bad. Review your weak areas and try again.' :
               '🔁 You need more practice. Review the dictionary and exercises first.'}
            </p>

            <Button variant="outline" onClick={handleRetakeAll}>
              <RotateCcw className="mr-2 h-4 w-4" /> Retake All Parts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}