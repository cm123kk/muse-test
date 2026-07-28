# appendix. Auth Design (MUSE)

> Phase 2 deliverable. Trigger SQL and Dashboard checklist.
> For the auth UI component spec, see [`appendix-auth-ui-spec.md`](./appendix-auth-ui-spec.md).
> Migration: `supabase/migrations/20260520120100_auth_profiles.sql`

## Authentication Method

- **Provider**: Email + Password
- **Email verification**: Required (Confirm email ON)
- **Password policy**: 8 characters or more (client-side validation)
- **Role system**: None (single-user personal app)
- **Session**: Supabase defaults (access token 1h, refresh token auto-renewed)

## Automatic Creation on Sign Up (`handle_new_user`)

The moment an `auth.users` insert occurs, the trigger creates both a `profiles` and a `user_settings` row at the same time.

### profiles Defaults

| Column | Default | Description |
|---|---|---|
| `id` | `auth.users.id` | Same value |
| `display_name` | Email prefix (before the @) | If `display_name` metadata is provided at sign up, that value takes precedence |
| `avatar_url` | NULL | Edited later in Settings |

### user_settings Defaults

| Column | Default |
|---|---|
| `id` | `auth.users.id` |
| `ai_model` | `'claude-sonnet-4-6'` |
| `storage_mode` | `'local'` |
| `theme_mode` | `'system'` |
| `is_auto_tag_enabled` | `true` |

## Client Flow

```
Sign up (email + password)
  -> supabase.auth.signUp({ email, password, options: { data: { display_name } }})
  -> Verification email sent
  -> User clicks the email link
  -> auth.users insert -> handle_new_user -> profiles + user_settings created automatically
  -> Ready to sign in

Sign in (email + password)
  -> supabase.auth.signInWithPassword({ email, password })
  -> access_token stored (localStorage)
  -> onAuthStateChange SIGNED_IN event

Sign out
  -> supabase.auth.signOut()
  -> localStorage token removed
  -> SIGNED_OUT event -> app state reset

Refresh
  -> supabase-js restores the session automatically (getSession)
```

## Supabase Dashboard Configuration Checklist

Dashboard settings that cannot be verified via the CLI. Confirm these manually.

- [ ] Auth -> Providers -> **Email**: Enabled
- [ ] Auth -> Settings -> **Confirm email**: ON
- [ ] Auth -> URL Configuration -> **Site URL**: `http://localhost:5173`
- [ ] Auth -> URL Configuration -> register **Redirect URLs**:
  - `http://localhost:5173/*`
  - Production URL (add when deploying)
- [ ] Auth -> Email Templates -> Korean customization (optional)

## Security Checklist

- [ ] Only `VITE_SUPABASE_ANON_KEY` in `.env.local` (never service_role)
- [ ] Confirm `.env.local` is listed in `.gitignore`
- [ ] `handle_new_user` function: confirm `security definer` + `set search_path = public`

## Common Issues

| Symptom | Cause / Fix |
|---|---|
| "Email not confirmed" after sign up | Email verification is required. Check your inbox |
| Redirect fails after clicking the email link | Redirect URLs not registered in the Dashboard |
| No profiles row after sign up | `handle_new_user` trigger not applied. Re-check the migration |
| Logged out on refresh | Not subscribed to `onAuthStateChange`. Apply the `useAuth` hook |
