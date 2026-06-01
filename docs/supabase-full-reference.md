# Supabase — полная справка по базе данных проекта Adaptation

Документ содержит **всё**, что нужно знать про backend курса: структуру
таблиц, триггеры, RLS-политики, файлы клиента, которые с ними работают,
а также скрипт «с нуля» для воссоздания базы и пошаговые инструкции по
изменениям.

---

## 1. Архитектура backend

| Слой | Где живёт | За что отвечает |
|------|-----------|-----------------|
| Auth | Supabase `auth.users` | Регистрация, вход, восстановление пароля, смена email |
| Profiles | `public.profiles` | Имя студента, email, флаг ФинУниверситета, прогресс в JSON |
| Триггер | `public.handle_new_user()` | При регистрации создаёт строку в `profiles` |
| RLS | политики на `public.profiles` | Регулирует чтение/запись по роли пользователя |
| Storage | не используется | Файлы (видео) лежат в репозитории под `public/` |

Клиентский код подключается к Supabase через единый экземпляр:

```
src/lib/supabaseClient.js
```

---

## 2. Схема таблицы `public.profiles`

```sql
CREATE TABLE public.profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  display_name        text,
  full_name           text,
  university_tracking boolean DEFAULT false,
  -- JSONB-структура прогресса. Записывается из ProgressContext
  -- (src/context/ProgressContext.jsx), читается Teacher Dashboard.
  saved_progress      jsonb DEFAULT '{}'::jsonb,
  -- Устаревшее агрегатное поле — оставлено для обратной совместимости,
  -- новый код его не использует.
  progress            jsonb DEFAULT '{}'::jsonb,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now()
);
```

### Структура `saved_progress`

JSON-объект со следующими полями (все необязательные, дефолт — пустая
структура соответствующего типа):

| Поле | Тип | Что хранит |
|------|-----|-----------|
| `learnedWords` | `string[]` | ID выученных слов, например `["u1_competition", "u3_currency"]` |
| `weakWords` | `string[]` | ID слабых слов |
| `weakWordsAddedAt` | `{[id]: ISOString}` | Когда слово отмечено как слабое |
| `completedExercises` | `string[]` | ID выполненных упражнений |
| `exerciseScores` | `{[id]: number}` | Последний % за упражнение |
| `exerciseBestScores` | `{[id]: number}` | Лучший % за упражнение |
| `exerciseAttempts` | `{[id]: number}` | Количество попыток |
| `completedSections` | `{[unitId]: {[sectionId]: true}}` | Пройденные секции по юнитам |
| `sectionScores` | `{[unitId]: {[sectionId]: number}}` | Per-section score 0–100 |
| `totalTestScores` | `{[unitId]: number}` | Итоговые тесты по юнитам |
| `completedMedia` | `string[]` | ID просмотренных видео |
| `mediaTaskScores` | `{[mediaId]: number}` | Post-quiz score после видео |
| `vocabRadar` | `{[key]: {[status]: true}}` | Vocabulary Radar (статусы слов) |
| `lastOpenedUnit` | `number \| null` | ID последнего открытого юнита |
| `lastOpenedSection` | `string \| null` | ID последней секции |
| `scenarioScores` | `{[unitId]: {score, result}}` | Scenario Loop |
| `crosswordScores` | `{[unitId]: object}` | Кроссворды |
| `mediaQuestScores` | `{[key]: number}` | Media Quest |
| `srsData` | `{[wordId]: SRSCard}` | Spaced repetition card data |

### Колонка `university_tracking`

Это **флаг ФинУниверситета**: студент при регистрации ставит галочку
«Я студент Финансового университета». Записывается клиентом в
`raw_user_meta_data` (см. триггер ниже), и триггер копирует значение
в эту колонку. Teacher Dashboard фильтрует студентов по этому полю —
показывает только тех, у кого `true`.

---

## 3. Триггер `handle_new_user`

При создании пользователя в `auth.users` (через `supabase.auth.signUp`)
триггер автоматически создаёт строку в `public.profiles`, копируя:

- `id` — UUID из `auth.users`
- `email` — email из `auth.users`
- `full_name` — из `raw_user_meta_data->>'full_name'` (передаётся при `signUp`)
- `university_tracking` — из `raw_user_meta_data->>'university_tracking'`

Триггер выполняется с правами `SECURITY DEFINER`, что позволяет ему
писать в `public.profiles` независимо от RLS-политик.

