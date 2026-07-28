import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { buildDesignMd } from '../../utils/tokenConverters.js';

/**
 * DESIGN.md preview, getdesign.md style.
 *
 * Branching by variant:
 *  - 'raw'      : DESIGN.md raw markdown box + copy / download only (for the DESIGN.md tab)
 *  - 'showcase' : live component render + spacing/rounded/elevation visualization (for the design guide, below the tabs)
 *  - 'full'     : all of the above (default, for standalone use)
 *
 * Props:
 * @param {object} project - { name, intent, mode } [Required]
 * @param {object} layers  - analysis layers [Required]
 * @param {'raw'|'showcase'|'full'} variant - Branch [Optional, default: 'full']
 *
 * Example:
 * <DesignMdPreview project={ project } layers={ analysis } variant="raw" />
 */
export function DesignMdPreview({ project, layers, variant = 'full' }) {
  const [copied, setCopied] = useState(false);

  const designMd = useMemo(
    () => buildDesignMd({ project, layers }),
    [project, layers],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(designMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const handleDownload = () => {
    const blob = new Blob([designMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(project?.name || 'design').toLowerCase().replace(/\s+/g, '-')}.DESIGN.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showRaw = variant === 'raw' || variant === 'full';
  const showShowcase = variant === 'showcase' || variant === 'full';

  const sectionLabel = variant === 'showcase' ? '00 - SHOWCASE' : '00 - DESIGN.MD';
  const sectionTitle = variant === 'showcase'
    ? `${project?.name || 'Untitled'} - live system`
    : `${project?.name || 'Untitled'}.DESIGN.md`;
  const sectionLede = variant === 'showcase'
    ? 'color, typography, spacing tokens and a sample card UI combining them.'
    : 'Google Labs alpha spec. YAML front-matter + prose 8 sections: an AI coding agent consumes it directly as context.';

  const Header = (
    <Box sx={ { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' } }>
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 720 } }>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { fontSize: '0.7rem', letterSpacing: '0.18em', lineHeight: 1, fontWeight: 500 } }
        >
          { sectionLabel }
        </Typography>
        <Typography
          variant="h3"
          sx={ {
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
          } }
        >
          { sectionTitle }
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { lineHeight: 1.7, fontSize: '0.92rem' } }>
          { sectionLede }
        </Typography>
      </Box>
      { showRaw && (
        <Box sx={ { display: 'flex', gap: 1 } }>
          <Button
            variant="outlined"
            size="small"
            startIcon={ copied ? <CheckIcon /> : <ContentCopyIcon /> }
            onClick={ handleCopy }
          >
            { copied ? 'Copied' : 'Copy all' }
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={ <DownloadIcon /> }
            onClick={ handleDownload }
          >
            DESIGN.md
          </Button>
        </Box>
      ) }
    </Box>
  );

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
      { Header }

      {/* ================ 01 - COLOR (includes gradient) ================ */}
      { showShowcase && (
        <ShowcaseSection
          index="01"
          eyebrow="COLOR"
          title="Color palette"
          lede="Palette and supporting gradients that define brand identity and information hierarchy."
        >
          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
            <ColorSwatchGrid colors={ layers?.color } />
            { (layers?.gradient || []).filter((g) => g?.isEnabled !== false).length > 0 && (
              <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={ { fontSize: '0.7rem', letterSpacing: '0.14em', lineHeight: 1, fontWeight: 500 } }
                >
                  Gradient
                </Typography>
                <GradientGrid gradients={ layers?.gradient } />
              </Box>
            ) }
          </Box>
        </ShowcaseSection>
      ) }

      {/* ================ 02 - TYPOGRAPHY ================ */}
      { showShowcase && (
        <ShowcaseSection
          index="02"
          eyebrow="TYPOGRAPHY"
          title="Type scale"
          lede="Font scale that establishes readability and hierarchy."
        >
          <TypographySamples typography={ layers?.typography } />
        </ShowcaseSection>
      ) }

      {/* ================ 03 - SPACING ================ */}
      { showShowcase && (
        <ShowcaseSection
          index="03"
          eyebrow="SPACING"
          title="Spacing scale"
          lede="Unit scale that builds a consistent rhythm for layout and spacing."
        >
          <ScaleVisualizer
            scale={ layers?.spacing }
            renderer={ (val) => (
              <Box sx={ { width: val, height: val, bgcolor: 'primary.main', borderRadius: 0.5 } } />
            ) }
            empty="(No spacing)"
          />
        </ShowcaseSection>
      ) }

      {/* ================ 04 - SAMPLE CARD (composition) ================ */}
      { showShowcase && (
        <ShowcaseSection
          index="04"
          eyebrow="COMPOSITION"
          title="Sample card"
          lede="A simple card UI combining color, typography, spacing, and rounded tokens."
        >
          <SampleCard layers={ layers } />
        </ShowcaseSection>
      ) }

      {/* ================ Raw DESIGN.md (raw only) ================ */}
      { showRaw && (
        <Box>
          <Typography variant="overline" color="text.secondary" sx={ { letterSpacing: '0.12em', display: 'block', mb: 1 } }>
            DESIGN.MD (RAW)
          </Typography>
          <Box sx={ { position: 'relative' } }>
            <Box
              component="pre"
              sx={ {
                m: 0,
                p: 2.5,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                fontSize: 12,
                lineHeight: 1.7,
                fontFamily: 'monospace',
                maxHeight: 520,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              } }
            >
              { designMd }
            </Box>
            <Tooltip title={ copied ? 'Copied' : 'Copy all' } arrow>
              <IconButton
                size="small"
                onClick={ handleCopy }
                sx={ {
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                } }
              >
                { copied ? <CheckIcon fontSize="small" sx={ { color: 'success.main' } } /> : <ContentCopyIcon fontSize="small" /> }
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mt: 1 } }>
            { designMd.length.toLocaleString() } chars · YAML front-matter + prose 8 sections (present sections only, canonical order)
          </Typography>
        </Box>
      ) }
    </Box>
  );
}

