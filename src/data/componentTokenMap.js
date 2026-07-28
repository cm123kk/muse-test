/**
 * Per-component MUI token usage mapping data
 *
 * This file defines which theme tokens each MUI component references when styled.
 * It helps designers understand the styling structure of each component.
 *
 * Token categories:
 * - palette: colors (primary, secondary, error, text, etc.)
 * - typography: typography (fontFamily, fontSize, fontWeight, etc.)
 * - spacing: spacing (padding, margin)
 * - shape: shape (borderRadius)
 * - shadows: shadows (elevation)
 * - transitions: transition effects (duration, easing)
 * - zIndex: layer order
 */

const componentTokenMap = {
  // ============================================================
  // 1. Button
  // ============================================================
  Button: {
    name: 'Button',
    description: 'A clickable interaction element. Used to drive primary actions.',
    variants: ['contained', 'outlined', 'text'],
    sizes: ['small', 'medium', 'large'],

    tokens: {
      palette: {
        items: [
          { token: 'primary', role: 'Default button color' },
          { token: 'secondary', role: 'Secondary button color' },
          { token: 'error', role: 'Delete / dangerous action' },
          { token: 'warning', role: 'Action requiring caution' },
          { token: 'success', role: 'Complete / confirm action' },
          { token: 'info', role: 'Informational action' },
        ],
        affects: 'Background (contained), border (outlined), text color',
        howToUse: 'Set via the color prop (e.g. color="primary")',
      },
      typography: {
        items: [
          { token: 'button', role: 'Button text style' },
        ],
        affects: 'Font size (14px), weight (600), letter spacing (0.02em)',
        howToUse: 'Applied automatically (theme.typography.button)',
      },
      spacing: {
        items: [
          { token: 'spacing(1)', role: 'small button padding' },
          { token: 'spacing(2)', role: 'medium button padding' },
          { token: 'spacing(3)', role: 'large button padding' },
        ],
        affects: 'Button inner padding',
        howToUse: 'Adjusted indirectly via the size prop',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Button corner radius' },
        ],
        affects: 'Button outline corners',
        howToUse: 'theme.shape.borderRadius (currently: 0px)',
      },
      shadows: {
        items: [
          { token: 'elevation1', role: 'Default shadow' },
          { token: 'elevation2', role: 'Shadow on hover' },
        ],
        affects: 'Shadow on contained buttons',
        howToUse: 'Can be removed via the disableElevation prop',
      },
      transitions: {
        items: [
          { token: 'duration.short', role: 'State change speed' },
          { token: 'easing.easeInOut', role: 'Animation curve' },
        ],
        affects: 'hover, focus, active transitions',
        howToUse: 'Applied automatically',
      },
    },

    stateTokens: {
      hover: 'palette.action.hover (background overlay)',
      focus: 'palette.action.focus + focusVisible ring',
      active: 'palette.[color].dark (darker color)',
      disabled: 'palette.action.disabled, disabledBackground',
    },
  },

  // ============================================================
  // 2. Typography
  // ============================================================
  Typography: {
    name: 'Typography',
    description: 'A component for displaying text. Provides a range of text styles from headings to body copy.',
    variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline'],

    tokens: {
      typography: {
        items: [
          { token: 'h1', role: 'Largest heading (40px, 900)' },
          { token: 'h2', role: 'Section heading (32px, 900)' },
          { token: 'h3', role: 'Sub-section heading (28px, 800)' },
          { token: 'h4', role: 'Card heading (24px, 700)' },
          { token: 'h5', role: 'Small heading (20px, 700)' },
          { token: 'h6', role: 'Smallest heading (18px, 600)' },
          { token: 'subtitle1', role: 'Subtitle (16px, 500)' },
          { token: 'subtitle2', role: 'Small subtitle (14px, 500)' },
          { token: 'body1', role: 'Default body (16px)' },
          { token: 'body2', role: 'Secondary body (14px)' },
          { token: 'caption', role: 'Caption / note (12px)' },
          { token: 'overline', role: 'Label / category (12px, uppercase)' },
        ],
        affects: 'fontFamily, fontSize, fontWeight, lineHeight, letterSpacing',
        howToUse: 'Set via the variant prop',
      },
      palette: {
        items: [
          { token: 'text.primary', role: 'Primary text color' },
          { token: 'text.secondary', role: 'Secondary text color' },
          { token: 'text.disabled', role: 'Disabled text color' },
          { token: 'primary.main', role: 'Emphasized text' },
          { token: 'error.main', role: 'Error text' },
        ],
        affects: 'Text color',
        howToUse: 'Set via the color prop (e.g. color="textSecondary")',
      },
    },
  },

  // ============================================================
  // 3. TextField
  // ============================================================
  TextField: {
    name: 'TextField',
    description: 'A text input field. Collects text data from the user.',
    variants: ['outlined', 'filled', 'standard'],

    tokens: {
      palette: {
        items: [
          { token: 'primary.main', role: 'Border / label color on focus' },
          { token: 'error.main', role: 'Error state color' },
          { token: 'text.primary', role: 'Input text color' },
          { token: 'text.secondary', role: 'Label / placeholder color' },
          { token: 'action.hover', role: 'Background on hover' },
          { token: 'action.disabled', role: 'Disabled state' },
        ],
        affects: 'Border, label, input text, and background color',
        howToUse: 'Set via the color and error props',
      },
      typography: {
        items: [
          { token: 'body1', role: 'Input text style' },
          { token: 'caption', role: 'helperText style' },
          { token: 'body2', role: 'Label style' },
        ],
        affects: 'Text style inside the input field',
        howToUse: 'Applied automatically',
      },
      spacing: {
        items: [
          { token: 'spacing(1.5)', role: 'Inner padding' },
          { token: 'spacing(1)', role: 'helperText spacing' },
        ],
        affects: 'Field inner padding',
        howToUse: 'Adjusted via the size and margin props',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Field corners' },
        ],
        affects: 'outlined and filled variant corners',
        howToUse: 'theme.shape.borderRadius',
      },
      transitions: {
        items: [
          { token: 'duration.shorter', role: 'focus transition speed' },
        ],
        affects: 'Border color and label position transition',
        howToUse: 'Applied automatically',
      },
    },

    stateTokens: {
      hover: 'Border color darkens',
      focus: 'primary.main border, label shrinks and moves',
      error: 'error.main border / label',
      disabled: 'action.disabled background and text',
    },
  },

  // ============================================================
  // 4. Select
  // ============================================================
  Select: {
    name: 'Select',
    description: 'A dropdown selection component. Lets the user pick one of several options.',
    variants: ['outlined', 'filled', 'standard'],

    tokens: {
      palette: {
        items: [
          { token: 'primary.main', role: 'Border color on focus' },
          { token: 'text.primary', role: 'Selected value text' },
          { token: 'text.secondary', role: 'Label / placeholder' },
          { token: 'action.hover', role: 'Option hover background' },
          { token: 'action.selected', role: 'Selected option background' },
          { token: 'background.paper', role: 'Dropdown menu background' },
        ],
        affects: 'Field and dropdown menu color',
        howToUse: 'Same as TextField',
      },
      typography: {
        items: [
          { token: 'body1', role: 'Selected value text' },
          { token: 'body2', role: 'Option text' },
        ],
        affects: 'Text style',
        howToUse: 'Applied automatically',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Field and menu corners' },
        ],
        affects: 'Corner radius',
        howToUse: 'theme.shape.borderRadius',
      },
      shadows: {
        items: [
          { token: 'elevation8', role: 'Dropdown menu shadow' },
        ],
        affects: 'Floating menu effect',
        howToUse: 'Adjustable via MenuProps',
      },
      zIndex: {
        items: [
          { token: 'modal', role: 'Dropdown layer order' },
        ],
        affects: 'Displayed above other elements',
        howToUse: 'Applied automatically',
      },
    },
  },

  // ============================================================
  // 5. Card
  // ============================================================
  Card: {
    name: 'Card',
    description: 'A container for content. Groups related information for display.',
    subComponents: ['CardHeader', 'CardContent', 'CardActions', 'CardMedia'],

    tokens: {
      palette: {
        items: [
          { token: 'background.paper', role: 'Card background color' },
          { token: 'text.primary', role: 'Title text' },
          { token: 'text.secondary', role: 'Subtitle and description text' },
          { token: 'divider', role: 'Divider color' },
        ],
        affects: 'Card background and text color',
        howToUse: 'Customize via the sx prop',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Card corners' },
        ],
        affects: 'Card outer corners',
        howToUse: 'theme.shape.borderRadius (currently: 0px)',
      },
      shadows: {
        items: [
          { token: 'elevation1', role: 'Default shadow' },
          { token: 'elevation2-24', role: 'elevation prop value' },
        ],
        affects: 'Floating card effect',
        howToUse: 'Set via the elevation prop',
      },
      spacing: {
        items: [
          { token: 'spacing(2)', role: 'CardContent padding' },
          { token: 'spacing(1)', role: 'CardActions padding' },
        ],
        affects: 'Inner padding',
        howToUse: 'Applied automatically, adjustable via sx',
      },
    },
  },

  // ============================================================
  // 6. Table
  // ============================================================
  Table: {
    name: 'Table',
    description: 'A table component that displays data in rows and columns.',
    subComponents: ['TableHead', 'TableBody', 'TableRow', 'TableCell', 'TablePagination'],

    tokens: {
      palette: {
        items: [
          { token: 'background.paper', role: 'Table background' },
          { token: 'text.primary', role: 'Cell text' },
          { token: 'text.secondary', role: 'Secondary text' },
          { token: 'divider', role: 'Cell divider' },
          { token: 'action.hover', role: 'Row hover background' },
          { token: 'action.selected', role: 'Selected row background' },
        ],
        affects: 'Background, text, and divider color',
        howToUse: 'Customize via the sx prop',
      },
      typography: {
        items: [
          { token: 'body2', role: 'Cell text (14px)' },
          { token: 'subtitle2', role: 'Header cell text' },
        ],
        affects: 'Text style',
        howToUse: 'Applied automatically',
      },
      spacing: {
        items: [
          { token: 'spacing(2)', role: 'Cell padding' },
        ],
        affects: 'Cell inner padding',
        howToUse: 'size prop (small, medium)',
      },
    },

    stateTokens: {
      hover: 'action.hover row background',
      selected: 'action.selected row background',
      sortActive: 'primary.main sort icon',
    },
  },

  // ============================================================
  // 7. Chip
  // ============================================================
  Chip: {
    name: 'Chip',
    description: 'A small component for showing tags, states, and categories.',
    variants: ['filled', 'outlined'],
    sizes: ['small', 'medium'],

    tokens: {
      palette: {
        items: [
          { token: 'default', role: 'Default grey background' },
          { token: 'primary', role: 'Primary emphasis' },
          { token: 'secondary', role: 'Secondary emphasis' },
          { token: 'error', role: 'Error / delete state' },
          { token: 'warning', role: 'Warning state' },
          { token: 'success', role: 'Success / complete state' },
          { token: 'info', role: 'Information state' },
        ],
        affects: 'Background (filled), border (outlined)',
        howToUse: 'Set via the color prop',
      },
      typography: {
        items: [
          { token: 'body2', role: 'Chip text style' },
        ],
        affects: 'Label text',
        howToUse: 'Applied automatically',
      },
      shape: {
        items: [
          { token: '16px (custom)', role: 'Chip corners (pill shape)' },
        ],
        affects: 'Rounded corners',
        howToUse: 'theme.components.MuiChip (currently: 4px)',
      },
      spacing: {
        items: [
          { token: 'spacing(0.5)', role: 'Icon-to-text spacing' },
          { token: 'spacing(1)', role: 'Inner padding' },
        ],
        affects: 'Inner padding',
        howToUse: 'Adjusted via the size prop',
      },
    },

    stateTokens: {
      hover: 'Background darkens (clickable)',
      focus: 'focusVisible ring',
      disabled: 'action.disabled',
    },
  },

  // ============================================================
  // 8. Alert
  // ============================================================
  Alert: {
    name: 'Alert',
    description: 'A feedback component that delivers important messages to the user.',
    variants: ['standard', 'filled', 'outlined'],
    severities: ['error', 'warning', 'success', 'info'],

    tokens: {
      palette: {
        items: [
          { token: 'error', role: 'Error message (red)' },
          { token: 'warning', role: 'Warning message (orange)' },
          { token: 'success', role: 'Success message (green)' },
          { token: 'info', role: 'Info message (blue)' },
        ],
        affects: 'Background, icon, and text color',
        howToUse: 'Set via the severity prop',
      },
      typography: {
        items: [
          { token: 'body2', role: 'Message text' },
          { token: 'subtitle2', role: 'Title text (AlertTitle)' },
        ],
        affects: 'Text style',
        howToUse: 'Applied automatically',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Alert corners' },
        ],
        affects: 'Outer corners',
        howToUse: 'theme.shape.borderRadius',
      },
      spacing: {
        items: [
          { token: 'spacing(1.5)', role: 'Inner padding' },
          { token: 'spacing(1.5)', role: 'Icon-to-text spacing' },
        ],
        affects: 'Inner padding',
        howToUse: 'Applied automatically',
      },
    },
  },

  // ============================================================
  // 9. Tabs
  // ============================================================
  Tabs: {
    name: 'Tabs',
    description: 'A component for navigating content divided into tabs.',
    subComponents: ['Tab'],

    tokens: {
      palette: {
        items: [
          { token: 'primary.main', role: 'Selected tab and indicator color' },
          { token: 'text.primary', role: 'Selected tab text' },
          { token: 'text.secondary', role: 'Unselected tab text' },
          { token: 'action.hover', role: 'Tab hover background' },
          { token: 'divider', role: 'Tab divider (optional)' },
        ],
        affects: 'Tab text and indicator color',
        howToUse: 'textColor, indicatorColor props',
      },
      typography: {
        items: [
          { token: 'button', role: 'Tab text style' },
        ],
        affects: 'Tab label text',
        howToUse: 'Applied automatically',
      },
      spacing: {
        items: [
          { token: 'spacing(2)', role: 'Tab inner padding' },
          { token: 'spacing(3)', role: 'Spacing between tabs' },
        ],
        affects: 'Tab size and spacing',
        howToUse: 'Applied automatically',
      },
      transitions: {
        items: [
          { token: 'duration.standard', role: 'indicator movement speed' },
        ],
        affects: 'indicator slide animation',
        howToUse: 'Applied automatically',
      },
    },

    stateTokens: {
      hover: 'action.hover background',
      selected: 'primary.main text and indicator',
      disabled: 'text.disabled',
    },
  },

  // ============================================================
  // 10. Dialog
  // ============================================================
  Dialog: {
    name: 'Dialog',
    description: 'A modal window. Draws the user attention to request important information or an action.',
    subComponents: ['DialogTitle', 'DialogContent', 'DialogActions'],

    tokens: {
      palette: {
        items: [
          { token: 'background.paper', role: 'Dialog background' },
          { token: 'text.primary', role: 'Title and body text' },
          { token: 'text.secondary', role: 'Secondary text' },
          { token: 'divider', role: 'Section divider' },
          { token: 'action.active', role: 'backdrop (dark overlay)' },
        ],
        affects: 'Background, text, and backdrop color',
        howToUse: 'Customize via the sx prop',
      },
      typography: {
        items: [
          { token: 'h6', role: 'DialogTitle text' },
          { token: 'body1', role: 'DialogContent text' },
        ],
        affects: 'Text style',
        howToUse: 'Applied automatically',
      },
      shape: {
        items: [
          { token: 'borderRadius', role: 'Dialog corners' },
        ],
        affects: 'Outer corners',
        howToUse: 'theme.shape.borderRadius',
      },
      shadows: {
        items: [
          { token: 'elevation24', role: 'Dialog shadow' },
        ],
        affects: 'Floating effect',
        howToUse: 'Applied automatically (highest elevation)',
      },
      zIndex: {
        items: [
          { token: 'modal (1300)', role: 'Layer order' },
        ],
        affects: 'Displayed above all other elements',
        howToUse: 'Applied automatically',
      },
      spacing: {
        items: [
          { token: 'spacing(2)', role: 'DialogTitle padding' },
          { token: 'spacing(3)', role: 'DialogContent padding' },
          { token: 'spacing(1)', role: 'DialogActions padding' },
        ],
        affects: 'Inner padding',
        howToUse: 'Applied automatically',
      },
      transitions: {
        items: [
          { token: 'duration.enteringScreen', role: 'Open animation' },
          { token: 'duration.leavingScreen', role: 'Close animation' },
        ],
        affects: 'Appear / disappear effect',
        howToUse: 'TransitionComponent prop',
      },
    },
  },
};

