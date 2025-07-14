-- Add teachingStyle column to tutors table
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS teaching_style TEXT DEFAULT 'balanced';

-- Update existing tutors to have teachingStyle based on their duration values
-- This provides backward compatibility
UPDATE tutors 
SET teaching_style = CASE 
    WHEN duration <= 10 THEN 'quick'
    WHEN duration <= 20 THEN 'balanced' 
    ELSE 'deep'
END
WHERE teaching_style IS NULL OR teaching_style = 'balanced';

-- Add check constraint to ensure valid teaching styles
ALTER TABLE tutors ADD CONSTRAINT check_teaching_style 
CHECK (teaching_style IN ('quick', 'balanced', 'deep'));

-- Create index for better performance on teaching_style queries
CREATE INDEX IF NOT EXISTS idx_tutors_teaching_style ON tutors(teaching_style);