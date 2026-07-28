/**
 * Default Theme - MUSE Visual Direction
 *
 * Base design tokens for the MUSE project.
 * Implements the design principles from docs/muse/03-visual-direction.md.
 *
 * ## Core Philosophy (MUSE)
 * - **Image-First Neutral**: Primary is near-black `#14132B`. Reference images and tokens are the focus.
 * - **Subtle Tint**: Remove pure white/black, keep the violet tint understated.
 * - **Sharp by default, Round on clickables**: Keep global borderRadius=0, only clickables get pill/24px.
 * - **Dimmed Tinted Shadow**: Blur-based shadow with no offset, color kept consistent with the near-black tint.
 * - **Accent Sparingly**: Use the violet `#4F46E5` only in small amounts for essential emphasis, such as "analyzing".
 */

import { createTheme } from '@mui/material/styles';

// ============================================================
// 1. Color Tokens
// ============================================================
const palette = {
  mode: 'light',
  // Brand colors - Image-First Neutral (near-black with subtle violet tint)
  primary: {
    light: '#2D2B5A',
    main: '#14132B',
    dark: '#0A091A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#7A798E',
    main: '#5A586E',
    dark: '#3A384E',
    contrastText: '#FFFFFF',
  },

  // State colors (Feedback) - keep MUI defaults
  error: {
    light: '#ef5350',
    main: '#d32f2f',
    dark: '#c62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#ff9800',
    main: '#ed6c02',
    dark: '#e65100',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    contrastText: '#FFFFFF',
  },
  // info = MUSE Accent (violet for essential emphasis, used sparingly)
  info: {
    light: '#6366F1',
    main: '#4F46E5',
    dark: '#3730A3',
    contrastText: '#FFFFFF',
  },

  // Text colors - near-black on the same axis as Primary (ink concept)
  text: {
    primary: '#14132B',
    secondary: '#7A798E',
    disabled: 'rgba(20, 19, 43, 0.38)',
  },

  // Background colors - subtle blue-violet tint (avoid pure white)
  background: {
    default: '#FCFCFF',
    paper: '#F8F8FC',
  },

  // Divider - low-opacity near-black
  divider: 'rgba(20, 19, 43, 0.08)',

  // Action states - kept consistent with the near-black tint
  action: {
    active: 'rgba(20, 19, 43, 0.54)',
    hover: 'rgba(20, 19, 43, 0.04)',
    selected: 'rgba(20, 19, 43, 0.06)',
    disabled: 'rgba(20, 19, 43, 0.26)',
    disabledBackground: 'rgba(20, 19, 43, 0.08)',
    focus: 'rgba(20, 19, 43, 0.12)',
  },

  // Grey scale - redefined with a violet tint (replaces the default MUI grey)
  grey: {
    50: '#FAFAFD',
    100: '#F3F3F9',
    200: '#E8E7F0',
    300: '#D6D5E0',
    400: '#B5B4C2',
    500: '#9493A3',
    600: '#7A798E',
    700: '#5A586E',
    800: '#3A384E',
    900: '#14132B',
  },
};

// ============================================================
// 2. Typography Tokens
// ============================================================
// Unified system font stack.
// The project renders the OS default UI font (no web font is bundled/loaded),
// so this reflects what actually shows in the running app. Body and headings
// share the same stack for a consistent, native look.
const systemFontStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  'system-ui',
  'Roboto',
  '"Helvetica Neue"',
  '"Segoe UI"',
  '"Apple SD Gothic Neo"',
  '"Noto Sans KR"',
  '"Malgun Gothic"',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  'sans-serif',
].join(',');

const typography = {
  // Base font family (OS system font)
  fontFamily: systemFontStack,

  // Heading font family - unified with body (same system stack)
  headingFontFamily: systemFontStack,

  // Font size baseline
  fontSize: 14,
  htmlFontSize: 16,

  // Font weights
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  // Heading styles - MUSE: fluid up-scaling with lighter weight
  h1: {
    fontWeight: 700,
    fontSize: 'clamp(3rem, 6vw, 6rem)', // 48px ~ 96px
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 600,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)', // 32px ~ 56px
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontWeight: 700,
    fontSize: 'clamp(1.875rem, 3.25vw, 2.625rem)', // 30px ~ 42px
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',      // 24px
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',     // 20px
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  h6: {
    fontWeight: 500,
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.4,
    letterSpacing: '0',
  },

  // Body styles - generous line-height to lower information density
  body1: {
    fontSize: '1rem',        // 16px
    lineHeight: 1.7,
    letterSpacing: '0',
  },
  body2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.7,
    letterSpacing: '0',
  },

  // Subtitles
  subtitle1: {
    fontSize: '1.125rem',    // 18px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  subtitle2: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
  },

  // Misc
  button: {
    fontSize: '0.9375rem',   // 15px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',     // 12px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.75rem',     // 12px
    fontWeight: 500,
    lineHeight: 2,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};

// ============================================================
// 3. Spacing Token
// ============================================================
const spacing = 8; // Base unit: 8px

