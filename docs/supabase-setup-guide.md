# Adaptation — Supabase: полное руководство по настройке и сопровождению

Документ описывает всё, что нужно сделать на стороне Supabase, чтобы приложение Adaptation работало корректно в продуктивной среде. Гайд написан в расчёте на читателя, который не знаком с Supabase и впервые открывает консоль управления.

Все шаги проверены на актуальной редакции Supabase Studio (май 2026 года). Если интерфейс изменится, ориентируйтесь на названия разделов и команд — они приведены полностью.

---

## Оглавление

1. Введение и предварительные требования
2. Доступ в консоль управления Supabase
3. Архитектура данных приложения
4. Схема базы данных и обязательные таблицы
5. Триггер handle_new_user (создание профиля при регистрации)
6. Политики Row-Level Security (RLS) для таблицы profiles
7. Конфигурация Authentication: Site URL и Redirect URLs
8. Конфигурация Authentication: подтверждение смены email
9. Учётная запись преподавателя и переход в Teacher Dashboard
10. Проверочные SQL-запросы
11. Типовые проблемы и их устранение
12. Сценарии массовых операций
13. Итоговый чек-лист готовности

---

## 1. Введение и предварительные требования

Приложение Adaptation (адрес `https://adaptation-fa.online` или альтернативный домен) использует Supabase как единый бекенд: аутентификация пользователей, хранение профилей и прогресса обучения. Никаких других серверов или баз данных в проекте нет.

Для всех описанных ниже операций требуется:

- Учётная запись владельца проекта Supabase. Логин и пароль находятся у разработчика проекта.
- Браузер с поддержкой современных стандартов (Chrome, Edge, Firefox, Yandex Browser последних версий).
- Стабильное интернет-соединение.

Никакого специального программного обеспечения устанавливать не нужно. Все действия выполняются через веб-интерфейс Supabase Studio.

---

## 2. Доступ в консоль управления Supabase

### 2.1. Вход

1. Откройте в браузере адрес `https://supabase.com`.
2. В правом верхнем углу нажмите кнопку «Sign in».
3. Введите учётные данные владельца проекта Supabase (адрес электронной почты и пароль).
4. После успешного входа отобразится список проектов организации.

### 2.2. Открытие нужного проекта

1. В списке проектов найдите проект, относящийся к Adaptation. Имя организации — `flos9r's Org`, имя проекта — `flos9r's Project`. Идентификатор проекта: `zxuyohjyuahwfobsdlhx`.
2. Нажмите на карточку проекта. Откроется страница «Project Overview» (общая сводка проекта).

### 2.3. Ориентация по интерфейсу

Слева расположена вертикальная панель навигации с пиктограммами разделов. Далее в документе используются следующие обозначения:

| Раздел | Что отвечает |
|--------|--------------|
| Project Overview | Общая статистика проекта |
| Table Editor | Просмотр и редактирование строк таблиц |
| SQL Editor | Выполнение произвольных SQL-запросов |
| Database | Управление схемой, функциями, триггерами, политиками |
| Authentication | Управление пользователями, провайдерами, URL-конфигурацией |
| Storage | Объектное хранилище файлов (в проекте не используется) |
| Edge Functions | Серверные функции на Deno (в проекте не используется) |

В дальнейшем фраза вида «Authentication → URL Configuration» означает: в левой панели выбрать раздел Authentication, затем в его подменю выбрать пункт URL Configuration.

---

## 3. Архитектура данных приложения

Прежде чем приступать к настройке, важно понимать, как клиент взаимодействует с базой данных. Это убережёт от неправильных правок.

### 3.1. Поток регистрации нового пользователя

1. Пользователь открывает страницу регистрации и заполняет форму: адрес электронной почты, пароль, полное имя (необязательно), флажок «Я студент Финансового университета».
2. Клиент вызывает метод `supabase.auth.signUp(email, password, { data: { full_name, university_tracking } })`.
3. Supabase Auth создаёт запись в служебной таблице `auth.users`. Поля `full_name` и `university_tracking` попадают в JSONB-колонку `raw_user_meta_data`.
4. На таблице `auth.users` срабатывает триггер `on_auth_user_created`, который вызывает функцию `public.handle_new_user`. Эта функция создаёт строку в `public.profiles`, копируя адрес электронной почты и извлекая `full_name` и `university_tracking` из метаданных.
5. Если в проекте включено подтверждение email, на указанный адрес отправляется письмо со ссылкой. До нажатия на ссылку пользователь считается не подтверждённым и не может войти.
6. После подтверждения пользователь возвращается на сайт и входит обычным способом.

