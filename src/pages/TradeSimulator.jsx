import React, { useState } from 'react';
import { Ship, ArrowRight, CheckCircle, RotateCcw, ChevronRight, TrendingUp, TrendingDown, Minus, Package, Globe } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GBR',
    region: 'Western Europe',
    strengths: ['financial_services', 'education_services'],
    weaknesses: ['manufacturing', 'oil_gas'],
    tariffLevel: 'medium',
  },
  {
    id: 'russia',
    name: 'Russia',
    code: 'RUS',
    region: 'Eastern Europe / Asia',
    strengths: ['oil_gas', 'manufacturing'],
    weaknesses: ['technology', 'education_services'],
    tariffLevel: 'high',
  },
  {
    id: 'usa',
    name: 'United States',
    code: 'USA',
    region: 'North America',
    strengths: ['technology', 'financial_services', 'education_services'],
    weaknesses: ['oil_gas'],
    tariffLevel: 'medium',
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DEU',
    region: 'Central Europe',
    strengths: ['cars_machinery', 'manufacturing'],
    weaknesses: ['oil_gas', 'consumer_goods'],
    tariffLevel: 'low',
  },
  {
    id: 'china',
    name: 'China',
    code: 'CHN',
    region: 'East Asia',
    strengths: ['manufacturing', 'consumer_goods', 'technology'],
    weaknesses: ['financial_services', 'education_services'],
    tariffLevel: 'high',
  },
];

