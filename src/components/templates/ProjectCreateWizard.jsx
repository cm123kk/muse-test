import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ReferencePicker } from './ReferencePicker.jsx';
import { AnalysisProgress } from '../overlay-feedback/AnalysisProgress.jsx';
import { ModeSelectCard } from '../card/ModeSelectCard.jsx';
import { IntentGuideField } from '../input/IntentGuideField.jsx';
import { RefImage } from '../media/RefImage.jsx';
import { runSuggestRefNote } from '../../utils/museAiTasks';
import Chip from '@mui/material/Chip';
import {
  LAYER_LABEL,
  TOKEN_LAYER_CATEGORIES as MUSE_LAYERS,
} from '../../data/muse/layers.js';

const STEPS = ['Mode', 'Title + Intent', 'References', 'Usage Notes', 'Analysis'];

const MODE_DEFS = [
  {
    mode: 'concept',
    title: 'Concept Design',
    subtitle: 'When you want to quickly shape a design concept from references',
    description: 'Feed your reference bundle straight into Claude Design. A single prompt that fuses mood, color, and typography returns concept drafts fast.',
  },
  {
    mode: 'system',
    title: 'Design System',
    subtitle: 'Build design system tokens to maintain in your dev environment',
    description: 'Export the color, typography, and layout tokens extracted from references as DTCG / MUI theme formats. Commit them straight into a new project repo as your system starting point.',
  },
];

