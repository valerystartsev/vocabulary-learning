# Refactoring Plan — Phase 3: Declarative Unit Architecture

**Дата:** 2026-05-21
**Ветка:** feature/units-3-4
**Контекст:** аудит в `audit-report.md`, фактически выполнены блоки C1 (унификация кроссворда) и точечный feat MoneyCompass (f1). Остаются C2 и C3 + более глубокий рефакторинг — превращение `UnitPage.jsx` в декларативный рендерер.

---

## Цель

Чтобы добавление нового юнита было **чисто data-операцией**: создать `unitN.js` → добавить в `courseData.js` → готово. Никаких правок в компонентах. Все секции — опциональны и берутся из полей юнита.

---

## Принципы

1. **Один источник истины** — массив `units` в `courseData.js`. Всё остальное (Dashboard, Sidebar, Glossary, Progress, Review, MyMistakes, TeacherDashboard) — итерация по нему.

2. **Component registry** — карта `sectionId → React component` в одном месте (`src/components/unit/sectionRegistry.js`). UnitPage не знает о существовании конкретных секций.

3. **Декларативные секции** — каждая секция описана как:
   ```js
   { id: 'casestudy', dataField: 'caseStudy', component: 'CaseStudySection', label: 'Case Study', labelRu: 'Кейс' }
   ```
   Появление секции = наличие `unit[dataField]`.

4. **Безопасный рефакторинг** — Unit 1 и Unit 2 после рефакторинга работают **ровно как раньше**. Все опциональные секции рендерятся через тот же путь.

5. **Один коммит — одна фаза.** После каждой — `npm run build` + проверка в браузере.

---

## Фазы

### Фаза R1 — Component Registry

**Цель:** вынести импорты секционных компонентов из `UnitPage.jsx` в отдельный модуль.

**Файлы:**
- **Новый:** `src/components/unit/sectionRegistry.js`
  - Импортирует все секционные компоненты (KeyIdeas, Dictionary, ComicsBlock, ReadingSection, ComprehensionQuestions, MediaLab, MediaQuest, DialogueBlock, WritingBlock, TotalTest, VocabularyRadar, ScenarioLoop, CrosswordChallenge, MemoSection, LabourMarketSection, CaseStudySection, RolePerspectives, GrammarSection, MoneyCompass, GrowthTimeline, EmploymentSnapshot, PeopleProgressCards)
  - Экспортирует объект `SECTION_COMPONENTS = { 'casestudy': CaseStudySection, ... }`
  - Экспортирует функцию `getSectionConfig(id)` возвращающую `{ component, props, dataField }`

- **Edit:** `src/pages/UnitPage.jsx`
  - Удаляет все 20+ импортов секционных компонентов
  - Импортирует `SECTION_COMPONENTS` из registry
  - Рендер цикла секций ещё не меняется — это в R2

**Риск:** низкий. Просто реорганизация импортов, нулевое изменение поведения.

**Проверка:** build + смоук-тест Unit 1, Unit 2.

---

### Фаза R2 — Декларативные секции в данных

**Цель:** убрать хардкоды `unit.id === N` из `buildSections()` и из JSX.

**Файлы:**
- **Edit:** `src/data/unit1.js`
  - Добавить поле `mediaQuest: true` (boolean-флаг для активации секции).  
    Не data-объект, потому что MediaQuest читает данные из `unit.media` напрямую.
  
- **Edit:** `src/data/unit2.js`
  - Добавить поле `timeline: <данные для GrowthTimeline>`. Сейчас GrowthTimeline получает данные через хардкод из `growthImpactMap`. Перенести их в `timeline`. Альтернатива — оставить `growthImpactMap` и читать через `unit.growthImpactMap`, но `timeline` универсальнее.
  - Опционально удалить `comics: []` (пустой массив, нужен только для блокировки рендера) — после R2 это поведение уйдёт.