### 3.2. Поток сохранения прогресса

1. По мере прохождения курса клиент изменяет локальную копию объекта прогресса (массивы выполненных упражнений, оценки тестов, секции и т. д.).
2. С интервалом примерно две секунды клиент отправляет полный снимок прогресса в Supabase с помощью операции `upsert` на таблице `profiles`, заполняя колонку `saved_progress`.
3. При следующем входе пользователя клиент читает колонку `saved_progress` и объединяет (`mergeUnion`) её содержимое с локальной копией, чтобы не потерять прогресс ни на одном устройстве.

### 3.3. Поток отображения данных у преподавателя

1. Преподаватель входит под зарегистрированной учётной записью с адресом `emzakhtser@mail.ru` (адрес жёстко прописан в коде).
2. Клиент определяет роль по совпадению адреса и автоматически перенаправляет преподавателя на маршрут `/teacher`.
3. На странице Teacher Dashboard клиент выполняет запрос `select id, email, display_name, full_name, university_tracking, saved_progress, updated_at from profiles where university_tracking = true`.
4. Из колонки `saved_progress` клиент вычисляет все метрики: процент по юнитам, средний балл по тестам, выполненные секции, выученные слова и так далее. На стороне базы ничего не агрегируется.

---

## 4. Схема базы данных и обязательные таблицы

Все таблицы располагаются в схеме `public`. Служебные таблицы Supabase (`auth.users`, `auth.identities` и др.) трогать запрещено.

### 4.1. Таблица public.profiles

Это центральная таблица проекта. Каждая её строка соответствует одному пользователю системы и хранит как метаданные, так и весь прогресс обучения.

Минимально необходимая структура колонок:

| Колонка | Тип | Назначение |
|---------|-----|------------|
| id | uuid (PRIMARY KEY) | Идентификатор. Должен совпадать с `auth.users.id`. |
| email | text | Адрес электронной почты. Дублирует `auth.users.email`. |
| full_name | text | Полное имя пользователя. Может быть NULL. |
| display_name | text | Опциональное отображаемое имя. Может быть NULL. |
| university_tracking | boolean | Признак «студент Финансового университета». Управляет фильтрацией в Teacher Dashboard. |
| saved_progress | jsonb | Полный снимок прогресса обучения. Содержит до 15 вложенных полей. |
| progress | jsonb | Устаревшее поле. В новой архитектуре не используется, можно оставить пустым. |
| updated_at | timestamptz | Время последнего обновления. Используется как «last active». |
| created_at | timestamptz | Время создания записи. |

#### 4.1.1. SQL для создания таблицы с нуля

Если таблица отсутствует, выполните следующий блок в SQL Editor. Если таблица уже существует, переходите к проверке наличия колонок (раздел 4.1.2).

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  display_name text,
  university_tracking boolean DEFAULT false,
  saved_progress jsonb DEFAULT '{}'::jsonb,
  progress jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

#### 4.1.2. Проверка наличия колонок

Выполните в SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;
```

В результате должны быть строки с указанными выше именами. Если какой-либо колонки нет, добавьте её одной из команд:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university_tracking boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS saved_progress jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
```

### 4.2. Структура saved_progress

Колонка `saved_progress` имеет тип JSONB и содержит вложенный объект со следующими ключами. Их формат знать необязательно, но он пригодится при отладке.

```
saved_progress = {
  "learnedWords":           ["u1_competition", "u3_currency", ...],
  "weakWords":              ["u1_monopoly", ...],
  "weakWordsAddedAt":       { "u1_monopoly": "2026-05-31T12:00:00Z" },
  "completedExercises":     ["u1_match_market_types", ...],
  "exerciseScores":         { "u1_match_market_types": 85, ... },
  "exerciseBestScores":     { "u1_match_market_types": 90, ... },
  "exerciseAttempts":       { "u1_match_market_types": 3, ... },
  "completedSections":      { "1": { "media": true, "reading": true }, ... },
  "sectionScores":          { "3": { "balancesheet": 80, "loansim": 100 } },
  "totalTestScores":        { "1": 75, "2": 80 },
  "completedMedia":         ["u1_media_markets_intro", ...],
  "mediaTaskScores":        { "u1_media_markets_intro": 90, ... },
  "vocabRadar":             { "u1_u1_competition": { "understand": true, ... } },
  "lastOpenedUnit":         3,
  "lastOpenedSection":      "moneycompass",
  "scenarioScores":         { "1": { "score": 70, "result": "good" } },
  "crosswordScores":        { "1": { "solved": 12, "total": 12 } },
  "mediaQuestScores":       { "u1_quest_0": 85 },
  "srsData":                { "u1_competition": { "interval": 7, ... } }
}
```

