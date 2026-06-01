# Audit Report — Units 3–4 Architecture

**Дата:** 2026-05-21
**Ветка:** feature/units-3-4
**Scope:** src/ целиком + docs/units-3-4-concept.html

> Цель: найти всё, что мешает добавлению новых юнитов как чистой data-операции.
> Код не менялся — только чтение и анализ.

---

## Status update (after Phase 2 + Phase 3 refactoring)

| Block | Status | Commit |
|-------|--------|--------|
| **C1** Унификация кроссворда | ✅ done | `abc9db4d` |
| **C2** `unit.id === N` хардкоды | ✅ done | `77c8b1b2` |
| **C3** TeacherDashboard hardcodes | ✅ done | see R5 below |
| **N3** GrowthTimeline rendering bug | ✅ fixed | `77c8b1b2` |
| **R1** Section component registry | ✅ done | `16922291` |
| **R2** Data-driven section flags | ✅ done | `77c8b1b2` |
| **R3** `unit.sections` array | ✅ done | `dc1b55e7` |
| **R4** Declarative render loop | ✅ done | `dc1b55e7` |
| **R5** TeacherDashboard dynamic iteration | ✅ done | this commit |
| **N2** Dashboard `/unit/1` hardcode | ✅ done | this commit |
| **Lab P1** Skeleton + Trade Sim + Economic World migration | ✅ done | Phase 1 commit |
| **Lab P2** 5 unit-section tools migrated into Lab | ✅ done | `595fafae` |
| **Lab P3** In-unit banners pointing to Lab tools | ✅ done | `df58d423` |
| **Lab P4** Audit + mobile smoke test | ✅ done | `a54fb79e` |
| **Unit 1 A** Market Structure Compass | ✅ done | `409d0e48` |
| **Unit 1 C** Complaint Resolution Path | ✅ done | `960f3363` |
| **Unit 2 A** Growth Drivers Compass | ✅ done | `8f4ec097` |
| **Unit 2 C** Technology & Jobs Flow | ✅ done | `80df54bb` |
| **Final** dedupe fix in VocabularyRadar media list | ✅ done | this commit |

Adding a new unit to the course is now genuinely a single-file operation:
create `src/data/unitN.js`, add to the `units` array in
`src/data/courseData.js`, and it appears in the sidebar, dashboard,
glossary, progress, and teacher views without further code edits.

> The sections below remain as the original audit (May 2026) for reference
> on what was true *before* this work.

---

## Раздел 1. Хардкоды unit.id в коде

### src/pages/UnitPage.jsx

| Строка | Условие | Что делает | Предложение |
|--------|---------|-----------|-------------|
| 44 | `unit.id === 2` | Добавляет секцию `impactmap` (Timeline) в навигацию только для Unit 2 | Добавить поле `unit.timeline` в данные; условие → `unit.timeline ?` |
| 49 | `unit.id === 1` | Добавляет секцию `mediaquest` (Media Quest) только для Unit 1 | Добавить поле `unit.mediaQuest` в данные; условие → `unit.mediaQuest ?` |
| 271 | `unit.id === 2` | Рендерит VocabularyRadar после Dictionary только для Unit 2 | Косметика; можно оставить или вынести в `unit.showRadarAfterDictionary` |
| 288 | `unit.id === 2` | Else-ветка для GrowthTimeline (альтернатива comics) — **фактически никогда не срабатывает**, т.к. `unit.comics = []` truthy в Unit 2; GrowthTimeline не рендерится | Заменить всю ветку: `unit.timeline ? <GrowthTimeline data={unit.timeline}> : unit.comics?.length ? <ComicsBlock> : null` |
| 324 | `unit.id === 1` | Рендерит секцию MediaQuest только для Unit 1 | То же что строка 49 — добавить `unit.mediaQuest` |
| 333–334 | `unit.id === 2` | Выбирает `Unit2Crossword` для Unit 2, `CrosswordChallenge` для всех остальных | Единый компонент + `crossword` поле из данных юнита (см. Раздел 3) |

**Итого по UnitPage.jsx: 6 хардкодов на unit.id**

### src/pages/TeacherDashboard.jsx

