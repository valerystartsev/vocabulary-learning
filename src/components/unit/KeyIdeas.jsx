import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Swords, Crown, TrendingUp, ThumbsUp, AlertTriangle } from 'lucide-react';

const iconMap = { Store, Swords, Crown, TrendingUp, ThumbsUp, AlertTriangle };

export default function KeyIdeas({ unit }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-2">What is this unit about?</h2>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{unit.description}</p>
      <p className="text-xs text-muted-foreground/70 italic mb-6">{unit.descriptionRu}</p>
      <h3 className="text-lg font-semibold text-foreground mb-4">Three Key Ideas</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {unit.keyIdeas.map((idea, i) => {
          const Icon = iconMap[idea.icon] || Store;
          return (
            <Card key={i} className="border-2 hover:border-accent transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{idea.term}</h4>
                    <p className="text-xs text-muted-foreground">{idea.termRu}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{idea.meaning}</p>
                <p className="text-xs text-muted-foreground italic mt-1">{idea.meaningRu}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}