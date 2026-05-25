/**
 * MUSE Store — Context + useReducer (in-memory only, start-point 버전)
 *
 * 이 시작 키트에는 백엔드 연동이 없다. 모든 CRUD 는 메모리 내 dispatch 만 수행한다.
 * 페이지 새로고침 시 상태가 초기화된다 (의도된 동작).
 *
 * 디폴트 시드: empty (실습은 빈 상태에서 직접 업로드 → T1 → 프로젝트 생성 → T2/T3 까지 검증).
 * Storybook 등 데모용 fixtures 가 필요하면 <MuseStoreProvider seed="fixtures"> 로 전환.
 *
 * 학습 단계에서 Supabase 연동을 추가할 때 다음을 확장한다:
 *   - addReference: Supabase Storage 업로드 + reference_items insert
 *   - addProject:   projects insert + project_references insert
 *   - setAnalysis:  analysis_results upsert
 *   - updateSettings: user_settings update
 *   - hydrate effect: 로그인 사용자의 데이터 fetch
 */

import { createContext, useContext, useReducer } from 'react';
import {
  references as fixtureReferences,
  projects as fixtureProjects,
  analysisResultsByProjectId as fixtureAnalyses,
  defaultUserSettings,
} from '../data/muse';

const MuseContext = createContext(null);

const FIXTURES_STATE = {
  references: fixtureReferences,
  projects: fixtureProjects,
  analyses: fixtureAnalyses,
  settings: { ...defaultUserSettings },
  loading: false,
  hydrated: true,
};

const EMPTY_STATE = {
  references: [],
  projects: [],
  analyses: {},
  settings: { ...defaultUserSettings },
  loading: false,
  hydrated: true,
};

/* ============================================
 * Reducer
 * ============================================ */

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_REFERENCE':
      return { ...state, references: [action.payload, ...state.references] };

    case 'UPDATE_REFERENCE': {
      const { id, patch } = action.payload;
      return {
        ...state,
        references: state.references.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      };
    }

    case 'REMOVE_REFERENCE':
      return { ...state, references: state.references.filter((r) => r.id !== action.payload) };

    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };

    case 'UPDATE_PROJECT': {
      const { id, patch } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      };
    }

    case 'REMOVE_PROJECT': {
      const id = action.payload;
      const { [id]: _removed, ...remainingAnalyses } = state.analyses;
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== id),
        analyses: remainingAnalyses,
      };
    }

    case 'SET_ANALYSIS':
      return {
        ...state,
        analyses: { ...state.analyses, [action.payload.projectId]: action.payload },
      };

    case 'UPDATE_ANALYSIS_LAYER': {
      const { projectId, layerKey, tokenId, patch } = action.payload;
      const current = state.analyses[projectId];
      if (!current) return state;

      const layer = current.layers[layerKey];
      let nextLayer;
      if (Array.isArray(layer)) {
        nextLayer = layer
          .map((t) => (t.id === tokenId ? { ...t, ...patch } : t))
          .filter((t) => !t._removed);
      } else {
        nextLayer = { ...layer, ...patch };
      }
      return {
        ...state,
        analyses: {
          ...state.analyses,
          [projectId]: {
            ...current,
            layers: { ...current.layers, [layerKey]: nextLayer },
          },
        },
      };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

const genId = () => (typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

/* ============================================
 * Provider
 * ============================================ */

/**
 * @param {object} props
 * @param {'empty'|'fixtures'} [props.seed='empty'] - empty: 빈 상태 (실습 디폴트) / fixtures: 데모 데이터 시드 (Storybook 용)
 */
export function MuseStoreProvider({ children, seed = 'empty' }) {
  const initial = seed === 'fixtures' ? FIXTURES_STATE : EMPTY_STATE;
  const [state, dispatch] = useReducer(reducer, initial);

  return (
    <MuseContext.Provider value={ { state, dispatch, seed } }>
      { children }
    </MuseContext.Provider>
  );
}

/* ============================================
 * Hooks
 * ============================================ */

function useCtx() {
  const ctx = useContext(MuseContext);
  if (!ctx) throw new Error('useMuseStore must be used inside <MuseStoreProvider>');
  return ctx;
}

export function useReferencesSlice() {
  const { state, dispatch } = useCtx();

  const addReference = async (payload = {}) => {
    const { file: _file, ...fields } = payload;
    const id = fields.id || genId();
    const reference = {
      ...fields,
      id,
      source: fields.source || (payload.file ? 'file' : 'url'),
      storagePath: fields.storagePath || null,
      thumbnailUrl: fields.thumbnailUrl || null,
      title: fields.title || '',
      tags: fields.tags || {},
      dominantColors: fields.dominantColors || [],
      extracted: fields.extracted || {},
      createdAt: fields.createdAt || new Date().toISOString(),
    };

    // 백엔드 연동 단계에서: Storage 업로드 → DB insert → 결과 dispatch 순으로 확장.
    dispatch({ type: 'ADD_REFERENCE', payload: reference });
    return reference;
  };

  const updateReference = async (id, patch) => {
    dispatch({ type: 'UPDATE_REFERENCE', payload: { id, patch } });
  };

  const removeReference = async (id) => {
    dispatch({ type: 'REMOVE_REFERENCE', payload: id });
  };

  return {
    references: state.references,
    loading: state.loading,
    hydrated: state.hydrated,
    addReference,
    updateReference,
    removeReference,
  };
}

export function useProjectsSlice() {
  const { state, dispatch } = useCtx();

  const addProject = async (project) => {
    const id = project.id || genId();
    const full = {
      id,
      name: project.name,
      intent: project.intent || '',
      mode: project.mode,
      referenceNotes: project.referenceNotes || {},
      selectedRefs: project.selectedRefs || [],
      referenceIds: project.referenceIds || [],
      createdAt: project.createdAt || new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: full });
    return full;
  };

  const updateProject = async (id, patch) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, patch } });
  };

  const removeProject = async (id) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: id });
  };

  return {
    projects: state.projects,
    loading: state.loading,
    hydrated: state.hydrated,
    addProject,
    updateProject,
    removeProject,
  };
}

export function useAnalysesSlice() {
  const { state, dispatch } = useCtx();

  const setAnalysis = async (analysis) => {
    const full = {
      id: analysis.id || genId(),
      projectId: analysis.projectId,
      layers: analysis.layers || {},
      status: analysis.status || 'done',
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'SET_ANALYSIS', payload: full });
    return full;
  };

  const updateLayer = async (projectId, layerKey, tokenId, patch) => {
    dispatch({ type: 'UPDATE_ANALYSIS_LAYER', payload: { projectId, layerKey, tokenId, patch } });
  };

  return {
    analyses: state.analyses,
    loading: state.loading,
    hydrated: state.hydrated,
    getAnalysis: (projectId) => state.analyses[projectId],
    setAnalysis,
    updateLayer,
  };
}

export function useSettingsSlice() {
  const { state, dispatch } = useCtx();

  const updateSettings = async (patch) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: patch });
  };

  return {
    settings: state.settings,
    updateSettings,
  };
}

export function useMuseStore() {
  return useCtx();
}