| Строка | Хардкод | Что делает | Предложение |
|--------|---------|-----------|-------------|
| 31–32 | `prog.unit1Percent`, `prog.unit2Percent` | Показывает прогресс студента по Units 1 и 2 в карточке StudentCard | Вычислять динамически из `profiles.saved_progress` + списка юнитов |
| 66 | `{tests}/2` | Хардкод «Tests: N/2» — знаменатель равен числу юнитов | Заменить на `{tests}/{units.length}` |
| 107–108 | Те же поля | Повтор в компоненте StudentDetail | Та же правка |
| 165 | `{tests}/2` | Повтор в grid метрик StudentDetail | Та же правка |

**Итого по TeacherDashboard.jsx: 4 хардкода** (плюс архитектурный вопрос по Supabase — см. Раздел 6)

### src/pages/Dashboard.jsx

| Строка | Хардкод | Что делает | Оценка |
|--------|---------|-----------|--------|
| 285 | `<Link to="/unit/1">` | «Start the Course» — ссылка на Unit 1 при отсутствии lastUnit | **Не критично.** Unit 1 всегда первый; `/unit/${units[0].id}` чище, но функционально одинаково |

---

## Раздел 2. buildSections(unit): что есть у обоих, что специфично

`SECTIONS_UNIT1` / `SECTIONS_UNIT2` как отдельных констант **нет** — они уже объединены в функцию `buildSections(unit)` (UnitPage.jsx:37–63). Всё хорошо, кроме двух оставшихся хардкодов на unit.id.

### Секции, присутствующие всегда (обязательные)

`header` · `keyideas` · `dictionary` · `exercises` · `reading` · `comprehension` · `media` · `crossword` · `dialogue` · `writing` · `scenario` · `totaltest` · `answerkey` · `summary`

### Секции, управляемые данными (data-driven, могут быть в любом юните)

| Секция | Поле в данных юнита | Компонент |
|--------|-------------------|-----------|
| `comics` | `unit.comics` (truthy array) | `ComicsBlock` |
| `casestudy` | `unit.caseStudy` | `CaseStudySection` |
| `roleperspectives` | `unit.rolePerspectives` | `RolePerspectives` |
| `labourmarket` | `unit.labourMarketSection` | `LabourMarketSection` |
| `memo` | `unit.memoSection` | `MemoSection` |
| `grammar` | `unit.grammarSection` | `GrammarSection` |

> Эти секции — **общие паттерны**, могут использоваться в Units 3–4 без правки кода.

### Секции, завязанные на конкретный юнит через хардкод

| Секция | Только для | Компонент | Характер привязки |
|--------|-----------|-----------|-------------------|
| `impactmap` (Timeline) | Unit 2 | `GrowthTimeline` | Тематический: шкала роста ВВП — дизайн Unit 2. Едва ли повторится буквально, но паттерн «таймлайн» мог бы быть data-driven |
| `mediaquest` | Unit 1 | `MediaQuest` | Игровой квест по медиа-материалам Unit 1. Unit 1-специфичен по контенту |

> **Вывод:** `caseStudy`, `rolePerspectives`, `labourMarketSection`, `memoSection`, `grammarSection` — уже полностью data-driven и готовы для Units 3–4. Только `impactmap` и `mediaquest` остаются проблемой для новых юнитов.

### Баг: GrowthTimeline не рендерится в Unit 2

Unit 2 объявляет `comics: []` (пустой массив). В JS `[]` truthy, поэтому ветка `unit.id === 2 → GrowthTimeline` (строка 288) никогда не достигается — рендерится `ComicsBlock` с пустым массивом. **GrowthTimeline не показывается.** При добавлении нового юнита без поправки — этот баг сохраняется и хардкод `impactmap` блокирует Unit 3/4.

---

## Раздел 3. Дублирующиеся компоненты

### CrosswordChallenge vs Unit2Crossword

| Компонент | Путь | Используется |
|-----------|------|-------------|
| `CrosswordChallenge` | `src/components/unit/CrosswordChallenge.jsx` | Units 1, 3, 4 (все кроме 2) |
| `Unit2Crossword` | `src/components/unit/Unit2Crossword.jsx` | Только Unit 2 (хардкод строка 333) |

Оба компонента реализуют одну механику кроссворда. Выбор: `unit.id === 2 ? <Unit2Crossword> : <CrosswordChallenge>`.

**Рекомендация:** Объединить в один компонент `CrosswordChallenge`, принимающий `data={unit.crossword}`. Данные кроссворда вынести в поле `crossword` каждого unit-файла (Unit 1 уже имеет `crossword`-поле; Unit 2 нужно добавить аналогичную структуру).

