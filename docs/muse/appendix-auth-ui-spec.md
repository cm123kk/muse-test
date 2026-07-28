# appendix. Auth UI Spec (MUSE)

> Input specification for `/component-work`. component-work reads this file to automatically generate components and stories.
> User invocation: `/component-work LoginForm SignUpForm AuthGuard`

## Component List

### 1. LoginForm

- **Category**: `input`
- **Path**: `src/components/input/LoginForm.jsx`
- **Hook consumed**: `useSignIn` (`src/hooks/auth/useSignIn.js`)
- **Fields**: email, password
- **States**: loading / error / success
- **Behavior**: enter values and submit -> call `signIn({ email, password })` -> on success, invoke the `onSuccess` callback
- **Props**:
  - `onSuccess?: () => void` callback on successful login (for example, routing)
- **Storybook stories**: Default / Loading / WithError (inject a mock `useSignIn`)

---

### 2. SignUpForm

- **Category**: `input`
- **Path**: `src/components/input/SignUpForm.jsx`
- **Hook consumed**: `useSignUp` (`src/hooks/auth/useSignUp.js`)
- **Fields**: email, password, password_confirm, display_name (optional)
- **States**: loading / error / awaiting_email_confirmation
- **Behavior**: submit -> call `signUp({ email, password, displayName })` -> show the confirmation email sent notice
- **Props**:
  - `onSuccess?: () => void` callback on completed sign-up
- **Storybook stories**: Default / Loading / AwaitingEmailConfirmation / WithError

---

### 3. AuthGuard

- **Category**: `layout`
- **Path**: `src/components/layout/AuthGuard.jsx`
- **Hook consumed**: `useAuth` (`src/hooks/auth/useAuth.js`)
- **Behavior**: wraps children and redirects to `/auth` when the user is not logged in
- **Props**:
  - `children: ReactNode`
  - `fallback?: ReactNode` component shown when not logged in (default: `<Navigate to="/auth" />`)
- **Storybook stories**: Authenticated / Unauthenticated (inject a mock `useAuth`)

---

## Design System Compliance

- All forms reuse MUI `TextField` + `Button`
- Error messages are in Korean (the normalized result from `supabaseError.js`)
- Use only theme tokens for spacing and typography (no hardcoded values)
- Place these by wrapping the existing `AuthHero` component (`components/templates/AuthHero.jsx`)

## Referenced Hooks (created in Phase 4)

| Hook | Path | Responsibility |
|---|---|---|
| `useAuth` | `src/hooks/auth/useAuth.js` | subscribes to the current user/session |
| `useSignIn` | `src/hooks/auth/useSignIn.js` | signInWithPassword |
| `useSignUp` | `src/hooks/auth/useSignUp.js` | signUp + passes metadata |
| `useSignOut` | `src/hooks/auth/useSignOut.js` | signOut |
