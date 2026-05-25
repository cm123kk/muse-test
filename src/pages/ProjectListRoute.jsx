import { useNavigate } from 'react-router-dom';
import { ProjectListPage } from '../components/templates/ProjectListPage.jsx';
import { useProjectsWithThumbnails, useDeleteProject } from '../hooks/data/useProjects';

export function ProjectListRoute() {
  const navigate = useNavigate();
  const { data: projects, refetch } = useProjectsWithThumbnails();
  const { deleteProject } = useDeleteProject();

  return (
    <ProjectListPage
      projects={projects || []}
      onSelectProject={(id) => navigate(`/projects/${id}`)}
      onNewProject={() => navigate('/projects/new')}
      onDeleteProject={async (id) => {
        if (window.confirm('이 프로젝트를 삭제할까요?')) {
          await deleteProject(id);
          refetch();
        }
      }}
    />
  );
}
