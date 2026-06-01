# Final Integration Report — Units 3 & 4

**Дата:** 2026-05-27
**Ветка:** `feature/units-3-4`
**Цель:** перед merge в `main` подтвердить, что Units 3 и 4 проходят по всем тем же путям, что Units 1 и 2.

> Метод: для каждого пункта чек-листа открыт исходник, проверена итерация
> по `units` из `courseData`, сверены поля Units 3/4 на наличие и форму.
> Хардкодов `unit.id === 1/2` или `unit1Percent/unit2Percent` в продуктовом
> коде (`src/pages`, `src/components`) больше нет — `Grep` подтверждает.

---

## Сводная таблица

| # | Файл | Статус | Что проверено |
|---|------|--------|--------------|
| 1  | `src/pages/Dashboard.jsx`              | ✅ ok | `units.map` для карточек юнитов, `units.length` для `Tests Done`, `units[0]?.id ?? 1` fallback, поиск `untakedTestUnit`/`failedTestUnit` по всем юнитам, Teacher-блок выводит `Answer Key` для каждого юнита. |
| 2  | `src/components/Layout.jsx`            | ✅ ok | Sidebar строится через `...units.map(u => ({ path: \`/unit/${u.id}\`, ... }))` — Units 3 и 4 появляются автоматически. `UnitProgressMini` работает с любым `unitId`. |
| 3  | `src/pages/Glossary.jsx`               | ✅ ok | `getAllVocabulary()` агрегирует словарь из всех 4 юнитов; фильтр по юнитам — `units.map(u => <SelectItem value={String(u.id)}>)`; фильтрация `v.unitId === Number(unitFilter)`; бейдж `U{word.unitId}`. |
| 4  | `src/pages/Review.jsx`                 | ✅ ok | SRS-карточки берутся из `getAllVocabulary()` через `getDueWords(srsData, allVocab.map(v => v.id))` — никакой привязки к конкретному юниту. |
| 5  | `src/pages/MyMistakes.jsx`             | ✅ ok | Источник — `getAllVocabulary()` + `progress.errorLog` / `exerciseErrors`. Fallback-кнопка → `/unit/${units[0].id}`. Любые ошибки из Unit 3/4 захватятся идентично. |
| 6  | `src/pages/Progress.jsx`               | ✅ ok | `courseProgress = average(computeUnitProgress(...) over units)`; `totalMedia = units.reduce(...)`; `units.map(unit => <UnitProgressCard>)`. Знаменатели и итерации — динамические. |
| 7  | `src/pages/TeacherDashboard.jsx`       | ✅ ok | `units.map(u => ...)` для unit-progress баров, `units.length` для знаменателя `Tests`, `UNIT_COLORS` циклирует по палитре. **Источник правды теперь `profiles.saved_progress`** — Teacher Dashboard вычисляет проценты в клиенте через `deriveProgress()` + `computeUnitProgress()` (та же функция, что у студента). Зависимости от устаревшей колонки `profiles.progress` и каких-либо триггеров больше нет. |
| 8  | `src/pages/EconomicWorld.jsx`          | ✅ ok | Не связан с системой юнитов — использует `src/data/economicWorldData.js`. Добавление юнитов не затрагивает страницу. |
| 9  | `src/pages/ListeningLab.jsx`           | ✅ ok | `units.find(u => u.id === selectedUnitId) || units[0]`; picker — `{units.map(u => ...)}`; клипы строятся из `unit.vocabulary[i].example`. Units 3/4 имеют examples → клипы будут. |
| 10 | `src/pages/TradeSimulator.jsx`         | ✅ ok | Не связан с системой юнитов. Встроенные `COUNTRIES`/`GOODS`. Добавление юнитов не требует правок. |
| 11 | `src/context/ProgressContext.jsx`      | ✅ ok | Все ключи (`completedSections[unitId]`, `totalTestScores[unitId]`, `scenarioScores[unitId]`, `crosswordScores[unitId]`) — динамические JSON-ключи по `unitId`. `computeUnitProgress(prog, unitId, unit)` чистая функция от данных юнита. Supabase `saved_progress` пишется как unit-agnostic JSON через `supabase.from('profiles').upsert(...)`. |
| 12 | `unit3.totalTest` / `unit4.totalTest`  | ✅ ok | Unit 3: 5 частей (match 12 + match 8 + trueFalse 6 + fillGap 10 + MC 5 ≈ **41 items**). Unit 4: 5 частей (match 12 + trueFalse 6 + fillGap 12 + conceptMatch 5 + MC 5 ≈ **40 items**). Оба ≫ 10. |

---

## Проверка регрессий

`Grep` по `src/` на паттерны хардкодов:

```
unit\.id === [12]\b | unitId === [12]\b | unit1\.|unit2\.
| \[1, 2\] | unit1Percent | unit2Percent
```

→ Совпадений в продуктовом коде нет (единственное упоминание `unit1Percent/unit2Percent` —
в комментарии-TODO в `TeacherDashboard.jsx` про Supabase-триггер). Все
остальные хиты (`step === 1`, `taskType === 2` и т.д.) к юнитам отношения не имеют.

---

## Что остаётся для сервера (вне зоны клиента)

См. отдельный документ `docs/supabase-setup-guide.md` — там пошаговые
инструкции для трёх оставшихся серверных задач:

1. **Auth → Redirect URLs** — для B2a (forgot-password)
2. **Secure email change** — для B3
3. **RLS-политика на `profiles.university_tracking`** — для B1

Эти три пункта не блокируют merge, но желательны до того, как пользователи
начнут активно пользоваться auth-flow.

---

## Готовность к merge

| Критерий | Статус |
|----------|--------|
| Все 12 пунктов чек-листа: критичных регрессий нет | ✅ |
| Хардкоды Units 1/2 в продуктовом коде | ✅ нет |
| Sidebar / Dashboard / Progress / Glossary / Review / Listening Lab для Units 3/4 | ✅ работают |
| TotalTest Units 3/4: ≥ 10 вопросов | ✅ ~40 each |
| Supabase `saved_progress` для Units 3/4 | ✅ unit-agnostic |
| Teacher Dashboard: проценты по всем юнитам | ✅ считаются на клиенте из `saved_progress` |
| Auth-flow Supabase Dashboard (URLs, RLS, secure email) | ⏳ см. `supabase-setup-guide.md` |

Ветка `feature/units-3-4` готова к merge в `main`. Студентский и учительский опыт полностью покрыты клиентским кодом — серверные TODO касаются только auth-безопасности и могут быть применены отдельно.
