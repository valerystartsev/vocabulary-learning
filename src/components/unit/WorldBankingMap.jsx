import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { CheckCircle, Globe, Landmark, Coins, Wallet } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

// Done after exploring 4+ of the 7 banking systems
const DONE_THRESHOLD = 4;

const DEFAULT_GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map palette — keeps in sync with EconomicMap conventions
const OCEAN  = '#1a2a38';
const LAND   = '#243548';
const STROKE = '#2e4560';
const ACTIVE_FILL          = '#5E9E89';
const ACTIVE_FILL_HOVER    = '#7BB89F';
const ACTIVE_FILL_SELECTED = '#3A7A65';

export default function WorldBankingMap({ data, unitId, isTeacherMode }) {
  const { markSectionComplete } = useProgress();
  const countries = data?.countries || [];
  const geoUrl = data?.geoUrl || DEFAULT_GEO_URL;

  const [selectedId, setSelectedId] = useState(null);
  const [hoveredIso, setHoveredIso] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  // Build ISO → entry lookup so each Geography knows which entry it belongs to
  const isoToEntry = useMemo(() => {
    const m = new Map();
    countries.forEach(entry => {
      (entry.isoCodes || []).forEach(code => {
        m.set(String(code).padStart(3, '0'), entry);
      });
    });
    return m;
  }, [countries]);

  const handleSelect = (entry) => {
    if (!entry) return;
    setSelectedId(prev => (prev === entry.id ? null : entry.id));
    setSeen(prev => new Set([...prev, entry.id]));
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      markSectionComplete?.(unitId, 'worldbanking');
    }
  }, [seen, markedDone, unitId, markSectionComplete]);

  useEffect(() => {
    if (isTeacherMode && countries.length > 0 && !selectedId) {
      setSelectedId(countries[0].id);
      setSeen(new Set(countries.map(c => c.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!countries.length) return null;

  const selected = countries.find(c => c.id === selectedId);
  const hoveredEntry = hoveredIso ? isoToEntry.get(hoveredIso) : null;

  return (
    <div className="mb-8">
      {/* Intro */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {data.intro && (
            <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
              {data.intro}
            </p>
          )}
          {data.introRu && (
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
              {data.introRu}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {countries.map(c => (
              <div
                key={c.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(c.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{countries.length}
          </span>
        </div>
      </div>

      {/* Map + detail panel — side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 mb-3">
        {/* Map container */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ backgroundColor: OCEAN, border: '1px solid var(--col-border)' }}
          onClick={() => setSelectedId(null)}
        >
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 145, center: [10, 10] }}
            style={{ width: '100%', display: 'block', maxHeight: 460 }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const iso = String(geo.id).padStart(3, '0');
                  const entry = isoToEntry.get(iso);
                  const isClickable = !!entry;
                  const isSelected = entry && entry.id === selectedId;
                  const isHovered = isClickable && hoveredIso === iso;

                  let fill = LAND;
                  if (isSelected) fill = ACTIVE_FILL_SELECTED;
                  else if (isHovered) fill = ACTIVE_FILL_HOVER;
                  else if (isClickable) fill = ACTIVE_FILL;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={isClickable ? '#3a5575' : STROKE}
                      strokeWidth={isClickable ? 0.6 : 0.4}
                      onClick={(e) => {
                        if (!isClickable) return;
                        e.stopPropagation();
                        handleSelect(entry);
                      }}
                      onMouseEnter={() => isClickable && setHoveredIso(iso)}
                      onMouseLeave={() => setHoveredIso(null)}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.15s' },
                        hover:   { outline: 'none', cursor: isClickable ? 'pointer' : 'default' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Hover tooltip — country name */}
          {hoveredEntry && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-none"
              style={{ backgroundColor: 'rgba(26,42,56,0.92)', color: 'white' }}
            >
              <span className="mr-1.5">{hoveredEntry.flag}</span>
              {hoveredEntry.name}
            </div>
          )}

          {/* Legend */}
          <div
            className="absolute bottom-3 left-3 px-3 py-2 rounded-lg flex items-center gap-3 text-[10px] font-medium"
            style={{ backgroundColor: 'rgba(26,42,56,0.85)', color: 'white' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: ACTIVE_FILL }} />
              Clickable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: ACTIVE_FILL_SELECTED }} />
              Selected
            </span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
              >
                {/* Header */}
                <div className="flex items-baseline justify-between gap-2 mb-3 flex-wrap">
                  <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--col-heading)' }}>
                    <span style={{ fontSize: 22 }}>{selected.flag}</span>
                    {selected.name}
                  </h3>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--col-muted)' }}>
                  {selected.nameRu}
                </p>

                {/* Stat blocks */}
                <div className="space-y-2 mb-4">
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Landmark className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                        Central bank
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--col-heading)' }}>
                      {selected.centralBank}
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Coins className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                        Currency
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--col-heading)' }}>
                      {selected.currency}
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wallet className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                        Main accounts
                      </p>
                    </div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--col-heading)' }}>
                      {selected.mainAccounts}
                    </p>
                  </div>
                </div>

                {/* Narrative */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="h-3.5 w-3.5" style={{ color: 'var(--col-accent)' }} />
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                      Banking culture
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--col-accent-text)' }}>
                    {selected.narrative}
                  </p>
                  {selected.narrativeRu && (
                    <p className="text-xs italic leading-relaxed" style={{ color: 'var(--col-accent-text)', opacity: 0.78 }}>
                      {selected.narrativeRu}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px dashed var(--col-border)' }}
              >
                <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" style={{ color: 'var(--col-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--col-heading)' }}>
                  Click a highlighted country
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--col-muted)' }}>
                  Нажмите на выделенную страну, чтобы увидеть её банковскую систему.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Country chips (quick access, mobile-friendly) */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {countries.map(country => {
          const isSelected = selectedId === country.id;
          const wasSeen = seen.has(country.id);
          return (
            <button
              key={country.id}
              onClick={() => handleSelect(country)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--col-accent)' : wasSeen ? 'var(--col-accent-light)' : 'var(--col-surface)',
                color: isSelected ? 'white' : 'var(--col-secondary)',
                border: `1px solid ${isSelected ? 'var(--col-accent)' : 'var(--col-border)'}`,
                minHeight: 32,
              }}
            >
              <span style={{ fontSize: 14 }}>{country.flag}</span>
              {country.name}
              {wasSeen && !isSelected && <CheckCircle className="h-3 w-3" style={{ color: 'var(--col-accent)' }} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {markedDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>
              World Banking Map complete — you've toured 4+ banking systems across the globe.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
