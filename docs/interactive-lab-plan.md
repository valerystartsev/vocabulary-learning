# Interactive Lab — Architectural Plan

**Status:** plan only, no implementation
**Branch:** feature/units-3-4 (separate branch recommended for implementation)
**Date:** 2026-05-25

## Goal

Consolidate the "heavy" interactive tools currently scattered across
standalone pages and unit sections into a single discoverable
`/interactive-lab` hub. Keep light, theme-tied interactives inside
units. End result: cleaner unit pages, single home for hands-on
practice, no rewrite of any existing tool component.

## What moves vs what stays

| Tool | Today | After |
|------|-------|-------|
| Trade Simulator | `/trade-simulator` standalone page | Lab tool |
| Economic World | `/economic-world` standalone page | Lab tool |
| Loan Simulator | Unit 3 section | Lab tool |
| Currency Comparator | Unit 3 section | Lab tool |
| World Banking Map | Unit 3 section | Lab tool |
| GDP Calculator | Unit 4 section | Lab tool |
| Balance Sheet Builder | Unit 4 section | Lab tool |
| Money Functions Compass | Unit 3 section | **stays in unit** |
| Forms of Money Spectrum | Unit 3 section | **stays in unit** |
| Central Bank Wheel | Unit 3 section | **stays in unit** |
| Bank Account Picker | Unit 3 section | **stays in unit** |
| Indicators Dashboard | Unit 4 section | **stays in unit** |
| Business Cycle Switcher | Unit 4 section | **stays in unit** |
| Annual Report Reader | Unit 4 section | **stays in unit** |
| Capstone Project | Unit 4 (end) | **stays in unit** |

Heuristic for the split: **if the tool is a self-contained sandbox
that benefits from full-screen and could be revisited independently
of the unit narrative — it moves to the Lab.** If it's tightly tied
to the unit's pedagogical thread or is a small "card-style" interaction
— it stays in the unit.

---

## 1. Route and navigation

**New route:**
`/interactive-lab` — index page (grid of tools)
`/interactive-lab/:toolId` — single-tool view (renders the tool component)

**Sidebar placement (`src/components/Layout.jsx` → `authNavItems`):**

Recommendation: insert **after Glossary, before Progress**.

```
Welcome → Dashboard → Unit 1…N → Glossary →
  Interactive Lab ← NEW →
Progress → Smart Review → Listening Lab → My Mistakes
```

Rationale: Glossary is a reference, Lab is a workshop, Progress is
analytics. The natural reading order is *content → reference →
practice → analytics*. Lab also pushes "Economic World" /
"Trade Simulator" off the top-level sidebar, which declutters it.

Icon suggestion: `FlaskConical` from lucide-react (clearly distinct
from Headphones used by Listening Lab).

**Dashboard placement:**

Add a single feature card after the Units grid, before "Recent
activity" / "Continue learning" sections. Same visual weight as
the existing utility cards (Smart Review, Glossary). Title:
*Interactive Lab — 7 hands-on tools*.

This is the only place we **promote** the Lab to a user who hasn't
opened it yet, so it earns its space.

---

## 2. Page structure

### Index page (`/interactive-lab`)

```
┌─────────────────────────────────────────────────────┐
│ HERO                                                │
│   Interactive Lab · Лаборатория                     │
│   Hands-on tools to practise course concepts.       │
│   2-line bilingual subtitle.                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FILTER CHIPS                                        │
│   All · Unit 3 · Unit 4 · Standalone                │
└─────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ Tool card 1  │ Tool card 2  │ Tool card 3  │   ← grid 1 col mobile,
├──────────────┼──────────────┼──────────────┤     2 col md, 3 col lg
│ Tool card 4  │ Tool card 5  │ Tool card 6  │
└──────────────┴──────────────┴──────────────┘
```

### Tool card content

- Icon (24px, accent colour)
- EN name + RU subtitle
- 1-2 sentence description (bilingual)
- Optional badge: "Unit 3 · Banking" or "Standalone"
- "Open →" button OR full-card click target

