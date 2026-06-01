-- ════════════════════════════════════════════════════════════════════════
-- ADAPTATION — Business English Course
-- Полный скрипт развёртывания базы данных Supabase «с нуля»
-- ════════════════════════════════════════════════════════════════════════
-- Запускается одним блоком в Supabase SQL Editor (Role: postgres).
-- Идемпотентен — можно выполнять повторно без последствий.
-- ════════════════════════════════════════════════════════════════════════

-- ─── 1. ТАБЛИЦА public.profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  display_name        text,
  full_name           text,
  university_tracking boolean DEFAULT false,
  saved_progress      jsonb DEFAULT '{}'::jsonb,
  progress            jsonb DEFAULT '{}'::jsonb,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx               ON public.profiles (email);
CREATE INDEX IF NOT EXISTS profiles_university_tracking_idx ON public.profiles (university_tracking);
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx          ON public.profiles (updated_at DESC NULLS LAST);


-- ─── 2. ТРИГГЕР handle_new_user — создание профиля при регистрации ──────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, university_tracking, updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    COALESCE((NEW.raw_user_meta_data->>'university_tracking')::boolean, false),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email               = EXCLUDED.email,
        full_name           = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        university_tracking = EXCLUDED.university_tracking,
        updated_at          = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 3. ROW LEVEL SECURITY ──────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3.1. Студент видит свой профиль
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- 3.2. Преподаватель видит всех студентов ФинУниверситета
-- ВНИМАНИЕ: подставь правильный email преподавателя в auth.email()
DROP POLICY IF EXISTS "Teacher can view all tracked students" ON public.profiles;
CREATE POLICY "Teacher can view all tracked students"
ON public.profiles FOR SELECT TO authenticated
USING (
  auth.email() = 'emzakhtser@mail.ru'
  AND university_tracking = true
);

-- 3.3. Резервный INSERT (на случай если триггер не сработал)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- 3.4. Студент может править свой профиль, но НЕ изменять university_tracking
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


-- ─── 4. ВЕРИФИКАЦИЯ — проверь что всё на месте ─────────────────────────
-- Раскомментируй и запусти эти три запроса для проверки:

-- SELECT 'Table profiles exists' AS check, count(*)::text AS row_count
--   FROM public.profiles;

-- SELECT 'Trigger on_auth_user_created exists' AS check,
--        proname AS function_name
--   FROM pg_proc WHERE proname = 'handle_new_user';

-- SELECT policyname, cmd FROM pg_policies
--   WHERE schemaname = 'public' AND tablename = 'profiles'
--   ORDER BY cmd, policyname;
-- Должно быть 4 строки: 1 INSERT, 2 SELECT, 1 UPDATE


-- ─── 5. AUTH SETTINGS — нельзя задать через SQL ─────────────────────────
-- Эти три настройки выставляются ТОЛЬКО через Supabase Dashboard UI:
--
-- 5.1. Authentication → URL Configuration:
--      Site URL: https://adaptation-fa.ru
--      Redirect URLs:
--        https://adaptation-fa.ru/**
--        https://www.adaptation-fa.ru/**
--        https://adaptation-fa.ru/update-password
--        https://www.adaptation-fa.ru/update-password
--        http://localhost:5173/**
--        http://localhost:5173/update-password
--
-- 5.2. Authentication → Providers → Email:
--      Secure email change = ON
--      Confirm email       = ON
--
-- 5.3. (опционально) Authentication → Email Templates:
--      перевести шаблоны Reset Password / Confirm Email на русский


-- ════════════════════════════════════════════════════════════════════════
-- ГОТОВО. База развёрнута. Студенты могут регистрироваться, прогресс
-- будет писаться в profiles.saved_progress, преподаватель увидит
-- студентов с университетским флагом в /teacher.
-- ════════════════════════════════════════════════════════════════════════