### Другие дубли

По результатам полного обхода `src/components/unit/` очевидных дублей аналогичного масштаба больше не обнаружено. Все остальные компоненты (`CaseStudySection`, `MemoSection`, `GrammarSection` и т.д.) — уникальные паттерны, управляемые данными.

---

## Раздел 4. Точки регистрации юнита

### 1. src/data/courseData.js — Главный реестр

```js
import { unit3 } from './unit3';
import { unit4 } from './unit4';
export const units = [unit1, unit2, unit3, unit4];
```

✅ **Полностью динамический.** Уже содержит все 4 юнита. `getUnit(id)` и `getAllVocabulary()` итерируют динамически. **Единственное место добавления нового юнита в реестр.**

---

### 2. src/pages/Dashboard.jsx

✅ **Динамический.**
- Строка 136: `units.reduce(...)` — courseProgress по всем юнитам
- Строка 143: `units.find(...)` — поиск не сданного теста
- Строка 454: `{units.map(unit => ...)}` — карточки юнитов
- Строка 436: `{units.map(u => ...)}` — ссылки на Answer Key в Teacher-блоке
- Строка 285: `<Link to="/unit/1">` — **единственный хардкод**, не критичен

---

### 3. src/components/Layout.jsx — Sidebar-навигация

✅ **Полностью динамический.**
```js
...units.map(u => ({ path: `/unit/${u.id}`, label: `Unit ${u.id}`, labelRu: u.title, icon: BookOpen }))
```
Строка 20: навигационные элементы генерируются из массива `units`. При добавлении нового юнита в `courseData.js` — пункт в sidebar появится автоматически.

---

### 4. src/pages/Glossary.jsx

✅ **Полностью динамический.**
- `getAllVocabulary()` — агрегирует словарь из всех юнитов
- Строка 384: `{units.map(u => <SelectItem>)}` — фильтр по юнитам в Select
- Фильтрация: `v.unitId === Number(unitFilter)` — по полю `unitId`, установленному `getAllVocabulary()`

---

### 5. src/pages/Progress.jsx

✅ **Полностью динамический.**
- Строка 244: `units.reduce(...)` — courseProgress
- Строка 247: `units.reduce(...)` — totalMedia
- Строка 327: `{units.map(unit => ...)}` — UnitProgressCard для каждого юнита

---

### 6. src/pages/Review.jsx

✅ **Полностью динамический.**
Использует только `getAllVocabulary()` для SRS-повторения. Никакой unit-специфичной логики нет.

---

### 7. src/pages/MyMistakes.jsx

✅ **Эффективно динамический.**
- `getAllVocabulary()` — все слова
- Строка 35: `units[0].id` — ссылка на первый юнит (fallback-кнопка). Работает для любого количества юнитов.

---

### 8. src/pages/TeacherDashboard.jsx

⚠️ **Частично захардкожен — требует правки.**

Данные студентов читаются из Supabase `profiles.progress` (JSON-объект). Этот объект содержит **захардкоженные** ключи:

| Поле | Строка | Проблема |
|------|--------|---------|
| `prog.unit1Percent` | 31, 107 | Прогресс только по Unit 1 |
| `prog.unit2Percent` | 32, 108 | Прогресс только по Unit 2 |
| `prog.testsDoneCount` | 33, 111 | Число тестов (читается без знаменателя) |
| `{tests}/2` | 66, 165 | Хардкод «из 2 тестов» |

Интерфейс не показывает Units 3–4 в разбивке студентов. Для полноты картины нужна правка знаменателя и добавление отображения прогресса по всем юнитам.

---

### 9. src/pages/EconomicWorld.jsx

✅ **Не связан с системой юнитов.**
Использует отдельный файл `src/data/economicWorldData.js` (массив `PROFILES` с профилями стран). К courseData не обращается. Добавление юнитов не затрагивает этот модуль.

---

### 10. src/pages/ListeningLab.jsx

✅ **Полностью динамический.**
- Строка 307: `units.find(u => u.id === selectedUnitId) || units[0]`
- Строка 357: `{units.map(u => ...)}` — picker юнитов
- Клипы генерируются из `unit.vocabulary` — работает для любого юнита.

---

