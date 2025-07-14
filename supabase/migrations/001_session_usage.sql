-- Create session_usage table for tracking voice session durations and costs
CREATE TABLE IF NOT EXISTS session_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    duration_minutes DECIMAL(10, 2) NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    cost DECIMAL(10, 4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_usage_user_id ON session_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_session_usage_tutor_id ON session_usage(tutor_id);
CREATE INDEX IF NOT EXISTS idx_session_usage_start_time ON session_usage(start_time);
CREATE INDEX IF NOT EXISTS idx_session_usage_user_month ON session_usage(user_id, start_time);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_session_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS trigger_session_usage_updated_at ON session_usage;
CREATE TRIGGER trigger_session_usage_updated_at
    BEFORE UPDATE ON session_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_session_usage_updated_at();

-- Create user_subscriptions table to track subscription details
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    plan_id TEXT NOT NULL DEFAULT 'FREE',
    voice_minutes_used DECIMAL(10, 2) NOT NULL DEFAULT 0,
    voice_minutes_limit INTEGER NOT NULL DEFAULT 10,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);

-- Create trigger to update updated_at timestamp for user_subscriptions
DROP TRIGGER IF EXISTS trigger_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER trigger_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_usage_updated_at();

-- Create a function to calculate monthly usage
CREATE OR REPLACE FUNCTION get_monthly_usage(user_id_param TEXT, start_date TIMESTAMP WITH TIME ZONE)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(duration_minutes) 
         FROM session_usage 
         WHERE user_id = user_id_param 
         AND start_time >= start_date
         AND start_time < start_date + INTERVAL '1 month'),
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user's current subscription info
CREATE OR REPLACE FUNCTION get_user_subscription_info(user_id_param TEXT)
RETURNS TABLE (
    plan_id TEXT,
    voice_minutes_used DECIMAL(10, 2),
    voice_minutes_limit INTEGER,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.plan_id,
        get_monthly_usage(user_id_param, us.current_period_start) as voice_minutes_used,
        us.voice_minutes_limit,
        us.current_period_start,
        us.current_period_end
    FROM user_subscriptions us
    WHERE us.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Insert default subscription for existing users (if any)
INSERT INTO user_subscriptions (user_id, plan_id, voice_minutes_limit, current_period_start, current_period_end)
SELECT DISTINCT 
    author as user_id,
    'FREE' as plan_id,
    10 as voice_minutes_limit,
    date_trunc('month', CURRENT_DATE) as current_period_start,
    date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' as current_period_end
FROM tutors
WHERE author IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Add RLS (Row Level Security) policies
ALTER TABLE session_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own session usage
DROP POLICY IF EXISTS "Users can view own session usage" ON session_usage;
CREATE POLICY "Users can view own session usage" ON session_usage
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own session usage
DROP POLICY IF EXISTS "Users can insert own session usage" ON session_usage;
CREATE POLICY "Users can insert own session usage" ON session_usage
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: Users can update their own subscription
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
CREATE POLICY "Users can update own subscription" ON user_subscriptions
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own subscription
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
CREATE POLICY "Users can insert own subscription" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);