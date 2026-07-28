import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TokenListItem } from './TokenListItem';

export default {
  title: 'Component/5. Data Display/TokenListItem',
  component: TokenListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## TokenListItem

The **shared row Component** used across the per-Layer Token editing UI in MUSE Project detail.

- Inject any node (Color swatch, Typography sample, Gradient, etc.) into the left 48x48 **Preview slot**
- When \`isEnabled=false\`, preview/label/value are dimmed to 40% opacity while controls stay usable
- **The emphasis toggle is always active**: disabled Tokens can still have their emphasis edited (preserved when re-enabled later)
- Switch uses the MUI Default pill style

### Structure
\`\`\`
[preview 48x48] [label + value] [Low | Mid | High] [on/off]
\`\`\`

### Usage (MUSE Phase 3 per-Layer preview)
- ColorSwatchList: preview: Color swatch
- TypographyPreview: preview: sample glyph
- LayoutTokenPreview: preview: grid/spacing diagram
- GradientPreview: preview: Gradient box
        `,
      },
    },
  },
  argTypes: {
    preview: { control: false, description: 'Left 48x48 preview slot (ReactNode)' },
    label: { control: 'text', description: 'Token name/role' },
    value: { control: 'text', description: 'Token value (HEX/px/font name, etc.)' },
    isEnabled: { control: 'boolean', description: 'Token enabled State' },
    emphasis: {
      control: { type: 'select' },
      options: [0, 1, 2],
      description: 'Emphasis level (Low/Mid/High)',
    },
    onToggleEnabled: { action: 'toggleEnabled' },
    onChangeEmphasis: { action: 'changeEmphasis' },
  },
};

/** Color swatch preview */
const ColorSwatch = ({ color }) => (
  <Box
    sx={ {
      width: 48,
      height: 48,
      borderRadius: 1.5,
      backgroundColor: color,
      border: '1px solid',
      borderColor: 'divider',
    } }
  />
);

/** Typography sample preview */
const TypoSample = ({ family, weight }) => (
  <Typography
    sx={ {
      fontFamily: family,
      fontWeight: weight,
      fontSize: 28,
      lineHeight: 1,
    } }
  >
    Aa
  </Typography>
);

/** Gradient preview */
const GradientSwatch = ({ gradient }) => (
  <Box
    sx={ {
      width: 48,
      height: 48,
      borderRadius: 1.5,
      background: gradient,
    } }
  />
);

/** Default: color token example */
export const Default = {
  render: (args) => {
    const [isEnabled, setEnabled] = useState(args.isEnabled ?? true);
    const [emphasis, setEmphasis] = useState(args.emphasis ?? 1);
    return (
      <Box sx={ { maxWidth: 640 } }>
        <TokenListItem
          preview={ <ColorSwatch color="#14132B" /> }
          label="Primary Ink"
          value="#14132B"
          { ...args }
          isEnabled={ isEnabled }
          emphasis={ emphasis }
          onToggleEnabled={ (v) => { setEnabled(v); args.onToggleEnabled?.(v); } }
          onChangeEmphasis={ (v) => { setEmphasis(v); args.onChangeEmphasis?.(v); } }
        />
      </Box>
    );
  },
  args: {
    label: 'Primary Ink',
    value: '#14132B',
    isEnabled: true,
    emphasis: 1,
  },
};

/** Disabled state */
export const Disabled = {
  render: () => (
    <Box sx={ { maxWidth: 640 } }>
      <TokenListItem
        preview={ <ColorSwatch color="#7A798E" /> }
        label="Muted Grey"
        value="#7A798E"
        isEnabled={ false }
        emphasis={ 0 }
      />
    </Box>
  ),
};

