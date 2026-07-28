import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { PageContainer } from '../layout/PageContainer.jsx';
import { MoodboardCard } from '../card/MoodboardCard.jsx';

/**
 * ProjectListPage template
 *
 * MUSE project list screen. Uses MoodboardCard as a 2x2 thumbnail grid to show
 * each project's reference preview, name, and type.
 *
 * Props:
 * @param {array} projects - project list [{ id, name, intent?, thumbnails[], createdAt? }] [Required]
 * @param {function} onSelectProject - project click (id) => void [Optional]
 * @param {function} onNewProject - new project button click [Optional]
 * @param {function} onEditProject - edit (id) => void [Optional]
 * @param {function} onDeleteProject - delete (id) => void [Optional]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <ProjectListPage
 *   projects={ projects }
 *   onSelectProject={ (id) => navigate(`/projects/${id}`) }
 *   onNewProject={ () => navigate('/projects/new') }
 * />
 */
export function ProjectListPage({
  projects,
  onSelectProject,
  onNewProject,
  onEditProject,
  onDeleteProject,
  sx,
}) {
  return (
    <PageContainer variant="fluid" sx={sx}>
      {/* Hero */}
      <Box sx={{ py: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onNewProject}
        >
          New Project
        </Button>
      </Box>

      {/* Grid */}
      {projects.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No projects yet
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onNewProject}>
            Create your first project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <MoodboardCard
                  id={project.id}
                  name={project.name}
                  description={project.intent}
                  items={(project.thumbnails || []).map((url, i) => ({
                    id: `${project.id}-thumb-${i}`,
                    // MoodboardCard reads image.thumbnail or image.src.medium
                    thumbnail: url,
                  }))}
                  createdAt={project.createdAt}
                  onClick={() => onSelectProject?.(project.id)}
                  onEdit={onEditProject ? () => onEditProject(project.id) : undefined}
                  onDelete={onDeleteProject ? () => onDeleteProject(project.id) : undefined}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ height: 64 }} />
    </PageContainer>
  );
}
