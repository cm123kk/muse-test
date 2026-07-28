import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isSimilarColor } from '../../utils/colorSimilarity';
import { PageContainer } from '../layout/PageContainer.jsx';
import { InfiniteMasonry } from '../layout/InfiniteMasonry.jsx';
import { ReferenceCard } from '../card/ReferenceCard.jsx';
import { FileDropzone } from '../input/FileDropzone.jsx';
import { ReferenceDetailDialog } from '../overlay-feedback/ReferenceDetailDialog.jsx';
import { flattenTags } from '../../data/muse';
import { FilterPanel } from './FilterPanel.jsx';
import { useReferenceArchive } from './useReferenceArchive';

/**
 * ArchivePage template
 *
 * MUSE archive screen. A page-level component that combines upload, filtering, and detail actions (delete, re-tag).
 *
 * Flow:
 * 1. Drag or pick an image to upload via the FileDropzone below the top hero
 *    - When `useStoreMode=true`, it handles Storage/DB internally plus T1 auto-tagging
 *    - Otherwise it delegates to the host via `onUploadFile`
 * 2. Sticky FilterPanel: multi-filter by search term, representative color, and per-layer tags
 * 3. Renders cards with InfiniteMasonry. Shows a delete icon on hover and status badges for tagging in progress or failure
 * 4. Clicking the delete button shows a confirmation Dialog. On approval it is removed from the store
 *
 * Props:
 * @param {array}    [references] - Store-less mode when injected externally [Optional]
 * @param {boolean}  [useStoreMode] - Whether to use the store directly [Optional, default: false]
 * @param {function} [onUploadFile] - (file) => void, delegates upload when the store is not used [Optional]
 * @param {function} [onLoadMore] - Load more via infinite scroll [Optional]
 * @param {boolean}  [hasMore] - Whether more can be loaded [Optional, default: false]
 * @param {boolean}  [isLoading] - Whether more is currently loading [Optional, default: false]
 * @param {function} [onNewProject] - New project button click callback [Optional]
 * @param {object}   [sx] - Additional PageContainer styles [Optional]
 *
 * Example usage:
 * <ArchivePage useStoreMode onNewProject={ () => {} } />
 */
