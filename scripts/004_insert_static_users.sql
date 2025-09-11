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
