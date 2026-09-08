-- ============================================================================
-- StudyFam Production Supabase Schema
-- ============================================================================

-- 1. REGISTRATIONS TABLE
create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    email text not null,
    phone text not null,
    jee_status text not null check (jee_status in ('class-11', 'class-12', 'dropper')),
    status text not null default 'waitlist' check (status in ('waitlist', 'registered', 'confirmed', 'cancelled')),
    amount_paid numeric not null default 0,
    order_id text unique,
    payment_id text,
    payment_status text not null default 'pending' check (payment_status in ('pending', 'success', 'failed', 'user_dropped')),
    payment_method text,
    referral_code text,
    created_at timestamptz not null default now()
);

-- Index for lookups & duplicate detection
create index if not exists idx_registrations_email on public.registrations(email);
create index if not exists idx_registrations_created_at on public.registrations(created_at);
create index if not exists idx_registrations_order_id on public.registrations(order_id);

-- Enable RLS
alter table public.registrations enable row level security;

-- Public can register/join waitlist
drop policy if exists "Allow public insert registrations" on public.registrations;
create policy "Allow public insert registrations"
on public.registrations
for insert
to anon, authenticated
with check (true);

-- Authenticated candidates can read their own registration records
drop policy if exists "Allow users to read own registration by email" on public.registrations;
create policy "Allow users to read own registration by email"
on public.registrations
for select
to authenticated
using (email = (select auth.jwt() ->> 'email'));

-- Allow update of payment status via order verification
drop policy if exists "Allow public update registration payment" on public.registrations;
create policy "Allow public update registration payment"
on public.registrations
for update
to anon, authenticated
using (order_id is not null)
with check (order_id is not null);

-- 2. SUPPORT INQUIRIES & GRIEVANCES TABLE
create table if not exists public.support_inquiries (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    email text not null,
    phone text not null,
    category text not null,
    message text not null,
    status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.support_inquiries enable row level security;

-- Public can submit inquiries
drop policy if exists "Allow public insert support inquiries" on public.support_inquiries;
create policy "Allow public insert support inquiries"
on public.support_inquiries
for insert
to anon, authenticated
with check (true);

-- 3. APP CONFIGURATION TABLE (Dynamic site settings)
create table if not exists public.app_config (
    key text primary key,
    value text not null,
    description text,
    updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.app_config enable row level security;

-- Public can read configuration settings
drop policy if exists "Allow public read app config" on public.app_config;
create policy "Allow public read app config"
on public.app_config
for select
to anon, authenticated
using (true);

-- Seed baseline configuration
insert into public.app_config (key, value, description) values
    ('registration_open_date', '2026-11-27T20:27:00+05:30', 'Countdown target for registration opening'),
    ('exam_date', '2026-12-27T09:00:00+05:30', 'Date of the All India Mock Exam'),
    ('support_per_registration', '18', 'INR allocated to scholarship pool per registration'),
    ('fee_per_mock', '27', 'Entry fee in INR'),
    ('milestone', '1000', 'Current target milestone of registrations'),
    ('support_amount_boys', '1000', 'Official NTA application fee for boys'),
    ('support_amount_girls', '800', 'Official NTA application fee for girls'),
    ('baseline_registrations', '0', 'Baseline offset for live counter if migrating existing counts')
on conflict (key) do update set value = excluded.value;

-- 4. SECURE FUNCTION TO COMPUTE LIVE STATS (Protects Student PII)
create or replace function public.get_impact_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
    actual_count bigint;
    baseline_count bigint := 0;
    total_count bigint;
    support_rate numeric := 18;
    target_milestone bigint := 15000;
    boys_fee numeric := 1000;
    girls_fee numeric := 800;
    avg_fee numeric;
    pool_total numeric;
    funded_count bigint;
    result json;
begin
    -- Count real registered students
    select count(*) into actual_count from public.registrations;

    -- Fetch dynamic config values if present
    select coalesce(value::bigint, 0) into baseline_count from public.app_config where key = 'baseline_registrations';
    select coalesce(value::numeric, 18) into support_rate from public.app_config where key = 'support_per_registration';
    select coalesce(value::bigint, 15000) into target_milestone from public.app_config where key = 'milestone';
    select coalesce(value::numeric, 1000) into boys_fee from public.app_config where key = 'support_amount_boys';
    select coalesce(value::numeric, 800) into girls_fee from public.app_config where key = 'support_amount_girls';

    total_count := actual_count + baseline_count;
    pool_total := total_count * support_rate;
    avg_fee := (boys_fee + girls_fee) / 2;
    funded_count := floor(pool_total / avg_fee);

    -- Progressive milestone tiers: 1000 -> 5000 -> 10000 -> 25000 -> 50000 -> 100000
    if total_count < 1000 then
        target_milestone := 1000;
    elsif total_count < 5000 then
        target_milestone := 5000;
    elsif total_count < 10000 then
        target_milestone := 10000;
    elsif total_count < 25000 then
        target_milestone := 25000;
    elsif total_count < 50000 then
        target_milestone := 50000;
    else
        target_milestone := 100000;
    end if;

    result := json_build_object(
        'total_registrations', total_count,
        'support_pool', pool_total,
        'funded_students', funded_count,
        'milestone', target_milestone,
        'progress_percentage', least(100.0, (total_count::numeric / nullif(target_milestone, 0)) * 100),
        'remaining_to_milestone', greatest(0, target_milestone - total_count)
    );

    return result;
end;
$$;

-- Grant execution permission to public roles
grant execute on function public.get_impact_stats() to anon, authenticated;

-- 5. ENABLE REALTIME BROADCASTS
do $$
begin
  alter publication supabase_realtime add table public.registrations;
exception
  when others then null;
end;
$$;

