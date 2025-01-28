-- Enable RLS on videos table
alter table videos enable row level security;

-- Allow anyone to view videos
create policy "Videos are viewable by everyone"
on videos for select
using (true);

-- Allow authenticated users to insert their own videos
create policy "Users can insert their own videos"
on videos for insert
with check (auth.uid() = user_id);

-- Allow users to update their own videos
create policy "Users can update their own videos"
on videos for update
using (auth.uid() = user_id);

-- Allow users to delete their own videos
create policy "Users can delete their own videos"
on videos for delete
using (auth.uid() = user_id); 