/* ============================================
 * Subcomponents
 * ============================================ */

/* ============================================
 * ShowcaseSection - reference large header (eyebrow + serif title + lede) + body
 * ============================================ */

function ShowcaseSection({ index, eyebrow, title, lede, children }) {
  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3 } }>
      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.25, maxWidth: 720 } }>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={ { fontSize: '0.7rem', letterSpacing: '0.18em', lineHeight: 1, fontWeight: 500 } }
        >
          { index ? `${index} - ` : '' }{ eyebrow }
        </Typography>
        <Typography
          variant="h4"
          sx={ {
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.012em',
          } }
        >
          { title }
        </Typography>
        { lede && (
          <Typography variant="body2" color="text.secondary" sx={ { lineHeight: 1.7, fontSize: '0.9rem' } }>
            { lede }
          </Typography>
        ) }
      </Box>
      { children }
    </Box>
  );
}

/* ============================================
 * ColorSwatchGrid - color cards per category (group) (flex wrap)
 *   Each card: large color box on top + token name / hex / role below
 * ============================================ */

function ColorSwatchGrid({ colors }) {
  const list = (colors || []).filter((c) => c?.isEnabled !== false);
  if (list.length === 0) {
    return (
      <Box sx={ { p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 } }>
        <Typography variant="body2" color="text.disabled" sx={ { fontStyle: 'italic' } }>
          (No color)
        </Typography>
      </Box>
    );
  }
  // Group by group; fall back to 'Etc' when there is no group
  const grouped = list.reduce((acc, c) => {
    const g = c.group || 'Etc';
    if (!acc[g]) acc[g] = [];
    acc[g].push(c);
    return acc;
  }, {});

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 4 } }>
      { Object.entries(grouped).map(([groupName, items]) => (
        <Box key={ groupName } sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={ { fontSize: '0.7rem', letterSpacing: '0.14em', lineHeight: 1, fontWeight: 500 } }
          >
            { groupName }
          </Typography>
          <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 2 } }>
            { items.map((c) => (
              <Box
                key={ c.id }
                sx={ {
                  width: { xs: 'calc(50% - 8px)', sm: 200 },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  overflow: 'hidden',
                } }
              >
                <Box sx={ { width: '100%', height: 80, bgcolor: c.hex } } />
                <Box sx={ { p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.4 } }>
                  <Typography
                    sx={ {
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                    } }
                  >
                    { c.id || c.label }
                  </Typography>
                  <Typography sx={ { fontFamily: 'monospace', fontSize: '0.7rem', color: 'text.secondary' } }>
                    { c.hex }
                  </Typography>
                  { c.role && (
                    <Typography sx={ { fontFamily: 'monospace', fontSize: '0.68rem', color: 'text.disabled' } }>
                      { c.role }
                    </Typography>
                  ) }
                </Box>
              </Box>
            )) }
          </Box>
        </Box>
      )) }
    </Box>
  );
}

/* ============================================
 * TypographySamples - meta on the left / font sample on the right, per row (vertical stack)
 * ============================================ */

