# appendix. API Integration (MUSE)

> Phase 4+5 산출물. 클라이언트 코드 구조 + 사용 예시 + 검증.

## 파일 구조

```
src/
├── lib/
│   └── supabase.js              # client singleton
├── utils/
│   ├── supabaseError.js         # 에러 정규화
│   └── errorMessages.js         # 에러 코드 → 한국어 매핑
├── types/
│   └── database.js              # JSDoc 타입 (ReferenceItem, Project 등)
├── hooks/
│   ├── auth/
│   │   ├── useAuth.js           # 전역 세션 구독
│   │   ├── useSignIn.js         # signInWithPassword
│   │   ├── useSignUp.js         # signUp + 메타데이터 전달
│   │   └── useSignOut.js        # signOut
│   └── data/
│       ├── useReferences.js     # reference_items CRUD
│       ├── useProjects.js       # projects CRUD
│       ├── useProjectReferences.js  # project_references upsert/delete
│       ├── useAnalysisResult.js # analysis_results 조회/생성/수정
│       └── useUserSettings.js   # user_settings 조회/수정
```

## 환경 변수 (`.env.local`)

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

> `service_role` 키는 절대 프론트에 두지 않는다.

## 사용 예시

### 로그인

```jsx
const { signIn, loading, error } = useSignIn();
await signIn({ email, password });
```

### 회원가입

```jsx
const { signUp, loading, error } = useSignUp();
await signUp({ email, password, displayName: '홍길동' });
```

### 레퍼런스 목록 조회

```jsx
const { data: references, loading, error } = useReferences();
```

### 레퍼런스 생성 (업로드 후)

```jsx
const { createReference } = useCreateReference();
await createReference({ owner_id: user.id, source: 'file', thumbnail_url: url });
```

### 프로젝트 생성 (Step 0)

```jsx
const { createProject } = useCreateProject();
const { data: project } = await createProject({ owner_id: user.id, name: '새 프로젝트', mode: 'concept' });
```

### 분석 결과 저장 (Step 4 완료 후)

```jsx
const { createAnalysisResult } = useCreateAnalysisResult();
await createAnalysisResult({ project_id: project.id, status: 'done', layers: analysisJson });
```

### 토큰 편집 (isEnabled / emphasis)

```jsx
const { updateAnalysisResult } = useUpdateAnalysisResult();
await updateAnalysisResult(result.id, { layers: updatedLayers });
```

### 설정 수정

```jsx
const { updateUserSettings } = useUpdateUserSettings();
await updateUserSettings({ theme_mode: 'dark' });
```

## 에러 처리

모든 Supabase 에러는 `normalizeSupabaseError` 를 거쳐 한국어 메시지로 변환된다.
에러 추가 시 `src/utils/errorMessages.js` 의 `ERROR_MESSAGES` 에 키-값 추가.

```jsx
const { signIn, error } = useSignIn();

return (
  <>
    {error && <Alert severity='error'>{error.message}</Alert>}
    <Button onClick={() => signIn({ email, password })}>로그인</Button>
  </>
);
```

## Storybook Mock 주입

모든 데이터 훅은 `{ client }` 파라미터로 mock client 주입 가능.

```jsx
// .stories.jsx 에서
const mockClient = {
  from: () => ({
    select: () => ({ data: mockData, error: null }),
  }),
};

<MyComponent client={mockClient} />
```

## 마이그레이션 적용 순서

```bash
# 1. Supabase CLI 설치 (미설치 시)
brew install supabase/tap/supabase

# 2. 로컬 Supabase 초기화
supabase init
supabase login
supabase link --project-ref [프로젝트 ref]

# 3. 마이그레이션 순서대로 적용
supabase db push
```

| 파일 | 내용 |
|---|---|
| `20260520120000_init_schema.sql` | 테이블 + 트리거 함수 + 인덱스 |
| `20260520120100_auth_profiles.sql` | handle_new_user 트리거 |
| `20260520120200_rls_policies.sql` | RLS 정책 전체 |

## 검증 쿼리 (적용 후 실행)

```sql
-- 테이블 개수 확인 (6개)
select count(*) from information_schema.tables
where table_schema = 'public';

-- RLS 비활성 테이블 (0개여야 함)
select tablename from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- 트리거 목록 확인
select trigger_name, event_object_table from information_schema.triggers
where trigger_schema = 'public';
```

## 자주 발생하는 이슈

| 증상 | 원인 / 해결 |
|---|---|
| `Missing VITE_SUPABASE_URL` 에러 | `.env.local` 에 키 미입력 |
| 모든 쿼리 RLS 차단 (42501) | 로그인 안 된 상태. `useAuth` 확인 |
| Storybook 에서 Supabase 실제 호출 | `{ client }` mock 주입 필요 |
| 회원가입 후 profiles 없음 | `handle_new_user` 트리거 미적용. `db push` 재실행 |
