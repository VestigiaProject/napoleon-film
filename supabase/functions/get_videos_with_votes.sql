-- Drop the existing function first
drop function if exists get_videos_with_votes(bigint);

-- Function to get videos with vote counts for a specific shot
create or replace function get_videos_with_votes(shot_id_input bigint)
returns table (
  id bigint,
  shot_id bigint,
  video_url text,
  user_id uuid,
  user_email text,
  created_at timestamptz,
  votes_count bigint,
  has_voted boolean
) language plpgsql security definer 
set search_path = public
as $$
begin
  return query
  select 
    v.id,
    v.shot_id,
    v.video_url::text,
    v.user_id,
    u.email::text as user_email,
    v.created_at,
    coalesce(count(distinct vt.id), 0)::bigint as votes_count,
    exists(
      select 1 
      from votes uv 
      where uv.video_id = v.id 
      and uv.user_id = auth.uid()
    ) as has_voted
  from videos v
  left join auth.users u on v.user_id = u.id
  left join votes vt on v.id = vt.video_id
  where v.shot_id = shot_id_input
  group by v.id, v.shot_id, v.video_url, v.user_id, v.created_at, u.email
  order by votes_count desc, v.created_at desc;
end;
$$; 