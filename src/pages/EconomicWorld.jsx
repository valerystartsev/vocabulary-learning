import React, { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { PROFILES } from '../data/economicWorldData';
import EconomicMap from '../components/economic-world/EconomicMap';
import CountryPanel from '../components/economic-world/CountryPanel';

const ACCENT = '#5E9E89';

function ProfileCard({ profile, selected, onClick }) {
  const isSelected = selected?.id === profile.id;
  return (
    <button
      onClick={() => onClick(isSelected ? null : profile)}
      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        backgroundColor: isSelected ? 'var(--col-accent-light)' : 'var(--col-surface)',
        border: isSelected ? `1.5px solid ${ACCENT}` : '1px solid var(--col-border)',
        minHeight: 60
      }}
    >
      <div
        className="shrink-0 flex items-center justify-center rounded-lg"
        style={{ width: 30, height: 30, backgroundColor: isSelected ? ACCENT : 'var(--col-surface-secondary)', border: `1px solid ${isSelected ? ACCENT : 'var(--col-border)'}` }}
      >
        <MapPin className="h-3.5 w-3.5" style={{ color: isSelected ? 'white' : 'var(--col-muted)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--col-heading)' }}>{profile.name}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--col-muted)' }}>{profile.courseLens}</p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 transition-transform"
        style={{ color: isSelected ? ACCENT : 'var(--col-muted)', transform: isSelected ? 'rotate(90deg)' : 'none' }}
      />
    </button>
  );
}

export default function EconomicWorld() {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    if (profile && window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('ew-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* Page header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--col-heading)', letterSpacing: '-0.3px' }}>
            Economic World
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--col-muted)' }}>
            How course vocabulary connects to real markets, real regulation, and real competition cases around the world
          </p>
          <div
            className="rounded-xl px-5 py-4"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)', borderLeft: `3px solid ${ACCENT}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--col-body)' }}>
              Each country profile shows a <strong>vocabulary lens</strong> of three course words, a real <strong>competition or antitrust case</strong> handled by that country's regulator, and a short interactive question. This section is part of the course — it helps you see the words you are learning in real market contexts.
            </p>
            <p className="text-xs italic mt-2" style={{ color: 'var(--col-muted)' }}>
              Каждый профиль страны показывает три слова из курса, реальное антимонопольное дело и короткое интерактивное задание. Этот раздел — часть курса.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: map + profile list */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Real world map */}
            <EconomicMap selectedProfile={selectedProfile} onSelectProfile={handleSelect} />

            {/* Profile list */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>
                Active Course Profiles — {PROFILES.length} countries
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PROFILES.map(p => (
                  <ProfileCard key={p.id} profile={p} selected={selectedProfile} onClick={handleSelect} />
                ))}
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--col-muted)' }}>
                Each profile is tied to real competition law cases and course vocabulary. Click any country to open its full profile with a source-linked case and interactive check.
              </p>
            </div>
          </div>

          {/* Right: country detail panel */}
          <div id="ew-panel" className="lg:w-[390px] lg:shrink-0" style={{ minWidth: 0 }}>
            {selectedProfile ? (
              <div
                className="rounded-2xl overflow-hidden lg:sticky lg:top-4"
                style={{
                  backgroundColor: 'var(--col-surface)',
                  border: '1px solid var(--col-border)',
                  maxHeight: 'calc(100vh - 2rem)',
                  overflowY: 'auto'
                }}
              >
                <CountryPanel
                  profile={selectedProfile}
                  onClose={() => setSelectedProfile(null)}
                  accentColor={ACCENT}
                />
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 text-center lg:sticky lg:top-4"
                style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
                >
                  <MapPin className="h-6 w-6" style={{ color: ACCENT }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--col-heading)' }}>Select a country</h3>
                <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
                  Click a highlighted marker on the map or choose a profile from the list to open a course-based country profile.
                </p>
                <p className="text-xs italic mt-2" style={{ color: 'var(--col-muted)' }}>
                  Нажмите на маркер карты или выберите страну из списка.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}