/**
 * Token category metadata
 * Description and Figma analogy for each token category
 */
const tokenCategories = {
  palette: {
    name: 'Palette',
    description: 'Color tokens',
    figmaAnalogy: 'Color Styles / Variables',
    icon: '',
  },
  typography: {
    name: 'Typography',
    description: 'Typography tokens',
    figmaAnalogy: 'Text Styles',
    icon: '',
  },
  spacing: {
    name: 'Spacing',
    description: 'Spacing tokens (8px based)',
    figmaAnalogy: 'Auto Layout spacing',
    icon: '',
  },
  shape: {
    name: 'Shape',
    description: 'Shape tokens',
    figmaAnalogy: 'Corner Radius',
    icon: '',
  },
  shadows: {
    name: 'Shadows',
    description: 'Shadow / elevation tokens',
    figmaAnalogy: 'Drop Shadow Effects',
    icon: '',
  },
  transitions: {
    name: 'Transitions',
    description: 'Transition tokens',
    figmaAnalogy: 'Smart Animate',
    icon: '',
  },
  zIndex: {
    name: 'Z-Index',
    description: 'Layer order',
    figmaAnalogy: 'Layer Order',
    icon: '',
  },
};

/**
 * Component list (in order)
 */
const componentList = [
  'Button',
  'Typography',
  'TextField',
  'Select',
  'Card',
  'Table',
  'Chip',
  'Alert',
  'Tabs',
  'Dialog',
];

export { componentTokenMap, tokenCategories, componentList };
export default componentTokenMap;