### SQL-код триггера

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, university_tracking, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    COALESCE((NEW.raw_user_meta_data->>'university_tracking')::boolean, false),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        university_tracking = EXCLUDED.university_tracking,
        updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Подключение триггера к auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Row-Level Security политики

### Политики на `public.profiles`

| Имя | Команда | Условие | Смысл |
|-----|---------|---------|-------|
| `Users can view own profile` | SELECT | `auth.uid() = id` | Студент видит свой профиль |
| `Teacher can view all tracked students` | SELECT | `auth.email() = 'emzakhtser@mail.ru' AND university_tracking = true` | Преподаватель видит студентов ФинУни |
| `Users can insert own profile` | INSERT | `auth.uid() = id` | Запасной insert (на случай если триггер не сработал) |
| `Users can update own profile (no tracking flag)` | UPDATE | `auth.uid() = id AND NOT (university_tracking IS DISTINCT FROM ...)` | Студент может править свой профиль, **но не** менять `university_tracking` |

### SQL-код политик

```sql
-- Включаем RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: студент видит свой профиль
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- SELECT: преподаватель видит всех студентов с флагом
CREATE POLICY "Teacher can view all tracked students"
ON public.profiles FOR SELECT TO authenticated
USING (
  auth.email() = 'emzakhtser@mail.ru'
  AND university_tracking = true
);

-- INSERT: студент может создать строку с собственным id (на всякий случай)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: студент может править свой профиль, кроме university_tracking
CREATE POLICY "Users can update own profile (no tracking flag)"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND university_tracking IS NOT DISTINCT FROM (
    SELECT university_tracking FROM public.profiles WHERE id = auth.uid()
  )
);
```

---

## 5. Файлы клиента, связанные с базой данных

| Файл | Что делает |
|------|-----------|
| `src/lib/supabaseClient.js` | Единственный экземпляр Supabase-клиента |
| `src/lib/AuthContext.jsx` | Управляет состоянием авторизации, `getSession()`, `onAuthStateChange` |
| `src/context/ProgressContext.jsx` | Пишет/читает `saved_progress`, синхронизирует с localStorage |
| `src/pages/LoginPage.jsx` | Регистрация, вход, forgot password — вызывает `supabase.auth.*` |
| `src/pages/UpdatePassword.jsx` | Страница смены пароля по ссылке из письма |
| `src/pages/Profile.jsx` | Профиль студента — смена пароля и email |
| `src/pages/TeacherDashboard.jsx` | Чтение `profiles` с фильтром `university_tracking=true` |

---

## 6. Скрипт «база с нуля» (полный install)

Если нужно поднять базу в новом проекте Supabase — выполни в SQL Editor
по порядку (или одним блоком):

```sql
-- ════════════════════════════════════════════════════════════════════════
-- 1. ТАБЛИЦА ПРОФИЛЕЙ
-- ════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  display_name        text,
  full_name           text,
  university_tracking boolean DEFAULT false,
  saved_progress      jsonb DEFAULT '{}'::jsonb,
  progress            jsonb DEFAULT '{}'::jsonb,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════════════
-- 2. ТРИГГЕР НА РЕГИСТРАЦИЮ
-- ════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, university_tracking, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    COALESCE((NEW.raw_user_meta_data->>'university_tracking')::boolean, false),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        university_tracking = EXCLUDED.university_tracking,
        updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════
-- 3. ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Чтение собственного профиля
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Чтение всех студентов ФинУни — только для преподавателя
DROP POLICY IF EXISTS "Teacher can view all tracked students" ON public.profiles;
CREATE POLICY "Teacher can view all tracked students"
ON public.profiles FOR SELECT TO authenticated
USING (
  auth.email() = 'emzakhtser@mail.ru'
  AND university_tracking = true
);

-- Insert для self (резерв)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Update своего профиля кроме university_tracking
DROP POLICY IF EXISTS "Users can update own profile (no tracking flag)" ON public.profiles;
CREATE POLICY "Users can update own profile (no tracking flag)"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND university_tracking IS NOT DISTINCT FROM (
    SELECT university_tracking FROM public.profiles WHERE id = auth.uid()
  )
);

-- ════════════════════════════════════════════════════════════════════════
-- 4. AUTH SETTINGS (выполняется через Dashboard UI, не SQL)
-- ════════════════════════════════════════════════════════════════════════
-- Authentication → URL Configuration:
--   Site URL: https://adaptation-fa.ru
--   Redirect URLs:
--     https://adaptation-fa.ru/**
--     https://www.adaptation-fa.ru/**
--     https://adaptation-fa.ru/update-password
--     https://www.adaptation-fa.ru/update-password
--     http://localhost:5173/**
--     http://localhost:5173/update-password
--
-- Authentication → Providers → Email:
--   Secure email change = ON
--   Confirm email = ON
```

