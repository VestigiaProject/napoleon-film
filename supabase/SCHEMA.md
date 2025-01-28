# Napoleon Film Project Database Schema

## Tables

### `shots`
Represents individual shots from the Napoleon film script.

| Column          | Type          | Description                                    | Constraints    |
|----------------|---------------|------------------------------------------------|----------------|
| id             | bigint        | Primary key                                    | PK, auto-increment |
| title          | text          | Title of the shot                              | not null |
| script_excerpt | text          | The script/description for this shot           | not null |
| order_index    | integer       | The sequence number of the shot in the film    | not null, unique |
| created_at     | timestamptz   | When the shot was created                      | not null, default now() |

### `videos`
User-submitted videos for each shot.

| Column      | Type        | Description                                    | Constraints    |
|------------|-------------|------------------------------------------------|----------------|
| id         | bigint      | Primary key                                    | PK, auto-increment |
| shot_id    | bigint      | Reference to the shot this video belongs to    | FK → shots.id |
| video_url  | text        | URL to the video in storage                    | not null |
| user_id    | uuid        | Reference to the user who uploaded the video   | FK → auth.users.id |
| created_at | timestamptz | When the video was uploaded                    | not null, default now() |

### `votes`
User votes on videos.

| Column      | Type        | Description                                    | Constraints    |
|------------|-------------|------------------------------------------------|----------------|
| id         | bigint      | Primary key                                    | PK, auto-increment |
| video_id   | bigint      | Reference to the video being voted on          | FK → videos.id |
| user_id    | uuid        | Reference to the user who voted                | FK → auth.users.id |
| created_at | timestamptz | When the vote was cast                        | not null, default now() |

## Row Level Security (RLS) Policies

### Videos Table
```sql
-- Enable RLS
alter table videos enable row level security;

-- Anyone can view videos
create policy "Videos are viewable by everyone" 
on videos for select using (true);

-- Only authenticated users can insert their own videos
create policy "Users can insert their own videos" 
on videos for insert with check (auth.uid() = user_id);

-- Users can only update their own videos
create policy "Users can update their own videos" 
on videos for update using (auth.uid() = user_id);

-- Users can only delete their own videos
create policy "Users can delete their own videos" 
on videos for delete using (auth.uid() = user_id);
```

### Votes Table
```sql
-- Enable RLS
alter table votes enable row level security;

-- Anyone can view votes
create policy "Votes are viewable by everyone" 
on votes for select using (true);

-- Only authenticated users can insert their own votes
create policy "Users can insert their own votes" 
on votes for insert with check (auth.uid() = user_id);

-- Users can only delete their own votes
create policy "Users can delete their own votes" 
on votes for delete using (auth.uid() = user_id);
```

## Database Functions

### `get_videos_with_votes(shot_id_input bigint)`
Returns videos for a specific shot with their vote counts and whether the current user has voted.

Returns:
- id: bigint
- shot_id: bigint
- video_url: text
- user_id: uuid
- user_email: text
- created_at: timestamptz
- votes_count: bigint
- has_voted: boolean

### `get_shots_with_top_videos()`
Returns all shots with their highest-voted video.

Returns:
- id: bigint
- title: text
- script_excerpt: text
- order_index: integer
- created_at: timestamptz
- top_video_url: text
- top_video_user_id: uuid
- top_video_user_email: text
- top_video_votes: bigint

## Relationships

1. `videos.shot_id` → `shots.id`: Each video belongs to one shot
2. `videos.user_id` → `auth.users.id`: Each video is uploaded by one user
3. `votes.video_id` → `videos.id`: Each vote is for one video
4. `votes.user_id` → `auth.users.id`: Each vote is cast by one user

## Indexes
- `shots_order_index_key`: Unique index on shots(order_index)
- `videos_shot_id_idx`: Index on videos(shot_id)
- `votes_video_id_idx`: Index on votes(video_id)
- `votes_user_id_idx`: Index on votes(user_id)

## Notes
- All tables include RLS policies to ensure proper access control
- Timestamps are automatically managed using default now()
- The schema uses Supabase's auth.users table for user management
- Videos are stored in Supabase Storage (bucket: `videos`), with URLs referenced in the videos table 