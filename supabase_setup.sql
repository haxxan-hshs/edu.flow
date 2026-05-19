-- Run this in your Supabase SQL Editor to create the necessary tables for the User Dashboard

CREATE TABLE IF NOT EXISTS public.user_activities (
    email TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    subjects JSONB DEFAULT '[]'::jsonb,
    reading_records JSONB DEFAULT '[]'::jsonb,
    study_sessions JSONB DEFAULT '[]'::jsonb,
    total_study_seconds INTEGER DEFAULT 0,
    files_count INTEGER DEFAULT 0,
    certificates JSONB DEFAULT '[]'::jsonb,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own activity
CREATE POLICY "Users can view their own activity" ON public.user_activities
    FOR SELECT USING (auth.email() = email);

-- Allow users to update their own activity
CREATE POLICY "Users can insert their own activity" ON public.user_activities
    FOR INSERT WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own activity" ON public.user_activities
    FOR UPDATE USING (auth.email() = email);

-- Allow admins to view all activities (assuming admins have a role or just letting anyone authenticated see for now if needed, but keeping it secure by default)
-- Uncomment below if admins need to see all:
-- CREATE POLICY "Admins can view all" ON public.user_activities FOR SELECT USING (true);
