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
