import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Headphones, FileText, CheckCircle } from 'lucide-react';

const typeIcons = { video: Video, podcast: Headphones, article: FileText };

export default function MediaResources({ media, unitId }) {
  const { progress, markMediaComplete } = useProgress();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Video className="h-5 w-5 text-accent" /> Media & Resources
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {media.map((item, idx) => {
          const Icon = typeIcons[item.type] || FileText;
          const mediaId = `${unitId}_media_${idx}`;
          const isComplete = progress.completedMedia.includes(mediaId);
          return (
            <Card key={idx} className={isComplete ? 'border-green-200 bg-green-50/30' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <Badge variant="outline" className="text-[10px] mt-1">{item.type}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="p-2 bg-muted rounded-md mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Why it helps</p>
                  <p className="text-xs text-foreground/80">{item.whyHelps}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Vocabulary to listen for</p>
                  <div className="flex flex-wrap gap-1">
                    {item.vocabToListen.map(v => (
                      <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-2 bg-accent/5 rounded-md mb-3">
                  <p className="text-xs font-medium text-accent-foreground/70 uppercase">Follow-up task</p>
                  <p className="text-xs text-foreground/80">{item.task}</p>
                </div>
                <Button
                  size="sm"
                  variant={isComplete ? 'default' : 'outline'}
                  onClick={() => markMediaComplete(mediaId)}
                  className={isComplete ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {isComplete ? 'Completed' : 'Mark as Completed'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}