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
