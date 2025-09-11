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