### Single tool view (`/interactive-lab/:toolId`)

```
┌─────────────────────────────────────────────────────┐
│ ← Back to Lab     <icon> Tool Name      [pill: Unit]│
└─────────────────────────────────────────────────────┘

<the tool component renders here, full width>
```

Thin wrapper. The tool itself is rendered without modification.
Back button in the top-left is the only chrome we add.

### Decision: modal vs separate route

**Recommendation: separate route, no modal.**

| Aspect | Modal | Separate route ✅ |
|--------|-------|---------|
| Browser back button | Awkward (modal close handling) | Native |
| Deep linking | Hard | Free |
| Full viewport for big tools (Trade Simulator, World Map) | Cramped | Available |
| Existing tools as full pages | Need to be re-skinned | Rendered as-is |
| Implementation effort | Higher (focus trap, esc, scroll lock) | Lower |
| Mobile UX | Same as new page anyway | Same |

The two pages we're consuming (Trade Simulator, Economic World)
already use full-page layouts. Wrapping them in modals would force
a rewrite. Separate routes mean zero changes to existing tool
components.

---

## 3. Where do the current locations go

### Standalone pages (Trade Simulator, Economic World)

- Old route still exists, but **redirects** to the Lab equivalent:
  - `/trade-simulator` → `/interactive-lab/trade-simulator`
  - `/economic-world` → `/interactive-lab/economic-world`
- Achieved via `<Navigate to=… replace />` in `App.jsx`.
- Keep redirects forever — bookmarks and Sidebar history shouldn't break.
- Remove from Sidebar `authNavItems`.

### Unit-section tools (Loan Sim, GDP Calc, World Banking Map, Currency Comparator, Balance Sheet Builder)

- **Removed from `unit3.sections` / `unit4.sections`.** That alone makes
  the section disappear from the nav strip and from `renderSection`
  output (no entry → not rendered).
- **Data fields stay in unit data files** (`loanSimulator`, `gdpCalculator`,
  `worldBankingMap`, `currencyComparator`, `balanceSheetBuilder`,
  `bankAccountSection` if it moves). Keeping data in `unit3.js`/`unit4.js`
  means there is a single content source. The Lab registry references
  them by unit id + field name. No data duplication.
- **`renderSection` switch cases stay** (defensive — if a unit
  re-introduces the section ID in `sections`, it still works). No
  cleanup risk.

### Old `<UnitPage>` JSX

No JSX changes needed. The R3+R4 architecture already drives sections
from `unit.sections`. Removing IDs from the array is enough.

---

## 4. File structure

```
src/
  pages/
    InteractiveLab.jsx              ← index + :toolId router-aware
                                      (one component handles both)
  data/
    interactiveLab.js               ← tool registry
  components/
    interactive-lab/
      ToolCard.jsx                  ← grid card
      ToolFrame.jsx                 ← back-bar wrapper for single view
```

### `src/data/interactiveLab.js` shape

