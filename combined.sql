-- COMBINED SQL SCRIPT
-- This script is a combination of all the SQL scripts in the scripts/ folder.
-- It is intended to be run as a single script to set up the database.

--
-- File: 001_create_tables.sql
--
-- Modified to use static authentication instead of Supabase auth
-- Create users table with static credentials
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- In production, this should be hashed
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'group1', 'group2', 'group3', 'group4', 'group5', 'regcom')),
  group_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('college', 'community')),
  group_number INTEGER NOT NULL CHECK (group_number BETWEEN 1 AND 5),
  estimated_count INTEGER DEFAULT 0,
  actual_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  is_external BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for managing user sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users policies - simplified for static auth
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_all" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_all" ON public.users FOR UPDATE USING (true);

-- Clubs policies - simplified for static auth
CREATE POLICY "clubs_select_all" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "clubs_insert_all" ON public.clubs FOR INSERT WITH CHECK (true);
CREATE POLICY "clubs_update_all" ON public.clubs FOR UPDATE USING (true);
CREATE POLICY "clubs_delete_all" ON public.clubs FOR DELETE USING (true);

-- Sessions policies
CREATE POLICY "sessions_select_all" ON public.user_sessions FOR SELECT USING (true);
CREATE POLICY "sessions_insert_all" ON public.user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_update_all" ON public.user_sessions FOR UPDATE USING (true);
CREATE POLICY "sessions_delete_all" ON public.user_sessions FOR DELETE USING (true);


--
-- File: 002_create_user_trigger.sql
--
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, group_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'group1'),
    COALESCE(NEW.raw_user_meta_data ->> 'group_name', 'Group 1')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


--
-- File: 003_seed_sample_data.sql
--
-- Insert sample clubs for testing
INSERT INTO public.clubs (name, type, group_number, is_external) VALUES
('Rotaract Club of ABC College', 'college', 1, false),
('Rotaract Club of XYZ University', 'college', 1, false),
('Rotaract Club of Community Center', 'community', 1, false),
('Rotaract Club of DEF Institute', 'college', 2, false),
('Rotaract Club of GHI College', 'college', 2, false),
('Rotaract Club of JKL Community', 'community', 2, false),
('Rotaract Club of MNO University', 'college', 3, false),
('Rotaract Club of PQR College', 'college', 3, false),
('Rotaract Club of STU Community', 'community', 3, false),
('Rotaract Club of VWX Institute', 'college', 4, false),
('Rotaract Club of YZA College', 'college', 4, false),
('Rotaract Club of BCD Community', 'community', 4, false),
('Rotaract Club of EFG University', 'college', 5, false),
('Rotaract Club of HIJ College', 'college', 5, false),
('Rotaract Club of KLM Community', 'community', 5, false);


--
-- File: 004_insert_static_users.sql
--
-- Insert hardcoded users with static credentials
-- Insert static users with predefined credentials
INSERT INTO public.users (username, password, email, role, group_name) VALUES
  ('admin', 'admin123', 'admin@rid3233.org', 'admin', 'Administration'),
  ('group1', 'group1pass', 'group1@rid3233.org', 'group1', 'Group 1'),
  ('group2', 'group2pass', 'group2@rid3233.org', 'group2', 'Group 2'),
  ('group3', 'group3pass', 'group3@rid3233.org', 'group3', 'Group 3'),
  ('group4', 'group4pass', 'group4@rid3233.org', 'group4', 'Group 4'),
  ('group5', 'group5pass', 'group5@rid3233.org', 'group5', 'Group 5'),
  ('regcom', 'regcom123', 'regcom@rid3233.org', 'regcom', 'Registration Committee')
ON CONFLICT (username) DO NOTHING;


--
-- File: 005_create_registrations_table.sql
--
-- Create club_registrations table
CREATE TABLE IF NOT EXISTS public.club_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  target_registrations INTEGER DEFAULT 0,
  achieved_registrations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.club_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for club_registrations
CREATE POLICY "club_registrations_select_all" ON public.club_registrations FOR SELECT USING (true);
CREATE POLICY "club_registrations_insert_all" ON public.club_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "club_registrations_update_all" ON public.club_registrations FOR UPDATE USING (true);
CREATE POLICY "club_registrations_delete_all" ON public.club_registrations FOR DELETE USING (true);


--
-- File: 006_remove_registration_counts_from_clubs.sql
--
-- Remove registration count columns from the clubs table
ALTER TABLE public.clubs
DROP COLUMN IF EXISTS estimated_count,
DROP COLUMN IF EXISTS actual_count;


--
-- File: 007_create_execute_sql_function.sql
--
CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql;

--
-- File: 009_add_group_number_to_registrations.sql
--
-- Add group_number to club_registrations table
ALTER TABLE public.club_registrations
ADD COLUMN group_number INTEGER;

-- Update the group_number for existing records
UPDATE public.club_registrations cr
SET group_number = c.group_number
FROM public.clubs c
WHERE cr.club_id = c.id;

-- Add a NOT NULL constraint after populating the column
ALTER TABLE public.club_registrations
ALTER COLUMN group_number SET NOT NULL;


--
-- File: 008_seed_club_registrations.sql
--
-- Seed club_registrations with sample data
-- This script should be run after 003_seed_sample_data.sql

-- Clear existing data to prevent duplicates on re-runs
TRUNCATE TABLE public.club_registrations RESTART IDENTITY;

-- Insert registration data for each club
INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 50, 45 FROM public.clubs WHERE name = 'Rotaract Club of ABC College';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 40, 38 FROM public.clubs WHERE name = 'Rotaract Club of XYZ University';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 30, 25 FROM public.clubs WHERE name = 'Rotaract Club of Community Center';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 60, 55 FROM public.clubs WHERE name = 'Rotaract Club of DEF Institute';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 35, 30 FROM public.clubs WHERE name = 'Rotaract Club of GHI College';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 25, 20 FROM public.clubs WHERE name = 'Rotaract Club of JKL Community';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 45, 40 FROM public.clubs WHERE name = 'Rotaract Club of MNO University';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 55, 50 FROM public.clubs WHERE name = 'Rotaract Club of PQR College';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 20, 18 FROM public.clubs WHERE name = 'Rotaract Club of STU Community';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 65, 60 FROM public.clubs WHERE name = 'Rotaract Club of VWX Institute';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 40, 35 FROM public.clubs WHERE name = 'Rotaract Club of YZA College';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 30, 28 FROM public.clubs WHERE name = 'Rotaract Club of BCD Community';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 50, 48 FROM public.clubs WHERE name = 'Rotaract Club of EFG University';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 45, 42 FROM public.clubs WHERE name = 'Rotaract Club of HIJ College';

INSERT INTO public.club_registrations (club_id, group_number, target_registrations, achieved_registrations)
SELECT id, group_number, 35, 32 FROM public.clubs WHERE name = 'Rotaract Club of KLM Community';

--
-- File: 010_create_todos_table.sql
--
-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Todos policies - simplified for static auth
CREATE POLICY "todos_select_all" ON public.todos FOR SELECT USING (true);
CREATE POLICY "todos_insert_all" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "todos_update_all" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "todos_delete_all" ON public.todos FOR DELETE USING (true);
