-- Create the videos bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Public access policy for videos
create policy "Videos are publicly accessible"
on storage.objects for select
using ( bucket_id = 'videos' );

-- Upload policy for authenticated users
create policy "Authenticated users can upload videos"
on storage.objects for insert
with check (
    bucket_id = 'videos' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] like 'shot-%'
);

-- Allow users to delete their own videos
create policy "Users can delete own videos"
on storage.objects for delete
using (
    bucket_id = 'videos'
    and auth.uid()::text = (storage.foldername(name))[2]
); 