const GOODS = [
  {
    id: 'financial_services',
    label: 'Financial Services',
    labelRu: 'Финансовые услуги',
    type: 'Services',
    vocabWords: [
      { term: 'revenue', translationRu: 'доход, выручка' },
      { term: 'market', translationRu: 'рынок' },
      { term: 'enterprise', translationRu: 'предприятие' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology Products',
    labelRu: 'Технологические товары',
    type: 'Goods',
    vocabWords: [
      { term: 'competition', translationRu: 'конкуренция' },
      { term: 'monopoly', translationRu: 'монополия' },
      { term: 'merger', translationRu: 'слияние' },
    ],
  },
  {
    id: 'oil_gas',
    label: 'Oil and Gas',
    labelRu: 'Нефть и газ',
    type: 'Goods',
    vocabWords: [
      { term: 'supply', translationRu: 'предложение (товара)' },
      { term: 'demand', translationRu: 'спрос' },
      { term: 'revenue', translationRu: 'доход' },
    ],
  },
  {
    id: 'cars_machinery',
    label: 'Cars and Machinery',
    labelRu: 'Автомобили и оборудование',
    type: 'Goods',
    vocabWords: [
      { term: 'enterprise', translationRu: 'предприятие' },
      { term: 'competitive', translationRu: 'конкурентоспособный' },
      { term: 'merger', translationRu: 'слияние' },
    ],
  },
  {
    id: 'consumer_goods',
    label: 'Consumer Goods',
    labelRu: 'Потребительские товары',
    type: 'Goods',
    vocabWords: [
      { term: 'market', translationRu: 'рынок' },
      { term: 'demand', translationRu: 'спрос' },
      { term: 'competition', translationRu: 'конкуренция' },
    ],
  },
  {
    id: 'education_services',
    label: 'Education Services',
    labelRu: 'Образовательные услуги',
    type: 'Services',
    vocabWords: [
      { term: 'enterprise', translationRu: 'предприятие' },
      { term: 'procedure', translationRu: 'процедура' },
      { term: 'competition', translationRu: 'конкуренция' },
    ],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    labelRu: 'Производство',
    type: 'Goods',
    vocabWords: [
      { term: 'output', translationRu: 'объём производства' },
      { term: 'overhead', translationRu: 'накладные расходы' },
      { term: 'enterprise', translationRu: 'предприятие' },
    ],
  },
];

const GOOD_LABELS = Object.fromEntries(GOODS.map(g => [g.id, g.label]));

const QUIZ = [
  {
    q: 'What is a tariff?',
    qRu: 'Что такое тариф?',
    opts: ['A tax on imported goods', 'A type of business enterprise', 'A form of merger agreement', 'A government subsidy'],
    a: 0,
  },
  {
    q: '"Revenue" means:',
    qRu: '"Revenue" означает:',
    opts: ['Total costs before profit', 'Money a company receives from sales', 'A penalty for poor performance', 'A government fine'],
    a: 1,
  },
  {
    q: 'Which word means "to sell goods to another country"?',
    qRu: 'Какое слово означает "продавать товары в другую страну"?',
    opts: ['import', 'restrict', 'export', 'recruit'],
    a: 2,
  },
];

// ── Scoring logic ─────────────────────────────────────────────────────────────

function calcScore(exporter, importer, good) {
  let score = 0;
  if (exporter.strengths.includes(good.id)) score += 2;
  if (exporter.weaknesses.includes(good.id)) score -= 1;
  if (importer.weaknesses.includes(good.id)) score += 1;
  if (importer.tariffLevel === 'high') score -= 1;
  if (importer.tariffLevel === 'low') score += 1;
  return score;
}

function resultLevel(score) {
  if (score >= 3) return 'SUCCESS';
  if (score >= 1) return 'PARTIAL';
  return 'POOR';
}

function buildWhyReasons(exporter, importer, good) {
  const reasons = [];
  if (exporter.strengths.includes(good.id))
    reasons.push({ positive: true, text: `${exporter.name} has a competitive advantage in ${good.label}.` });
  if (exporter.weaknesses.includes(good.id))
    reasons.push({ positive: false, text: `${exporter.name} does not specialise in ${good.label}, which weakens the result.` });
  if (importer.weaknesses.includes(good.id))
    reasons.push({ positive: true, text: `${importer.name} needs to import ${good.label} — demand is high.` });
  if (!importer.weaknesses.includes(good.id) && !exporter.strengths.includes(good.id))
    reasons.push({ positive: false, text: `Neither country has a strong advantage in ${good.label}.` });
  if (importer.tariffLevel === 'high')
    reasons.push({ positive: false, text: `${importer.name} applies high import tariffs, reducing the final profit.` });
  if (importer.tariffLevel === 'low')
    reasons.push({ positive: true, text: `${importer.name} applies low tariffs — trade conditions are favourable.` });
  if (importer.tariffLevel === 'medium')
    reasons.push({ positive: null, text: `${importer.name} applies medium tariffs — a neutral factor.` });
  return reasons;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CountryBadge({ code }) {
  return (
    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded mr-1.5" style={{
      backgroundColor: 'var(--col-surface-secondary)',
      border: '1px solid var(--col-border)',
      color: 'var(--col-muted)',
    }}>
      {code}
    </span>
  );
}

function TariffBadge({ level }) {
  const styles = {
    low:    { bg: '#E8F5EE', color: '#1F5E3A', label: 'Low tariffs' },
    medium: { bg: '#FFF8E7', color: '#6B4C00', label: 'Medium tariffs' },
    high:   { bg: '#FEF2F2', color: '#7F2020', label: 'High tariffs' },
  };
  const s = styles[level] || styles.medium;
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function StepBar({ step }) {
  const labels = ['Exporter', 'Importer', 'Trade Item', 'Result'];
  return (
    <div className="flex gap-2 mb-6">
      {labels.map((l, i) => (
        <div key={i} className="flex-1 text-center">
          <div className="h-1.5 rounded-full mb-1 transition-all" style={{ backgroundColor: i <= step ? 'var(--col-accent)' : 'var(--col-divider)' }} />
          <p className="text-[10px] font-medium" style={{ color: i === step ? 'var(--col-accent)' : 'var(--col-muted)' }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

// Preview panel shown when a country is selected
function CountryPreviewPanel({ country }) {
  if (!country) return null;
  return (
    <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
            <CountryBadge code={country.code} />{country.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--col-secondary)' }}>{country.region}</p>
        </div>
        <TariffBadge level={country.tariffLevel} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3" style={{ backgroundColor: '#E8F5EE', border: '1px solid #A8D5BA' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#1F5E3A' }}>Strengths</p>
          <ul className="space-y-0.5">
            {country.strengths.map(s => (
              <li key={s} className="text-xs flex items-center gap-1.5" style={{ color: '#1F5E3A' }}>
                <TrendingUp className="h-3 w-3 shrink-0" />
                {GOOD_LABELS[s] || s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #F5C0C0' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#7F2020' }}>Weaknesses</p>
          <ul className="space-y-0.5">
            {country.weaknesses.map(w => (
              <li key={w} className="text-xs flex items-center gap-1.5" style={{ color: '#7F2020' }}>
                <TrendingDown className="h-3 w-3 shrink-0" />
                {GOOD_LABELS[w] || w}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-xs mt-3 italic" style={{ color: 'var(--col-accent-text)' }}>
        Consider whether this country's strengths match the goods you plan to trade.
      </p>
    </div>
  );
}

// Visual trade flow: Exporter → Trade Item → Importer
function TradeFlowBar({ exporter, importer, good }) {
  const exp = COUNTRIES.find(c => c.id === exporter);
  const imp = COUNTRIES.find(c => c.id === importer);
  const g = GOODS.find(x => x.id === good);

  if (!exp) return null;

  return (
    <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>Trade Flow</p>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Exporter */}
        <div className="flex-1 min-w-[90px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--col-surface)', border: '1.5px solid var(--col-accent)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--col-accent)' }}>Exporter</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--col-heading)' }}>{exp.code}</p>
          <p className="text-[10px]" style={{ color: 'var(--col-secondary)' }}>{exp.name}</p>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />

        {/* Trade item */}
        <div className="flex-1 min-w-[90px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: g ? 'var(--col-accent-light)' : 'var(--col-surface)', border: `1.5px solid ${g ? 'var(--col-accent)' : 'var(--col-border)'}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--col-muted)' }}>Trade Item</p>
          {g ? (
            <>
              <p className="text-xs font-semibold" style={{ color: 'var(--col-heading)' }}>{g.label}</p>
              <p className="text-[10px] italic" style={{ color: 'var(--col-secondary)' }}>{g.type}</p>
            </>
          ) : (
            <p className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>Not selected</p>
          )}
        </div>

        <ArrowRight className="h-4 w-4 shrink-0" style={{ color: imp ? 'var(--col-accent)' : 'var(--col-divider)' }} />

        {/* Importer */}
        <div className="flex-1 min-w-[90px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--col-surface)', border: `1.5px solid ${imp ? 'var(--col-border)' : 'var(--col-divider)'}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--col-muted)' }}>Importer</p>
          {imp ? (
            <>
              <p className="text-xs font-semibold" style={{ color: 'var(--col-heading)' }}>{imp.code}</p>
              <p className="text-[10px]" style={{ color: 'var(--col-secondary)' }}>{imp.name}</p>
            </>
          ) : (
            <p className="text-[10px] italic" style={{ color: 'var(--col-muted)' }}>Not selected</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Country selector ──────────────────────────────────────────────────────────

function CountryGrid({ value, onSelect, exclude, showPreview = true }) {
  const selected = COUNTRIES.find(c => c.id === value);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {COUNTRIES.filter(c => c.id !== exclude).map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="text-left rounded-xl px-4 py-3.5 transition-all"
            style={{
              backgroundColor: value === c.id ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
              border: `2px solid ${value === c.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
            }}
          >
            <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>
              <CountryBadge code={c.code} />{c.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--col-muted)' }}>{c.region}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <TariffBadge level={c.tariffLevel} />
            </div>
          </button>
        ))}
      </div>
      {showPreview && selected && <CountryPreviewPanel country={selected} />}
    </div>
  );
}

// ── Goods selector ────────────────────────────────────────────────────────────

function GoodsGrid({ value, onSelect, exporter, importer }) {
  const exp = COUNTRIES.find(c => c.id === exporter);
  const imp = COUNTRIES.find(c => c.id === importer);
  const selected = GOODS.find(g => g.id === value);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {GOODS.map(g => {
          const isStrength = exp?.strengths.includes(g.id);
          const isWeakness = exp?.weaknesses.includes(g.id);
          const impNeeds = imp?.weaknesses.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className="text-left rounded-xl px-4 py-3.5 transition-all"
              style={{
                backgroundColor: value === g.id ? 'var(--col-accent-light)' : 'var(--col-surface-secondary)',
                border: `2px solid ${value === g.id ? 'var(--col-accent)' : 'var(--col-border)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="font-semibold text-sm" style={{ color: 'var(--col-heading)' }}>{g.label}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded shrink-0"
                  style={g.type === 'Goods'
                    ? { backgroundColor: '#E8F5EE', color: '#1F5E3A' }
                    : { backgroundColor: '#EEF0F5', color: '#2A3060' }}>
                  {g.type}
                </span>
              </div>
              <p className="text-xs italic mb-1.5" style={{ color: 'var(--col-muted)' }}>{g.labelRu}</p>
              {exp && (
                <div className="flex gap-1.5 flex-wrap">
                  {isStrength && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#E8F5EE', color: '#1F5E3A' }}>
                      Exporter strength
                    </span>
                  )}
                  {isWeakness && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#FEF2F2', color: '#7F2020' }}>
                      Exporter weakness
                    </span>
                  )}
                  {impNeeds && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#FFF8E7', color: '#6B4C00' }}>
                      Importer needs this
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Selected good preview */}
      {selected && (
        <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'var(--col-accent-light)', border: '1px solid var(--col-divider)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-accent-text)' }}>
            Selected: {selected.label}
          </p>
          <p className="text-xs mb-2" style={{ color: 'var(--col-accent-text)' }}>
            Type: <strong>{selected.type}</strong> — {selected.labelRu}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--col-muted)' }}>Related vocabulary</p>
          <div className="flex flex-wrap gap-1.5">
            {selected.vocabWords.map(w => (
              <span key={w.term} className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-divider)', color: 'var(--col-heading)' }}>
                {w.term} <span style={{ color: 'var(--col-secondary)', fontWeight: 400 }}>— {w.translationRu}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Why this result section ───────────────────────────────────────────────────

function WhyResult({ exporter, importer, good }) {
  const reasons = buildWhyReasons(exporter, importer, good);
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>
        Why this result?
      </p>
      <div className="space-y-2">
        {reasons.map((r, i) => {
          const icon = r.positive === true ? (
            <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color: '#1F5E3A' }} />
          ) : r.positive === false ? (
            <TrendingDown className="h-3.5 w-3.5 shrink-0" style={{ color: '#7F2020' }} />
          ) : (
            <Minus className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--col-muted)' }} />
          );
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5">{icon}</span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--col-body)' }}>{r.text}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--col-border)' }}>
        <p className="text-xs italic" style={{ color: 'var(--col-muted)' }}>
          Почему такой результат: на итог влияют сильные стороны экспортёра, потребности импортёра и уровень тарифов.
        </p>
      </div>
    </div>
  );
}

// ── Result panel ──────────────────────────────────────────────────────────────

function ResultPanel({ exporter: exporterId, importer: importerId, good: goodId, onReset, onQuiz }) {
  const exp = COUNTRIES.find(c => c.id === exporterId);
  const imp = COUNTRIES.find(c => c.id === importerId);
  const g = GOODS.find(x => x.id === goodId);
  const score = calcScore(exp, imp, g);
  const level = resultLevel(score);

  const texts = {
    SUCCESS: {
      en: `Strong trade result. The export of ${g.label} from ${exp.name} to ${imp.name} is well-matched. ${exp.name} has a competitive advantage in this area, and ${imp.name} has demand for this import.`,
      ru: `Сильный результат. Экспорт ${g.labelRu} из ${exp.name} в ${imp.name} хорошо обоснован: у ${exp.name} есть конкурентное преимущество, а ${imp.name} нуждается в этом импорте.`,
      color: '#1F5E3A', bg: '#E8F5EE', border: '#A8D5BA', label: 'Trade Successful',
    },
    PARTIAL: {
      en: `The trade was completed, but conditions reduced the final result. ${imp.name} applies ${imp.tariffLevel} import tariffs, which affect profitability.`,
      ru: `Торговля состоялась, но условия снизили итоговый результат. ${imp.name} применяет ${imp.tariffLevel === 'high' ? 'высокие' : 'средние'} импортные пошлины.`,
      color: '#6B4C00', bg: '#FFF8E7', border: '#E8D08A', label: 'Partial Result',
    },
    POOR: {
      en: `This trade combination is weak. ${exp.name} does not have a strong position in ${g.label}, and the conditions in ${imp.name} restrict the potential outcome.`,
      ru: `Эта торговая комбинация слабая. У ${exp.name} нет сильной позиции в ${g.labelRu}, а условия в ${imp.name} ограничивают возможный результат.`,
      color: '#7F2020', bg: '#FEF2F2', border: '#F5C0C0', label: 'Poor Result',
    },
  };

  const t = texts[level];

  return (
    <div className="space-y-4">
      {/* Trade flow visualization */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--col-surface-secondary)', border: '1px solid var(--col-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--col-muted)' }}>Trade Flow Summary</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-[80px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: '#E8F5EE', border: '1.5px solid #A8D5BA' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#1F5E3A' }}>Exporter</p>
            <p className="text-xs font-bold" style={{ color: 'var(--col-heading)' }}>{exp.code}</p>
            <p className="text-[10px]" style={{ color: 'var(--col-secondary)' }}>{exp.name}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
          <div className="flex-1 min-w-[80px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: 'var(--col-accent-light)', border: '1.5px solid var(--col-accent)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--col-accent-text)' }}>Trade Item</p>
            <p className="text-xs font-bold" style={{ color: 'var(--col-heading)' }}>{g.label}</p>
            <p className="text-[10px] italic" style={{ color: 'var(--col-secondary)' }}>{g.type}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0" style={{ color: 'var(--col-accent)' }} />
          <div className="flex-1 min-w-[80px] rounded-lg px-3 py-2.5 text-center" style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #F5C0C0' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#7F2020' }}>Importer</p>
            <p className="text-xs font-bold" style={{ color: 'var(--col-heading)' }}>{imp.code}</p>
            <p className="text-[10px]" style={{ color: 'var(--col-secondary)' }}>{imp.name}</p>
          </div>
        </div>
      </div>

      {/* Result verdict */}
      <div className="px-4 py-4 rounded-xl" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="font-bold text-sm uppercase tracking-wider" style={{ color: t.color }}>{t.label}</p>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: t.border, color: t.color }}>
            Score: {score}
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-2" style={{ color: t.color }}>{t.en}</p>
        <p className="text-xs italic leading-relaxed" style={{ color: t.color, opacity: 0.8 }}>{t.ru}</p>
      </div>

      {/* Why this result */}
      <WhyResult exporter={exp} importer={imp} good={g} />

      {/* Vocabulary Spotlight */}
      <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--col-muted)' }}>
          Vocabulary Spotlight
        </p>
        <div className="space-y-1.5">
          {g.vocabWords.map(w => (
            <div key={w.term} className="flex items-center gap-2">
              <span className="font-semibold text-sm" style={{ color: 'var(--col-accent-text)', backgroundColor: 'var(--col-accent-light)', padding: '1px 8px', borderRadius: 6 }}>{w.term}</span>
              <span className="text-xs" style={{ color: 'var(--col-secondary)' }}>{w.translationRu}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
          style={{ border: '1px solid var(--col-border)', color: 'var(--col-secondary)', minHeight: 48 }}>
          <RotateCcw className="h-4 w-4" /> New Trade
        </button>
        <button onClick={onQuiz}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ backgroundColor: 'var(--col-accent)', minHeight: 48 }}>
          Trade Quiz <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TradeSimulator() {
  const [step, setStep] = useState(0);
  const [exporter, setExporter] = useState(null);
  const [importer, setImporter] = useState(null);
  const [good, setGood] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const reset = () => {
    setStep(0); setExporter(null); setImporter(null); setGood(null);
    setShowQuiz(false); setQuizIdx(0); setQuizScore(0); setSelected(null); setQuizDone(false);
  };

  const handleQuizPick = (idx) => {
    setSelected(idx);
    const correct = idx === QUIZ[quizIdx].a;
    if (correct) setQuizScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (quizIdx < QUIZ.length - 1) setQuizIdx(i => i + 1);
      else setQuizDone(true);
    }, 1000);
  };

  // ── Quiz ──
  if (showQuiz) {
    if (quizDone) {
      return (
        <div className="max-w-lg mx-auto px-5 py-16 text-center" style={{ backgroundColor: 'var(--col-page-bg)' }}>
          <CheckCircle className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--col-correct)' }} />
          <p className="text-3xl font-bold mb-2" style={{ color: 'var(--col-heading)' }}>{quizScore} / {QUIZ.length}</p>
          <p className="text-sm mb-6" style={{ color: 'var(--col-muted)' }}>
            {quizScore === QUIZ.length ? 'Excellent result. All answers correct.' : 'Good effort. Review the missed concepts in the Glossary.'}
          </p>
          <button onClick={reset} className="px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: 'var(--col-accent)' }}>
            New Trade
          </button>
        </div>
      );
    }

    const q = QUIZ[quizIdx];
    return (
      <div className="max-w-lg mx-auto px-5 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>
          <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--col-muted)' }}>
            <span>Question {quizIdx + 1} of {QUIZ.length}</span>
            <span>Score: {quizScore}</span>
          </div>
          <p className="font-semibold text-base mb-1" style={{ color: 'var(--col-heading)' }}>{q.q}</p>
          <p className="text-xs italic mb-5" style={{ color: 'var(--col-muted)' }}>{q.qRu}</p>
          <div className="space-y-2">
            {q.opts.map((opt, i) => {
              let bg = 'var(--col-surface-secondary)', border = 'var(--col-border)', color = 'var(--col-body)';
              if (selected !== null) {
                if (i === q.a) { bg = '#E8F5EE'; border = 'var(--col-correct)'; color = '#1F5E3A'; }
                else if (i === selected) { bg = '#FEF2F2'; border = 'var(--col-incorrect)'; color = '#7F2020'; }
              }
              return (
                <button key={i} disabled={selected !== null} onClick={() => handleQuizPick(i)}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: bg, border: `1px solid ${border}`, color, minHeight: 48 }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Main flow ──
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--col-page-bg)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'var(--col-accent-light)' }}>
          <Ship className="h-5 w-5" style={{ color: 'var(--col-accent)' }} />
        </div>
        <div>
          <h1 className="font-bold text-xl" style={{ color: 'var(--col-heading)' }}>Trade Simulator</h1>
          <p className="text-xs" style={{ color: 'var(--col-muted)' }}>
            Simulate international trade decisions — Симулятор международной торговли
          </p>
        </div>
      </div>

      <StepBar step={step} />

      {/* Trade flow strip — visible from step 1 onward */}
      {step >= 1 && (
        <TradeFlowBar exporter={exporter} importer={step >= 2 ? importer : null} good={step >= 3 ? good : null} />
      )}

      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--col-surface)', border: '1px solid var(--col-border)' }}>

        {step === 0 && (
          <>
            <h2 className="font-semibold text-base mb-0.5" style={{ color: 'var(--col-heading)' }}>Step 1 — Select the Exporting Country</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--col-body)' }}>
              This is the country that sells the product or service.
            </p>
            <p className="text-xs italic mb-1" style={{ color: 'var(--col-muted)' }}>
              Это страна, которая продаёт товар или услугу.
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--col-secondary)' }}>
              Review each country's strengths and weaknesses before choosing. A country exports best what it produces well.
            </p>
            <CountryGrid value={exporter} onSelect={setExporter} exclude={null} showPreview />
            <button disabled={!exporter} onClick={() => setStep(1)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ backgroundColor: exporter ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 48 }}>
              Next — Choose an Importer <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-semibold text-base mb-0.5" style={{ color: 'var(--col-heading)' }}>Step 2 — Select the Importing Country</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--col-body)' }}>
              This is the country that buys the product or service.
            </p>
            <p className="text-xs italic mb-1" style={{ color: 'var(--col-muted)' }}>
              Это страна, которая покупает товар или услугу.
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--col-secondary)' }}>
              A country imports what it cannot produce well. Check each country's weaknesses and tariff level — high tariffs reduce profit.
            </p>
            <CountryGrid value={importer} onSelect={setImporter} exclude={exporter} showPreview />
            <button disabled={!importer} onClick={() => setStep(2)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ backgroundColor: importer ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 48 }}>
              Next — Choose a Trade Item <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold text-base mb-0.5" style={{ color: 'var(--col-heading)' }}>Step 3 — Select the Trade Item</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--col-body)' }}>
              Choose what your exporting country will sell to the importer.
            </p>
            <p className="text-xs italic mb-1" style={{ color: 'var(--col-muted)' }}>
              Выберите, что ваша страна будет экспортировать.
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--col-secondary)' }}>
              Items marked as an exporter strength give a better result. Items that the importer needs also improve the outcome.
            </p>
            <GoodsGrid value={good} onSelect={setGood} exporter={exporter} importer={importer} />
            <button disabled={!good} onClick={() => setStep(3)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ backgroundColor: good ? 'var(--col-accent)' : 'var(--col-divider)', minHeight: 48 }}>
              View Trade Result <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-xs mb-4" style={{ color: 'var(--col-secondary)' }}>
              The final result depends on the exporter's strengths, the importer's needs, and the tariff level applied.
              <span className="italic ml-1" style={{ color: 'var(--col-muted)' }}>
                Итог зависит от сильных сторон, слабых сторон и тарифов.
              </span>
            </p>
            <ResultPanel
              exporter={exporter}
              importer={importer}
              good={good}
              onReset={reset}
              onQuiz={() => setShowQuiz(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}