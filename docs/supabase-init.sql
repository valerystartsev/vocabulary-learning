-- ============================================================================
-- Adaptation — полный SQL-инициализатор Supabase
-- ----------------------------------------------------------------------------
-- Скрипт выполняется один раз в SQL Editor. Создаёт таблицу profiles,
-- триггер handle_new_user, четыре политики Row-Level Security и
-- подтягивает метаданные ранее зарегистрированных пользователей.
--
-- Скрипт идемпотентен: повторный запуск не сломает существующие объекты.
-- Перед использованием подставьте фактический адрес преподавателя в
-- TEACHER_EMAIL (раздел 4).
-- ============================================================================


-- 1. Таблица profiles
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  full_name           text,
  display_name        text,
  university_tracking boolean DEFAULT false,
  saved_progress      jsonb   DEFAULT '{}'::jsonb,
  progress            jsonb   DEFAULT '{}'::jsonb,
  updated_at          timestamptz DEFAULT now(),
  created_at          timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name           text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name        text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university_tracking boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS saved_progress      jsonb   DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS progress            jsonb   DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at          timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at          timestamptz DEFAULT now();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- 2. Триггер handle_new_user
-- ----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- 3. Политики Row-Level Security
-- ----------------------------------------------------------------------------

-- Удалить старые имена, которые могли остаться от предыдущих миграций
DROP POLICY IF EXISTS "Users can view own profile"                          ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"                        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"                        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile (no tracking flag)"     ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile_no_tracking"                ON public.profiles;
DROP POLICY IF EXISTS "Teacher can view all tracked students"               ON public.profiles;

-- 3.1. SELECT для владельца строки
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 3.2. INSERT для владельца строки (на случай ручной вставки)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3.3. UPDATE для владельца — запрещено менять university_tracking
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


-- 4. Политика для преподавателя
-- ----------------------------------------------------------------------------
-- Подставьте фактический адрес преподавателя ниже. По умолчанию: emzakhtser@mail.ru

CREATE POLICY "Teacher can view all tracked students"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  university_tracking = true
  AND auth.jwt() ->> 'email' = 'emzakhtser@mail.ru'
);


-- 5. Подтянуть метаданные у ранее зарегистрированных пользователей
-- ----------------------------------------------------------------------------

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


-- 6. Проверочный SELECT
-- ----------------------------------------------------------------------------

-- Выполните этот запрос вручную после скрипта, чтобы убедиться, что всё на месте.
-- SELECT id, email, full_name, university_tracking, updated_at FROM public.profiles ORDER BY updated_at DESC LIMIT 20;
