import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ProjectDetailPage } from '../components/templates/ProjectDetailPage.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { useProject, useDeleteProject, useUpdateProject } from '../hooks/data/useProjects';
import { useAnalysisResult, useUpdateAnalysisResult } from '../hooks/data/useAnalysisResult';
import { useReferences } from '../hooks/data/useReferences';

export function ProjectDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, loading: projectLoading } = useProject({ id });
  const { data: analysis } = useAnalysisResult({ projectId: id });
  const { data: references } = useReferences();
  const { deleteProject } = useDeleteProject();
  const { updateProject } = useUpdateProject();
  const { updateAnalysisResult } = useUpdateAnalysisResult();

  if (projectLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Project not found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>id: {id}</Typography>
          <Button variant="contained" onClick={() => navigate('/projects')}>
            Back to projects
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const uiProject = {
    ...project,
    name: project.name,
    mode: project.mode,
    intent: project.intent,
    referenceNotes: project.reference_notes || {},
  };

  const uiReferences = (references || []).map((r) => ({
    ...r,
    thumbnailUrl: r.thumbnail_url,
  }));

  return (
    <ProjectDetailPage
      project={uiProject}
      analysis={analysis?.layers || { color: [], typography: [], layout: [], gradient: [], visualDirection: { markdown: '', tags: {} } }}
      references={uiReferences}
      onUpdateToken={async (layerKey, tokenId, patch) => {
        if (!analysis?.id) return;
        const nextLayers = { ...analysis.layers };
        if (Array.isArray(nextLayers[layerKey])) {
          nextLayers[layerKey] = nextLayers[layerKey].map((t) =>
            t.id === tokenId ? { ...t, ...patch } : t
          );
        }
        await updateAnalysisResult(analysis.id, { layers: nextLayers });
      }}
      onBack={() => navigate('/projects')}
      onDelete={async () => {
        await deleteProject(id);
        navigate('/projects');
      }}
      onUpdateReferenceNotes={async (nextNotes) => {
        await updateProject(id, { reference_notes: nextNotes });
      }}
    />
  );
}