---

## 7. Типичные операции — рецепты

### Поднять флаг ФинУни студенту вручную

```sql
UPDATE public.profiles
SET university_tracking = true
WHERE email = 'student@example.com';
```

Или массово для всех с почтой `@fa.ru`:

```sql
UPDATE public.profiles
SET university_tracking = true
WHERE email LIKE '%@fa.ru';
```

### Посмотреть прогресс конкретного студента

```sql
SELECT
  email,
  saved_progress->'completedExercises' AS exercises,
  saved_progress->'totalTestScores'    AS tests,
  saved_progress->'completedMedia'     AS videos,
  saved_progress->'completedSections'  AS sections,
  saved_progress->'learnedWords'       AS words,
  updated_at
FROM public.profiles
WHERE email = 'student@example.com';
```

### Обнулить прогресс студенту (например для повторного прохождения)

```sql
UPDATE public.profiles
SET saved_progress = '{}'::jsonb
WHERE email = 'student@example.com';
```

### Список всех студентов с количеством упражнений / тестов

```sql
SELECT
  email,
  university_tracking,
  jsonb_array_length(COALESCE(saved_progress->'completedExercises', '[]'::jsonb)) AS exercises,
  jsonb_array_length(COALESCE(saved_progress->'completedMedia', '[]'::jsonb))    AS videos,
  (SELECT count(*) FROM jsonb_object_keys(COALESCE(saved_progress->'totalTestScores','{}'::jsonb))) AS tests,
  updated_at
FROM public.profiles
WHERE email != 'emzakhtser@mail.ru'
ORDER BY updated_at DESC NULLS LAST;
```

### Сменить teacher email (если будет новый преподаватель)

1. Заменить константу `TEACHER_EMAIL` в файлах:
   - `src/pages/TeacherDashboard.jsx`
   - `src/pages/Dashboard.jsx`
   - `src/components/Layout.jsx`
   - `src/context/ProgressContext.jsx`
2. Обновить RLS-политику:
```sql
DROP POLICY "Teacher can view all tracked students" ON public.profiles;
CREATE POLICY "Teacher can view all tracked students"
ON public.profiles FOR SELECT TO authenticated
USING (
  auth.email() = 'new_teacher@example.com'
  AND university_tracking = true
);
```

### Диагностика: «почему студент не видит мой прогресс»

```sql
-- Сверить что у студента есть строка в profiles
SELECT * FROM public.profiles WHERE email = 'student@example.com';

-- Если строки нет — проверить триггер
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';

-- Если триггера нет — пересоздать (см. раздел 3)

-- Если строка есть, но пустая (saved_progress = {}) — студент не работал
```

---

## 8. История изменений базы данных

| Дата | Что изменилось | Зачем |
|------|---------------|-------|
| Старт | Создана таблица `profiles` + триггер | Минимальная структура для регистрации |
| Mid-period | Колонка `progress` (агрегат) | Использовалась старым Teacher Dashboard, сейчас deprecated |
| 2026-05 | Колонка `saved_progress` (JSONB) | Новый формат — единый источник правды клиента |
| 2026-05 | Политика «no tracking flag» | Защита от клиентского изменения `university_tracking` через DevTools |
| 2026-05 | Триггер расширен на `full_name` + `university_tracking` | Раньше не записывал эти поля → имя и галочка не сохранялись |

---

## 9. Что НЕ делать

- ❌ **Не использовать** колонку `progress` для новых фич — она устарела
- ❌ **Не давать** клиенту прямой UPDATE на `university_tracking` — RLS заблокирует, но и логика клиента не должна это пытаться
- ❌ **Не хранить** видео в Supabase Storage сейчас — раздаются как статика через Vercel
- ❌ **Не отключать** RLS — даже для отладки. Если нужно изменить как админ, используй SQL Editor (он работает как `postgres` role и обходит RLS)
- ❌ **Не удалять** триггер `handle_new_user` — без него регистрация не создаст запись в `profiles`
