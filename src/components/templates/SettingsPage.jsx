import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { PageContainer } from '../layout/PageContainer.jsx';

const AI_MODELS = [
  { value: 'claude-opus-4-7', label: 'Claude Opus 4.7 (Highest quality)' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (Balanced)' },
  { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (Fastest)' },
];

const THEME_MODES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/**
 * SettingsPage template
 *
 * MUSE settings screen. Manages the AI model, auto-tagging, and theme mode.
 *
 * Props:
 * @param {object} settings - { aiModel, themeMode, isAutoTagEnabled } [Required]
 * @param {function} onChange - (patch) => void [Required]
 * @param {function} onSave - "Save" click [Optional]
 * @param {object} usage - { references: number, projects: number, referenceLimit?: number, projectLimit?: number } usage (optional, filled in after backend integration) [Optional]
 * @param {object} sx - additional styles [Optional]
 *
 * Example usage:
 * <SettingsPage
 *   settings={ settings }
 *   onChange={ (patch) => updateSettings(patch) }
 *   onSave={ () => api.save(settings) }
 * />
 */
export function SettingsPage({ settings, onChange, onSave, usage, sx }) {
  const [dirty, setDirty] = useState(false);

  const patch = (next) => {
    setDirty(true);
    onChange?.(next);
  };

  return (
    <PageContainer variant="focus" focusMaxWidth={ 640 } sx={ sx }>
      {/* Hero */}
      <Box sx={ { py: { xs: 4, md: 8 } } }>
        <Typography variant="h2" sx={ { fontWeight: 600, letterSpacing: '-0.02em' } }>Settings</Typography>
      </Box>

        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 5 } }>
          {/* Usage (optional): shown when usage/limits are injected via props after backend integration */ }
          { usage && (usage.referenceLimit || usage.projectLimit) && (
            <>
              <Section
                title="Usage"
                description="Current account usage"
              >
                <Stack spacing={ 1 }>
                  { usage.referenceLimit && (
                    <UsageRow
                      label="References"
                      used={ usage.references ?? 0 }
                      limit={ usage.referenceLimit }
                    />
                  ) }
                  { usage.projectLimit && (
                    <UsageRow
                      label="Projects"
                      used={ usage.projects ?? 0 }
                      limit={ usage.projectLimit }
                    />
                  ) }
                </Stack>
              </Section>

              <Divider />
            </>
          ) }

          {/* AI Model */}
          <Section
            title="AI Model"
            description="Model used for reference tagging and token analysis"
          >
            <FormControl fullWidth>
              <Select
                value={ settings.aiModel || 'claude-sonnet-4-6' }
                onChange={ (e) => patch({ aiModel: e.target.value }) }
              >
                { AI_MODELS.map((m) => (
                  <MenuItem key={ m.value } value={ m.value }>{ m.label }</MenuItem>
                )) }
              </Select>
            </FormControl>
          </Section>

          <Divider />

          {/* Auto-tag toggle */}
          <Section
            title="Auto-tagging"
            description="AI automatically assigns color tone, style, and category tags on archiving"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={ !!settings.isAutoTagEnabled }
                  onChange={ (e) => patch({ isAutoTagEnabled: e.target.checked }) }
                />
              }
              label={ settings.isAutoTagEnabled ? 'On' : 'Off' }
            />
          </Section>

          <Divider />

          {/* Theme */}
          <Section
            title="Theme Mode"
            description="Light/dark mode for the MUSE app itself"
          >
            <RadioGroup
              row
              value={ settings.themeMode || 'system' }
              onChange={ (e) => patch({ themeMode: e.target.value }) }
            >
              { THEME_MODES.map((m) => (
                <FormControlLabel
                  key={ m.value }
                  value={ m.value }
                  control={ <Radio /> }
                  label={ m.label }
                />
              )) }
            </RadioGroup>
          </Section>

          {/* Save */}
          { onSave && (
            <Box sx={ { display: 'flex', justifyContent: 'flex-end', pt: 2 } }>
              <Button
                variant="contained"
                color="primary"
                disabled={ !dirty }
                onClick={ () => {
                  onSave();
                  setDirty(false);
                } }
              >
                Save
              </Button>
            </Box>
          ) }
        </Box>

      <Box sx={ { height: 64 } } />
    </PageContainer>
  );
}

/** Usage row: label on the left, count on the right */
function UsageRow({ label, used, limit }) {
  const ratio = limit > 0 ? Math.min(used / limit, 1) : 0;
  const color = ratio >= 1 ? 'error.main' : ratio >= 0.8 ? 'warning.main' : 'text.primary';
  return (
    <Box
      sx={ {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      } }
    >
      <Typography variant="body2" color="text.secondary">{ label }</Typography>
      <Typography variant="body2" sx={ { fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' } }>
        { used }
        <Box component="span" sx={ { color: 'text.disabled', fontWeight: 400, ml: 0.25 } }>
          / { limit }
        </Box>
      </Typography>
    </Box>
  );
}

/** Section wrapper (internal util) */
function Section({ title, description, children }) {
  return (
    <Box>
      <Typography variant="h6" sx={ { mb: 0.5, fontWeight: 600 } }>{ title }</Typography>
      { description && (
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          { description }
        </Typography>
      ) }
      { children }
    </Box>
  );
}