---

## 5. Триггер handle_new_user

Триггер создаёт строку в `public.profiles` сразу после регистрации пользователя в `auth.users` и переносит метаданные из `raw_user_meta_data`.

### 5.1. Полный SQL для создания или обновления

Откройте SQL Editor и выполните следующий блок целиком.

```sql
-- Шаг 1. Удалить старую версию триггера и функции, если они существуют
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Шаг 2. Создать функцию заново
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, university_tracking, updated_at, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    COALESCE((NEW.raw_user_meta_data->>'university_tracking')::boolean, false),
    NOW(),
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

-- Шаг 3. Привязать функцию к таблице auth.users как триггер
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 5.2. Объяснение

- `SECURITY DEFINER` означает, что функция выполняется с правами своего владельца (postgres), а не с правами пользователя, который вызвал триггер. Это нужно, чтобы триггер мог записывать в `public.profiles` в обход политик Row-Level Security.
- `SET search_path = public` фиксирует пространство имён и защищает функцию от подмены.
- `NULLIF(TRIM(...), '')` приводит пустые строки к NULL, чтобы не засорять колонку `full_name` пустыми значениями.
- `COALESCE((... ->> 'university_tracking')::boolean, false)` приводит признак к булеву типу и подставляет false, если значение отсутствует.
- `ON CONFLICT (id) DO UPDATE` делает операцию идемпотентной: повторный запуск триггера на существующей строке аккуратно обновит данные, но не дублирует запись.

### 5.3. Проверка

```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';
```

В выводе должен быть полный исходный текст функции, идентичный тому, который указан выше. Если функция отсутствует, повторите шаг 5.1.

```sql
SELECT tgname, tgenabled, tgfoid::regprocedure
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Триггер должен присутствовать и иметь признак `tgenabled = 'O'` (включён).

---

## 6. Политики Row-Level Security для таблицы profiles

Row-Level Security (RLS) — это правила доступа к строкам, которые проверяются на стороне базы данных и не могут быть обойдены клиентом.

В таблице `profiles` должны действовать четыре политики:

1. SELECT для владельца строки. Пользователь видит свой профиль.
2. INSERT для владельца строки. Используется триггером.
3. UPDATE для владельца строки. Пользователь может менять свой профиль, но не флаг `university_tracking`.
4. SELECT для преподавателя. Преподаватель видит профили всех студентов с `university_tracking = true`.

### 6.1. Полный SQL для создания политик

Перед выполнением убедитесь, что Row-Level Security включена на таблице:

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

Затем удалите старые версии политик и создайте новые. Подставьте в `TEACHER_EMAIL` фактический адрес преподавателя.

```sql
-- Удалить старые политики, если они существуют
DROP POLICY IF EXISTS "Users can view own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile (no tracking flag)" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile_no_tracking" ON public.profiles;
DROP POLICY IF EXISTS "Teacher can view all tracked students" ON public.profiles;

-- Политика 1. Пользователь видит свой профиль
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Политика 2. Пользователь создаёт свой профиль (на случай ручной вставки;
-- штатно создание идёт через триггер handle_new_user)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Политика 3. Пользователь обновляет свой профиль, но не может менять
-- колонку university_tracking. Сравнение через IS NOT DISTINCT FROM
-- корректно работает с NULL.
CREATE POLICY "Users can update own profile (no tracking flag)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND university_tracking IS NOT DISTINCT FROM (
    SELECT university_tracking FROM public.profiles WHERE id = auth.uid()
  )
);

-- Политика 4. Преподаватель видит всех отслеживаемых студентов
CREATE POLICY "Teacher can view all tracked students"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  university_tracking = true
  AND auth.jwt() ->> 'email' = 'emzakhtser@mail.ru'
);
```

