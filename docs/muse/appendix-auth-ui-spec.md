# appendix. Auth UI Spec (MUSE)

> `/component-work` 의 입력 사양. 이 파일을 component-work 가 Read 해서 컴포넌트 + 스토리 자동 생성.
> 사용자 호출: `/component-work LoginForm SignUpForm AuthGuard`

## 컴포넌트 목록

### 1. LoginForm

- **카테고리**: `input`
- **경로**: `src/components/input/LoginForm.jsx`
- **소비할 훅**: `useSignIn` (`src/hooks/auth/useSignIn.js`)
- **필드**: email, password
- **상태**: loading / error / success
- **동작**: 입력 후 submit → `signIn({ email, password })` 호출 → 성공 시 `onSuccess` 콜백
- **Props**:
  - `onSuccess?: () => void` 로그인 성공 시 콜백 (예: 라우팅)
- **Storybook 스토리**: Default / Loading / WithError (mock `useSignIn` 주입)

---

### 2. SignUpForm

- **카테고리**: `input`
- **경로**: `src/components/input/SignUpForm.jsx`
- **소비할 훅**: `useSignUp` (`src/hooks/auth/useSignUp.js`)
- **필드**: email, password, password_confirm, display_name (선택)
- **상태**: loading / error / awaiting_email_confirmation
- **동작**: submit → `signUp({ email, password, displayName })` 호출 → 인증 메일 발송 안내 표시
- **Props**:
  - `onSuccess?: () => void` 회원가입 완료 콜백
- **Storybook 스토리**: Default / Loading / AwaitingEmailConfirmation / WithError

---

### 3. AuthGuard

- **카테고리**: `layout`
- **경로**: `src/components/layout/AuthGuard.jsx`
- **소비할 훅**: `useAuth` (`src/hooks/auth/useAuth.js`)
- **동작**: children 을 감싸고 비로그인 시 `/auth` 로 리다이렉트
- **Props**:
  - `children: ReactNode`
  - `fallback?: ReactNode` 비로그인 시 표시할 컴포넌트 (기본: `<Navigate to="/auth" />`)
- **Storybook 스토리**: Authenticated / Unauthenticated (mock `useAuth` 주입)

---

## 디자인 시스템 준수

- 모든 form 은 MUI `TextField` + `Button` 재활용
- 에러 메시지는 한국어 (`supabaseError.js` 정규화 결과)
- spacing / typography 는 theme 토큰만 사용 (직접값 금지)
- 기존 `AuthHero` 컴포넌트 (`components/templates/AuthHero.jsx`) 를 감싸는 형태로 배치

## 참조 훅 (Phase 4 에서 생성)

| 훅 | 경로 | 책임 |
|---|---|---|
| `useAuth` | `src/hooks/auth/useAuth.js` | 현재 user/session 구독 |
| `useSignIn` | `src/hooks/auth/useSignIn.js` | signInWithPassword |
| `useSignUp` | `src/hooks/auth/useSignUp.js` | signUp + 메타데이터 전달 |
| `useSignOut` | `src/hooks/auth/useSignOut.js` | signOut |
