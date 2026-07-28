# appendix. RLS Policies (MUSE)

> Phase 3 deliverable. RLS policies for all tables.
> Migration: `supabase/migrations/20260520120200_rls_policies.sql`

## Core Principles

- `ENABLE ROW LEVEL SECURITY` on all public tables
- No policy = DENY by default
- `anon` (not logged in) cannot access any data

## Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE | Pattern |
|---|---|---|---|---|---|
| `profiles` | All | Trigger only | Self only | Not allowed (cascade) | G |
| `user_settings` | Self only | Trigger only | Self only | Not allowed (cascade) | A |
| `reference_items` | Self only | Self only | Self only | Self only | A |
| `projects` | Self only | Self only | Self only | Self only | A |
| `project_references` | Project owner | Project owner | Project owner | Project owner | owner-via-join |
| `analysis_results` | Project owner | Project owner | Project owner | Project owner | owner-via-join |

## Policy Details per Table

### `profiles`

```sql
-- SELECT: anyone (display name in the GNB and similar public fields)
-- INSERT: none (handle_new_user trigger only)
-- UPDATE: self only
-- DELETE: none (deleted via auth.users ON DELETE CASCADE)
```

### `user_settings`

```sql
-- SELECT: self only
-- INSERT: none (handle_new_user trigger only)
-- UPDATE: self only
-- DELETE: none (deleted via auth.users ON DELETE CASCADE)
```

### `reference_items`

```sql
-- Only the owner (owner_id = auth.uid()) can SELECT / INSERT / UPDATE / DELETE
```

### `projects`

```sql
-- Only the owner (owner_id = auth.uid()) can SELECT / INSERT / UPDATE / DELETE
```

### `project_references`

```sql
-- No owner_id. Verify via a JOIN on projects.owner_id
-- SELECT / INSERT / UPDATE / DELETE all: check owns_project(project_id)
```

### `analysis_results`

```sql
-- No owner_id. Verify via a JOIN on projects.owner_id
-- SELECT / INSERT / UPDATE / DELETE all: check owns_project(project_id)
```

## Helper Function

```sql
-- owner-via-join verification for project_references / analysis_results
-- security definer + stable: prevents RLS recursion + optimizes the query planner
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

## Verification Queries (run after Phase 5 is applied)

```sql
-- public tables with RLS disabled (must be 0 rows)
select tablename from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- RLS enabled tables with no policy (target 0 rows)
select c.relname
from pg_class c
left join pg_policy p on p.polrelid = c.oid
where c.relnamespace = 'public'::regnamespace
  and c.relrowsecurity = true
  and p.polname is null;
```

## Expected Verification Results

| Scenario | Expected Result |
|---|---|
| Not logged in, SELECT on `reference_items` | ✅ Returns 0 rows |
| User A runs SELECT on User B's `projects` | ✅ Returns 0 rows |
| User A runs SELECT on their own `projects` | ✅ Returns normally |
| User A runs INSERT on User B's `project_references` | ✅ Blocked |
| User A runs UPDATE on their own project's `analysis_results` | ✅ Allowed |