function TypographySamples({ typography }) {
  const list = (typography || []).filter((t) => t?.isEnabled !== false);
  if (list.length === 0) {
    return (
      <Box sx={ { p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 } }>
        <Typography variant="body2" color="text.disabled" sx={ { fontStyle: 'italic' } }>
          (No typography)
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        overflow: 'hidden',
      } }
    >
      { list.map((t, i) => (
        <Box
          key={ t.id || t.variant || i }
          sx={ {
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'baseline' },
            gap: { xs: 1, sm: 3 },
            p: 2.5,
            borderBottom: i < list.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
          } }
        >
          {/* 1. variant */}
          <Box sx={ { width: { xs: '100%', sm: 120 }, flexShrink: 0 } }>
            <Typography
              sx={ {
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              } }
            >
              { t.variant || t.id }
            </Typography>
          </Box>

          {/* 2. sample (flex:1) */}
          <Box
            sx={ {
              flex: 1,
              minWidth: 0,
              fontFamily: t.fontFamily,
              fontSize: t.fontSize,
              fontWeight: t.fontWeight,
              lineHeight: t.lineHeight,
              letterSpacing: t.letterSpacing,
              color: 'text.primary',
              wordBreak: 'keep-all',
            } }
          >
            { t.label || t.id || t.variant }
          </Box>

          {/* 3. spec */}
          <Box
            sx={ {
              width: { xs: '100%', sm: 200 },
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.3,
              textAlign: { sm: 'right' },
            } }
          >
            <Typography sx={ { fontFamily: 'monospace', fontSize: '0.7rem', color: 'text.secondary' } }>
              { [t.fontSize, t.fontWeight && `w${t.fontWeight}`, t.lineHeight && `lh${t.lineHeight}`].filter(Boolean).join(' / ') }
            </Typography>
            { t.fontFamily && (
              <Typography
                sx={ {
                  fontFamily: 'monospace',
                  fontSize: '0.68rem',
                  color: 'text.disabled',
                  wordBreak: 'break-all',
                } }
              >
                { t.fontFamily.split(',')[0].replace(/['"]/g, '').trim() }
              </Typography>
            ) }
          </Box>
        </Box>
      )) }
    </Box>
  );
}

/* ============================================
 * GradientGrid - gradient cards (large gradient box on top + meta below)
 * ============================================ */

function GradientGrid({ gradients }) {
  const list = (gradients || []).filter((g) => g?.isEnabled !== false);
  if (list.length === 0) return null;
  return (
    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 2 } }>
      { list.map((g) => (
        <Box
          key={ g.id || g.label }
          sx={ {
            width: { xs: 'calc(50% - 8px)', sm: 200 },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2.5,
            overflow: 'hidden',
          } }
        >
          <Box sx={ { width: '100%', height: 80, background: g.gradient } } />
          <Box sx={ { p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.4 } }>
            <Typography
              sx={ {
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              } }
            >
              { g.id || g.label }
            </Typography>
            <Typography
              sx={ {
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: 'text.secondary',
                wordBreak: 'break-all',
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              } }
            >
              { g.gradient }
            </Typography>
          </Box>
        </Box>
      )) }
    </Box>
  );
}

/* ============================================
 * SampleCard - card combining color, typography, spacing, and rounded tokens
 * ============================================ */

