-- Create the medicine_reminders table
create table if not exists public.medicine_reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  dosage text,
  time text not null, -- Format: "HH:mm"
  days text[] not null, -- Array of days e.g. ["Monday", "Wednesday"]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.medicine_reminders enable row level security;

-- Create policies
create policy "Users can view their own reminders"
  on public.medicine_reminders for select
  using (auth.uid() = (select uid from public.users where id = user_id));

create policy "Users can insert their own reminders"
  on public.medicine_reminders for insert
  with check (auth.uid() = (select uid from public.users where id = user_id));

create policy "Users can update their own reminders"
  on public.medicine_reminders for update
  using (auth.uid() = (select uid from public.users where id = user_id));

create policy "Users can delete their own reminders"
  on public.medicine_reminders for delete
  using (auth.uid() = (select uid from public.users where id = user_id));
