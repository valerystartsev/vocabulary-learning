import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '../../context/ProgressContext';
import { Zap, ChevronRight, RotateCcw, Trophy, AlertCircle } from 'lucide-react';

export default function ScenarioLoop({ scenario, unitId }) {
  const { saveScenarioScore, markSectionComplete, progress } = useProgress();
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const previousScore = progress.scenarioScores[unitId];

  const handleChoice = (choice) => {
    const newChoices = [...choices, choice];
    setChoices(newChoices);

    if (step < scenario.steps.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate score
      let total = 0;
      scenario.steps.forEach((s, i) => {
        if (newChoices[i]?.isOptimal) total++;
      });
      const finalScore = Math.round((total / scenario.steps.length) * 100);
      setScore(finalScore);
      setFinished(true);
      saveScenarioScore(unitId, finalScore, getResult(finalScore));
      markSectionComplete(unitId, 'scenario');
    }
  };

  const getResult = (s) => {
    if (s >= 80) return 'excellent';
    if (s >= 60) return 'good';
    if (s >= 40) return 'average';
    return 'needs work';
  };

  const resultConfig = {
    excellent: { label: 'Excellent decisions!', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
    good: { label: 'Good strategy!', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    average: { label: 'Reasonable choices.', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    'needs work': { label: 'Review the key concepts and try again.', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
  };

  const handleRetry = () => {
    setStep(0);
    setChoices([]);
    setFinished(false);
    setScore(0);
  };

  const currentStep = scenario.steps[step];
  const result = getResult(score);
  const cfg = resultConfig[result];

  return (
    <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">{scenario.title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{scenario.description}</p>
        {previousScore && !finished && (
          <Badge variant="outline" className="w-fit text-xs">
            Previous score: {previousScore.score}% — {previousScore.result}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {!finished ? (
          <div>
            {/* Progress bar */}
            <div className="flex gap-1 mb-4">
              {scenario.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < step ? 'bg-accent' : i === step ? 'bg-accent/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <Badge className="bg-accent/20 text-accent-foreground text-xs">
                Step {step + 1} of {scenario.steps.length}
              </Badge>
              {currentStep.vocabFocus && (
                <Badge variant="outline" className="text-[10px]">
                  Word: <strong className="ml-1">{currentStep.vocabFocus}</strong>
                </Badge>
              )}
            </div>

            <div className="p-4 bg-white rounded-xl border mb-4">
              <p className="text-sm font-semibold text-foreground mb-1">{currentStep.situation}</p>
              {currentStep.context && (
                <p className="text-xs text-muted-foreground italic">{currentStep.context}</p>
              )}
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">What do you do?</p>
            <div className="space-y-2">
              {currentStep.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">{opt.text}</p>
                  {opt.vocabUsed && (
                    <span className="text-[10px] text-muted-foreground italic mt-0.5 block">
                      Uses: <strong>{opt.vocabUsed}</strong>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Previous choice feedback */}
            {choices.length > 0 && choices[step - 1] && (
              <div className={`mt-4 p-3 rounded-lg border text-sm ${choices[step - 1].isOptimal ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <strong>{choices[step - 1].isOptimal ? '✓ Good choice!' : '⚠ Not ideal.'}</strong> {choices[step - 1].feedback}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Final feedback for last step */}
            {choices[choices.length - 1] && (
              <div className={`mb-4 p-3 rounded-lg border text-sm ${choices[choices.length - 1].isOptimal ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <strong>{choices[choices.length - 1].isOptimal ? '✓ Good final choice!' : '⚠ Last step not ideal.'}</strong> {choices[choices.length - 1].feedback}
              </div>
            )}

            {/* Score */}
            <div className={`p-5 rounded-xl border ${cfg.color} mb-4`}>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className={`h-8 w-8 ${cfg.text}`} />
                <div>
                  <p className={`text-xl font-bold ${cfg.text}`}>{score}%</p>
                  <p className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{scenario.conclusion}</p>
            </div>

            {/* Choice summary */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Your Decisions:</p>
              {scenario.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={`text-xs mt-0.5 ${choices[i]?.isOptimal ? 'text-green-600' : 'text-amber-600'}`}>
                    {choices[i]?.isOptimal ? '✓' : '✗'}
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.situation.slice(0, 50)}...</p>
                    <p className="text-xs font-medium">{choices[i]?.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleRetry} variant="outline" size="sm" className="w-full">
              <RotateCcw className="mr-2 h-3 w-3" /> Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}