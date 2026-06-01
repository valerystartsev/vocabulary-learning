// Registry of all tools shown in /interactive-lab.
//
// The registry is the single source of truth for:
//   - which tools appear on the index grid
//   - which component to render when the URL is /interactive-lab/:toolId
//   - what props each tool needs (built by buildToolProps below)
//
// To add a tool: import its component, add an entry. To remove: delete
// the entry. Nothing else in the app needs to change.

import TradeSimulator      from '../pages/TradeSimulator';
import EconomicWorld       from '../pages/EconomicWorld';
import LoanSimulator       from '../components/unit/LoanSimulator';
import CurrencyComparator  from '../components/unit/CurrencyComparator';
import WorldBankingMap     from '../components/unit/WorldBankingMap';
import GDPCalculator       from '../components/unit/GDPCalculator';
import BalanceSheetBuilder from '../components/unit/BalanceSheetBuilder';

import { units } from './courseData';

export const INTERACTIVE_TOOLS = [
  // ── Standalone tools (formerly top-level pages) ──────────────────
  {
    id: 'trade-simulator',
    name: 'Trade Simulator',
    nameRu: 'Симулятор торговли',
    icon: 'Ship',                       // lucide icon name, resolved at render time
    description: 'Pick an exporting country, an importing country, and a good. See how the trade plays out.',
    descriptionRu: 'Выберите страну-экспортёра, страну-импортёра и товар — увидите, как сложится сделка.',
    badge: 'Standalone · Trade',
    badgeRu: 'Свободный модуль · Торговля',
    component: TradeSimulator,
    selfNavigates: false,
    sourceUnit: null,
    sourceField: null,
  },
  {
    id: 'economic-world',
    name: 'Economic World',
    nameRu: 'Экономическая карта',
    icon: 'Globe',
    description: 'Explore profiles of major economies on an interactive world map.',
    descriptionRu: 'Изучите экономические профили крупных стран на интерактивной карте мира.',
    badge: 'Standalone · Markets',
    badgeRu: 'Свободный модуль · Рынки',
    component: EconomicWorld,
    selfNavigates: false,
    sourceUnit: null,
    sourceField: null,
  },

  // ── Migrated from Unit 3 sections (Phase 2) ──────────────────────
  {
    id: 'currency-comparator',
    name: 'Currency Comparator',
    nameRu: 'Сравнение валют',
    icon: 'BarChart3',
    description: 'Compare British pound and US dollar side-by-side — coins, notes, slang and pronunciation.',
    descriptionRu: 'Сравните британский фунт и американский доллар — монеты, банкноты, сленг.',
    badge: 'Unit 3 · Banking',
    badgeRu: 'Раздел 3 · Банки',
    component: CurrencyComparator,
    selfNavigates: false,
    sourceUnit: 3,
    sourceField: 'currencyComparator',
  },
  {
    id: 'world-banking-map',
    name: 'World Banking Map',
    nameRu: 'Карта банковских систем',
    icon: 'Landmark',
    description: 'Click any of 7 highlighted countries to see its central bank, currency, and banking culture.',
    descriptionRu: 'Нажмите на одну из 7 выделенных стран, чтобы увидеть её банковскую систему.',
    badge: 'Unit 3 · Banking',
    badgeRu: 'Раздел 3 · Банки',
    component: WorldBankingMap,
    selfNavigates: false,
    sourceUnit: 3,
    sourceField: 'worldBankingMap',
  },
  {
    id: 'loan-simulator',
    name: "Loan Simulator — Arthur's Car",
    nameRu: 'Симулятор кредита — машина Артура',
    icon: 'Car',
    description: 'Move price, term, rate, down-payment — live monthly payment plus an amortization chart.',
    descriptionRu: 'Подвигайте цену, срок, ставку — увидите ежемесячный платёж и график погашения.',
    badge: 'Unit 3 · Banking',
    badgeRu: 'Раздел 3 · Банки',
    component: LoanSimulator,
    selfNavigates: false,
    sourceUnit: 3,
    sourceField: 'loanSimulator',
  },

  // ── Migrated from Unit 4 sections (Phase 2) ──────────────────────
  {
    id: 'gdp-calculator',
    name: 'GDP Calculator',
    nameRu: 'Калькулятор ВВП',
    icon: 'Calculator',
    description: 'Edit any income or spending line. Both GDP approaches recompute live — they always equal each other.',
    descriptionRu: 'Меняйте любую строку дохода или расхода. Оба подхода к ВВП пересчитываются — итог всегда совпадает.',
    badge: 'Unit 4 · Measuring',
    badgeRu: 'Раздел 4 · Измерения',
    component: GDPCalculator,
    selfNavigates: false,
    sourceUnit: 4,
    // The data field is gdpTwoApproaches (intentional — there are
    // two parallel approaches, not a single calculator). Keeping the
    // tool's user-facing name as "GDP Calculator" for discoverability.
    sourceField: 'gdpTwoApproaches',
  },
  {
    id: 'balance-sheet-builder',
    name: 'Balance Sheet Builder',
    nameRu: 'Конструктор баланса',
    icon: 'Scale',
    description: 'Drag-and-drop 12 financial items into Assets vs Liabilities + Equity. The equation must balance.',
    descriptionRu: 'Перетаскивайте 12 финансовых карточек по колонкам Активы / Обязательства + Капитал. Уравнение должно сойтись.',
    badge: 'Unit 4 · Measuring',
    badgeRu: 'Раздел 4 · Измерения',
    component: BalanceSheetBuilder,
    selfNavigates: false,
    sourceUnit: 4,
    // Prefer the new drag-and-drop data shape (`balanceSheet`). The
    // resolveData helper falls back to the legacy `balanceSheetBuilder`
    // shape if `balanceSheet` is missing on a unit (defensive).
    sourceField: 'balanceSheet',
    fallbackField: 'balanceSheetBuilder',
  },
];

export const getTool = (id) => INTERACTIVE_TOOLS.find(t => t.id === id);

// Build the props object passed to <tool.component>. For unit-sourced
// tools we look up unit.<sourceField> (with optional fallbackField)
// and pass it as `data` along with `unit` and `unitId`. Standalone
// tools get just { isTeacherMode }.
export function buildToolProps(tool, { isTeacherMode } = {}) {
  if (!tool) return {};
  if (!tool.sourceUnit) {
    return { isTeacherMode };
  }
  const unit = units.find(u => u.id === tool.sourceUnit);
  if (!unit) return { isTeacherMode };
  const data = unit[tool.sourceField] || (tool.fallbackField ? unit[tool.fallbackField] : undefined);
  return {
    data,
    unit,
    unitId: tool.sourceUnit,
    isTeacherMode,
  };
}