### 6.2. Проверка

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;
```

В результате должно быть ровно четыре строки с именами политик из блока выше. Колонки `qual` и `with_check` содержат тексты условий — они должны соответствовать тому, что указано в SQL.

### 6.3. Что делает каждая политика на практике

- Политика 1 разрешает клиенту получить данные ровно одной строки — своей. Запрос `select * from profiles where id = auth.uid()` сработает; запрос всех строк вернёт только одну.
- Политика 2 разрешает создать строку, у которой `id` совпадает с идентификатором текущей сессии. Триггер `handle_new_user` обходит политику благодаря `SECURITY DEFINER`, но политика всё равно нужна на случай ручных операций.
- Политика 3 ключевая для защиты `university_tracking`. Запрос `update profiles set university_tracking = true` от обычного пользователя завершится ошибкой `new row violates row-level security policy`, поскольку новое значение не совпадёт с текущим.
- Политика 4 даёт преподавателю расширенные права на чтение. Используется в Teacher Dashboard для загрузки списка студентов. Решение через сравнение `auth.jwt() ->> 'email'` корректно для одного фиксированного преподавателя; если преподавателей будет несколько, понадобится отдельная таблица ролей.

---

## 7. Конфигурация Authentication: Site URL и Redirect URLs

Эти настройки определяют, на какие адреса Supabase может перенаправлять пользователя после прохождения по ссылкам из электронных писем (подтверждение регистрации, восстановление пароля и т. д.).

### 7.1. Путь в интерфейсе

1. В левой панели выберите Authentication.
2. В подменю выберите URL Configuration.

### 7.2. Site URL

В поле «Site URL» введите основной адрес продуктивной версии:

```
https://adaptation-fa.online
```

Адрес должен начинаться с `https://`, не оканчиваться косой чертой и не содержать поддомен `www`. Нажмите Save в нижней части блока.

### 7.3. Redirect URLs

Список разрешённых адресов перенаправления. Введите по одному адресу в каждую строку, используя кнопку «Add URL» (или «+»).

Полный список адресов, которые должны быть добавлены:

```
https://adaptation-fa.online/**
https://adaptation-fa.online/update-password
https://www.adaptation-fa.online/**
https://www.adaptation-fa.online/update-password
http://localhost:5173/**
http://localhost:5173/update-password
```

Если используется альтернативный домен `adaptation-fa.ru`, добавьте также его варианты по той же схеме.

Шаблон `/**` означает «любой путь под этим доменом». Дополнительные строки с конкретным путём `/update-password` указаны для совместимости со старыми клиентами, которые не поддерживают шаблоны.

После добавления всех адресов нажмите Save.

### 7.4. Проверка

1. Откройте страницу `/login` в режиме инкогнито.
2. Нажмите ссылку «Forgot password?».
3. Введите адрес существующего пользователя и нажмите «Send reset link».
4. Откройте полученное письмо и нажмите на ссылку.
5. Должна открыться страница `/update-password` с формой ввода нового пароля. Если открывается страница с сообщением об ошибке `redirect_to_url_not_allowed` или происходит перенаправление на главную, значит один из адресов в списке Redirect URLs указан некорректно. Сравните их с приведённым выше списком.

---

## 8. Конфигурация Authentication: подтверждение смены email

По умолчанию Supabase отправляет письмо с подтверждением только на новый адрес. Это создаёт уязвимость: при компрометации сессии злоумышленник может тихо сменить email и заблокировать настоящего владельца.

Решение — включить опцию «Secure email change», которая требует подтверждения с обоих ящиков (старого и нового).

### 8.1. Путь в интерфейсе

В зависимости от версии Supabase Studio опция может находиться в одном из трёх мест. Попробуйте по порядку:

- Authentication → Sign In / Up → Email (карточка провайдера).
- Authentication → Settings → Email.
- Project Settings (шестерёнка внизу) → Auth → Email.

### 8.2. Что искать

Переключатель с одним из названий:

- Secure email change.
- Confirm email change.
- Require email confirmation on update.
- Double confirm changes.

Под названием обычно подписано пояснение «Users will be required to confirm any email change on both the old email address and new email address».

Переведите переключатель в положение ON. Внизу страницы нажмите Save.

### 8.3. Проверка

1. Войдите под существующим пользователем.
2. Перейдите на страницу `/profile`.
3. В блоке смены email укажите новый адрес и текущий пароль.
4. Откройте оба почтовых ящика — старый и новый.
5. На каждый должно прийти отдельное письмо с просьбой подтвердить изменение.
6. Только после перехода по обеим ссылкам email вступает в силу.

