# appendix. API Integration (MUSE)

> Phase 4+5 deliverable. Client code structure, usage examples, and verification.

## File Structure

```
src/
├── lib/
│   └── supabase.js              # client singleton
├── utils/
│   ├── supabaseError.js         # error normalization
│   └── errorMessages.js         # error code -> Korean mapping
├── types/
│   └── database.js              # JSDoc types (ReferenceItem, Project, etc.)
├── hooks/
│   ├── auth/
│   │   ├── useAuth.js           # global session subscription
│   │   ├── useSignIn.js         # signInWithPassword
│   │   ├── useSignUp.js         # signUp + metadata passing
│   │   └── useSignOut.js        # signOut
│   └── data/
│       ├── useReferences.js     # reference_items CRUD
│       ├── useProjects.js       # projects CRUD
│       ├── useProjectReferences.js  # project_references upsert/delete
│       ├── useAnalysisResult.js # analysis_results read/create/update
│       └── useUserSettings.js   # user_settings read/update
```

## Environment Variables (`.env.local`)

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

> Never place the `service_role` key on the frontend.

## Usage Examples

### Sign In

```jsx
const { signIn, loading, error } = useSignIn();
await signIn({ email, password });
```

### Sign Up

```jsx
const { signUp, loading, error } = useSignUp();
await signUp({ email, password, displayName: 'John Doe' });
```

### List References

```jsx
const { data: references, loading, error } = useReferences();
```

### Create Reference (after upload)

```jsx
const { createReference } = useCreateReference();
await createReference({ owner_id: user.id, source: 'file', thumbnail_url: url });
```

### Create Project (Step 0)

```jsx
const { createProject } = useCreateProject();
const { data: project } = await createProject({ owner_id: user.id, name: 'New Project', mode: 'concept' });
```

### Save Analysis Result (after Step 4 completes)

```jsx
const { createAnalysisResult } = useCreateAnalysisResult();
await createAnalysisResult({ project_id: project.id, status: 'done', layers: analysisJson });
```

### Edit Tokens (isEnabled / emphasis)

```jsx
const { updateAnalysisResult } = useUpdateAnalysisResult();
await updateAnalysisResult(result.id, { layers: updatedLayers });
```

### Update Settings

```jsx
const { updateUserSettings } = useUpdateUserSettings();
await updateUserSettings({ theme_mode: 'dark' });
```

## Error Handling

Every Supabase error passes through `normalizeSupabaseError` and is converted into a Korean message.
To add a new error, add a key-value pair to `ERROR_MESSAGES` in `src/utils/errorMessages.js`.

```jsx
const { signIn, error } = useSignIn();

return (
  <>
    {error && <Alert severity='error'>{error.message}</Alert>}
    <Button onClick={() => signIn({ email, password })}>Sign In</Button>
  </>
);
```

## Injecting a Storybook Mock

Every data hook accepts a mock client via the `{ client }` parameter.

```jsx
// in .stories.jsx
const mockClient = {
  from: () => ({
    select: () => ({ data: mockData, error: null }),
  }),
};

<MyComponent client={mockClient} />
```

## Migration Order

```bash
# 1. Install the Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# 2. Initialize Supabase locally
supabase init
supabase login
supabase link --project-ref [project ref]

# 3. Apply migrations in order
supabase db push
```

| File | Contents |
|---|---|
| `20260520120000_init_schema.sql` | Tables, trigger functions, and indexes |
| `20260520120100_auth_profiles.sql` | handle_new_user trigger |
| `20260520120200_rls_policies.sql` | All RLS policies |

## Verification Queries (run after applying)

```sql
-- Check the table count (should be 6)
select count(*) from information_schema.tables
where table_schema = 'public';

-- Tables with RLS disabled (should be 0)
select tablename from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- List triggers
select trigger_name, event_object_table from information_schema.triggers
where trigger_schema = 'public';
```

## Common Issues

| Symptom | Cause / Fix |
|---|---|
| `Missing VITE_SUPABASE_URL` error | Key not set in `.env.local` |
| All queries blocked by RLS (42501) | Not signed in. Check `useAuth` |
| Supabase called for real in Storybook | You need to inject the `{ client }` mock |
| No profiles row after sign up | `handle_new_user` trigger not applied. Re-run `db push` |
