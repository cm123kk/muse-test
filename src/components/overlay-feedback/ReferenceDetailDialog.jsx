import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { RefImage } from '../media/RefImage.jsx';

const TAG_GROUPS = [
  { key: 'color', label: 'Color' },
  { key: 'typography', label: 'Typography' },
  { key: 'layout', label: 'Layout' },
  { key: 'gradient', label: 'Gradient' },
];
const VD_GROUPS = [
  { key: 'genre', label: 'Genre' },
  { key: 'style', label: 'Style' },
  { key: 'subject', label: 'Subject' },
];

/** A row of tag chips for one group: label plus Chip list. Not rendered when empty */
function TagRow({ label, tags, activeTags = [] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <Box sx={ { display: 'flex', alignItems: 'flex-start', gap: 2.5, py: 1.5 } }>
      <Typography
        variant="body2"
        sx={ { minWidth: 96, pt: 1, color: 'text.secondary', fontSize: '0.9rem', fontWeight: 500 } }
      >
        { label }
      </Typography>
      <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
        { tags.map((t) => (
          <Chip
            key={ t }
            label={ t }
            color={ activeTags.includes(t) ? 'primary' : 'default' }
            variant={ activeTags.includes(t) ? 'filled' : 'outlined' }
            sx={ { height: 34, fontSize: '0.88rem', px: 0.5 } }
          />
        )) }
      </Box>
    </Box>
  );
}

/**
 * ReferenceDetailDialog component
 *
 * Detail modal shown when an archive card is clicked.
 * Displays all the metadata that gets cut off in the card UI (full tags, dominant colors, source, etc.) at once.
 *
 * Flow:
 * 1. Opens when `reference` is truthy, closes when null
 * 2. A large image on the left (keeps the original aspect ratio), a meta info panel on the right
 * 3. Tags are grouped by layer. Tags included in the current active filter are highlighted as primary chips
 * 4. Closes via ESC, backdrop, or the X button
 *
 * Props:
 * @param {object|null} reference - Reference object to display (closed when null) [Required]
 * @param {function} onClose - () => void close callback [Required]
 * @param {string[]} activeTags - Currently active tags (for highlighting) [Optional, default: []]
 * @param {string[]} activeColors - Currently active dominant colors (for highlighting) [Optional, default: []]
 *
 * Example usage:
 * <ReferenceDetailDialog
 *   reference={ detailTarget }
 *   onClose={ () => setDetailTarget(null) }
 *   activeTags={ activeTags }
 *   activeColors={ activeColors }
 * />
 */
export function ReferenceDetailDialog({
  reference,
  onClose,
  activeTags = [],
  activeColors = [],
}) {
  const isOpen = !!reference;
  const t = reference?.tags || {};
  const vd = t.visualDirection || {};
  const dominantColors = reference?.dominantColors || [];
  const palette = reference?.extracted?.palette || [];

  return (
    <Dialog
      open={ isOpen }
      onClose={ onClose }
      fullScreen
      PaperProps={ { sx: { borderRadius: 0, bgcolor: 'background.default' } } }
    >
      <IconButton
        onClick={ onClose }
        aria-label="Close"
        sx={ {
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(20,19,43,0.6)',
          color: 'common.white',
          backdropFilter: 'blur(6px)',
          '&:hover': { bgcolor: 'rgba(20,19,43,0.85)' },
        } }
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={ { p: 0, height: '100vh', overflow: 'hidden', position: 'relative' } }>
        { /* Image: centered in the viewport on desktop (ignores the sidebar width) */ }
        { reference && (
          <Box
            sx={ {
              position: { xs: 'static', md: 'absolute' },
              inset: { md: 0 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              overflow: 'hidden',
              height: { xs: '55vh', md: '100vh' },
              p: { xs: 4, md: 10 },
              zIndex: 0,
            } }
          >
            <RefImage
              src={ reference.thumbnailUrl || reference.src }
              storagePath={ reference.storagePath }
              alt={ reference.title || 'Reference' }
              sx={ {
                maxWidth: { xs: '100%', md: '33vw' },
                maxHeight: { xs: '100%', md: 'min(100%, 80vh)' },
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              } }
            />
          </Box>
        ) }

        <Box
          sx={ {
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(480px, 600px)' },
            gridTemplateRows: { xs: '1fr auto', md: '1fr' },
            height: '100%',
            position: 'relative',
            zIndex: 1,
          } }
        >
          { /* Left image column: takes up space only, the actual image lives in the absolute layer above */ }
          <Box sx={ { display: { xs: 'none', md: 'block' } } }>
          </Box>

          { /* Right meta side */ }
          <Box
            sx={ {
              p: { xs: 4, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              overflowY: 'auto',
              height: { xs: 'auto', md: '100vh' },
              maxHeight: { xs: '45vh', md: '100vh' },
              bgcolor: 'background.default',
            } }
          >
            <Box>
              <Typography variant="h3" sx={ { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 } }>
                { reference?.title || '(Untitled)' }
              </Typography>
              { (reference?.createdAt || (reference?.source && reference.source !== 'unknown')) && (
                <Typography variant="body2" color="text.secondary" sx={ { display: 'block', mt: 2, fontSize: '0.95rem' } }>
                  { [
                    reference?.createdAt && `Collected ${reference.createdAt}`,
                    reference?.source && reference.source !== 'unknown' && `Source ${reference.source}`,
                  ].filter(Boolean).join(' · ') }
                </Typography>
              ) }
            </Box>

            { dominantColors.length > 0 && (
              <Box>
                <Typography variant="overline" sx={ { fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em' } }>
                  Dominant colors
                </Typography>
                <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 } }>
                  { dominantColors.map((hex, i) => {
                    const isActive = activeColors.some(
                      (a) => a.toLowerCase() === hex.toLowerCase(),
                    );
                    const labelObj = palette[i];
                    return (
                      <Box
                        key={ `${hex}-${i}` }
                        sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 } }
                      >
                        <Box
                          title={ hex }
                          sx={ {
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            bgcolor: hex,
                            border: isActive ? '3px solid' : '1px solid',
                            borderColor: isActive ? 'primary.main' : 'divider',
                            boxSizing: 'border-box',
                          } }
                        />
                        <Typography sx={ { fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.2 } }>
                          { labelObj?.label || hex }
                        </Typography>
                      </Box>
                    );
                  }) }
                </Box>
              </Box>
            ) }

            <Divider />

            <Box>
              <Typography variant="overline" sx={ { fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em' } }>
                Layer tags
              </Typography>
              <Box sx={ { mt: 1.5 } }>
                { TAG_GROUPS.map(({ key, label }) => (
                  <TagRow key={ key } label={ label } tags={ t[key] } activeTags={ activeTags } />
                )) }
              </Box>
            </Box>

            <Box>
              <Typography variant="overline" sx={ { fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em' } }>
                Visual Direction
              </Typography>
              <Box sx={ { mt: 1.5 } }>
                { VD_GROUPS.map(({ key, label }) => (
                  <TagRow key={ key } label={ label } tags={ vd[key] } activeTags={ activeTags } />
                )) }
              </Box>
            </Box>
          </Box>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