Если письмо приходит только на новый адрес, значит переключатель не сохранился. Вернитесь на шаг 8.1 и повторите.

---

## 9. Учётная запись преподавателя и переход в Teacher Dashboard

В коде клиента жёстко прописан адрес преподавателя: `emzakhtser@mail.ru`. Никакая дополнительная роль или флаг в базе данных не требуются — достаточно того, чтобы пользователь с этим адресом был зарегистрирован.

### 9.1. Первоначальная регистрация преподавателя

1. Преподаватель открывает страницу `/login`, переключается в режим «Create your account» и регистрируется на адрес `emzakhtser@mail.ru`.
2. На указанный адрес поступает письмо с подтверждением — необходимо перейти по ссылке.
3. После подтверждения преподаватель повторно открывает страницу `/login` и входит обычным способом.

### 9.2. Переход в Teacher Dashboard

Сразу после входа клиент определяет, что текущий пользователь — преподаватель, и автоматически перенаправляет его на `/teacher`. Дополнительно ссылка на Teacher Dashboard видна в боковой панели.

### 9.3. Что отображается на Teacher Dashboard

- Карточки сводки: «Tracked students», «Avg. progress», «With test scores».
- Список карточек студентов с базовой информацией (имя, email, общий процент, прогресс по юнитам).
- При нажатии на карточку открывается детальный профиль студента с метриками, таблицами Exercise Performance, Total Test Scores, Media Performance, Section Activity и Vocabulary Status.

### 9.4. Условия попадания студента в список

Студент попадает в Teacher Dashboard, если выполнены все три условия:

- Запись в `auth.users` с подтверждённым email.
- Запись в `public.profiles` со значением `university_tracking = true`.
- Соблюдены политики RLS, описанные в разделе 6 (преподаватель должен иметь право чтения чужих профилей).

Если хотя бы одно условие не выполняется, студент не появится в списке.

---

## 10. Проверочные SQL-запросы

Все запросы выполняются в SQL Editor.

### 10.1. Список зарегистрированных пользователей

```sql
SELECT
  id,
  email,
  display_name,
  full_name,
  university_tracking,
  CASE
    WHEN saved_progress IS NULL OR saved_progress = '{}'::jsonb THEN 'EMPTY'
    ELSE 'HAS DATA'
  END AS progress_state,
  updated_at
FROM public.profiles
WHERE email != 'emzakhtser@mail.ru'
ORDER BY updated_at DESC NULLS LAST;
```

Ожидаемый результат: одна строка на каждого зарегистрированного студента. Колонка `university_tracking` показывает, попадает ли студент в Teacher Dashboard.

### 10.2. Детальный прогресс конкретного студента

```sql
SELECT
  email,
  saved_progress->'totalTestScores'         AS test_scores,
  saved_progress->'completedExercises'      AS exercises,
  saved_progress->'exerciseBestScores'      AS exercise_best_scores,
  saved_progress->'completedMedia'          AS media,
  saved_progress->'mediaTaskScores'         AS media_quiz_scores,
  saved_progress->'completedSections'       AS sections,
  saved_progress->'sectionScores'           AS section_scores,
  saved_progress->'scenarioScores'          AS scenarios,
  saved_progress->'crosswordScores'         AS crosswords,
  saved_progress->'learnedWords'            AS learned,
  saved_progress->'weakWords'               AS weak,
  saved_progress->>'lastOpenedUnit'         AS last_unit,
  saved_progress->>'lastOpenedSection'      AS last_section,
  updated_at
FROM public.profiles
WHERE email = 'student@example.com';
```

Замените `student@example.com` на фактический адрес студента.

### 10.3. Свод по юнитам для одного студента

Запрос вычисляет приближённый процент по каждому юниту по той же логике, что и приложение.

