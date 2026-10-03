-- ============================================================================
-- StudyFAM Master Supabase Schema Migration: Full Mock Tests & User Sync
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wyzkhvomjwrgripytoiv/sql
-- ============================================================================

-- 1. CREATE EXAM ATTEMPTS TABLE (If it does not exist)
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    email text,
    test_id text NOT NULL,
    test_title text,
    score numeric NOT NULL DEFAULT 0,
    max_score numeric NOT NULL DEFAULT 300,
    percentage numeric NOT NULL DEFAULT 0,
    accuracy numeric NOT NULL DEFAULT 0,
    time_spent_seconds integer NOT NULL DEFAULT 0,
    total_questions integer NOT NULL DEFAULT 75,
    attempted_count integer NOT NULL DEFAULT 0,
    correct_count integer NOT NULL DEFAULT 0,
    incorrect_count integer NOT NULL DEFAULT 0,
    section_breakdown jsonb,
    detailed_results jsonb,
    question_times jsonb,
    tab_violations integer NOT NULL DEFAULT 0,
    submission_reason text,
    started_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. ENSURE ALL COLUMNS EXIST (Idempotent for existing tables)
ALTER TABLE public.exam_attempts
  ADD COLUMN IF NOT EXISTS test_title        text,
  ADD COLUMN IF NOT EXISTS detailed_results  jsonb,
  ADD COLUMN IF NOT EXISTS question_times    jsonb,
  ADD COLUMN IF NOT EXISTS tab_violations    integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submission_reason text,
  ADD COLUMN IF NOT EXISTS started_at        timestamptz;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- 4. GRANT API ACCESS TO anon AND authenticated ROLES
GRANT SELECT, INSERT ON TABLE public.exam_attempts TO anon, authenticated;

-- 5. POLICIES: ALLOW INSERTS AND SELECTS
DROP POLICY IF EXISTS "Allow public insert exam attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Anyone can insert attempts" ON public.exam_attempts;
CREATE POLICY "Allow public insert exam attempts"
  ON public.exam_attempts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select exam attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Users can read own attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Allow read own exam attempts" ON public.exam_attempts;
CREATE POLICY "Allow select exam attempts"
  ON public.exam_attempts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_exam_attempts_email      ON public.exam_attempts(email);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_test_id    ON public.exam_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_created_at ON public.exam_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id    ON public.exam_attempts(user_id);

-- 7. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
