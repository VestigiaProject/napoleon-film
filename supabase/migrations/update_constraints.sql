-- Add unique constraint on order_index in shots table
alter table shots
add constraint shots_order_index_key unique (order_index);

-- Add foreign key constraint for user_id in videos table
alter table videos
add constraint videos_user_id_fkey
foreign key (user_id) references auth.users(id) on delete cascade;

-- Add foreign key constraint for user_id in votes table
alter table votes
add constraint votes_user_id_fkey
foreign key (user_id) references auth.users(id) on delete cascade;

-- Add indexes for better performance
create index if not exists videos_shot_id_idx on videos(shot_id);
create index if not exists votes_video_id_idx on votes(video_id);
create index if not exists shots_order_index_idx on shots(order_index); 