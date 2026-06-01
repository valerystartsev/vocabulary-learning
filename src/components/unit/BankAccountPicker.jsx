import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, CheckSquare, Clock, Calendar, CheckCircle, Percent, Zap, Globe,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

const ICON_MAP = { Wallet, CheckSquare, Clock, Calendar };

const DONE_THRESHOLD = 3; // viewed at least 3 of 4 account types

export default function BankAccountPicker({ data, unitId, isTeacherMode }) {
  const { markSectionComplete, saveSectionScore } = useProgress();
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [markedDone, setMarkedDone] = useState(false);

  const accountTypes = data?.accountTypes || [];
  const filters = data?.filters || [{ id: 'all', label: 'All accounts', labelRu: 'Все счета' }];

  // Filter accounts by tag
  const filteredAccounts = useMemo(() => {
    if (filter === 'all') return accountTypes;
    return accountTypes.filter(acc => (acc.tags || []).includes(filter));
  }, [accountTypes, filter]);

  const handleSelect = (account) => {
    setSelectedId(selectedId === account.id ? null : account.id);
    if (selectedId !== account.id) {
      setSeen(prev => new Set([...prev, account.id]));
    }
  };

  useEffect(() => {
    if (!markedDone && seen.size >= DONE_THRESHOLD) {
      setMarkedDone(true);
      // Score = % of distinct account types the student explored.
      // Encourages opening all four rather than the minimum threshold.
      const score = accountTypes.length > 0
        ? Math.round((seen.size / accountTypes.length) * 100)
        : 100;
      saveSectionScore?.(unitId, 'bankaccounts', score);
      markSectionComplete?.(unitId, 'bankaccounts');
    }
  }, [seen, markedDone, unitId, markSectionComplete, saveSectionScore, accountTypes.length]);

  useEffect(() => {
    if (isTeacherMode && accountTypes.length > 0 && !selectedId) {
      setSelectedId(accountTypes[0].id);
      setSeen(new Set(accountTypes.map(a => a.id)));
    }
  }, [isTeacherMode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!accountTypes.length) return null;

  const selected = accountTypes.find(a => a.id === selectedId);

  return (
    <div className="mb-8">
      {/* Intro */}
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {data.description && (
            <p className="text-sm" style={{ color: 'var(--col-secondary)' }}>
              {data.description}
            </p>
          )}
          {data.descriptionRu && (
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--col-muted)' }}>
              {data.descriptionRu}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {accountTypes.map(a => (
              <div
                key={a.id}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: seen.has(a.id) ? 'var(--col-accent)' : 'var(--col-divider)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--col-muted)' }}>
            {seen.size}/{accountTypes.length}
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {filters.map(f => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--col-accent)' : 'var(--col-surface)',
                color: isActive ? 'white' : 'var(--col-secondary)',
                border: `1px solid ${isActive ? 'var(--col-accent)' : 'var(--col-border)'}`,
                minHeight: 32,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      {filter !== 'all' && (
        <p className="text-xs mb-3 italic" style={{ color: 'var(--col-muted)' }}>
          Showing accounts matching: <strong>{filters.find(f => f.id === filter)?.label}</strong>
        </p>
      )}

      {/* Account cards grid */}
      {filteredAccounts.length === 0 ? (
        <div
          className="rounded-2xl p-6 text-center text-sm"
          style={{ backgroundColor: 'var(--col-surface)', border: '1px dashed var(--col-border)', color: 'var(--col-muted)' }}
        >
          No accounts match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {filteredAccounts.map((account) => {
            const Icon = ICON_MAP[account.icon] || Wallet;
            const isSelected = selectedId === account.id;
            const wasSeen = seen.has(account.id);
            return (
              <button
                key={account.id}
                onClick={() => handleSelect(account)}
                className="text-left rounded-2xl p-4 transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--col-accent-light)' : 'var(--col-surface)',
                  border: `1.5px solid ${isSelected ? 'var(--col-accent)' : 'var(--col-border)'}`,
                  boxShadow: isSelected ? '0 2px 12px rgba(94,158,137,0.12)' : 'none',
                  minHeight: 130,
                }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: 40, height: 40,
                      backgroundColor: account.color || 'var(--col-accent)',
                      color: 'white',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
                        {account.name}
                      </p>
                      {account.region && (
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--col-surface-secondary)', color: 'var(--col-muted)' }}
                        >
                          {account.region}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>
                      {account.nameRu}
                    </p>
                  </div>
                  {wasSeen && (
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-1" style={{ color: 'var(--col-accent)' }} />
                  )}
                </div>

                {/* Stats row */}
                {account.stats && (
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <div className="rounded px-2 py-1.5" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Percent className="h-2.5 w-2.5" style={{ color: 'var(--col-muted)' }} />
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                          Interest
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--col-heading)' }}>
                        {account.stats.interest}
                      </p>
                    </div>
                    <div className="rounded px-2 py-1.5" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Zap className="h-2.5 w-2.5" style={{ color: 'var(--col-muted)' }} />
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                          Access
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--col-heading)' }}>
                        {account.stats.access}
                      </p>
                    </div>
                    <div className="rounded px-2 py-1.5" style={{ backgroundColor: 'var(--col-surface-secondary)' }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Globe className="h-2.5 w-2.5" style={{ color: 'var(--col-muted)' }} />
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--col-muted)' }}>
                          Term
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--col-heading)' }}>
                        {account.stats.term}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs leading-relaxed" style={{ color: 'var(--col-body)' }}>
                  {account.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail panel for selected */}
      <AnimatePresence mode="wait" initial={false}>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--col-accent-light)', borderLeft: '3px solid var(--col-accent)' }}
          >
            <p
              className="font-semibold uppercase tracking-wider mb-2"
              style={{ fontSize: 10, color: 'var(--col-muted)', letterSpacing: '0.06em' }}
            >
              {selected.name} · Key features
            </p>
            <ul className="space-y-1 mb-3">
              {(selected.keyFeatures || []).map((feature, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--col-accent-text)' }}>
                  <span className="shrink-0" style={{ color: 'var(--col-accent)' }}>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {selected.descriptionRu && (
              <p className="text-xs italic leading-relaxed mb-2" style={{ color: 'var(--col-secondary)' }}>
                {selected.descriptionRu}
              </p>
            )}
            {selected.equivalents && (
              <p
                className="text-[10px] mt-2 inline-block px-2 py-1 rounded font-medium"
                style={{ backgroundColor: 'var(--col-surface)', color: 'var(--col-muted)' }}
              >
                {selected.equivalents}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {markedDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--col-accent-text)' }}>
              Bank Account Picker complete — you know which account fits which need.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
