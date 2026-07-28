import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import { PageContainer } from '../layout/PageContainer.jsx';
import { SplitScreen } from '../layout/SplitScreen.jsx';
import { AnalysisLayerTabs } from '../data-display/AnalysisLayerTabs.jsx';
import { DesignMdPreview } from '../data-display/DesignMdPreview.jsx';
import { ThemeExportDialog } from '../overlay-feedback/ThemeExportDialog.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { RefImage } from '../media/RefImage.jsx';

/**
 * ProjectDetailPage template
 *
 * MUSE project detail screen. Left: layer tabs + token editing / Right: token summary preview.
 * The top "Export" button opens the generic JSON + ZIP bundle dialog.
 *
 * Props:
 * @param {object} project - { id, name, intent, type, referenceIds } [Required]
 * @param {object} analysis - tokens per layer {color, typography, layout, gradient, visualDirection} [Required]
 * @param {array}  [references] - all store references, used for ZIP image bundling [Optional]
 * @param {function} onUpdateToken - (layerKey, tokenId, patch) => void [Required]
 * @param {function} onBack - go back [Optional]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <ProjectDetailPage
 *   project={ { id: 'p1', name: 'Editorial', intent: '...', type: 'landing' } }
 *   analysis={ { color: [...], typography: [...], ... } }
 *   onUpdateToken={ (layer, id, patch) => updateStore(layer, id, patch) }
 * />
 */