```sql
WITH base AS (
  SELECT
    email,
    COALESCE(saved_progress, '{}'::jsonb) AS sp
  FROM public.profiles
  WHERE email = 'student@example.com'
),
counts AS (
  SELECT
    email,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedExercises') x WHERE x LIKE 'u1_%') AS u1_ex,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedExercises') x WHERE x LIKE 'u2_%') AS u2_ex,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedExercises') x WHERE x LIKE 'u3_%') AS u3_ex,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedExercises') x WHERE x LIKE 'u4_%') AS u4_ex,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedMedia') m WHERE m LIKE 'u1_%') AS u1_m,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedMedia') m WHERE m LIKE 'u2_%') AS u2_m,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedMedia') m WHERE m LIKE 'u3_%') AS u3_m,
    (SELECT count(*) FROM jsonb_array_elements_text(sp->'completedMedia') m WHERE m LIKE 'u4_%') AS u4_m,
    CASE WHEN sp->'totalTestScores'->'1' IS NOT NULL THEN 1 ELSE 0 END AS u1_t,
    CASE WHEN sp->'totalTestScores'->'2' IS NOT NULL THEN 1 ELSE 0 END AS u2_t,
    CASE WHEN sp->'totalTestScores'->'3' IS NOT NULL THEN 1 ELSE 0 END AS u3_t,
    CASE WHEN sp->'totalTestScores'->'4' IS NOT NULL THEN 1 ELSE 0 END AS u4_t,
    (SELECT count(*) FROM jsonb_object_keys(COALESCE(sp->'completedSections'->'1','{}'::jsonb))) AS u1_s,
    (SELECT count(*) FROM jsonb_object_keys(COALESCE(sp->'completedSections'->'2','{}'::jsonb))) AS u2_s,
    (SELECT count(*) FROM jsonb_object_keys(COALESCE(sp->'completedSections'->'3','{}'::jsonb))) AS u3_s,
    (SELECT count(*) FROM jsonb_object_keys(COALESCE(sp->'completedSections'->'4','{}'::jsonb))) AS u4_s,
    sp
  FROM base
)
SELECT
  email,
  LEAST(100, ROUND((u1_ex + u1_m + u1_t * 3 + u1_s)::numeric / 25 * 100))::int AS unit_1_pct,
  LEAST(100, ROUND((u2_ex + u2_m + u2_t * 3 + u2_s)::numeric / 26 * 100))::int AS unit_2_pct,
  LEAST(100, ROUND((u3_ex + u3_m + u3_t * 3 + u3_s)::numeric / 27 * 100))::int AS unit_3_pct,
  LEAST(100, ROUND((u4_ex + u4_m + u4_t * 3 + u4_s)::numeric / 29 * 100))::int AS unit_4_pct,
  sp->'totalTestScores' AS test_scores_raw
FROM counts;
```

Числа 25, 26, 27, 29 — приближённое количество слотов прогресса в каждом юните. В клиенте используются точные значения, поэтому SQL-результат может отличаться от UI на ±5 процентных пунктов.

### 10.4. Проверка политик RLS

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;
```

Должно быть четыре политики из раздела 6.

### 10.5. Проверка триггера

```sql
SELECT
  tgname,
  tgenabled,
  tgrelid::regclass AS table_name,
  tgfoid::regprocedure AS function_name
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Должна вернуться одна строка с `tgenabled = 'O'` и `table_name = auth.users`.

---

## 11. Типовые проблемы и их устранение

### 11.1. Преподаватель не видит ни одного студента

Возможные причины:

- В базе нет ни одного пользователя с `university_tracking = true`. Проверьте запросом 10.1.
- Политика 4 (`Teacher can view all tracked students`) не создана или содержит другой email. Проверьте запросом 10.4.
- Преподаватель вошёл не под тем адресом. Сравните адрес сессии с константой `TEACHER_EMAIL` в коде (`emzakhtser@mail.ru`).
- В клиенте кэшируются устаревшие данные. Закройте все вкладки сайта, очистите cookies для домена, войдите заново.

### 11.2. У преподавателя видны студенты, но прогресс пустой

Возможные причины:

- Студент действительно ничего ещё не делал. Проверьте запросом 10.2.
- Студент работал до того, как в проект был добавлен механизм сохранения. Прогресс хранится в локальном хранилище браузера и пока не синхронизирован с базой. При следующем входе студента сработает синхронизация.
- В клиенте отключено сохранение по сети из-за блокировки рекламы или расширений. Попросите студента отключить расширения и проверить вкладку Network в инструментах разработчика.

### 11.3. Студент поставил галочку «Я студент ФинУна», но в Teacher Dashboard его нет

Причина: триггер `handle_new_user` не успел отработать или работал со старой версией, которая не читала `university_tracking`.

Решение:

- Подтянуть значения из метаданных вручную одним запросом:

