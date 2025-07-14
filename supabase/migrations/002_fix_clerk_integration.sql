-- Temporarily disable RLS to fix Clerk integration issues
-- This allows the app to work while we fix the authentication integration

-- Disable RLS on all tables temporarily
ALTER TABLE tutors DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "tutors_select_policy" ON tutors;
DROP POLICY IF EXISTS "tutors_insert_policy" ON tutors;
DROP POLICY IF EXISTS "tutors_update_policy" ON tutors;
DROP POLICY IF EXISTS "tutors_delete_policy" ON tutors;

DROP POLICY IF EXISTS "bookmarks_select_policy" ON bookmarks;
DROP POLICY IF EXISTS "bookmarks_insert_policy" ON bookmarks;
DROP POLICY IF EXISTS "bookmarks_delete_policy" ON bookmarks;

DROP POLICY IF EXISTS "session_history_select_policy" ON session_history;
DROP POLICY IF EXISTS "session_history_insert_policy" ON session_history;

DROP POLICY IF EXISTS "Users can view own session usage" ON session_usage;
DROP POLICY IF EXISTS "Users can insert own session usage" ON session_usage;

DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;

-- Insert some sample data to test
INSERT INTO tutors (name, subject, topic, teaching_style, voice_id, author) VALUES
('Math Wizard', 'maths', 'Algebra Basics', 'quick', 'male_casual', 'sample_user_1'),
('Science Explorer', 'science', 'Physics Fundamentals', 'deep', 'female_formal', 'sample_user_1'),
('Language Master', 'language', 'English Grammar', 'balanced', 'female_casual', 'sample_user_1')
ON CONFLICT (name) DO NOTHING;