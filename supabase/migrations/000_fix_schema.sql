-- Fix schema migration - add missing columns to existing tables
-- This handles the case where tables exist but are missing some columns

-- Add missing columns to tutors table if they don't exist
DO $$ 
BEGIN
    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'is_public') THEN
        ALTER TABLE tutors ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'description') THEN
        ALTER TABLE tutors ADD COLUMN description TEXT;
    END IF;
    
    -- Add instructions column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'instructions') THEN
        ALTER TABLE tutors ADD COLUMN instructions TEXT;
    END IF;
    
    -- Add voice_id column if it doesn't exist (but check for existing 'voice' column)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'voice_id') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'voice') THEN
            -- Rename voice to voice_id
            ALTER TABLE tutors RENAME COLUMN voice TO voice_id;
        ELSE
            -- Add new voice_id column
            ALTER TABLE tutors ADD COLUMN voice_id TEXT DEFAULT 'default';
        END IF;
    END IF;
    
    -- Add teaching_style column if it doesn't exist (but check for existing 'style' column)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'teaching_style') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'style') THEN
            -- Rename style to teaching_style
            ALTER TABLE tutors RENAME COLUMN style TO teaching_style;
        ELSE
            -- Add new teaching_style column
            ALTER TABLE tutors ADD COLUMN teaching_style TEXT DEFAULT 'adaptive';
        END IF;
    END IF;
    
    -- Ensure updated_at column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tutors' AND column_name = 'updated_at') THEN
        ALTER TABLE tutors ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create bookmarks table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tutor_id) -- Prevent duplicate bookmarks
);

-- Create session_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS session_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    session_type TEXT DEFAULT 'voice', -- 'voice' or 'text'
    duration_minutes DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_tutors_author ON tutors(author);
CREATE INDEX IF NOT EXISTS idx_tutors_subject ON tutors(subject);
CREATE INDEX IF NOT EXISTS idx_tutors_is_public ON tutors(is_public);
CREATE INDEX IF NOT EXISTS idx_tutors_created_at ON tutors(created_at);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tutor_id ON bookmarks(tutor_id);

CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_tutor_id ON session_history(tutor_id);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_tutors_updated_at ON tutors;
CREATE TRIGGER update_tutors_updated_at
    BEFORE UPDATE ON tutors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_session_history_updated_at ON session_history;
CREATE TRIGGER update_session_history_updated_at
    BEFORE UPDATE ON session_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Tutors: Users can see public tutors and their own tutors
DROP POLICY IF EXISTS "tutors_select_policy" ON tutors;
CREATE POLICY "tutors_select_policy" ON tutors
    FOR SELECT USING (
        is_public = true OR 
        auth.uid()::text = author
    );

-- Tutors: Users can insert their own tutors
DROP POLICY IF EXISTS "tutors_insert_policy" ON tutors;
CREATE POLICY "tutors_insert_policy" ON tutors
    FOR INSERT WITH CHECK (auth.uid()::text = author);

-- Tutors: Users can update their own tutors
DROP POLICY IF EXISTS "tutors_update_policy" ON tutors;
CREATE POLICY "tutors_update_policy" ON tutors
    FOR UPDATE USING (auth.uid()::text = author);

-- Tutors: Users can delete their own tutors
DROP POLICY IF EXISTS "tutors_delete_policy" ON tutors;
CREATE POLICY "tutors_delete_policy" ON tutors
    FOR DELETE USING (auth.uid()::text = author);

-- Bookmarks: Users can only see their own bookmarks
DROP POLICY IF EXISTS "bookmarks_select_policy" ON bookmarks;
CREATE POLICY "bookmarks_select_policy" ON bookmarks
    FOR SELECT USING (auth.uid()::text = user_id);

-- Bookmarks: Users can insert their own bookmarks
DROP POLICY IF EXISTS "bookmarks_insert_policy" ON bookmarks;
CREATE POLICY "bookmarks_insert_policy" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Bookmarks: Users can delete their own bookmarks
DROP POLICY IF EXISTS "bookmarks_delete_policy" ON bookmarks;
CREATE POLICY "bookmarks_delete_policy" ON bookmarks
    FOR DELETE USING (auth.uid()::text = user_id);

-- Session History: Users can only see their own sessions
DROP POLICY IF EXISTS "session_history_select_policy" ON session_history;
CREATE POLICY "session_history_select_policy" ON session_history
    FOR SELECT USING (auth.uid()::text = user_id);

-- Session History: Users can insert their own sessions
DROP POLICY IF EXISTS "session_history_insert_policy" ON session_history;
CREATE POLICY "session_history_insert_policy" ON session_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);