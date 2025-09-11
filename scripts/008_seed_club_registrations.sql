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
