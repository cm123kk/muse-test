/**
 * Theme System
 *
 * Provides utilities for managing themes.
 * Each theme follows the MUI createTheme specification.
 */

import defaultTheme from './default.js';
import darkTheme from './dark.js';

/** List of available themes */
export const themes = {
  default: defaultTheme,
  light: defaultTheme,
  dark: darkTheme,
};

/** Theme metadata */
export const themeMeta = {
  default: { name: 'Default', description: 'Project base theme', mode: 'light' },
  light: { name: 'Light', description: 'MUSE light mode', mode: 'light' },
  dark: { name: 'Dark', description: 'MUSE dark mode', mode: 'dark' },
};

/**
 * Get a theme object by theme name
 *
 * @param {string} themeName - Theme name
 * @returns {object} MUI theme object
 */
export const getTheme = (themeName) => {
  return themes[themeName] || themes.default;
};

/**
 * Get the list of theme names
 *
 * @returns {string[]} Array of theme names
 */
export const getThemeNames = () => Object.keys(themes);

export { defaultTheme, darkTheme };
export default themes;
