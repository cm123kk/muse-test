# appendix. Auth Design (MUSE)

> Phase 2 산출물. 트리거 SQL + Dashboard 체크리스트.
> 인증 UI 컴포넌트 사양은 [`appendix-auth-ui-spec.md`](./appendix-auth-ui-spec.md).
> 마이그레이션: `supabase/migrations/20260520120100_auth_profiles.sql`

## 인증 방식

- **Provider**: Email + Password
- **이메일 인증**: 필수 (Confirm email ON)
- **비밀번호 정책**: 8자 이상 (클라이언트 validation)
- **역할 시스템**: 없음 (단일 사용자 개인 앱)
- **세션**: Supabase 기본 (access token 1h, refresh token 자동 갱신)

## 가입 시 자동 생성 (`handle_new_user`)

`auth.users` insert 발생 순간 트리거가 `profiles` + `user_settings` row 를 동시에 생성한다.

### profiles 초기값

| 컬럼 | 초기값 | 설명 |
|---|---|---|
| `id` | `auth.users.id` | 동일 |
| `display_name` | 이메일 prefix (@ 앞) | 회원가입 시 `display_name` 메타데이터가 있으면 그 값 우선 |
| `avatar_url` | NULL | 이후 Settings 에서 수정 |

### user_settings 초기값

| 컬럼 | 초기값 |
|---|---|
| `id` | `auth.users.id` |
| `ai_model` | `'claude-sonnet-4-6'` |
| `storage_mode` | `'local'` |
| `theme_mode` | `'system'` |
| `is_auto_tag_enabled` | `true` |

## 클라이언트 플로우

```
회원가입 (email + password)
  → supabase.auth.signUp({ email, password, options: { data: { display_name } }})
  → 인증 메일 발송
  → 사용자 이메일 링크 클릭
  → auth.users insert → handle_new_user → profiles + user_settings 자동 생성
  → 로그인 가능

로그인 (email + password)
  → supabase.auth.signInWithPassword({ email, password })
  → access_token 저장 (localStorage)
  → onAuthStateChange SIGNED_IN 이벤트

로그아웃
  → supabase.auth.signOut()
  → localStorage 토큰 삭제
  → SIGNED_OUT 이벤트 → 앱 상태 초기화

새로고침
  → supabase-js 자동 세션 복원 (getSession)
```

## Supabase Dashboard 설정 체크리스트

CLI 로 검증 불가한 Dashboard 설정. 직접 확인 필요.

- [ ] Auth → Providers → **Email**: Enabled
- [ ] Auth → Settings → **Confirm email**: ON
- [ ] Auth → URL Configuration → **Site URL**: `http://localhost:5173`
- [ ] Auth → URL Configuration → **Redirect URLs** 등록:
  - `http://localhost:5173/*`
  - 프로덕션 URL (배포 시 추가)
- [ ] Auth → Email Templates → 한국어 커스터마이즈 (선택)

## 보안 체크리스트

- [ ] `.env.local` 에 `VITE_SUPABASE_ANON_KEY` 만 (service_role 절대 금지)
- [ ] `.gitignore` 에 `.env.local` 포함 확인
- [ ] `handle_new_user` 함수: `security definer` + `set search_path = public` 확인

## 자주 발생하는 이슈

| 증상 | 원인 / 해결 |
|---|---|
| 회원가입 후 "Email not confirmed" | 이메일 인증 필수. Inbox 확인 |
| 이메일 링크 클릭 후 redirect 실패 | Dashboard Redirect URLs 미등록 |
| 가입 후 profiles row 없음 | `handle_new_user` 트리거 미적용. 마이그레이션 재확인 |
| 새로고침 시 로그아웃됨 | `onAuthStateChange` 미구독. `useAuth` 훅 적용 필요 |