export function ProjectDetailPage({
  project,
  analysis,
  references = [],
  onUpdateToken,
  onBack,
  onDelete,
  sx,
}) {
  const [isExportOpen, setExportOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied'

  const referenceNotes = project?.referenceNotes || {};

  const isConceptMode = project?.mode === 'concept';
  const conceptPrompt = analysis?.conceptPrompt || '';

  const handleCopyConceptPrompt = async () => {
    if (!conceptPrompt) return;
    try {
      await navigator.clipboard.writeText(conceptPrompt);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1500);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[copy] clipboard failed', e);
    }
  };

  const handleDownloadConceptBundle = async () => {
    if (!conceptPrompt) return;
    try {
      const { exportConceptPrompt } = await import('../../utils/museExport');
      await exportConceptPrompt({ project, analysis, references });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[ProjectDetailPage] concept bundle download failed', e);
      window.alert(`Download failed: ${e?.message || e}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setDeleteOpen(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[ProjectDetailPage] delete failed', e);
      window.alert(`Delete failed: ${e?.message || e}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const usedReferences = (project?.referenceIds || [])
    .map((id) => references.find((r) => r.id === id))
    .filter(Boolean);

  const renderNotesPanel = () => {
    if (Object.keys(referenceNotes).length === 0) {
      return (
        <Box sx={ { py: 4 } }>
          <Typography variant="caption" color="text.disabled" sx={ { fontStyle: 'italic' } }>
            (No usage notes)
          </Typography>
        </Box>
      );
    }
    const notedRefs = usedReferences.filter((ref) => referenceNotes[ref.id]);
    return (
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={ { textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 } }
        >
          Usage Notes ({ notedRefs.length })
        </Typography>
        <Table size="small" sx={ { '& td': { borderColor: 'divider' } } }>
          <TableBody>
            { notedRefs.map((ref, i, arr) => (
              <TableRow key={ ref.id }>
                <TableCell
                  sx={ {
                    width: 96,
                    verticalAlign: 'top',
                    py: 1.5,
                    pl: 0,
                    pr: 2,
                    borderBottom: i < arr.length - 1 ? '1px solid' : 0,
                  } }
                >
                  <Box
                    sx={ {
                      width: 80,
                      height: 80,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    } }
                  >
                    <RefImage
                      src={ ref.thumbnailUrl || ref.src }
                      storagePath={ ref.storagePath }
                      alt={ ref.title || '' }
                    />
                  </Box>
                </TableCell>
                <TableCell
                  sx={ {
                    py: 1.5,
                    pl: 0,
                    pr: 0,
                    borderBottom: i < arr.length - 1 ? '1px solid' : 0,
                  } }
                >
                  { ref.title && (
                    <Typography
                      variant="caption"
                      sx={ {
                        display: 'block',
                        color: 'text.secondary',
                        fontSize: '0.72rem',
                        mb: 0.5,
                        letterSpacing: '0.02em',
                      } }
                    >
                      { ref.title }
                    </Typography>
                  ) }
                  <Typography variant="body2" sx={ { lineHeight: 1.6 } }>
                    { referenceNotes[ref.id] }
                  </Typography>
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </Box>
    );
  };

  return (
    <PageContainer variant="fluid" sx={ sx }>
      {/* Project header */}
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, py: { xs: 3, md: 6 } } }>
        { onBack && (
          <IconButton onClick={ onBack } aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
        ) }
        <Box sx={ { flex: 1 } }>
          <Typography variant="h3" sx={ { mb: 0.5 } }>
            { project?.name || 'Untitled Project' }
          </Typography>
          { project?.intent && (
            <Typography variant="body2" color="text.secondary">
              { project.intent }
            </Typography>
          ) }
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={ <FolderZipIcon /> }
          onClick={ () => setExportOpen(true) }
        >
          Export
        </Button>
        { onDelete && (
          <IconButton
            onClick={ () => setDeleteOpen(true) }
            aria-label="Delete Project"
            sx={ { color: 'text.secondary', '&:hover': { color: 'error.main' } } }
          >
            <DeleteOutlineIcon />
          </IconButton>
        ) }
      </Box>

        { isConceptMode ? (
          /* Concept mode: single prompt view (no tabs/split) */
          <Box sx={ { mt: 2 } }>
            <Box sx={ { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 } }>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={ { textTransform: 'uppercase', letterSpacing: '0.08em' } }>
                  Concept Prompt
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={ { mt: 0.5 } }>
                  Paste it straight into Claude Desktop, Gemini, or ChatGPT to visualize instantly.
                </Typography>
              </Box>
              <Box sx={ { display: 'flex', gap: 1 } }>
                <Button
                  variant="contained"
                  startIcon={ <ContentCopyIcon /> }
                  onClick={ handleCopyConceptPrompt }
                  disabled={ !conceptPrompt }
                >
                  { copyState === 'copied' ? 'Copied ✓' : 'Copy Prompt' }
                </Button>
                <Button
                  variant="outlined"
                  startIcon={ <DownloadIcon /> }
                  onClick={ handleDownloadConceptBundle }
                  disabled={ !conceptPrompt }
                >
                  Download ZIP (with images)
                </Button>
              </Box>
            </Box>
            <Box
              sx={ {
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                fontSize: 16,
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
                minHeight: 240,
                fontFamily: 'inherit',
              } }
            >
              { conceptPrompt || '(No prompt has been generated yet)' }
            </Box>
            <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mt: 1, textAlign: 'right' } }>
              { conceptPrompt.length } / 800 chars
            </Typography>
          </Box>
        ) : (
          <SplitScreen
            ratio="25:75"
            gap={ 4 }
            stackAt="md"
            left={
              <Box
                sx={ {
                  position: { md: 'sticky' },
                  top: { md: 24 },
                  alignSelf: 'flex-start',
                  maxHeight: { md: 'calc(100vh - 48px)' },
                  overflowY: { md: 'auto' },
                  pr: { md: 1 },
                } }
              >
                { renderNotesPanel() }
              </Box>
            }
            right={
              <Box sx={ { display: 'flex', flexDirection: 'column', gap: 6 } }>
                {/* Analysis results: layer tabs (modularized as AnalysisLayerTabs) */}
                <AnalysisLayerTabs
                  analysis={ analysis }
                  project={ project }
                  references={ references }
                  onUpdateToken={ onUpdateToken }
                />

                {/* Design guide: showcase */}
                { analysis && (
                  <Box
                    sx={ {
                      p: { xs: 2, md: 4 },
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                    } }
                  >
                    <DesignMdPreview project={ project } layers={ analysis } variant="showcase" />
                  </Box>
                ) }
              </Box>
            }
          />
        ) }

      <Box sx={ { height: 64 } } />

      <ThemeExportDialog
        open={ isExportOpen }
        onClose={ () => setExportOpen(false) }
        project={ project }
        analysis={ analysis }
        references={ references }
      />

<Dialog
        open={ isDeleteOpen }
        onClose={ () => !isDeleting && setDeleteOpen(false) }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{ project?.name || 'this project' }</strong>?
            <br />
            The analysis and curation are deleted along with it, and this cannot be undone.
            <br />
            (The uploaded references themselves stay in your Archive.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => setDeleteOpen(false) } disabled={ isDeleting }>
            Cancel
          </Button>
          <Button onClick={ handleDeleteConfirm } color="error" variant="contained" disabled={ isDeleting }>
            { isDeleting ? 'Deleting…' : 'Delete' }
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
