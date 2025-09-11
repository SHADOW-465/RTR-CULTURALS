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