```js
import TradeSimulator from '../pages/TradeSimulator';
import EconomicWorld from '../pages/EconomicWorld';
import LoanSimulator from '../components/unit/LoanSimulator';
import CurrencyComparator from '../components/unit/CurrencyComparator';
import WorldBankingMap from '../components/unit/WorldBankingMap';
import GDPCalculator from '../components/unit/GDPCalculator';
import BalanceSheetBuilder from '../components/unit/BalanceSheetBuilder';
import { unit3 } from './unit3';
import { unit4 } from './unit4';

export const INTERACTIVE_TOOLS = [
  {
    id: 'trade-simulator',
    name: 'Trade Simulator',
    nameRu: 'Симулятор торговли',
    icon: 'Ship',
    description: 'Pick exporting & importing countries, choose a good, see the trade outcome.',
    descriptionRu: 'Выберите страны и товар — увидите, как сложится сделка.',
    component: TradeSimulator,
    sourceUnit: null,        // standalone
    badge: 'Standalone · Trade',
  },
  {
    id: 'economic-world',
    name: 'Economic World',
    nameRu: 'Экономическая карта',
    icon: 'Globe',
    description: 'Tap a country on the world map to read its economic profile.',
    descriptionRu: 'Нажмите на страну на карте — увидите её экономический профиль.',
    component: EconomicWorld,
    sourceUnit: null,
    badge: 'Standalone · Markets',
  },
  {
    id: 'loan-simulator',
    name: "Loan Simulator — Arthur's Car",
    nameRu: 'Симулятор кредита — машина Артура',
    icon: 'Car',
    description: 'Move price, term, rate, down-payment — live monthly payment + amortization.',
    descriptionRu: 'Подвигайте цену, срок, ставку — увидите платёж и график погашения.',
    component: LoanSimulator,
    sourceUnit: 3,
    sourceField: 'loanSimulator',
    badge: 'Unit 3 · Banking',
  },
  // … five more entries
];

// Helpers
export const getTool = (id) => INTERACTIVE_TOOLS.find(t => t.id === id);
export const buildToolProps = (tool) => {
  if (!tool.sourceUnit) return {};
  const unit = tool.sourceUnit === 3 ? unit3 : unit4;
  return {
    data: unit[tool.sourceField],
    unit,
    unitId: tool.sourceUnit,
  };
};
```

The InteractiveLab page receives the toolId from `useParams()`, looks
up the tool, and renders `<tool.component {...buildToolProps(tool)} />`.

---

## 5. Architecture changes in units

### `src/data/unit3.js`

