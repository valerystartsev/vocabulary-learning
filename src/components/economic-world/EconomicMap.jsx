import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { PROFILES } from '../../data/economicWorldData';

// Natural Earth 110m world TopoJSON — real geographic data
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const OCEAN_COLOR = '#1a2a38';
const LAND_COLOR = '#243548';
const LAND_STROKE = '#2e4560';
const LAND_STROKE_WIDTH = 0.4;
const BORDER_COLOR = '#3a5575';
const ACTIVE_FILL = '#5E9E89';
const ACTIVE_FILL_HOVER = '#4a8a75';
const ACTIVE_FILL_SELECTED = '#3a7a65';

// Map profile ids to ISO numeric codes for highlighting
const PROFILE_ISO_CODES = {
  uk:      '826',
  russia:  '643',
  usa:     '840',
  germany: '276',
  china:   '156',
};

function CountryMarker({ profile, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const fill = isSelected ? ACTIVE_FILL_SELECTED : hovered ? ACTIVE_FILL_HOVER : ACTIVE_FILL;
  const r = isSelected ? 8 : 6;

  return (
    <Marker
      coordinates={[profile.lng, profile.lat]}
      onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : profile); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer halo */}
      {!isSelected && (
        <circle r={r + 5} fill={`${ACTIVE_FILL}22`} stroke={`${ACTIVE_FILL}55`} strokeWidth={0.8} />
      )}
      {isSelected && (
        <circle r={r + 6} fill="none" stroke={ACTIVE_FILL} strokeWidth={1.5} opacity={0.6} />
      )}
      {/* Main dot */}
      <circle
        r={r}
        fill={fill}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth={isSelected ? 2 : 1.5}
      />
      {/* Inner dot */}
      <circle r={isSelected ? 3 : 2.5} fill="white" opacity={isSelected ? 1 : 0.8} />

      {/* Label tooltip */}
      {(hovered || isSelected) && (
        <g>
          <rect
            x={-(profile.name.length * 3.2 + 6)}
            y={-26}
            width={profile.name.length * 6.4 + 12}
            height={18}
            rx={4}
            fill="#1a2733"
            opacity={0.95}
          />
          <text
            textAnchor="middle"
            y={-13}
            fill="white"
            fontSize={9}
            fontFamily="var(--font-inter)"
            fontWeight={600}
            letterSpacing={0.3}
            style={{ pointerEvents: 'none' }}
          >
            {profile.name}
          </text>
        </g>
      )}
    </Marker>
  );
}

export default function EconomicMap({ selectedProfile, onSelectProfile }) {
  const [geosLoaded, setGeosLoaded] = useState(false);

  const activeIsoCodes = new Set(Object.values(PROFILE_ISO_CODES));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--col-border)', position: 'relative' }}
    >
      {/* Map */}
      <div
        style={{ backgroundColor: OCEAN_COLOR }}
        onClick={() => onSelectProfile(null)}
      >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 153, center: [10, 10] }}
          style={{ width: '100%', display: 'block', maxHeight: 430 }}
        >
          {/* Ocean background */}
          <rect x="-100%" y="-100%" width="300%" height="300%" fill={OCEAN_COLOR} />

          {/* Graticule lines */}
          {[-60, -30, 0, 30, 60].map(lat => (
            <line key={`lat-${lat}`} />
          ))}

          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              if (!geosLoaded && geographies.length > 0) {
                // Trigger re-render once loaded
                setTimeout(() => setGeosLoaded(true), 0);
              }
              return geographies.map((geo) => {
                const isoCode = String(geo.id);
                const isActiveCountry = activeIsoCodes.has(isoCode);
                const matchedProfile = PROFILES.find(
                  p => PROFILE_ISO_CODES[p.id] === isoCode
                );
                const isSelected = selectedProfile && matchedProfile?.id === selectedProfile.id;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      isSelected
                        ? `${ACTIVE_FILL}40`
                        : isActiveCountry
                        ? `${ACTIVE_FILL}20`
                        : LAND_COLOR
                    }
                    stroke={isActiveCountry ? BORDER_COLOR : LAND_STROKE}
                    strokeWidth={isActiveCountry ? 0.6 : LAND_STROKE_WIDTH}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        fill: isActiveCountry ? `${ACTIVE_FILL}35` : '#2d4158',
                        outline: 'none',
                        cursor: isActiveCountry ? 'pointer' : 'default',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onClick={(e) => {
                      if (isActiveCountry && matchedProfile) {
                        e.stopPropagation();
                        onSelectProfile(isSelected ? null : matchedProfile);
                      }
                    }}
                  />
                );
              });
            }}
          </Geographies>

          {/* Country markers */}
          {PROFILES.map(profile => (
            <CountryMarker
              key={profile.id}
              profile={profile}
              isSelected={selectedProfile?.id === profile.id}
              onSelect={onSelectProfile}
            />
          ))}
        </ComposableMap>
      </div>

      {/* Legend bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-wrap gap-2"
        style={{ backgroundColor: '#14212d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: ACTIVE_FILL,
              border: '1.5px solid rgba(255,255,255,0.7)',
              flexShrink: 0
            }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 500, fontFamily: 'var(--font-inter)' }}>
              Active profile — click to open
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              backgroundColor: `${ACTIVE_FILL}25`,
              border: `1px solid ${BORDER_COLOR}`,
              flexShrink: 0
            }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
              Active country region
            </span>
          </div>
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-inter)' }}>
          Natural Earth · Adaptation course
        </span>
      </div>
    </div>
  );
}