### 11. src/pages/TradeSimulator.jsx

✅ **Не связан с системой юнитов.**
Использует встроенные массивы `COUNTRIES` и `GOODS`. Словарь курса упоминается по именам слов (hardcoded strings в `vocabWords`), но не через courseData. Добавление юнитов не требует правок.

---

## Раздел 5. Схема данных юнита

### Поля, присутствующие в обоих юнитах (обязательные)

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | `number` | Идентификатор юнита |
| `title` | `string` | Название юнита |
| `subtitle` | `string` | Подзаголовок |
| `description` | `string` | Описание (EN) |
| `descriptionRu` | `string` | Описание (RU) |
| `keyIdeas` | `Array<{term, termRu, meaning, meaningRu, icon}>` | 3 ключевые идеи |
| `vocabulary` | `Array<VocabWord>` | Словарь |
| `comics` | `Array<Comic> \| []` | Комиксы (Unit 1 — данные; Unit 2 — пустой `[]`) |
| `comicQuestions` | `Array` | Вопросы к комиксам |
| `exercises` | `Array<Exercise>` | Упражнения |
| `reading` | `object` | Текст для чтения |
| `comprehension` | `Array<Question>` | Вопросы на понимание |
| `media` | `Array<MediaItem>` | Медиа-материалы |
| `dialogue` | `object` | Диалог |
| `writing` | `{title, prompt, sampleAnswer, teacherNotes}` | Письменное задание |
| `scenario` | `object \| null` | Scenario Loop (опционально) |
| `totalTest` | `{parts: Array<Part>}` | Итоговый тест |

**Структура VocabWord:**
```js
{ id, term, pos, translationRu, trick, meaningEn, meaningRu, example, collocations }
```

### Поле crossword — только Unit 1; Unit 2 использует отдельный компонент

Unit 1 имеет поле `crossword` с данными для `CrosswordChallenge`. Unit 2 использует `Unit2Crossword` с данными внутри компонента. Это корень дублирования — решается добавлением `crossword` в данные Unit 2 и унификацией компонента.

### Поля только в Unit 2 (опциональные, data-driven)

| Поле | Тип | Компонент | Готово для Units 3–4? |
|------|-----|-----------|----------------------|
| `growthImpactMap` | `object` | `GrowthTimeline` (через хардкод `unit.id === 2`) | ❌ Не data-driven; компонент подключён через хардкод |
| `caseStudy` | `object` | `CaseStudySection` | ✅ Да |
| `rolePerspectives` | `object` | `RolePerspectives` | ✅ Да |
| `labourMarketSection` | `object` | `LabourMarketSection` | ✅ Да |
| `memoSection` | `object` | `MemoSection` | ✅ Да |
| `grammarSection` | `object` | `GrammarSection` | ✅ Да |

### Unit 3 и Unit 4

Файлы `src/data/unit3.js` и `src/data/unit4.js` уже созданы и импортированы в `courseData.js`. Unit 3 (Money & Banking) имеет базовую структуру: `id`, `title`, `keyIdeas`, `vocabulary`. Поля для 12 новых фич (f1–f12 из концепта) потребуют добавления соответствующих data-полей по аналогии с `caseStudy` и другими опциональными секциями.

---

## Раздел 6. Supabase

### Архитектура хранения прогресса

| Колонка `profiles` | Что хранит | Кто пишет |
|--------------------|-----------|----------|
| `saved_progress` (JSONB) | Полный прогресс студента | `ProgressContext.syncProgressToUser()` |
| `progress` (JSONB) | Агрегированная сводка (unitNPercent, testsDoneCount...) | Неизвестно из клиентского кода — вероятно Supabase-триггер или устаревший путь |

### Динамичность saved_progress

Все ключи используют `unitId` как динамический ключ объекта:

```js
completedSections[unitId][sectionId]
totalTestScores[unitId]
scenarioScores[unitId]
crosswordScores[unitId]
```

✅ **Изменений Supabase-схемы не требуется.** Units 3–4 автоматически получат свои ключи при первом взаимодействии студента.

### Проблема колонки `progress`

`TeacherDashboard.jsx` читает из `profiles.progress`:
```js
const unit1 = prog.unit1Percent || 0;   // строки 31, 107
const unit2 = prog.unit2Percent || 0;   // строки 32, 108
```