- **Edit:** `src/pages/UnitPage.jsx` → `buildSections()`
  - Заменить `...(unit.id === 1 ? [s('mediaquest', ...)] : [])` на `...(unit.mediaQuest ? [...] : [])`
  - Заменить `...(unit.id === 2 ? [s('impactmap', ...)] : [])` на `...(unit.timeline ? [s('timeline', 'Timeline', 'Шкала')] : [])`
  - Переименовать `impactmap` → `timeline` для консистентности (потребует миграции `completedSections.unit2.impactmap` → `timeline` — но это user-side данные в Supabase, не критично)
  - Заменить `unit.id === 2 && <VocabularyRadar ...>` (line 271) на `unit.radarAfterDictionary && <VocabularyRadar ...>`

- **Edit:** `src/components/unit/SectionBanner.jsx`
  - Добавить конфиг для `timeline` (или переиспользовать `impactmap` config с новым ID)

**Риск:** средний. Меняется логика условий + миграция ID.

**Проверка:** Unit 1 показывает MediaQuest, Unit 2 показывает Timeline (а не Comics с пустым массивом — это исправит баг N3 из аудита).

---

### Фаза R3 — Section List в данных юнита

**Цель:** полностью убрать функцию `buildSections()` из `UnitPage.jsx`. Каждый юнит сам декларирует свои секции.

**Файлы:**
- **Edit:** `src/data/unit1.js`, `unit2.js`, `unit3.js`, `unit4.js`
  - Добавить поле `sections` — массив строк (ID секций) **в порядке отображения**:
    ```js
    sections: [
      'header', 'keyideas', 'dictionary', 'comics', 'exercises',
      'reading', 'comprehension', 'media', 'mediaquest', 'crossword',
      'dialogue', 'writing', 'scenario', 'totaltest', 'answerkey', 'summary'
    ]
    ```
  - Для Unit 3 туда же `moneycompass`. Для Unit 2 — `timeline`, `casestudy`, `roleperspectives`, `labourmarket`, `memo`, `grammar`.

- **Edit:** `src/pages/UnitPage.jsx`
  - Удалить `buildSections()`. Использовать `unit.sections.map(id => SECTION_REGISTRY[id])`.
  - Лейблы (`label`, `labelRu`) — из registry, не из массива в данных.

- **Edit:** `src/components/unit/sectionRegistry.js`
  - Экспортировать `SECTION_LABELS = { header: { label: 'Intro', labelRu: '' }, ... }`

**Риск:** средний. Меняется источник списка секций. Нужно убедиться, что порядок в `sections` для Unit 1 и Unit 2 даёт **тот же visual order**, что был раньше.

**Проверка:** диф навигационной полосы Unit 1 / Unit 2 до и после — должна быть идентичной.

---

### Фаза R4 — Декларативный JSX render

**Цель:** в `UnitPage.jsx` нет ни одного `<KeyIdeas>`, `<Dictionary>` и т.д. — есть **один цикл** `unit.sections.map(...)`.

**Файлы:**
- **Edit:** `src/components/unit/sectionRegistry.js`
  - Полная конфигурация для каждой секции:
    ```js
    {
      id: 'casestudy',
      label: 'Case Study',
      labelRu: 'Кейс',
      component: CaseStudySection,
      buildProps: (unit) => ({ data: unit.caseStudy, unitId: unit.id }),
      isVisible: (unit) => !!unit.caseStudy,
      includeBanner: true, // showSectionBanner header above
      isStatusTracked: true, // include in section nav status
    }
    ```

- **Edit:** `src/pages/UnitPage.jsx`
  - Главный JSX заменяется на:
    ```jsx
    {unit.sections.map(sectionId => {
      const config = SECTION_REGISTRY[sectionId];
      if (!config?.isVisible(unit)) return null;
      const Component = config.component;
      const extraProps = config.buildProps(unit, { isTeacherMode, progress });
      return (
        <React.Fragment key={sectionId}>
          {config.includeBanner && <SectionDivider id={sectionId} isDone={sectionDone(sectionId)} />}
          <Component {...extraProps} />
        </React.Fragment>
      );
    })}
    ```
  - Top bar, teacher banner, nav strip, summary footer — остаются как есть, **не часть цикла**.

- **Edit:** Answer Key и Summary секции — оставить отдельно либо вынести в `SECTION_REGISTRY` как специальные компоненты.

