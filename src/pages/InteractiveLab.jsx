import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Filter } from 'lucide-react';
import { INTERACTIVE_TOOLS, getTool, buildToolProps } from '../data/interactiveLab';
import ToolCard from '../components/interactive-lab/ToolCard';
import ToolFrame from '../components/interactive-lab/ToolFrame';
import { useMode } from '../context/ModeContext';

// Build filter chip list from the registry — one per distinct sourceUnit
// plus an "All" chip. "Standalone" appears once for any null sourceUnit.
function buildFilters(tools) {
  const set = new Set();
  tools.forEach(t => set.add(t.sourceUnit === null ? 'standalone' : `unit:${t.sourceUnit}`));
  const filters = [{ id: 'all', label: 'All tools', labelRu: 'Все инструменты' }];
  if (set.has('standalone')) {
    filters.push({ id: 'standalone', label: 'Standalone', labelRu: 'Свободные' });
  }
  // Sort unit filters by unit number
  [...set]
    .filter(s => s.startsWith('unit:'))
    .map(s => Number(s.slice(5)))
    .sort((a, b) => a - b)
    .forEach(n => filters.push({ id: `unit:${n}`, label: `Unit ${n}`, labelRu: `Раздел ${n}` }));
  return filters;
}

export default function InteractiveLab() {
  const { toolId } = useParams();
  const { isTeacherMode } = useMode();

  // Detail view — single tool
  if (toolId) {
    const tool = getTool(toolId);
    if (!tool) {
      // Unknown tool id → bounce to the index
      return <Navigate to="/interactive-lab" replace />;
    }
    const Component = tool.component;
    const props = buildToolProps(tool, { isTeacherMode });
    return (
      <ToolFrame tool={tool}>
        <Component {...props} />
      </ToolFrame>
    );
  }

  // Index view
  return <LabIndex />;
}

function LabIndex() {
  const [filter, setFilter] = useState('all');
  const filters = useMemo(() => buildFilters(INTERACTIVE_TOOLS), []);

  const visible = useMemo(() => {
    if (filter === 'all') return INTERACTIVE_TOOLS;
    if (filter === 'standalone') return INTERACTIVE_TOOLS.filter(t => t.sourceUnit === null);
    const unitId = Number(filter.slice(5));
    return INTERACTIVE_TOOLS.filter(t => t.sourceUnit === unitId);
  }, [filter]);

  return (
    <div
      className="max-w-5xl mx-auto px-4 md:px-8 py-8"
      style={{ backgroundColor: 'var(--col-page-bg)' }}
    >
      {/* Hero */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 44, height: 44, backgroundColor: 'var(--col-accent)' }}
          >
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className="font-bold text-2xl leading-tight"
              style={{ color: 'var(--col-heading)', letterSpacing: '-0.4px' }}
            >
              Interactive Lab
            </h1>
            <p className="text-sm italic" style={{ color: 'var(--col-muted)' }}>
              Лаборатория · hands-on tools
            </p>
          </div>
        </div>
        <p className="text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: 'var(--col-secondary)' }}>
          A sandbox of {INTERACTIVE_TOOLS.length} tools to practise course
          concepts hands-on. Open any tool, experiment freely, come back
          whenever you want — nothing here is graded.
        </p>
        <p className="text-xs italic mt-1 leading-relaxed max-w-2xl" style={{ color: 'var(--col-muted)' }}>
          Песочница из {INTERACTIVE_TOOLS.length} инструментов для практики. Открывайте, экспериментируйте — ничего не оценивается.
        </p>
      </div>

      {/* Filter chips */}
      {filters.length > 2 && (
        <div className="mb-5 flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-muted)' }} />
          {filters.map(f => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: active ? 'var(--col-accent)' : 'var(--col-surface)',
                  color: active ? 'white' : 'var(--col-secondary)',
                  border: `1px solid ${active ? 'var(--col-accent)' : 'var(--col-border)'}`,
                  minHeight: 32,
                }}
              >
                {f.label}
                <span className="ml-1 opacity-60">· {f.labelRu}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {visible.map(tool => (
          <motion.div
            key={tool.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
            }}
          >
            <ToolCard tool={tool} />
          </motion.div>
        ))}
        {visible.length === 0 && (
          <div
            className="col-span-full rounded-2xl p-8 text-center text-sm"
            style={{ backgroundColor: 'var(--col-surface)', border: '1px dashed var(--col-border)', color: 'var(--col-muted)' }}
          >
            No tools in this category yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