Это **отдельная колонка** (не `saved_progress`). Источник записи в клиентском коде не найден — возможно, функция/триггер Supabase, вычисляющий сводку из `saved_progress`. Если так — сводка захардкожена только для Units 1–2, и прогресс студентов по Units 3–4 **не будет виден в TeacherDashboard** без правки серверной логики.

### Нет хардкода unit_id в SQL-запросах

Все Supabase-запросы в клиентском коде не привязаны к конкретным юнитам:
- `ProgressContext.jsx:373` — `profiles.upsert({ saved_progress: snapshot })` — unit-agnostic JSON
- `TeacherDashboard.jsx:86` — `.select('...progress')` — читает JSON целиком

✅ SQL-запросы не захардкожены на конкретные юниты.

---

## Раздел 7. Итоговая рекомендация

### Критичные правки (без них Units 3–4 не заработают корректно)

| # | Файл | Строки | Проблема | Что сделать |
|---|------|--------|---------|------------|
| **C1** | `UnitPage.jsx` | 333–334 | `unit.id === 2 → Unit2Crossword` | Унифицировать в один компонент `CrosswordChallenge(data={unit.crossword})`; добавить `crossword` в `unit2.js` |
| **C2** | `UnitPage.jsx` | 44, 49, 288, 324 | Хардкоды `unit.id === 1/2` для impactmap/mediaquest | Добавить поля `unit.timeline` и `unit.mediaQuest`; заменить условия на проверку полей; исправить баг с GrowthTimeline |
| **C3** | `TeacherDashboard.jsx` | 31–32, 66, 107–108, 165 | `unit1Percent`, `unit2Percent`, `/2` | Динамическое вычисление из `saved_progress` или расширение логики сводки |

> **C1 и C2 обязательны** — без них Units 3–4 либо рендерятся не те компоненты, либо падают. C3 — критично для TeacherDashboard, не блокирует студентский опыт.

### Некритичные правки (можно отложить)

| # | Файл | Строки | Комментарий |
|---|------|--------|------------|
| **N1** | `UnitPage.jsx` | 271 | VocabularyRadar после Dictionary только для Unit 2 — косметика |
| **N2** | `Dashboard.jsx` | 285 | Хардкод `/unit/1` — функционально правильно, чистота кода |
| **N3** | `UnitPage.jsx` | 288 | Баг GrowthTimeline — не блокирует Units 3–4, но Unit 2 показывает пустой блок вместо таймлайна |

### Что уже работает без правок

- `courseData.js` — Units 3–4 уже в массиве `units` ✅
- `Layout.jsx` — sidebar добавляет пункты автоматически ✅
- `Dashboard.jsx` — карточки юнитов рендерятся динамически ✅
- `Glossary.jsx` — словарь и фильтры включают все юниты ✅
- `Progress.jsx` — прогресс-карточки для всех юнитов ✅
- `ListeningLab.jsx` — picker юнитов динамический ✅
- `Supabase saved_progress` — схема не требует изменений ✅

### Оценка трудоёмкости

| Блок | Файлов | ~Строк изменений | Усилие |
|------|--------|-----------------|--------|
| C1: Унификация кроссворда | 2 | ~20 | Малое |
| C2: id-хардкоды → data fields | 1–2 | ~15 | Малое |
| C3: TeacherDashboard динамика | 1–2 | ~30 | Малое–среднее |
| **Итого критичный рефактор** | **3–4** | **~65** | **Малое (1–2 часа)** |

### Вывод

Архитектура в целом хорошо подготовлена к масштабированию. Большинство страниц уже итерируют `units` динамически. Критичных хардкодов **10 мест в 2 файлах** (UnitPage.jsx и TeacherDashboard.jsx). Каждый решается точечной правкой без структурного рефактора.

Новые компоненты из концепта (f1 Money Compass, f2 Forms of Money Spectrum, f3 £/$ Comparator, f4 Central Bank Wheel, f5 Bank Account Picker, f6 World Banking Map, f7 Loan Simulator для Unit 3; f8 GDP Calculator, f9 Indicators Dashboard, f10 Business Cycle Switcher, f11 Balance Sheet Builder, f12 Annual Report Reader для Unit 4) встраиваются по уже существующему паттерну: **поле в data-файле → условный рендер в `buildSections` → новый компонент**. Архитектурный барьер отсутствует, единственное условие — сначала устранить C1 и C2.
