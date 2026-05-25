-- ============================================================
-- Phase 3: rls_policies.sql
-- MUSE. 전체 RLS 정책
-- ============================================================

-- ============================================================
-- 헬퍼 함수: project_references / analysis_results owner 확인
-- ============================================================
create or replace function public.owns_project(pid uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.projects
    where id = pid and owner_id = auth.uid()
  );
$$;

-- ============================================================
-- 1. profiles (패턴 G: 전체 SELECT, 본인 UPDATE, INSERT 없음)
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- 2. user_settings (패턴 A: 본인만, INSERT 없음)
-- ============================================================
alter table public.user_settings enable row level security;

create policy "user_settings_select_own"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = id);

create policy "user_settings_update_own"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- 3. reference_items (패턴 A: owner-only 전체)
-- ============================================================
alter table public.reference_items enable row level security;

create policy "reference_items_select_own"
  on public.reference_items for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "reference_items_insert_own"
  on public.reference_items for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "reference_items_update_own"
  on public.reference_items for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "reference_items_delete_own"
  on public.reference_items for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ============================================================
-- 4. projects (패턴 A: owner-only 전체)
-- ============================================================
alter table public.projects enable row level security;

create policy "projects_select_own"
  on public.projects for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "projects_update_own"
  on public.projects for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "projects_delete_own"
  on public.projects for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ============================================================
-- 5. project_references (owner-via-join: owns_project 경유)
-- ============================================================
alter table public.project_references enable row level security;

create policy "project_references_select_own"
  on public.project_references for select
  to authenticated
  using (public.owns_project(project_id));

create policy "project_references_insert_own"
  on public.project_references for insert
  to authenticated
  with check (public.owns_project(project_id));

create policy "project_references_update_own"
  on public.project_references for update
  to authenticated
  using (public.owns_project(project_id))
  with check (public.owns_project(project_id));

create policy "project_references_delete_own"
  on public.project_references for delete
  to authenticated
  using (public.owns_project(project_id));

-- ============================================================
-- 6. analysis_results (owner-via-join: owns_project 경유)
-- ============================================================
alter table public.analysis_results enable row level security;

create policy "analysis_results_select_own"
  on public.analysis_results for select
  to authenticated
  using (public.owns_project(project_id));

create policy "analysis_results_insert_own"
  on public.analysis_results for insert
  to authenticated
  with check (public.owns_project(project_id));

create policy "analysis_results_update_own"
  on public.analysis_results for update
  to authenticated
  using (public.owns_project(project_id))
  with check (public.owns_project(project_id));

create policy "analysis_results_delete_own"
  on public.analysis_results for delete
  to authenticated
  using (public.owns_project(project_id));