/** Color layer list: preview of the real usage pattern */
export const ColorLayer = {
  render: () => {
    const [tokens, setTokens] = useState([
      { id: 'ink', label: 'Primary Ink', value: '#14132B', color: '#14132B', isEnabled: true, emphasis: 2 },
      { id: 'accent', label: 'Accent Violet', value: '#4F46E5', color: '#4F46E5', isEnabled: true, emphasis: 1 },
      { id: 'bg', label: 'Background Tint', value: '#FCFCFF', color: '#FCFCFF', isEnabled: true, emphasis: 0 },
      { id: 'muted', label: 'Muted Grey', value: '#7A798E', color: '#7A798E', isEnabled: false, emphasis: 0 },
    ]);

    const update = (id, patch) =>
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    return (
      <Box sx={ { maxWidth: 640, bgcolor: 'background.paper', borderRadius: 3, py: 1 } }>
        { tokens.map((t, i) => (
          <Box key={ t.id }>
            <TokenListItem
              preview={ <ColorSwatch color={ t.color } /> }
              label={ t.label }
              value={ t.value }
              isEnabled={ t.isEnabled }
              emphasis={ t.emphasis }
              onToggleEnabled={ (next) => update(t.id, { isEnabled: next }) }
              onChangeEmphasis={ (next) => update(t.id, { emphasis: next }) }
            />
            { i < tokens.length - 1 && <Divider sx={ { mx: 2 } } /> }
          </Box>
        )) }
      </Box>
    );
  },
};

/** Typography layer list */
export const TypographyLayer = {
  render: () => {
    const [tokens, setTokens] = useState([
      { id: 'h1', label: 'Display Heading', value: 'Outfit 700 · clamp(48, 6vw, 96)', family: 'Outfit', weight: 700, isEnabled: true, emphasis: 2 },
      { id: 'h2', label: 'Section Heading', value: 'Outfit 600 · clamp(32, 4vw, 56)', family: 'Outfit', weight: 600, isEnabled: true, emphasis: 1 },
      { id: 'body', label: 'Body', value: 'Pretendard 400 · 16/1.7', family: 'Pretendard Variable', weight: 400, isEnabled: true, emphasis: 1 },
    ]);

    const update = (id, patch) =>
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    return (
      <Box sx={ { maxWidth: 720, bgcolor: 'background.paper', borderRadius: 3, py: 1 } }>
        { tokens.map((t, i) => (
          <Box key={ t.id }>
            <TokenListItem
              preview={ <TypoSample family={ t.family } weight={ t.weight } /> }
              label={ t.label }
              value={ t.value }
              isEnabled={ t.isEnabled }
              emphasis={ t.emphasis }
              onToggleEnabled={ (next) => update(t.id, { isEnabled: next }) }
              onChangeEmphasis={ (next) => update(t.id, { emphasis: next }) }
            />
            { i < tokens.length - 1 && <Divider sx={ { mx: 2 } } /> }
          </Box>
        )) }
      </Box>
    );
  },
};

/** Gradient layer list */
export const GradientLayer = {
  render: () => {
    const [tokens, setTokens] = useState([
      { id: 'g1', label: 'Sunrise', value: 'linear-gradient(135deg, #FEE2F5, #FEF9C3)', gradient: 'linear-gradient(135deg, #FEE2F5, #FEF9C3)', isEnabled: true, emphasis: 1 },
      { id: 'g2', label: 'Indigo Dusk', value: 'linear-gradient(180deg, #1E1B4B, #4F46E5)', gradient: 'linear-gradient(180deg, #1E1B4B, #4F46E5)', isEnabled: true, emphasis: 2 },
      { id: 'g3', label: 'Muted Sand', value: 'linear-gradient(90deg, #E8E7F0, #D6D5E0)', gradient: 'linear-gradient(90deg, #E8E7F0, #D6D5E0)', isEnabled: false, emphasis: 0 },
    ]);

    const update = (id, patch) =>
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

    return (
      <Box sx={ { maxWidth: 720, bgcolor: 'background.paper', borderRadius: 3, py: 1 } }>
        { tokens.map((t, i) => (
          <Box key={ t.id }>
            <TokenListItem
              preview={ <GradientSwatch gradient={ t.gradient } /> }
              label={ t.label }
              value={ t.value }
              isEnabled={ t.isEnabled }
              emphasis={ t.emphasis }
              onToggleEnabled={ (next) => update(t.id, { isEnabled: next }) }
              onChangeEmphasis={ (next) => update(t.id, { emphasis: next }) }
            />
            { i < tokens.length - 1 && <Divider sx={ { mx: 2 } } /> }
          </Box>
        )) }
      </Box>
    );
  },
};
