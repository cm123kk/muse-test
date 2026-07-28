import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { RefImage } from '../media/RefImage.jsx';
import { LAYER_LABEL } from '../../data/muse/layers.js';

/**
 * ReferenceNotesDialog - bulk edit free-text notes per reference
 *
 * Opens from the project detail view when the pencil button next to "Used references" is clicked.
 * Edit every used reference in a list layout on a single screen.
 * Notes are only used to build the paste block and do not trigger a T3 re-call.
 *
 * Props:
 * @param {boolean} open - Whether the Dialog is shown [Required]
 * @param {function} onClose - Close callback [Required]
 * @param {Array<{id, thumbnailUrl, title}>} usedReferences - References the project uses [Required]
 * @param {Object<string, string>} initialNotes - Currently saved notes per ref {refId: text} [Optional, default: {}]
 * @param {Object<string, string[]>} useLayersByRef - useLayers per ref (read-only display) [Optional, default: {}]
 * @param {function} onSave - (nextNotes) => Promise<void> save callback [Required]
 *
 * Example usage:
 * <ReferenceNotesDialog
 *   open={ open }
 *   onClose={ handleClose }
 *   usedReferences={ refs }
 *   initialNotes={ project.referenceNotes }
 *   useLayersByRef={ layersByRef }
 *   onSave={ async (notes) => updateProject(id, { referenceNotes: notes }) }
 * />
 */
export function ReferenceNotesDialog({
  open,
  onClose,
  usedReferences = [],
  initialNotes = {},
  useLayersByRef = {},
  onSave,
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setNotes(initialNotes || {});
  }, [open, initialNotes]);

  const handleChange = (refId, value) => {
    setNotes((prev) => ({ ...prev, [refId]: value }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(notes).filter(([, v]) => v && v.trim().length > 0).map(([k, v]) => [k, v.trim()]),
      );
      await onSave(cleaned);
      onClose?.();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[ReferenceNotesDialog] save failed', e);
      window.alert(`Save failed: ${e?.message || e}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={ open } onClose={ () => !isSaving && onClose?.() } maxWidth="md" fullWidth>
      <DialogTitle>Usage Notes by Reference</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          Write freely about which parts of each reference to borrow. When you paste into an external AI tool, these notes serve as matching cues for each reference.
        </Typography>
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
          { usedReferences.map((ref) => {
            const layers = useLayersByRef[ref.id] || [];
            const note = notes[ref.id] || '';
            return (
              <Box
                key={ ref.id }
                sx={ {
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                } }
              >
                <Box
                  sx={ {
                    width: 96,
                    height: 96,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  } }
                >
                  { ref.thumbnailUrl && (
                    <RefImage
                      src={ ref.thumbnailUrl }
                      storagePath={ ref.storagePath }
                      alt={ ref.title || ref.id }
                    />
                  ) }
                </Box>
                <Box sx={ { flex: 1, minWidth: 0 } }>
                  <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 } }>
                    <Typography variant="body2" sx={ { fontWeight: 600 } }>
                      { ref.title || ref.id }
                    </Typography>
                    <Typography variant="caption" sx={ { fontFamily: 'monospace', color: 'text.secondary' } }>
                      { ref.id }
                    </Typography>
                  </Box>
                  { layers.length > 0 ? (
                    <Box sx={ { display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 } }>
                      { layers.map((l) => (
                        <Chip
                          key={ l }
                          label={ LAYER_LABEL[l] || l }
                          size="small"
                          variant="outlined"
                          sx={ { height: 20, fontSize: '0.65rem' } }
                        />
                      )) }
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1 } }>
                      Borrow layers: auto (all)
                    </Typography>
                  ) }
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    minRows={ 2 }
                    maxRows={ 3 }
                    placeholder={ 'e.g. Borrow only the hero color scheme / mimic the right sidebar structure' }
                    value={ note }
                    onChange={ (e) => handleChange(ref.id, e.target.value) }
                    inputProps={ { maxLength: 100 } }
                    helperText={ `${note.length} / 100` }
                  />
                </Box>
              </Box>
            );
          }) }
          { usedReferences.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={ { textAlign: 'center', py: 4 } }>
              No references used.
            </Typography>
          ) }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={ onClose } disabled={ isSaving }>Cancel</Button>
        <Button onClick={ handleSave } variant="contained" disabled={ isSaving }>
          { isSaving ? 'Saving…' : 'Save' }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
