-- ============================================================
-- StudyFAM: exam_attempts migration
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wyzkhvomjwrgripytoiv/sql
-- ============================================================

-- 1. Add missing columns for full mock tracking
ALTER TABLE exam_attempts
  ADD COLUMN IF NOT EXISTS test_title        text,
  ADD COLUMN IF NOT EXISTS detailed_results  jsonb,
  ADD COLUMN IF NOT EXISTS question_times    jsonb,
  ADD COLUMN IF NOT EXISTS tab_violations    integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submission_reason text,
  ADD COLUMN IF NOT EXISTS started_at        timestamptz;

-- 2. Expose the table to the REST API (anon + authenticated)
GRANT SELECT, INSERT ON TABLE exam_attempts TO anon, authenticated;

-- 3. Enable Row Level Security
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

-- 4. Policy: users can only see their own attempts (by email or user_id)
DROP POLICY IF EXISTS "Users can read own attempts" ON exam_attempts;
CREATE POLICY "Users can read own attempts"
  ON exam_attempts
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR email = (SELECT auth.email())
  );

-- 5. Policy: anyone can insert (worker uses anon key for server-side insert)
DROP POLICY IF EXISTS "Anyone can insert attempts" ON exam_attempts;
CREATE POLICY "Anyone can insert attempts"
  ON exam_attempts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. Index for fast lookup by email and test_id
CREATE INDEX IF NOT EXISTS idx_exam_attempts_email    ON exam_attempts (email);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_test_id  ON exam_attempts (test_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id  ON exam_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_created  ON exam_attempts (created_at DESC);
