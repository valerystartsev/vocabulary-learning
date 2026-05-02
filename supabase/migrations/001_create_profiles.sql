-- =========================================
-- Migration: Add missing columns to existing profiles table
-- Run this in Supabase Dashboard → SQL Editor
-- =========================================

-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_financial_university BOOLEAN DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{}'::jsonb;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Teacher can view all profiles" ON public.profiles;
CREATE POLICY "Teacher can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (auth.jwt() ->> 'email' = 'emzakhtser@mail.ru');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create function for new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_financial_university, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'isFinancialUniversity')::BOOLEAN, false),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to sync user metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_metadata_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data THEN
    UPDATE public.profiles
    SET 
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      is_financial_university = COALESCE((NEW.raw_user_meta_data->>'isFinancialUniversity')::BOOLEAN, profiles.is_financial_university),
      role = COALESCE(NEW.raw_user_meta_data->>'role', profiles.role),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for metadata updates
DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_metadata_update();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_is_financial ON public.profiles(is_financial_university);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Sync existing auth users to profiles table
INSERT INTO public.profiles (id, email, full_name, is_financial_university, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  COALESCE((raw_user_meta_data->>'isFinancialUniversity')::BOOLEAN, false),
  COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
  is_financial_university = COALESCE(EXCLUDED.is_financial_university, profiles.is_financial_university),
  role = COALESCE(EXCLUDED.role, profiles.role);

-- Done! Verify with:
-- SELECT * FROM public.profiles LIMIT 5;