function SampleCard({ layers }) {
  const colors = (layers?.color || []).filter((c) => c?.isEnabled !== false);
  const typography = (layers?.typography || []).filter((t) => t?.isEnabled !== false);
  const spacing = layers?.spacing || {};
  const rounded = layers?.rounded || {};

  const lightSurface = colors.find((c) => c.group === 'Surface' || c.role === 'neutral') || { hex: '#ffffff' };
  const primary = colors.find((c) => c.role === 'primary') || colors[0];
  const ink = colors.find((c) => c.role === 'text' || c.group === 'Text') || { hex: '#111111' };
  const onPrimary = lightSurface;

  const heading = typography.find((t) => t.variant === 'h2')
    || typography.find((t) => t.variant === 'h1')
    || typography[0];
  const body = typography.find((t) => t.variant === 'body1')
    || typography.find((t) => t.variant === 'body2')
    || typography[typography.length - 1];

  const cardPadding = spacing.lg || spacing.md || '24px';
  const cardRadius = rounded.lg || rounded.md || '12px';
  const buttonRadius = rounded.sm || rounded.md || '6px';
  const buttonPaddingX = spacing.md || '16px';
  const buttonPaddingY = spacing.sm || '8px';
  const headingMb = spacing.sm || '8px';
  const bodyMb = spacing.md || '16px';

  if (!primary || !heading || !body) {
    return (
      <Box sx={ { p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 } }>
        <Typography variant="body2" color="text.disabled" sx={ { fontStyle: 'italic' } }>
          (Cannot build sample card: not enough color / typography tokens)
        </Typography>
      </Box>
    );
  }

  const variants = [
    {
      key: 'filled',
      label: 'Filled',
      surfaceHex: lightSurface.hex,
      textHex: ink.hex,
      buttonStyle: 'filled',
    },
    {
      key: 'outlined',
      label: 'Outlined',
      surfaceHex: lightSurface.hex,
      textHex: ink.hex,
      buttonStyle: 'outlined',
    },
    {
      key: 'inverse',
      label: 'Inverse',
      surfaceHex: primary.hex,
      textHex: onPrimary.hex,
      buttonStyle: 'inverse',
    },
  ];

  const renderButton = (style) => {
    if (style === 'outlined') {
      return {
        bgcolor: 'transparent',
        color: primary.hex,
        border: `1px solid ${primary.hex}`,
      };
    }
    if (style === 'inverse') {
      return {
        bgcolor: onPrimary.hex,
        color: primary.hex,
        border: '1px solid transparent',
      };
    }
    return {
      bgcolor: primary.hex,
      color: onPrimary.hex,
      border: '1px solid transparent',
    };
  };

  return (
    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 2 } }>
      { variants.map((v) => {
        const buttonSx = renderButton(v.buttonStyle);
        return (
          <Box
            key={ v.key }
            sx={ {
              flex: '1 1 260px',
              minWidth: 240,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            } }
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={ { fontSize: '0.65rem', letterSpacing: '0.14em', lineHeight: 1, fontWeight: 500 } }
            >
              { v.label }
            </Typography>
            <Box
              sx={ {
                bgcolor: v.surfaceHex,
                borderRadius: cardRadius,
                p: cardPadding,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              } }
            >
              <Box
                sx={ {
                  color: v.textHex,
                  fontFamily: heading.fontFamily,
                  fontSize: heading.fontSize,
                  fontWeight: heading.fontWeight,
                  lineHeight: heading.lineHeight,
                  letterSpacing: heading.letterSpacing,
                  mb: headingMb,
                } }
              >
                { heading.label || heading.variant || 'Heading' }
              </Box>
              <Box
                sx={ {
                  color: v.textHex,
                  opacity: 0.78,
                  fontFamily: body.fontFamily,
                  fontSize: body.fontSize,
                  fontWeight: body.fontWeight,
                  lineHeight: body.lineHeight,
                  letterSpacing: body.letterSpacing,
                  mb: bodyMb,
                } }
              >
                { body.label || `${body.variant || 'body'}: a card UI using color, typography, spacing, and rounded tokens.` }
              </Box>
              <Box
                component="span"
                sx={ {
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-start',
                  ...buttonSx,
                  borderRadius: buttonRadius,
                  px: buttonPaddingX,
                  py: buttonPaddingY,
                  fontFamily: body.fontFamily,
                  fontSize: body.fontSize,
                  fontWeight: 500,
                  cursor: 'default',
                  userSelect: 'none',
                } }
              >
                { primary.label || primary.id || 'Action' }
              </Box>
            </Box>
          </Box>
        );
      }) }
    </Box>
  );
}

/* ============================================
 * ScaleVisualizer - list inside a card (vertical)
 * ============================================ */

function ScaleVisualizer({ scale, renderer, empty }) {
  const entries = Object.entries(scale || {}).sort(([, a], [, b]) => {
    const na = parseFloat(typeof a === 'number' ? a : String(a));
    const nb = parseFloat(typeof b === 'number' ? b : String(b));
    return (Number.isFinite(na) ? na : 0) - (Number.isFinite(nb) ? nb : 0);
  });
  if (entries.length === 0) {
    return (
      <Box sx={ { p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 } }>
        <Typography variant="body2" color="text.disabled" sx={ { fontStyle: 'italic' } }>
          { empty }
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        overflow: 'hidden',
      } }
    >
      { entries.map(([key, val], i) => (
        <Box
          key={ key }
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            p: 2.25,
            borderBottom: i < entries.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
          } }
        >
          <Typography
            sx={ {
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              fontWeight: 600,
              minWidth: 56,
              letterSpacing: '0.02em',
            } }
          >
            { key }
          </Typography>
          <Box sx={ { flexShrink: 0, minWidth: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' } }>
            { renderer(typeof val === 'number' ? `${val}px` : val) }
          </Box>
          <Typography sx={ { fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary', ml: 'auto' } }>
            { typeof val === 'number' ? `${val}px` : val }
          </Typography>
        </Box>
      )) }
    </Box>
  );
}