**Риск:** высокий. Главный JSX переписывается. Каждая секция должна быть проверена.

**Проверка:** полный сценарий Unit 1 и Unit 2 (как было в прошлой проверке через preview) — секция за секцией.

---

### Фаза R5 — Динамичный TeacherDashboard (блок C3 из аудита)

**Цель:** убрать хардкоды `unit1Percent`, `unit2Percent`, `{tests}/2`.

**Файлы:**
- **Edit:** `src/pages/TeacherDashboard.jsx`
  - Импорт `units` из `courseData`
  - Заменить статичные `unit1`, `unit2` на цикл по `units.map(u => ({ id: u.id, pct: prog[`unit${u.id}Percent`] || 0 }))`
  - Заменить `{tests}/2` на `{tests}/{units.length}`
  - В `StudentCard` и `StudentDetail` — список прогрессов по всем юнитам (компактный layout: бары столбиком, по 4 на десктоп, 2 на мобайл)

- **Комментарий-TODO:** `// Supabase profiles.progress JSON всё ещё пишется триггером с hardcoded unitNPercent. Расширить триггер для Units 3-4 — задача DBA.`

**Риск:** низкий. Только UI слой, серверная сторона не меняется.

**Проверка:** залогиниться учителем, увидеть Unit 3 и Unit 4 в карточках студентов (даже если процент = 0, потому что триггер не обновлён — это видно как 0%, не падает).

---

### Фаза R6 — Cleanup

**Файлы:**
- Удалить мёртвые комментарии про `unit.id === N` из всех файлов
- Удалить хардкод `<Link to="/unit/1">` в `Dashboard.jsx` → `<Link to={\`/unit/${units[0].id}\`}>`
- В `MyMistakes.jsx` строка 35 уже использует `units[0].id` — оставить
- Обновить `audit-report.md` — отметить C2 и C3 как done, добавить раздел про R3/R4 (registry-based architecture)

**Риск:** нулевой.

---

## Файлы, которые создаются

1. `src/components/unit/sectionRegistry.js` — карта секций
2. `docs/refactoring-plan.md` — этот документ

## Файлы, которые редактируются

| Файл | Фаза | Тип изменения |
|------|------|---------------|
| `src/pages/UnitPage.jsx` | R1, R2, R3, R4 | Major rewrite |
| `src/data/unit1.js` | R2, R3 | Add `mediaQuest`, `sections` |
| `src/data/unit2.js` | R2, R3 | Add `timeline`, `sections`, possibly rename `growthImpactMap` |
| `src/data/unit3.js` | R3 | Add `sections` |
| `src/data/unit4.js` | R3 | Add `sections` |
| `src/components/unit/SectionBanner.jsx` | R2 | Add `timeline` entry |
| `src/pages/TeacherDashboard.jsx` | R5 | Dynamic iteration |
| `src/pages/Dashboard.jsx` | R6 | Tiny cleanup |
| `docs/audit-report.md` | R6 | Status update |

## Порядок коммитов

1. `refactor(R1): extract section registry from UnitPage`
2. `refactor(R2): data-driven mediaquest and timeline sections, kill unit.id checks`
3. `refactor(R3): unit.sections drives nav order`
4. `refactor(R4): UnitPage renders sections via registry loop`
5. `refactor(R5): TeacherDashboard reads all units dynamically`
6. `chore(R6): cleanup, doc update`

После каждого — `npm run build` + браузер-чек.

---

## Что НЕ входит в этот рефакторинг

- Полное наполнение `unit3.js` и `unit4.js` контентом (vocabulary 28+25 терминов, reading 700–900 слов, dialogue, scenario, totalTest, crossword) — это **отдельная задача**, не архитектурная. Делается после R3 (когда поле `sections` уже формализовано).
- Имплементация фич f2–f12 из концепта — отдельные задачи (MoneyCompass = f1 готов как образец).
- Серверная Supabase-логика (триггер для `profiles.progress`) — задача DBA.

---

## После одобрения

Запускаюсь по фазам R1 → R6. Перед каждым `Edit`/`Write` показываю короткий diff (старый блок → новый блок), жду нажатия. Это позволит контролировать изменения построчно.
