import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
  ChevronRight,
} from 'lucide-react';

// Map lucide icon names (strings stored in the registry) to the
// imported components. Add new entries here when a new tool needs
// an icon that isn't already in the map.
const ICON_MAP = {
  Ship, Globe, Car, BarChart3, Landmark, Wallet, Calculator, Scale,
};

export default function ToolCard({ tool }) {
  const Icon = ICON_MAP[tool.icon] || Ship;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <Link
        to={`/interactive-lab/${tool.id}`}
        className="block rounded-2xl p-5 h-full transition-colors group"
        style={{
          backgroundColor: 'var(--col-surface)',
          border: '1px solid var(--col-border)',
          boxShadow: '0 1px 3px rgba(26,40,40,0.04)',
        }}
      >
        {/* Icon + badge row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 44, height: 44, backgroundColor: 'var(--col-accent-light)' }}
          >
            <Icon className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
          </div>
          {tool.badge && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded shrink-0"
              style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-muted)' }}
            >
              {tool.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base leading-tight" style={{ color: 'var(--col-heading)' }}>
          {tool.name}
        </h3>
        <p className="text-xs italic mt-0.5 mb-3" style={{ color: 'var(--col-muted)' }}>
          {tool.nameRu}
        </p>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--col-body)' }}>
          {tool.description}
        </p>
        <p className="text-xs italic leading-relaxed" style={{ color: 'var(--col-secondary)' }}>
          {tool.descriptionRu}
        </p>

        {/* Open arrow row */}
        <div className="flex items-center justify-end mt-4 text-xs font-semibold"
          style={{ color: 'var(--col-accent)' }}>
          Open · Открыть
          <ChevronRight className="h-3.5 w-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}