Remove from `sections` array:
- `currency`
- `centralbank` *(keep? — it's a light wheel, stays in unit per the brief)*
- `bankaccounts` *(stays in unit per the brief)*
- `worldbanking`
- `loansim`

(After Lab migration, `unit3.sections` keeps `header, keyideas,
moneycompass, moneyforms, centralbank, bankaccounts, dictionary,
exercises, reading, comprehension, media, crossword, dialogue,
writing, scenario, totaltest, answerkey, summary` — i.e. 18 sections
down from 20.)

Per the brief table at the top: stays in unit = compass, forms,
central-bank, bank-accounts. Moves to Lab = currency, world-banking,
loan-sim. Adjust accordingly.

### `src/data/unit4.js`

Remove from `sections` array:
- `gdpcalc`
- `balancesheet`

Stays in unit: `indicators`, `businesscycle`, `annualreport`, capstone.

### `src/pages/UnitPage.jsx`

**Zero changes** required — the renderSection switch keeps its cases,
they just never fire because the IDs are no longer in `sections`.
Future-proofs: if anyone puts the IDs back into `sections`, they
still render.

### Progress

`computeUnitProgress(prog, unitId, unit)` already iterates over
`unit.sections` (via `getSectionStatus`). Sections removed from
`unit.sections` are no longer counted. **Effect: unit % goes UP for
users who had completed those tool sections** (the denominator
shrinks while their completed count stays the same on the now-stale
keys).

That's a positive UX surprise (most students will see a small jump),
not a bug. No migration required.

**Optional one-time cleanup:** in ProgressContext mount, drop keys
from `progress.completedSections[3]` / `[4]` that match the moved
section IDs. Adds one block of code; gain is purely cosmetic
(localStorage stays tiny anyway). **Recommendation: skip**, leave
stale keys as harmless metadata.

---

## 6. UX bridge between units and Lab

Add a new section type: **`labbanner`** — a small inline strip that
references one or more Lab tools.

Data shape in unit:
```js
labBanners: {
  bankaccounts: { toolIds: ['loan-simulator'], anchor: 'after' },
  reading:      { toolIds: ['world-banking-map'], anchor: 'after' },
}
```

In `unit.sections`:
```js
sections: [
  …, 'bankaccounts', 'labbanner:bankaccounts', …,
                     ↑ embedded reference
]
```

Or simpler: special section IDs `labbanner:loan-simulator` etc., one
banner per section ID. `renderSection` adds one new case `labbanner:*`
that strips the prefix and renders a small card:

```
┌────────────────────────────────────────────────────┐
│ 💡 Try the Loan Simulator hands-on                 │
│    Practise this concept in the Interactive Lab.   │
│                                       [Open Lab →] │
└────────────────────────────────────────────────────┘
```

Compact (≤80px tall), accent-light background, single line on
desktop / two on mobile. Click navigates to
`/interactive-lab/<tool-id>`.

These banners are the **only** signal in the unit that the tool exists.
Avoid being pushy — one banner per relevant section, not three in a
row.

---

## 7. Progress and Lab

**Recommendation: no progress tracking inside the Lab.**

Reasoning:
- Lab is a sandbox. Achievement-style tracking would force students
  into "complete the tool" behaviour, which contradicts its purpose
  (experimentation).
- Existing tools already self-track engagement (Done after N opens,
  N drags, etc.) — but those `markSectionComplete(unitId, sectionId)`
  calls become no-ops when the tool is rendered in Lab (no
  `unitId` in scope). Safe.

**Alternative considered and rejected:** "tools opened" count surfaced
on the Lab index page (`5 of 7 explored`). Tempting but risks the
same achievement-trap and adds Supabase write cost for no learning
benefit.

If you want a lightweight nudge: a *visited* dot next to each tool
card (purely local-storage tracked, no DB writes). I lean toward
**not adding even that**, because it makes the lab feel like a
checklist.

---

## 8. Teacher mode in Lab

**Phase 1 (now): no special teacher view.** Teacher sees the same Lab
as students. They can browse and demo tools in class.

**Phase 2 (future TODO):** if the team later wants per-student tool
usage analytics, the model would be:

```sql
ALTER TABLE profiles
  ADD COLUMN tool_usage JSONB DEFAULT '{}'::jsonb;
-- Shape: { "loan-simulator": { firstOpenedAt, lastOpenedAt, openCount } }
```

Client writes a small record on tool open (debounced). TeacherDashboard
gets a new section "Lab activity" with a table.

For Phase 1, drop a `// TODO: tool_usage telemetry` comment next to
the tool-render code in `InteractiveLab.jsx` to make the future
extension point visible.

---

## 9. Trade Simulator and Economic World specifics

**Keep their UX exactly as today.** They become Lab tools by being
entries in the registry — that's the only conceptual change.

Concrete changes:
- Their components (`TradeSimulator.jsx`, `EconomicWorld.jsx`) are not
  edited.
- The route `/interactive-lab/trade-simulator` renders them via the
  Lab single-tool view, which adds a back-bar above and nothing else.
- The old top-level routes `/trade-simulator` and `/economic-world`
  remain registered in `App.jsx` but use `<Navigate to=…replace />`
  to redirect to the Lab equivalents.
- Remove their entries from Sidebar `authNavItems`. Lab itself
  appears in the sidebar instead.

Edge case: those components currently have their own "Back to
Dashboard" buttons. Decision needed:
- **Option A:** leave their existing back buttons → user sees two back
  controls (the Lab frame's "← Back to Lab" + the component's "← Back
  to Dashboard"). Confusing.
- **Option B (recommended):** the Lab frame detects when the rendered
  tool has its own back/header and suppresses its own. Implemented
  via a prop on the registry entry: `selfNavigates: true`.

For Trade Simulator and Economic World → `selfNavigates: true`.
Their existing back buttons get routed to `/interactive-lab` (small
inline edit needed in those two files — one prop change each).

For migrated section components (Loan Simulator, GDP Calc, etc.) →
`selfNavigates: false`, Lab frame renders the back-bar.

---

## 10. Phasing

Each phase ends with `npm run build`, browser smoke-test, and a single
commit. Phases are independent and revertable.

### Phase 1 — Skeleton + standalone tools

Lowest blast radius — no unit changes yet.

- `src/data/interactiveLab.js` — registry with 2 entries (Trade
  Simulator, Economic World)
- `src/pages/InteractiveLab.jsx` — index grid + `:toolId` view
- `src/components/interactive-lab/ToolCard.jsx`,
  `ToolFrame.jsx`
- `src/App.jsx` — routes:
  - `/interactive-lab` and `/interactive-lab/:toolId` → InteractiveLab
  - `/trade-simulator` → `<Navigate to="/interactive-lab/trade-simulator" replace />`
  - `/economic-world` → `<Navigate to="/interactive-lab/economic-world" replace />`
- `src/components/Layout.jsx` — add Lab to `authNavItems`; remove
  Trade Simulator and Economic World entries
- `src/pages/Dashboard.jsx` — add Lab feature card

**Exit criteria:** Lab page loads, both tools work via Lab routes,
old direct URLs redirect, Sidebar shows Lab and not the standalones.

### Phase 2 — Migrate unit-section tools

Higher blast radius — touches unit data.

- Extend `interactiveLab.js` registry with 5 more entries:
  loan-simulator, currency-comparator, world-banking-map,
  gdp-calculator, balance-sheet-builder
- Remove IDs from `unit3.sections` and `unit4.sections`
- Verify each migrated tool renders standalone (no missing props
  beyond what `buildToolProps` provides)
- For tools that previously called `markSectionComplete(unitId,…)`:
  confirm graceful no-op when `unitId` is undefined

**Exit criteria:** Lab grid shows all 7 tools, each opens and works.
Units 3 & 4 nav strip no longer shows the migrated sections.

### Phase 3 — Lab banners in units

UX-polish — pointers from units to Lab.

- New section ID pattern `labbanner:<tool-id>` recognised by
  `renderSection`
- Add `labbanner:loan-simulator` after `bankaccounts` in
  `unit3.sections`, etc.
- Banner component lives in `src/components/unit/LabBanner.jsx`

**Exit criteria:** small accent-light cards appear after relevant
unit sections, clicking opens the tool in Lab.

### Phase 4 — Audit + cleanup

- Update `docs/audit-report.md` with a new row for the Lab refactor
- Verify Teacher Dashboard still works (it queries `profiles.progress`
  with hardcoded `unitNPercent`; nothing in Lab changes that)
- Smoke test on mobile (320, 768) — particularly Trade Simulator and
  Economic World since they have their own layouts
- Confirm no console errors when navigating between Lab tools

---

## Open questions for confirmation before implementation

1. **Sidebar position:** "after Glossary, before Progress" — OK?
   If you prefer it bottom-pinned (like Profile/Settings) say so.

2. **Dashboard card:** confirm we add a single feature card promoting
   the Lab. Position: after the units grid, before Recent Activity.

3. **Modal vs separate route:** I strongly recommend separate route
   (`/interactive-lab/:toolId`). Confirm or push back.

4. **Banner approach in units:** new section ID `labbanner:<tool-id>`
   is simpler than a parallel `labBanners` data field. Confirm
   pattern.

5. **Progress migration:** leave stale `completedSections.<unit>.
   <toolId>` keys in user data (recommended — harmless) or actively
   drop them on next mount?

6. **Lab usage tracking:** Phase 1 has zero progress / telemetry per
   Section 7 recommendation. Confirm, or specify a lightweight nudge
   (visited dots, opened-count) you want from the start.

7. **`selfNavigates: true` for Trade Simulator / Economic World:**
   Lab frame suppresses its own back-bar when the tool has its own
   navigation. Confirm pattern, OR prefer to strip the in-tool
   back buttons and let Lab frame own all navigation.

8. **Unit reading section's banner placement:** for unit 3, should
   the Loan Simulator banner appear after `bankaccounts` (where
   loans are introduced) or after `reading`/`dialogue` (where Arthur
   appears)? Both are defensible — pick one.

---

## Out of scope

- Capstone Project rendering (stays in Unit 4 — not touched here)
- Listening Lab (already its own page — distinct from Interactive Lab,
  keep separate)
- Mobile-specific re-skinning of Trade Simulator / Economic World —
  defer to a separate UX pass if needed
- Supabase schema changes for tool telemetry — Phase 2 TODO comment
  only
- Removing `worldBankingMap` / `loanSimulator` / etc. data fields from
  unit3.js/unit4.js — keep them; they're the content source the Lab
  reads via `buildToolProps`
