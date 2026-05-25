import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ProjectCreateWizard } from '../components/templates/ProjectCreateWizard.jsx';
import { useReferences } from '../hooks/data/useReferences';
import { useCreateProject } from '../hooks/data/useProjects';
import { useCreateAnalysisResult } from '../hooks/data/useAnalysisResult';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { runRecommend, runAnalyzeTokens, runAnalyzeConcept } from '../utils/museAiTasks';

const toPickerItem = (r) => ({
  id: r.id,
  src: r.thumbnail_url,
  storagePath: r.storage_path,
  title: r.title,
  tags: r.tags,
  dominantColors: r.dominant_colors,
});

export function ProjectCreateRoute() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: references } = useReferences();
  const { createProject } = useCreateProject();
  const { createAnalysisResult } = useCreateAnalysisResult();

  const archive = useMemo(() => (references || []).map(toPickerItem), [references]);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <ProjectCreateWizard
          archive={archive}
          recommendedLoader={async ({ intent, mode }) => {
            try {
              const result = await runRecommend({ intent, mode, archive: references || [], n: 6 });
              const ids = new Set(result.recommendedIds || []);
              const recItems = (references || []).filter((r) => ids.has(r.id)).map(toPickerItem);
              return { recommended: recItems, referenceLayer: result.referenceLayer || [] };
            } catch (e) {
              console.warn('[T2 실패]', e);
              return [];
            }
          }}
          onAnalyze={async (payload, updateLayers) => {
            const refNotes = payload.form.referenceNotes || {};
            const enriched = payload.selectedIds.map((id) => {
              const ref = (references || []).find((r) => r.id === id);
              if (!ref) return null;
              const useLayers = payload.selectedRefs?.find((sr) => sr.id === id)?.useLayers || [];
              const note = refNotes[id] || '';
              return { ...ref, thumbnailUrl: ref.thumbnail_url, useLayers, note };
            }).filter(Boolean);

            if (payload.form.mode === 'concept') {
              return runAnalyzeConcept({ intent: payload.form.intent, selectedRefs: enriched, onProgress: updateLayers });
            }
            return runAnalyzeTokens({ intent: payload.form.intent, mode: payload.form.mode, selectedRefs: enriched, onProgress: updateLayers });
          }}
          onComplete={async ({ form, referenceIds, selectedRefs, analysis: analysisResult }) => {
            try {
              const { ok, data: project } = await createProject({
                owner_id: user.id,
                name: form.name,
                intent: form.intent,
                mode: form.mode,
                user_notes: form.userNotes || '',
                reference_notes: form.referenceNotes || {},
              });
              if (!ok || !project) throw new Error('프로젝트 저장 실패');

              // project_references 연결
              if (referenceIds?.length) {
                await supabase.from('project_references').insert(
                  referenceIds.map((rid) => ({
                    project_id: project.id,
                    reference_id: rid,
                    use_layers: selectedRefs?.find((sr) => sr.id === rid)?.useLayers || [],
                  }))
                );
              }

              // 분석 결과 저장
              let layers;
              if (form.mode === 'concept') {
                layers = {
                  color: [], typography: [], layout: [], gradient: [],
                  visualDirection: { markdown: '', tags: { genre: [], style: [], subject: [] } },
                  conceptPrompt: analysisResult?.conceptPrompt || '',
                };
              } else {
                const tokens = analysisResult?.tokens || {};
                layers = {
                  color: tokens.color || [],
                  typography: tokens.typography || [],
                  layout: tokens.layout || [],
                  gradient: tokens.gradient || [],
                  spacing: tokens.spacing || {},
                  rounded: tokens.rounded || {},
                  elevation: Array.isArray(tokens.elevation) ? tokens.elevation : [],
                  components: tokens.components || {},
                  visualDirection: analysisResult?.visualDirection || { markdown: '', tags: {} },
                };
              }
              await createAnalysisResult({ project_id: project.id, status: 'done', layers });

              navigate(`/projects/${project.id}`);
            } catch (e) {
              console.error('[프로젝트 생성 실패]', e);
              window.alert(`프로젝트 저장 중 에러: ${e?.message || e}`);
            }
          }}
          onCancel={() => navigate('/')}
        />
      </Box>
    </Box>
  );
}