export function ArchivePage({
  references: externalReferences,
  useStoreMode = false,
  onUploadFile,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  onNewProject,
  client,
  sx,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [activeColors, setActiveColors] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteState, setDeleteState] = useState({ isDeleting: false, error: null });
  const [detailTarget, setDetailTarget] = useState(null);
  const [isAddRefOpen, setIsAddRefOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const {
    references,
    uploadState,
    pendingCount,
    handleUploadFile,
    handleUploadFiles,
    retryTagging,
    removeReference,
  } = useReferenceArchive({ useStoreMode, externalReferences, onUploadFile, client });

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return references.filter((r) => {
      const refTags = flattenTags(r);
      const matchesTerm = !term
        || (r.title && r.title.toLowerCase().includes(term))
        || refTags.some((t) => t.toLowerCase().includes(term));
      const matchesTags = !activeTags.length
        || activeTags.every((t) => refTags.includes(t));
      // Color filter = similarity matching based on the representative color wheel (OR: a match if any surrounding shade of a single representative color is included)
      const refColors = r.dominantColors || [];
      const matchesColors = !activeColors.length
        || activeColors.some((repHex) => refColors.some((hex) => isSimilarColor(repHex, hex)));
      return matchesTerm && matchesTags && matchesColors;
    });
  }, [references, searchTerm, activeTags, activeColors]);

  const toggleTag = (tag) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const toggleColor = (hex) => {
    setActiveColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex],
    );
  };

  const resetAllFilters = () => {
    setActiveTags([]);
    setActiveColors([]);
  };

  const resetColors = () => setActiveColors([]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteState({ isDeleting: true, error: null });
    try {
      await removeReference(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteState({ isDeleting: false, error: null });
    } catch (e) {
      setDeleteState({ isDeleting: false, error: e?.message || String(e) });
    }
  };

  const hasActiveFilters = !!searchTerm || activeTags.length > 0 || activeColors.length > 0;

  return (
    <>
      <PageContainer variant="fluid" sx={sx}>
        {/* Hero */}
        <Box ref={heroRef} sx={{ py: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>Archive</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddRefOpen(true)}
          >
            Add Reference
          </Button>
        </Box>

        {uploadState.error && (
          <Alert severity="error" sx={{ mb: 2 }}>{uploadState.error}</Alert>
        )}
        {useStoreMode && pendingCount > 0 && (
          <Alert
            severity="info"
            icon={<CircularProgress size={16} thickness={5} />}
            sx={{ mb: 2 }}
          >
            Auto-tagging {pendingCount} image(s). Tags will fill in on each card once it finishes.
          </Alert>
        )}

        {/* Left sticky filter sidebar + right fluid grid */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 4 },
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: 240 },
              flexShrink: 0,
              position: { md: 'sticky' },
              top: { md: 88 },
              alignSelf: { md: 'flex-start' },
            }}
          >
            <FilterPanel
              references={references}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              activeTags={activeTags}
              onToggleTag={toggleTag}
              activeColors={activeColors}
              onToggleColor={toggleColor}
              onResetColors={resetColors}
              onResetFilters={resetAllFilters}
              filteredCount={filtered.length}
              totalCount={references.length}
            />
          </Box>

          <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
            <InfiniteMasonry
              items={filtered}
              hasMore={hasMore && !hasActiveFilters}
              isLoading={isLoading}
              onLoadMore={onLoadMore}
              columns={{ xs: 2, sm: 3, md: 3, lg: 4, xl: 5 }}
              spacing={4}
              emptyContent={
                hasActiveFilters
                  ? 'No references match your filters.'
                  : 'No references yet. Drag an image here to add one.'
              }
              renderItem={(item) => (
                <ArchiveCard
                  item={item}
                  useStoreMode={useStoreMode}
                  onOpenDetail={() => setDetailTarget(item)}
                  onRequestDelete={() =>
                    setDeleteTarget({ id: item.id, title: item.title || '(Untitled)' })
                  }
                  onRetryTagging={() => retryTagging(item)}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ height: 64 }} />
      </PageContainer>

      <Fab
        color="primary"
        variant="extended"
        aria-label="Add Reference"
        onClick={() => setIsAddRefOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 32 },
          right: { xs: 24, md: 32 },
          zIndex: (theme) => theme.zIndex.fab,
          opacity: isHeroVisible ? 0 : 1,
          transform: isHeroVisible ? 'translateY(8px)' : 'translateY(0)',
          pointerEvents: isHeroVisible ? 'none' : 'auto',
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Reference
      </Fab>

      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleteState.isDeleting && setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Reference</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Delete <strong>{deleteTarget?.title}</strong>?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This cannot be undone. The original image file is removed too, and it is automatically unlinked from any project it belongs to.
          </Typography>
          {deleteState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>{deleteState.error}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteState.isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteState.isDeleting}
          >
            {deleteState.isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <ReferenceDetailDialog
        reference={detailTarget}
        onClose={() => setDetailTarget(null)}
        activeTags={activeTags}
        activeColors={activeColors}
      />

      <Dialog
        open={isAddRefOpen}
        onClose={() => setIsAddRefOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Reference</DialogTitle>
        <DialogContent>
          <FileDropzone
            multiple
            onFileSelect={(file) => {
              setIsAddRefOpen(false);
              handleUploadFile(file);
            }}
            onFilesSelect={(files) => {
              setIsAddRefOpen(false);
              handleUploadFiles(files);
            }}
            variant="default"
            isUploading={false}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              e.target.value = '';
              if (!files.length) return;
              setIsAddRefOpen(false);
              if (files.length > 1) handleUploadFiles(files);
              else handleUploadFile(files[0]);
            }}
          />
          {uploadState.error && (
            <Alert severity="error" sx={{ mt: 2 }}>{uploadState.error}</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload File
          </Button>
          <Button onClick={() => setIsAddRefOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/** A single card in the archive grid: includes delete on hover and a tagging status overlay */
function ArchiveCard({ item, useStoreMode, onOpenDetail, onRequestDelete, onRetryTagging }) {
  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .muse-delete-btn': { opacity: 1 },
      }}
    >
      <ReferenceCard
        src={item.thumbnailUrl || item.src}
        title={item.title}
        tags={flattenTags(item).slice(0, 3)}
        dominantColors={item.dominantColors || []}
        state={item._pending ? 1 : 2}
        analyzingVariant="chip"
        errorMessage={item._tagError}
        onRetry={onRetryTagging}
        onClick={onOpenDetail}
      />
      {useStoreMode && !item._pending && (
        <IconButton
          className="muse-delete-btn"
          size="small"
          aria-label="Delete Reference"
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete();
          }}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(20,19,43,0.85)',
            color: 'common.white',
            opacity: 0,
            transition: 'opacity 150ms',
            backdropFilter: 'blur(6px)',
            '&:hover': { bgcolor: 'error.main' },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
