import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMode } from '../../context/ModeContext';
import { MessageSquare, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function DialogueBlock({ dialogue }) {
  const { isTeacherMode } = useMode();
  const [taskAnswers, setTaskAnswers] = useState({});
  const [taskSubmitted, setTaskSubmitted] = useState({});
  const [showTaskAnswers, setShowTaskAnswers] = useState({});

  const checkTask = (idx, task) => {
    const userAns = (taskAnswers[idx] || '').trim().toLowerCase();
    const correct = task.a.toLowerCase();
    setTaskSubmitted(prev => ({ ...prev, [idx]: userAns === correct || userAns.includes(correct) }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent" /> Dialogue: {dialogue.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">{dialogue.context}</p>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="space-y-3">
            {dialogue.lines.map((line, idx) => (
              <div key={idx} className={`flex gap-3 ${line.speaker === dialogue.lines[0].speaker ? '' : 'ml-8'}`}>
                <Badge variant={line.speaker === dialogue.lines[0].speaker ? 'default' : 'secondary'} className="shrink-0 h-6">
                  {line.speaker}
                </Badge>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: line.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <h3 className="font-semibold text-foreground mb-3">Dialogue Tasks</h3>
      <div className="space-y-3">
        {dialogue.tasks.map((task, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">{task.q}</p>
              {task.type === 'choice' ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {task.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setTaskAnswers(prev => ({ ...prev, [idx]: opt })); setTaskSubmitted(prev => ({ ...prev, [idx]: opt === task.a })); }}
                      className={`px-3 py-1.5 rounded-md border text-sm ${
                        taskAnswers[idx] === opt
                          ? taskSubmitted[idx] !== undefined
                            ? opt === task.a ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                            : 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={taskAnswers[idx] || ''}
                    onChange={e => setTaskAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Your answer..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => checkTask(idx, task)}>Check</Button>
                </div>
              )}
              {taskSubmitted[idx] !== undefined && (
                <div className="flex items-center gap-1">
                  {taskSubmitted[idx] ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className="text-xs">{taskSubmitted[idx] ? 'Correct!' : 'Not quite. Try again or show the answer.'}</span>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="mt-1"
                onClick={() => setShowTaskAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
              >
                {showTaskAnswers[idx] ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                {showTaskAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
              </Button>
              {(showTaskAnswers[idx] || isTeacherMode) && (
                <p className="text-sm text-green-700 mt-1 p-2 bg-green-50 rounded">{task.a}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}