```sql
UPDATE public.profiles p
SET
  full_name = COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''), p.full_name),
  university_tracking = COALESCE(
    (u.raw_user_meta_data->>'university_tracking')::boolean,
    p.university_tracking,
    false
  ),
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id;
```

После этого запись будет содержать корректное значение, и студент появится в Teacher Dashboard.

### 11.4. При попытке смены пароля приходит ошибка «redirect_to_url_not_allowed»

Причина: адрес `/update-password` не добавлен в Redirect URLs. См. раздел 7.

### 11.5. Студент сообщает, что данные пропали при входе на другом устройстве

Причина: синхронизация прогресса работает только в момент, когда студент авторизован. Если на одном устройстве выйти не успел, изменения остаются локально. Откройте сайт под этим устройством, дождитесь автосинхронизации (около двух секунд после первого действия) — данные подтянутся в базу.

### 11.6. SQL Editor возвращает permission denied

Причина: в правом верхнем углу SQL Editor выбрана роль `anon` или `authenticated`. Переключите на роль `postgres` через выпадающий список «Role».

### 11.7. После создания политики весь UI «сломался»

Если применённая политика блокирует чтение собственного профиля, клиент не может выполнить базовую загрузку. Откатите изменения временной разрешительной политикой:

```sql
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile (no tracking flag)" ON public.profiles;

CREATE POLICY "Temp read all"
ON public.profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

Затем верните корректные политики из раздела 6 и удалите временную:

```sql
DROP POLICY "Temp read all" ON public.profiles;
```

---

## 12. Сценарии массовых операций

### 12.1. Сделать конкретных студентов отслеживаемыми

```sql
UPDATE public.profiles
SET university_tracking = true, updated_at = NOW()
WHERE email IN (
  'student1@example.com',
  'student2@example.com',
  'student3@example.com'
);
```

### 12.2. Сделать всех студентов с почтой в домене Финансового университета отслеживаемыми

```sql
UPDATE public.profiles
SET university_tracking = true, updated_at = NOW()
WHERE email ILIKE '%@fa.ru'
   OR email ILIKE '%@edu.fa.ru';
```

### 12.3. Удалить тестовые учётные записи

```sql
-- Сначала найдите ID
SELECT id, email FROM public.profiles WHERE email LIKE '%test%';

-- Затем удалите из auth.users — каскадно удалятся и записи из profiles
DELETE FROM auth.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);
```

Подставьте фактические идентификаторы.

### 12.4. Сбросить прогресс конкретного студента

```sql
UPDATE public.profiles
SET saved_progress = '{}'::jsonb, updated_at = NOW()
WHERE email = 'student@example.com';
```

### 12.5. Экспорт списка студентов в CSV

В SQL Editor выполните запрос 10.1. После получения результатов нажмите кнопку Export (или Download CSV) в правой части панели результатов.

---

## 13. Итоговый чек-лист готовности

Документ считается выполненным, когда выполнены все пункты.

- [ ] Открыт нужный проект в Supabase Studio (раздел 2).
- [ ] Таблица `public.profiles` существует и содержит все необходимые колонки (раздел 4).
- [ ] Row-Level Security включена на таблице (раздел 4.1.1).
- [ ] Функция `public.handle_new_user` создана и совпадает с эталонной версией (раздел 5).
- [ ] Триггер `on_auth_user_created` существует и включён (раздел 5.3).
- [ ] Четыре политики RLS на `public.profiles` созданы (раздел 6).
- [ ] В Authentication → URL Configuration задан Site URL и шесть Redirect URLs (раздел 7).
- [ ] Тест восстановления пароля пройден успешно (раздел 7.4).
- [ ] Переключатель Secure email change включён (раздел 8).
- [ ] Тест смены email подтверждает отправку писем на оба адреса (раздел 8.3).
- [ ] Преподавательский аккаунт `emzakhtser@mail.ru` зарегистрирован и подтверждён (раздел 9.1).
- [ ] При входе под этим адресом происходит автопереход на `/teacher` (раздел 9.2).
- [ ] В Teacher Dashboard виден список студентов с `university_tracking = true` (раздел 9.4).
- [ ] Если у студента есть прогресс, при клике на его карточку отображаются все блоки: метрики, Exercise Performance, Total Test Scores, Media Performance, Section Activity, Other Tasks, Vocabulary Status (раздел 9.3).

После выполнения всех пунктов система считается полностью настроенной для продуктивной эксплуатации.
