/**
 * Supabase 클라이언트 Mock
 *
 * { client } 주입 패턴을 사용하는 훅에 이 mock 을 전달하면
 * 실제 DB 없이 Storybook / 테스트에서 동일한 컴포넌트가 동작한다.
 *
 * 사용 예시 (Storybook decorator):
 *   import { createMockClient } from '../../lib/supabaseMock';
 *   import { REFERENCES } from '../../data/muse';
 *
 *   const mockClient = createMockClient({
 *     reference_items: REFERENCES,
 *     projects: PROJECTS,
 *   });
 *
 *   export default {
 *     decorators: [(Story) => <Story />, withMockClient(mockClient)],
 *   };
 */

/**
 * @param {Record<string, object[]>} fixtures - 테이블명 → 행 배열
 * @returns {object} Supabase 클라이언트 인터페이스를 흉내낸 mock 객체
 */
export function createMockClient(fixtures = {}) {
  function makeQuery(table) {
    const state = {
      action: 'select',
      filters: [],
      limit: null,
      isSingle: false,
      payload: null,
    };

    const chain = {
      select: () => chain,
      order: () => chain,
      eq: (col, val) => { state.filters.push([col, val]); return chain; },
      neq: () => chain,
      limit: (n) => { state.limit = n; return chain; },
      single: () => { state.isSingle = true; return chain; },
      insert: (p) => { state.action = 'insert'; state.payload = p; return chain; },
      update: (p) => { state.action = 'update'; state.payload = p; return chain; },
      delete: () => { state.action = 'delete'; return chain; },

      then(resolve) {
        const rows = fixtures[table] ? [...fixtures[table]] : [];

        if (state.action === 'select') {
          let result = rows;
          state.filters.forEach(([col, val]) => {
            result = result.filter((r) => r[col] === val);
          });
          if (state.limit) result = result.slice(0, state.limit);
          const data = state.isSingle ? (result[0] ?? null) : result;
          resolve({ data, error: null });
        } else if (state.action === 'insert') {
          const newRow = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...state.payload,
          };
          resolve({ data: state.isSingle ? newRow : [newRow], error: null });
        } else if (state.action === 'update') {
          const target = rows.find((r) =>
            state.filters.every(([col, val]) => r[col] === val),
          );
          const updated = target ? { ...target, ...state.payload } : state.payload;
          resolve({ data: state.isSingle ? updated : [updated], error: null });
        } else if (state.action === 'delete') {
          resolve({ data: null, error: null });
        }
      },
      catch: () => chain,
    };

    return chain;
  }

  return {
    from: (table) => makeQuery(table),

    auth: {
      getUser: async () => ({
        data: { user: { id: 'mock-uid-0001', email: 'demo@muse.test' } },
        error: null,
      }),
      getSession: async () => ({
        data: { session: { user: { id: 'mock-uid-0001', email: 'demo@muse.test' } } },
        error: null,
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },

    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'mock/placeholder.jpg' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: async () => ({ error: null }),
      }),
    },
  };
}
