 -- Enable RLS on votes table
alter table votes enable row level security;

-- Allow authenticated users to view votes
create policy "Votes are viewable by everyone" 
on votes for select 
using (true);

-- Allow authenticated users to insert their own votes
create policy "Users can insert their own votes" 
on votes for insert 
with check (auth.uid() = user_id);

-- Allow users to delete their own votes
create policy "Users can delete their own votes" 
on votes for delete 
using (auth.uid() = user_id);