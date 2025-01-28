-- Drop the existing function first
drop function if exists get_shots_with_top_videos();

create or replace function get_shots_with_top_videos()
returns table (
  id bigint,
  title text,
  script_excerpt text,
  order_index integer,
  created_at timestamptz,
  top_video_url text,
  top_video_user_id uuid,
  top_video_user_email text,
  top_video_votes bigint
) language plpgsql security definer 
set search_path = public
as $$
begin
  return query
  with ranked_videos as (
    select 
      v.shot_id,
      v.video_url::text,
      v.user_id,
      u.email::text as user_email,
      coalesce(count(votes.id), 0)::bigint as votes_count,
      row_number() over (partition by v.shot_id order by count(votes.id) desc) as rank
    from videos v
    left join auth.users u on v.user_id = u.id
    left join votes on v.id = votes.video_id
    group by v.id, v.shot_id, v.video_url, v.user_id, u.email
  )
  select 
    s.id,
    s.title::text,
    s.script_excerpt::text,
    s.order_index,
    coalesce(s.created_at, now()) as created_at,
    rv.video_url::text as top_video_url,
    rv.user_id as top_video_user_id,
    rv.user_email::text as top_video_user_email,
    rv.votes_count
  from shots s
  left join ranked_videos rv on s.id = rv.shot_id and rv.rank = 1
  order by s.order_index;
end;
$$; 