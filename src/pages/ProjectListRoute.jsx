import { useEffect, useRef } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { ProjectListPage } from '../components/templates/ProjectListPage.jsx';
import { useProjectsWithThumbnails, useDeleteProject } from '../hooks/data/useProjects';

export function ProjectListRoute() {
  const navigate = useNavigate();
  const isActive = !!useMatch('/projects');
  const { data: projects, refetch } = useProjectsWithThumbnails();
  const { deleteProject } = useDeleteProject();

  // AppShellLayout keeps this route mounted (it only toggles display), so it never
  // remounts on tab navigation and the list would stay stale until a full reload.
  // Refetch whenever /projects becomes active again (e.g. returning after creating a
  // project) so newly created projects appear without refreshing. The initial mount is
  // skipped because the hook already fetches on mount.
  const wasActiveRef = useRef(isActive);
  useEffect(() => {
    if (isActive && !wasActiveRef.current) refetch();
    wasActiveRef.current = isActive;
  }, [isActive, refetch]);

  return (
    <ProjectListPage
      projects={projects || []}
      onSelectProject={(id) => navigate(`/projects/${id}`)}
      onNewProject={() => navigate('/projects/new')}
      onDeleteProject={async (id) => {
        if (window.confirm('Delete this project?')) {
          await deleteProject(id);
          refetch();
        }
      }}
    />
  );
}
