create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, profile_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 140),
  description text check (description is null or char_length(description) <= 1000),
  status text not null default 'draft' check (status in ('draft', 'intake_ready', 'prd_pending', 'architecture_pending', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_briefs_required_keys check (
    data ? 'target_audience'
    and data ? 'core_problem'
    and data ? 'key_features'
    and data ? 'tech_preferences'
    and data ? 'integrations_needed'
  )
);

create table if not exists public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  status text not null default 'locked' check (status in ('locked', 'pending', 'in_progress', 'ready_for_approval', 'approved')),
  order_index integer not null check (order_index > 0),
  created_at timestamptz not null default now(),
  unique (project_id, order_index)
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  phase_id uuid references public.project_phases(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  rationale text not null check (char_length(trim(rationale)) between 2 and 4000),
  created_at timestamptz not null default now()
);

create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null check (char_length(trim(kind)) between 2 and 80),
  title text not null check (char_length(trim(title)) between 2 and 160),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_members_profile_id_idx on public.organization_members(profile_id);
create index if not exists projects_org_id_idx on public.projects(org_id);
create index if not exists project_phases_project_id_idx on public.project_phases(project_id);
create index if not exists approvals_project_id_idx on public.approvals(project_id);
create index if not exists decisions_project_id_idx on public.decisions(project_id);
create index if not exists artifacts_project_id_idx on public.artifacts(project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists project_briefs_set_updated_at on public.project_briefs;
create trigger project_briefs_set_updated_at
before update on public.project_briefs
for each row execute function public.set_updated_at();

drop trigger if exists artifacts_set_updated_at on public.artifacts;
create trigger artifacts_set_updated_at
before update on public.artifacts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      avatar_url = excluded.avatar_url,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.org_id = target_org_id
      and om.profile_id = auth.uid()
  );
$$;

create or replace function public.is_project_member(target_project_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    join public.organization_members om on om.org_id = p.org_id
    where p.id = target_project_id
      and om.profile_id = auth.uid()
  );
$$;

create or replace function public.create_organization_with_owner(
  organization_name text,
  organization_slug text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.profiles (id, email)
  select au.id, coalesce(au.email, '')
  from auth.users au
  where au.id = current_user_id
  on conflict (id) do update set email = excluded.email, updated_at = now();

  insert into public.organizations (name, slug)
  values (trim(organization_name), trim(organization_slug))
  returning id into new_org_id;

  insert into public.organization_members (org_id, profile_id, role)
  values (new_org_id, current_user_id, 'owner');

  return new_org_id;
end;
$$;

create or replace function public.create_project_with_default_phases(
  target_org_id uuid,
  project_name text,
  project_description text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_project_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_org_member(target_org_id) then
    raise exception 'Not a member of this organization';
  end if;

  insert into public.projects (org_id, name, description)
  values (target_org_id, trim(project_name), nullif(trim(project_description), ''))
  returning id into new_project_id;

  insert into public.project_phases (project_id, name, status, order_index)
  values
    (new_project_id, 'PRD', 'pending', 1),
    (new_project_id, 'Architecture', 'locked', 2),
    (new_project_id, 'Backlog', 'locked', 3);

  return new_project_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_briefs enable row level security;
alter table public.project_phases enable row level security;
alter table public.approvals enable row level security;
alter table public.decisions enable row level security;
alter table public.artifacts enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "organizations select by membership" on public.organizations;
create policy "organizations select by membership"
on public.organizations for select
to authenticated
using (public.is_org_member(id));

drop policy if exists "organizations update by owner" on public.organizations;
create policy "organizations update by owner"
on public.organizations for update
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.org_id = id
      and om.profile_id = auth.uid()
      and om.role = 'owner'
  )
)
with check (
  exists (
    select 1
    from public.organization_members om
    where om.org_id = id
      and om.profile_id = auth.uid()
      and om.role = 'owner'
  )
);

drop policy if exists "organization members select same org" on public.organization_members;
create policy "organization members select same org"
on public.organization_members for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "projects select by org membership" on public.projects;
create policy "projects select by org membership"
on public.projects for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "projects insert by org membership" on public.projects;
create policy "projects insert by org membership"
on public.projects for insert
to authenticated
with check (public.is_org_member(org_id));

drop policy if exists "projects update by org membership" on public.projects;
create policy "projects update by org membership"
on public.projects for update
to authenticated
using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

drop policy if exists "projects delete by owner" on public.projects;
create policy "projects delete by owner"
on public.projects for delete
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.org_id = projects.org_id
      and om.profile_id = auth.uid()
      and om.role = 'owner'
  )
);

drop policy if exists "project briefs select by project membership" on public.project_briefs;
create policy "project briefs select by project membership"
on public.project_briefs for select
to authenticated
using (public.is_project_member(project_id));

drop policy if exists "project briefs insert by project membership" on public.project_briefs;
create policy "project briefs insert by project membership"
on public.project_briefs for insert
to authenticated
with check (public.is_project_member(project_id));

drop policy if exists "project briefs update by project membership" on public.project_briefs;
create policy "project briefs update by project membership"
on public.project_briefs for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

drop policy if exists "project phases select by project membership" on public.project_phases;
create policy "project phases select by project membership"
on public.project_phases for select
to authenticated
using (public.is_project_member(project_id));

drop policy if exists "project phases update by project membership" on public.project_phases;
create policy "project phases update by project membership"
on public.project_phases for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

drop policy if exists "approvals all by project membership" on public.approvals;
create policy "approvals all by project membership"
on public.approvals for all
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

drop policy if exists "decisions all by project membership" on public.decisions;
create policy "decisions all by project membership"
on public.decisions for all
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

drop policy if exists "artifacts all by project membership" on public.artifacts;
create policy "artifacts all by project membership"
on public.artifacts for all
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));
