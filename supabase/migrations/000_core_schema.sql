-- Core schema migration for Neural Teach AI Learning Platform
-- This creates the fundamental tables required for the application

-- Create tutors table (AI learning companions)
CREATE TABLE IF NOT EXISTS tutors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    subject TEXT NOT NULL,
    topic TEXT,
    teaching_style TEXT DEFAULT 'adaptive',
    voice_id TEXT DEFAULT 'default',
    author TEXT NOT NULL, -- Clerk user ID
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table (user bookmarked tutors)
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tutor_id) -- Prevent duplicate bookmarks
);

-- Create session_history table (user interaction history)
CREATE TABLE IF NOT EXISTS session_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    session_type TEXT DEFAULT 'voice', -- 'voice' or 'text'
    duration_minutes DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tutors_author ON tutors(author);
CREATE INDEX IF NOT EXISTS idx_tutors_subject ON tutors(subject);
CREATE INDEX IF NOT EXISTS idx_tutors_is_public ON tutors(is_public);
CREATE INDEX IF NOT EXISTS idx_tutors_created_at ON tutors(created_at);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tutor_id ON bookmarks(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at);

CREATE INDEX IF NOT EXISTS idx_session_history_user_id ON session_history(user_id);
CREATE INDEX IF NOT EXISTS idx_session_history_tutor_id ON session_history(tutor_id);
CREATE INDEX IF NOT EXISTS idx_session_history_created_at ON session_history(created_at);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER trigger_tutors_updated_at
    BEFORE UPDATE ON tutors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_session_history_updated_at
    BEFORE UPDATE ON session_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Tutors policies
CREATE POLICY "Public tutors are viewable by everyone" ON tutors
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own tutors" ON tutors
    FOR SELECT USING (auth.uid()::text = author);

CREATE POLICY "Users can insert own tutors" ON tutors
    FOR INSERT WITH CHECK (auth.uid()::text = author);

CREATE POLICY "Users can update own tutors" ON tutors
    FOR UPDATE USING (auth.uid()::text = author);

CREATE POLICY "Users can delete own tutors" ON tutors
    FOR DELETE USING (auth.uid()::text = author);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
    FOR DELETE USING (auth.uid()::text = user_id);

-- Session history policies
CREATE POLICY "Users can view own session history" ON session_history
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own session history" ON session_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own session history" ON session_history
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Insert some sample tutors for demonstration
INSERT INTO tutors (name, description, instructions, subject, topic, teaching_style, voice_id, author, is_public) VALUES
('Math Mentor', 'Expert mathematics tutor specializing in algebra and calculus', 'You are a patient and encouraging mathematics tutor. Break down complex problems into simple steps and use real-world examples.', 'Mathematics', 'Algebra', 'patient', 'default', 'demo-user', true),
('Science Guide', 'Physics and chemistry tutor with interactive explanations', 'You are an enthusiastic science tutor. Use experiments, analogies, and visual descriptions to explain scientific concepts.', 'Science', 'Physics', 'interactive', 'default', 'demo-user', true),
('History Helper', 'Engaging history tutor covering world events and civilizations', 'You are a storytelling history tutor. Make historical events come alive through narratives and connections to modern times.', 'History', 'World History', 'storytelling', 'default', 'demo-user', true),
('Language Learning Assistant', 'Multilingual tutor for language acquisition and practice', 'You are a supportive language tutor. Encourage practice, correct mistakes gently, and provide cultural context.', 'Languages', 'Spanish', 'encouraging', 'default', 'demo-user', true);