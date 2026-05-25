# appendix. RLS Policies (MUSE)

> Phase 3 산출물. 모든 테이블 RLS 정책.
> 마이그레이션: `supabase/migrations/20260520120200_rls_policies.sql`

## 기본 원칙

- 모든 public 테이블 `ENABLE ROW LEVEL SECURITY`
- 정책 없음 = DENY by default
- `anon` (비로그인) 은 어떤 데이터도 접근 불가

## 정책 매트릭스

| 테이블 | SELECT | INSERT | UPDATE | DELETE | 패턴 |
|---|---|---|---|---|---|
| `profiles` | 전체 | 트리거 전용 | 본인만 | 불가 (cascade) | G |
| `user_settings` | 본인만 | 트리거 전용 | 본인만 | 불가 (cascade) | A |
| `reference_items` | 본인만 | 본인만 | 본인만 | 본인만 | A |
| `projects` | 본인만 | 본인만 | 본인만 | 본인만 | A |
| `project_references` | 프로젝트 소유자 | 프로젝트 소유자 | 프로젝트 소유자 | 프로젝트 소유자 | owner-via-join |
| `analysis_results` | 프로젝트 소유자 | 프로젝트 소유자 | 프로젝트 소유자 | 프로젝트 소유자 | owner-via-join |

## 테이블별 정책 상세

### `profiles`

```sql
-- SELECT: 누구나 (GNB 표시 이름 등 공개)
-- INSERT: 없음 (handle_new_user 트리거 전용)
-- UPDATE: 본인만
-- DELETE: 없음 (auth.users ON DELETE CASCADE 로 삭제)
```

### `user_settings`

```sql
-- SELECT: 본인만
-- INSERT: 없음 (handle_new_user 트리거 전용)
-- UPDATE: 본인만
-- DELETE: 없음 (auth.users ON DELETE CASCADE 로 삭제)
```

### `reference_items`

```sql
-- 본인 소유(owner_id = auth.uid()) 만 SELECT / INSERT / UPDATE / DELETE
```

### `projects`

```sql
-- 본인 소유(owner_id = auth.uid()) 만 SELECT / INSERT / UPDATE / DELETE
```

### `project_references`

```sql
-- owner_id 없음. projects.owner_id 를 JOIN 으로 확인
-- SELECT / INSERT / UPDATE / DELETE 모두: owns_project(project_id) 확인
```

### `analysis_results`

```sql
-- owner_id 없음. projects.owner_id 를 JOIN 으로 확인
-- SELECT / INSERT / UPDATE / DELETE 모두: owns_project(project_id) 확인
```

## 헬퍼 함수

```sql
-- project_references / analysis_results 의 owner-via-join 검증
-- security definer + stable: RLS 재귀 방지 + 쿼리 플래너 최적화
create or replace function public.owns_project(pid uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.projects
    where id = pid and owner_id = auth.uid()
  );
$$;
```

## 검증 쿼리 (Phase 5 적용 후 실행)

```sql
-- RLS 비활성 public 테이블 (반드시 0건)
select tablename from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- 정책 없는 RLS 활성 테이블 (0건 목표)
select c.relname
from pg_class c
left join pg_policy p on p.polrelid = c.oid
where c.relnamespace = 'public'::regnamespace
  and c.relrowsecurity = true
  and p.polname is null;
```

## 예상 검증 결과

| 시나리오 | 기대 결과 |
|---|---|
| 비로그인 `reference_items` SELECT | ✅ 0건 반환 |
| 사용자 A가 사용자 B의 `projects` SELECT | ✅ 0건 반환 |
| 사용자 A가 자기 `projects` SELECT | ✅ 정상 반환 |
| 사용자 A가 B의 `project_references` INSERT | ✅ 차단 |
| 사용자 A가 자기 프로젝트의 `analysis_results` UPDATE | ✅ 허용 |
