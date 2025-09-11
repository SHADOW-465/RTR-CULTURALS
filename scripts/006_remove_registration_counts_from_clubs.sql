-- Remove registration count columns from the clubs table
ALTER TABLE public.clubs
DROP COLUMN IF EXISTS estimated_count,
DROP COLUMN IF EXISTS actual_count;
