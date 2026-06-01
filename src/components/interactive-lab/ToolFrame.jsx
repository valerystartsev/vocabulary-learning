import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
} from 'lucide-react';

// Same icon map as ToolCard. Kept inline to avoid yet another shared
// constants file; if it grows beyond ~10 entries, extract to
// src/components/interactive-lab/icons.js.
const ICON_MAP = {
  Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
};

// Thin chrome above a Lab tool: back-arrow + icon + tool name +
// optional badge. The actual tool component is rendered as a child.
// If tool.selfNavigates is true (e.g. Trade Simulator, Economic
// World — both have their own internal navigation), the frame is
// hidden to avoid duplicate back buttons.
export default function ToolFrame({ tool, children }) {
  if (!tool) return null;
  const Icon = ICON_MAP[tool.icon] || Ship;

  if (tool.selfNavigates) {
    // Tool owns its own header. Just inject a fixed "Back to Lab"
    // link in the top-right and render the tool full-bleed.
    return (
      <div className="relative">
        <Link
          to="/interactive-lab"
          className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
          style={{
            backgroundColor: 'var(--col-surface)',
            border: '1px solid var(--col-border)',
            color: 'var(--col-secondary)',
            minHeight: 36,
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Lab
        </Link>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      {/* Back-bar */}
      <div
        className="sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--col-surface)',
          borderBottom: '1px solid var(--col-border)',
          boxShadow: '0 1px 6px rgba(26,40,40,0.04)',
        }}
      >
        <Link
          to="/interactive-lab"
          className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg"
          style={{
            backgroundColor: 'var(--col-surface-secondary)',
            border: '1px solid var(--col-border)',
            color: 'var(--col-secondary)',
            minHeight: 40,
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Lab</span>
          <span className="sm:hidden">Lab</span>
        </Link>

        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--col-heading)' }}>
            {tool.name}
          </p>
          <span className="text-xs italic hidden md:inline truncate" style={{ color: 'var(--col-muted)' }}>
            · {tool.nameRu}
          </span>
        </div>

        {tool.badge && (
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded shrink-0 hidden sm:inline"
            style={{ backgroundColor: 'var(--col-accent-light)', color: 'var(--col-accent-text)' }}
          >
            {tool.badge}
          </span>
        )}
      </div>

      {/* Tool content */}
      <div className="px-4 md:px-8 py-6">{children}</div>
    </div>
  );
}