// ============================================================
// 4. Shape Token
// ============================================================
const shape = {
  borderRadius: 0, // Sharp corners (0px)
};

// ============================================================
// 5. Shadow Tokens - MUSE near-black tint
// ============================================================
const customShadows = {
  none: 'none',
  sm: '0 0 12px rgba(20, 19, 43, 0.05)',
  md: '0 0 16px rgba(20, 19, 43, 0.07)',
  lg: '0 0 24px rgba(20, 19, 43, 0.08)',
  xl: '0 0 40px rgba(20, 19, 43, 0.10)',
};

// ============================================================
// 6. Breakpoints
// ============================================================
const breakpoints = {
  values: {
    xs: 0,      // Mobile
    sm: 600,    // Tablet portrait
    md: 900,    // Tablet landscape
    lg: 1200,   // Desktop
    xl: 1536,   // Large desktop
  },
};

// ============================================================
// 7. Z-Index (layer order)
// ============================================================
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// ============================================================
// 8. Transitions
// ============================================================
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// ============================================================
// 9. Component Overrides
// ============================================================
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
      },
    },
  },
  // Top-level surface - remove shadow at all elevation levels (flat)
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: 'none',
      },
      elevation0: { boxShadow: 'none' },
      elevation1: { boxShadow: 'none' },
      elevation2: { boxShadow: 'none' },
      elevation3: { boxShadow: 'none' },
      elevation4: { boxShadow: 'none' },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { boxShadow: 'none', backgroundImage: 'none' },
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: 24,
        boxShadow: 'none',
        backgroundImage: 'none',
      },
    },
  },
  MuiDialog: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      paper: {
        borderRadius: 24,
        boxShadow: 'none',
      },
    },
  },
  // Clickable elements - pill + size up + remove elevation
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      disableRipple: false,
    },
    styleOverrides: {
      root: {
        borderRadius: 999,
        textTransform: 'none',
        paddingInline: 32,
        paddingBlock: 10,
        boxShadow: 'none',
        transition: 'background-color 150ms, border-color 150ms, color 150ms',
        '&:hover': { boxShadow: 'none', transform: 'none' },
        '&:active': { transform: 'none' },
      },
      sizeLarge: {
        paddingInline: 36,
        paddingBlock: 14,
        fontSize: '0.95rem',
      },
      sizeSmall: {
        paddingInline: 20,
        paddingBlock: 6,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        transition: 'background-color 150ms, color 150ms',
        '&:hover': { transform: 'none' },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
      },
    },
  },
  // Input elements - 16px radius, larger padding, larger inner input
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      input: {
        paddingBlock: 16,
        paddingInline: 18,
      },
      multiline: {
        padding: 0,
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
      input: {
        paddingBlock: 16,
        paddingInline: 18,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: { minHeight: 48 },
    },
  },
};

// ============================================================
// Theme creation
// ============================================================
const defaultTheme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  breakpoints,
  zIndex,
  transitions,
  components,
});

// Add custom properties (accessible without type augmentation)
defaultTheme.customShadows = customShadows;

/**
 * Dashboard style settings (Default)
 */
defaultTheme.dashboard = {
  style: 'default',
  iconStyle: 'outlined',
  iconWeight: 400,
  cardBorderRadius: 24,
  cardColors: [
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
    'linear-gradient(to bottom, #F8F8FC 0%, #F8F8FC 100%)',
  ],
  subCardColors: [
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
    'linear-gradient(to bottom, #F3F3F9 0%, #F3F3F9 100%)',
  ],
  textColor: palette.text.primary,
  textSecondary: palette.text.secondary,
  textShadow: '0 0 0 rgba(20, 19, 43, 0)',
  backdropFilter: 'blur(0px)',
  WebkitBackdropFilter: 'blur(0px)',
  border: '1px solid transparent',
  borderColor: 'transparent',
  shadow: customShadows.lg,
  subBorder: '1px solid rgba(20, 19, 43, 0.06)',
  subShadow: '0 0 0 rgba(20, 19, 43, 0)',
  subBackdropFilter: 'blur(0px)',
  subBorderRadius: 16,
  dividerColor: 'rgba(20, 19, 43, 0.08)',
  progressHeight: 6,
  progressTrackColor: 'rgba(20, 19, 43, 0.06)',
  progressBarColor: palette.primary.main,
  progressGradient: false,
  progressBorderRadius: 999,
  background: '#FCFCFF',
  atmosphere: 'linear-gradient(to bottom, #FCFCFF 0%, #F8F8FC 100%)',
  atmosphereOpacity: 0,
  accentColor: '#4F46E5', // MUSE Accent (info.main) - for essential emphasis
  accentColors: {
    wind: '#4DB6AC',
    humidity: '#FFB74D',
    uvIndex: '#FF8A65',
    pressure: '#64B5F6',
  },
  blobs: null,
};

export default defaultTheme;

// Export individual tokens (for documentation)
export {
  palette,
  typography,
  spacing,
  shape,
  customShadows,
  breakpoints,
  zIndex,
  transitions,
  components,
};
