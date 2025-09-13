CREATE OR REPLACE FUNCTION get_dashboard_stats(p_group_number INTEGER DEFAULT NULL)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  WITH all_clubs_with_registrations AS (
    SELECT
      c.id,
      c.name,
      c.type,
      c.group_number,
      c.is_external,
      c.created_at,
      COALESCE(cr.target_registrations, 0) as target_registrations,
      COALESCE(cr.achieved_registrations, 0) as achieved_registrations
    FROM clubs c
    LEFT JOIN club_registrations cr ON c.id = cr.club_id
    WHERE p_group_number IS NULL OR c.group_number = p_group_number
  ),
  group_stats AS (
    SELECT
      group_number,
      SUM(target_registrations) as target_total,
      SUM(achieved_registrations) as achieved_total,
      COUNT(id) as club_count,
      COUNT(id) FILTER (WHERE is_external) as external_club_count
    FROM all_clubs_with_registrations
    GROUP BY group_number
  ),
  district_stats AS (
    SELECT
      SUM(target_total) as district_target,
      SUM(achieved_total) as district_achieved,
      SUM(club_count) as total_clubs,
      SUM(external_club_count) as total_external_clubs
    FROM group_stats
  ),
  top_college_clubs AS (
    SELECT id, name, group_number, achieved_registrations
    FROM all_clubs_with_registrations
    WHERE type = 'college' AND NOT is_external
    ORDER BY achieved_registrations DESC
    LIMIT 3
  ),
  top_community_clubs AS (
    SELECT id, name, group_number, achieved_registrations
    FROM all_clubs_with_registrations
    WHERE type = 'community' AND NOT is_external
    ORDER BY achieved_registrations DESC
    LIMIT 3
  ),
  college_clubs_list AS (
    SELECT id, name, group_number, target_registrations, achieved_registrations
    FROM all_clubs_with_registrations
    WHERE type = 'college' AND NOT is_external
    ORDER BY name
  ),
  community_clubs_list AS (
    SELECT id, name, group_number, target_registrations, achieved_registrations
    FROM all_clubs_with_registrations
    WHERE type = 'community' AND NOT is_external
    ORDER BY name
  ),
  all_external_clubs AS (
    SELECT id, name, type, group_number, target_registrations, achieved_registrations
    FROM all_clubs_with_registrations
    WHERE is_external
    ORDER BY name
  )
  SELECT jsonb_build_object(
    'group_totals', (SELECT jsonb_agg(gs) FROM group_stats gs),
    'district_totals', (SELECT to_jsonb(ds) FROM district_stats ds),
    'top_college_clubs', (SELECT jsonb_agg(tcc) FROM top_college_clubs tcc),
    'top_community_clubs', (SELECT jsonb_agg(tcc) FROM top_community_clubs tcc),
    'college_clubs_list', (SELECT jsonb_agg(ccl) FROM college_clubs_list ccl),
    'community_clubs_list', (SELECT jsonb_agg(ccl) FROM community_clubs_list ccl),
    'external_clubs_list', (SELECT jsonb_agg(aec) FROM all_external_clubs aec),
    'all_clubs', (SELECT jsonb_agg(acwr) FROM all_clubs_with_registrations acwr)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