const initialState = {
  step: 0,
  form: { name: '', intent: '', mode: 'concept', referenceNotes: {} },
  selectedIds: [],
  selectedRefs: [], // TP4: [{ id, useLayers }]
  tagFilter: [],
  analysisLayers: MUSE_LAYERS.map((l) => ({ ...l, status: 'pending' })),
  analysisState: 'idle',
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, STEPS.length - 1) };
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'GOTO':
      return { ...state, step: action.payload };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_MODE':
      return { ...state, form: { ...state.form, mode: action.payload } };
    case 'SET_INTENT':
      return { ...state, form: { ...state.form, intent: action.payload } };
    case 'SET_REFERENCE_NOTE': {
      const { id, text } = action.payload;
      const next = { ...state.form.referenceNotes };
      if (text && text.trim().length > 0) next[id] = text;
      else delete next[id];
      return { ...state, form: { ...state.form, referenceNotes: next } };
    }
    case 'SET_SELECTED':
      return { ...state, selectedIds: action.payload };
    case 'SET_SELECTED_REFS':
      return { ...state, selectedRefs: action.payload };
    case 'SET_USE_LAYERS': {
      const { id, layers } = action.payload;
      const existing = state.selectedRefs.find((r) => r.id === id);
      const next = existing
        ? state.selectedRefs.map((r) => (r.id === id ? { ...r, useLayers: layers } : r))
        : [...state.selectedRefs, { id, useLayers: layers }];
      return { ...state, selectedRefs: next };
    }
    case 'SET_TAG_FILTER':
      return { ...state, tagFilter: action.payload };
    case 'ANALYSIS_START':
      return {
        ...state,
        analysisState: 'running',
        analysisLayers: MUSE_LAYERS.map((l, i) => ({
          ...l,
          status: i === 0 ? 'running' : 'pending',
        })),
      };
    case 'ANALYSIS_UPDATE':
      return { ...state, analysisLayers: action.payload };
    case 'ANALYSIS_DONE':
      return {
        ...state,
        analysisState: 'done',
        analysisLayers: state.analysisLayers.map((l) => ({ ...l, status: 'done' })),
      };
    case 'ANALYSIS_ERROR':
      return { ...state, analysisState: 'error' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * ProjectCreateWizard component (TP2-TP5 integrated)
 *
 * MUSE project creation 5-step wizard.
 * Step 0: mode selection (TP2) -> Step 1: basic info + intent seed (TP3)
 * -> Step 2: reference selection + layer chips (TP4)
 * -> Step 3: pre-analysis confirmation box (TP5)
 * -> Step 4: analysis in progress
 *
 * Props:
 * @param {array} archive - Archive references [Required]
 * @param {array} recommended - Recommended references (optional) [Optional]
 * @param {function} recommendedLoader - ({ intent, type, mode }) => Promise<recommended[]>
 * @param {function} onAnalyze - (payload, onProgress) => Promise<{tokens, visualDirection}>
 * @param {function} onComplete - Callback on completion
 * @param {function} onCancel - Cancel
 * @param {object} sx
 *
 * Example usage:
 * <ProjectCreateWizard archive={ refs } onAnalyze={ analyze } onComplete={ done } />
 */
export function ProjectCreateWizard({
  archive,
  recommended = [],
  recommendedLoader,
  onAnalyze,
  onComplete,
  onCancel,
  sx,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();

  // T2 auto-call (on entering Step 2)
  const [loadedRecommended, setLoadedRecommended] = useState(null);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const [referenceLayerMap, setReferenceLayerMap] = useState({}); // Cache of T2 referenceLayer results
  const [suggestingRefIds, setSuggestingRefIds] = useState({}); // { [refId]: true }: Step 3 note auto-generation in progress

  /**
   * Presentational-only progress pacing.
   *
   * The real analysis resolves multiple layers per API call (Phase 1 returns
   * color/typography/layout/gradient/visualDirection at once), so their progress
   * would otherwise flip to "done" simultaneously. This wrapper reveals a batch of
   * newly-done layers one at a time so the UI reads as sequential completion.
   *
   * It only paces ANALYSIS_UPDATE dispatches. It never touches the analysis data,
   * the resolved result, or the onAnalyze/onComplete flow. The emitted arrays keep
   * the exact same shape the analyzer passes in (only `status` is toggled), and the
   * terminal ANALYSIS_DONE always snaps every layer to done, so completion is never
   * delayed past the real finish.
   */
  const revealTimersRef = useRef([]);
  const displayedLayersRef = useRef(null);

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach(clearTimeout);
    revealTimersRef.current = [];
  }, []);

  const emitProgress = useCallback((target) => {
    clearRevealTimers();
    const prev = displayedLayersRef.current;
    displayedLayersRef.current = target;
    const prevDone = new Set((prev || []).filter((l) => l.status === 'done').map((l) => l.key));
    const newlyDoneKeys = target
      .filter((l) => l.status === 'done' && !prevDone.has(l.key))
      .map((l) => l.key);

    // Zero or one newly-done layer: nothing to stagger, pass through unchanged.
    if (newlyDoneKeys.length <= 1) {
      dispatch({ type: 'ANALYSIS_UPDATE', payload: target });
      return;
    }

    const STEP_MS = 380;
    const revealed = new Set();
    const render = () => {
      const payload = target.map((l) => (
        newlyDoneKeys.includes(l.key) && !revealed.has(l.key)
          ? { ...l, status: 'running' }
          : l
      ));
      dispatch({ type: 'ANALYSIS_UPDATE', payload });
    };
    render();
    newlyDoneKeys.forEach((key, idx) => {
      const timer = setTimeout(() => {
        revealed.add(key);
        if (idx === newlyDoneKeys.length - 1) {
          dispatch({ type: 'ANALYSIS_UPDATE', payload: target });
        } else {
          render();
        }
      }, (idx + 1) * STEP_MS);
      revealTimersRef.current.push(timer);
    });
  }, [clearRevealTimers]);

  useEffect(() => () => clearRevealTimers(), [clearRevealTimers]);

  const handleSuggestNote = async (ref, useLayers) => {
    if (!ref?.id || suggestingRefIds[ref.id]) return;
    setSuggestingRefIds((prev) => ({ ...prev, [ref.id]: true }));
    try {
      const note = await runSuggestRefNote({
        intent: state.form.intent,
        mode: state.form.mode,
        ref,
        useLayers,
      });
      if (note) {
        dispatch({ type: 'SET_REFERENCE_NOTE', payload: { id: ref.id, text: note } });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[suggest-ref-note] failed', e?.message || e);
    } finally {
      setSuggestingRefIds((prev) => {
        const next = { ...prev };
        delete next[ref.id];
        return next;
      });
    }
  };

  useEffect(() => {
    if (state.step === 2 && recommendedLoader && !loadedRecommended && !isLoadingRecommended) {
      setIsLoadingRecommended(true);
      Promise.resolve(recommendedLoader({ ...state.form }))
        .then((result) => {
          // If result is an array it's a list; if it's an object, assume { recommended, referenceLayer } shape
          if (Array.isArray(result)) {
            setLoadedRecommended(result);
          } else if (result && Array.isArray(result.recommended)) {
            setLoadedRecommended(result.recommended);
            if (Array.isArray(result.referenceLayer)) {
              const map = {};
              result.referenceLayer.forEach((rl) => { map[rl.id] = rl.layers; });
              setReferenceLayerMap(map);
            }
          } else {
            setLoadedRecommended([]);
          }
        })
        .catch(() => setLoadedRecommended([]))
        .finally(() => setIsLoadingRecommended(false));
    }
  }, [state.step, recommendedLoader, loadedRecommended, isLoadingRecommended, state.form]);

  const effectiveRecommended = loadedRecommended || recommended || [];

  const isStep0Valid = !!state.form.mode;
  const isStep1Valid = state.form.name.trim().length > 0 && state.form.intent.trim().length > 0;
  const isStep2Valid = state.selectedIds.length > 0;
  // Step 3 = per-ref usage notes. All optional (0 chars OK): if there's no partial-borrow intent, you can leave it blank and continue.
  const isStep3Valid = true;

  const handleStartAnalysis = async () => {
    dispatch({ type: 'GOTO', payload: 4 });
    dispatch({ type: 'ANALYSIS_START' });

    // Order selectedRefs by selectedIds; items missing useLayers default to auto (empty array)
    const enrichedSelectedRefs = state.selectedIds.map((id) => {
      const existing = state.selectedRefs.find((r) => r.id === id);
      return existing || { id, useLayers: [] };
    });

    const payload = {
      form: state.form,                  // includes referenceNotes
      selectedIds: state.selectedIds,
      selectedRefs: enrichedSelectedRefs,
      mode: state.form.mode,
      referenceNotes: state.form.referenceNotes,
    };

    let analysisResult = null;
    try {
      if (onAnalyze) {
        displayedLayersRef.current = null;
        analysisResult = await onAnalyze(payload, emitProgress);
      } else {
        await new Promise((resolve) => {
          let i = 0;
          const tick = () => {
            if (i >= MUSE_LAYERS.length) return resolve();
            dispatch({
              type: 'ANALYSIS_UPDATE',
              payload: MUSE_LAYERS.map((l, idx) => ({
                ...l,
                status: idx < i ? 'done' : idx === i ? 'running' : 'pending',
              })),
            });
            i += 1;
            return setTimeout(tick, 900);
          };
          tick();
        });
      }
      clearRevealTimers();
      dispatch({ type: 'ANALYSIS_DONE' });
      onComplete?.({
        form: state.form,
        referenceIds: state.selectedIds,
        selectedRefs: enrichedSelectedRefs,
        analysis: analysisResult,
      });
    } catch {
      clearRevealTimers();
      dispatch({ type: 'ANALYSIS_ERROR' });
    }
  };

  const renderStep = () => {
    // Step 0: mode selection (TP2)
    if (state.step === 0) {
      return (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 1200, mx: 'auto', width: '100%' } }>
          <Box
            sx={ {
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: { xs: 2, md: 4 },
            } }
          >
            { MODE_DEFS.map((m) => (
              <Box
                key={ m.mode }
                sx={ {
                  flex: { xs: '1 1 100%', md: '0 1 360px' },
                  display: 'flex',
                } }
              >
                <ModeSelectCard
                  { ...m }
                  isSelected={ state.form.mode === m.mode }
                  onSelect={ (mode) => dispatch({ type: 'SET_MODE', payload: mode }) }
                />
              </Box>
            )) }
          </Box>
        </Box>
      );
    }

    // Step 1: basic info + TP3 intent seed
    if (state.step === 1) {
      return (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 720, mx: 'auto', width: '100%' } }>
          <TextField
            value={ state.form.name }
            onChange={ (e) => dispatch({ type: 'UPDATE_FORM', payload: { name: e.target.value } }) }
            placeholder="Project name (e.g. Editorial Portfolio)"
            label="Project name"
            fullWidth
          />
          <IntentGuideField
            value={ state.form.intent }
            onChange={ (next) => dispatch({ type: 'SET_INTENT', payload: next }) }
            label="One-line intent"
            placeholder="e.g. Calm dark-mood fintech dashboard, data readability first"
          />
        </Box>
      );
    }

    // Step 2: references + TP4 layer chips
    if (state.step === 2) {
      return (
        <Box>
          { isLoadingRecommended && (
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 2 } }>
              <CircularProgress size={ 14 } />
              <Typography variant="caption" color="text.secondary">
                Finding references that match your intent and mode ({ state.form.mode })…
              </Typography>
            </Box>
          ) }
          <ReferencePicker
            recommended={ effectiveRecommended }
            archive={ archive }
            selectedIds={ state.selectedIds }
            onChange={ (ids) => dispatch({ type: 'SET_SELECTED', payload: ids }) }
            tagFilter={ state.tagFilter }
            onTagFilterChange={ (tags) => dispatch({ type: 'SET_TAG_FILTER', payload: tags }) }
            referenceLayerMap={ referenceLayerMap }
            selectedRefs={ state.selectedRefs }
            onUseLayersChange={ (id, layers) =>
              dispatch({ type: 'SET_USE_LAYERS', payload: { id, layers } })
            }
            mode={ state.form.mode }
          />
        </Box>
      );
    }

    // Step 3: per-reference usage notes (which part of each ref to borrow)
    if (state.step === 3) {
      const selectedFullRefs = state.selectedIds
        .map((id) => archive.find((a) => a.id === id))
        .filter(Boolean)
        .map((a) => ({
          id: a.id,
          thumbnailUrl: a.src || a.thumbnailUrl,
          storagePath: a.storagePath,
          title: a.title,
          tags: a.tags,
          dominantColors: a.dominantColors,
          extracted: a.extracted,
        }));
      const useLayersByRef = Object.fromEntries(
        state.selectedRefs.map((sr) => [sr.id, sr.useLayers || []]),
      );
      const notes = state.form.referenceNotes || {};
      return (
        <Box sx={ { maxWidth: 880, mx: 'auto', width: '100%' } }>
          <Typography variant="h5" sx={ { fontWeight: 700, mb: 1.5 } }>
            Usage notes per reference
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={ { mb: 5 } }>
            Jot down which part of each reference you want to borrow. You can leave it blank and still continue.
            Notes take priority during analysis and appear in the output paste block as per-reference matching cues.
          </Typography>
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3 } }>
            { selectedFullRefs.map((ref) => {
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
                      width: 88,
                      height: 88,
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
                    <Box sx={ { position: 'relative' } }>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        minRows={ 2 }
                        maxRows={ 3 }
                        placeholder={ 'e.g. borrow only the hero color / mimic the right sidebar structure' }
                        value={ note }
                        onChange={ (e) =>
                          dispatch({ type: 'SET_REFERENCE_NOTE', payload: { id: ref.id, text: e.target.value } })
                        }
                        inputProps={ { maxLength: 100, style: { paddingRight: 32 } } }
                        helperText={ `${note.length} / 100` }
                      />
                      <Tooltip title={ suggestingRefIds[ref.id] ? 'Generating…' : 'Auto-generate usage note with AI' } placement="top">
                        <span style={ { position: 'absolute', top: 4, right: 4 } }>
                          <IconButton
                            size="small"
                            aria-label="Auto-generate note with AI"
                            disabled={ !!suggestingRefIds[ref.id] }
                            onClick={ () => handleSuggestNote(ref, layers) }
                            sx={ {
                              color: 'primary.main',
                              '@keyframes refNoteAiPulse': {
                                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.55, transform: 'scale(0.92)' },
                              },
                              '& .MuiSvgIcon-root': {
                                animation: suggestingRefIds[ref.id]
                                  ? 'refNoteAiPulse 900ms ease-in-out infinite'
                                  : 'none',
                                filter: suggestingRefIds[ref.id]
                                  ? `drop-shadow(0 0 6px ${alpha(theme.palette.info.light, 0.6)})`
                                  : 'none',
                              },
                              '&:hover .MuiSvgIcon-root': {
                                filter: `drop-shadow(0 0 4px ${alpha(theme.palette.info.light, 0.5)})`,
                              },
                            } }
                          >
                            { suggestingRefIds[ref.id]
                              ? <CircularProgress size={ 16 } thickness={ 5 } />
                              : <AutoAwesomeIcon fontSize="small" /> }
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              );
            }) }
            { selectedFullRefs.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={ { textAlign: 'center', py: 4 } }>
                Select references in Step 2 first.
              </Typography>
            ) }
          </Box>
        </Box>
      );
    }

    // Step 4: analysis
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center' } }>
        <AnalysisProgress
          title={ `Analyzing "${state.form.name}"` }
          intent={ state.form.intent }
          layers={ state.analysisLayers }
          onCancel={ state.analysisState === 'running' ? onCancel : undefined }
          onRetry={ state.analysisState === 'error' ? handleStartAnalysis : undefined }
        />
      </Box>
    );
  };

  const BOTTOM_BAR_HEIGHT = 88;
  const APP_BAR_HEIGHT = 64;

  return (
    <Box sx={ { width: '100%', ...sx } }>
      <Box
        sx={ {
          width: '100%',
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          pb: `${BOTTOM_BAR_HEIGHT}px`,
        } }
      >
        <Box
          sx={ {
            flexShrink: 0,
            px: { xs: 3, md: 6, lg: 10 },
            pt: { xs: 3, md: 5 },
            pb: { xs: 2, md: 3 },
          } }
        >
          <Stepper activeStep={ state.step } sx={ { maxWidth: 960, mx: 'auto', width: '100%' } }>
            { STEPS.map((label) => (
              <Step key={ label }>
                <StepLabel>{ label }</StepLabel>
              </Step>
            )) }
          </Stepper>
        </Box>

        <Box
          sx={ {
            flex: 1,
            minHeight: 0,
            width: '100%',
            overflowY: 'auto',
            px: { xs: 3, md: 6, lg: 10 },
            py: { xs: 3, md: 5 },
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          } }
        >
          <Box
            sx={ {
              width: '100%',
              // Step 2 (reference selection) is top-aligned; the rest are centered in the viewport
              my: state.step === 2 ? 0 : 'auto',
            } }
          >
            { renderStep() }
          </Box>
        </Box>
      </Box>

      {/* Fixed bottom navigation */}
      <Box
        sx={ {
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          height: BOTTOM_BAR_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 3, md: 6, lg: 10 },
        } }
      >
        <Box
          sx={ {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          } }
        >
          <Button
            variant="text"
            color="inherit"
            size="large"
            onClick={ state.step > 0 ? () => dispatch({ type: 'BACK' }) : onCancel }
            disabled={ state.analysisState === 'running' }
          >
            { state.step > 0 ? 'Back' : 'Cancel' }
          </Button>

          { state.step === 0 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={ () => dispatch({ type: 'NEXT' }) }
              disabled={ !isStep0Valid }
            >
              Next
            </Button>
          ) }

          { state.step === 1 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={ () => dispatch({ type: 'NEXT' }) }
              disabled={ !isStep1Valid }
            >
              Next
            </Button>
          ) }

          { state.step === 2 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={ () => dispatch({ type: 'NEXT' }) }
              disabled={ !isStep2Valid }
            >
              Next · { state.selectedIds.length }
            </Button>
          ) }

          { state.step === 3 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={ handleStartAnalysis }
              disabled={ !isStep3Valid }
            >
              Start Analysis →
            </Button>
          ) }

          { state.step === 4 && state.analysisState === 'done' && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={ () => onComplete?.({
                form: state.form,
                referenceIds: state.selectedIds,
                selectedRefs: state.selectedRefs,
                analysis: null,
              }) }
            >
              Open Project
            </Button>
          ) }
        </Box>
      </Box>
    </Box>
  );
}
