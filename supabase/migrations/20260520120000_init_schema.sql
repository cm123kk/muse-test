-- ============================================================
-- Phase 1: init_schema.sql
-- MUSE. 초기 스키마 생성
-- 삭제 정책: Hard delete
-- ============================================================

-- 0. set_updated_at 트리거 함수 (프로젝트 공통, 1회)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. profiles (auth.users 확장, User.displayName/avatarUrl 저장)
-- ============================================================
create table public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trg_profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 2. user_settings (사용자 1:1)
-- ============================================================
create table public.user_settings (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  ai_model            text        not null default 'claude-sonnet-4-6',
  storage_mode        text        not null default 'local',
  theme_mode          text        not null default 'system',
  is_auto_tag_enabled boolean     not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger trg_user_settings_set_updated_at
  before update on public.user_settings
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 3. reference_items (영감 이미지 아카이브)
-- ============================================================
create table public.reference_items (
  id              uuid        primary key default gen_random_uuid(),
  owner_id        uuid        not null references auth.users(id) on delete cascade,
  source          text        not null,
  thumbnail_url   text        not null,
  title           text,
  tags            jsonb,
  dominant_colors text[],
  extracted       jsonb,
  created_at      timestamptz not null default now()
);

create index idx_reference_items_owner_id on public.reference_items(owner_id);

-- ============================================================
-- 4. projects (의도+모드+레퍼런스 큐레이션 묶음)
-- ============================================================
create table public.projects (
  id              uuid        primary key default gen_random_uuid(),
  owner_id        uuid        not null references auth.users(id) on delete cascade,
  name            text        not null,
  mode            text        not null,
  intent          text,
  user_notes      text,
  reference_notes jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_projects_owner_id on public.projects(owner_id);

create trigger trg_projects_set_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 5. project_references (M:N 조인: 프로젝트 ↔ 레퍼런스)
-- ============================================================
create table public.project_references (
  id           uuid    primary key default gen_random_uuid(),
  project_id   uuid    not null references public.projects(id) on delete cascade,
  reference_id uuid    not null references public.reference_items(id) on delete cascade,
  use_layers   text[],
  unique (project_id, reference_id)
);

create index idx_project_references_project_id   on public.project_references(project_id);
create index idx_project_references_reference_id on public.project_references(reference_id);

-- ============================================================
-- 6. analysis_results (AI 분석 토큰 묶음)
-- ============================================================
create table public.analysis_results (
  id         uuid        primary key default gen_random_uuid(),
  project_id uuid        not null references public.projects(id) on delete cascade,
  status     text        not null default 'pending',
  layers     jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index idx_analysis_results_project_id on public.analysis_results(project_id);

create trigger trg_analysis_results_set_updated_at
  before update on public.analysis_results
  for each row execute procedure public.set_updated_at();
