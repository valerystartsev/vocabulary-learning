import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb, ChevronRight,
  Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
} from 'lucide-react';
import { getTool } from '../../data/interactiveLab';

// Same icon set as the Lab cards / frame. Kept local for self-containment;
// extract to a shared module if the list grows.
const ICON_MAP = {
  Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
};

// A compact inline link that lives inside a unit and points to a Lab tool.
// Visual rule from the plan: ≤80px tall, accent-light background, single
// banner per relevant section — no banner-on-banner.
//
// Renders nothing if the tool id is unknown (defensive: a unit may
// reference a tool that was removed from the registry).
export default function LabBanner({ toolId }) {
  const tool = getTool(toolId);
  if (!tool) return null;

  const Icon = ICON_MAP[tool.icon] || Ship;

  return (
    <Link
      to={`/interactive-lab/${tool.id}`}
      className="block rounded-2xl px-4 py-3 mb-8 transition-colors group"
      style={{
        backgroundColor: 'var(--col-accent-light)',
        border: '1px solid var(--col-divider)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Lightbulb tip indicator */}
        <Lightbulb className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />

        {/* Tool icon in a small circle */}
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 32, height: 32, backgroundColor: 'var(--col-surface)' }}
        >
          <Icon className="h-4 w-4" style={{ color: 'var(--col-accent)' }} />
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight" style={{ color: 'var(--col-accent-text)' }}>
            Practise hands-on in <strong>{tool.name}</strong>
          </p>
          <p className="text-xs italic mt-0.5 leading-tight" style={{ color: 'var(--col-accent-text)', opacity: 0.75 }}>
            Откройте <strong>{tool.nameRu}</strong> в Лаборатории
          </p>
        </div>

        {/* CTA arrow */}
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold shrink-0"
          style={{ color: 'var(--col-accent)' }}
        >
          <span className="hidden sm:inline">Open Lab</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
