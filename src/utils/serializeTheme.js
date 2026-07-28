/**
 * serializeTheme
 *
 * Serialize a theme-like object into a JS source string for MUI `createTheme`.
 * - Excludes functions, Symbols, and undefined
 * - Strings use single quotes, numbers/booleans stay as-is
 * - Keys are unquoted if valid JS identifiers, otherwise quoted
 *
 * @param {object} themeObject - The theme object to serialize
 * @param {object} options
 * @param {boolean} options.asCreateThemeCall - Whether to wrap in a createTheme(...) call [default: true]
 * @returns {string} JS source string
 */
export function serializeTheme(themeObject, { asCreateThemeCall = true } = {}) {
  const body = stringifyValue(themeObject, 0);
  if (!asCreateThemeCall) {
    return body;
  }
  return [
    "import { createTheme } from '@mui/material/styles';",
    '',
    `const theme = createTheme(${body});`,
    '',
    'export default theme;',
  ].join('\n');
}

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const INDENT = '  ';

function stringifyValue(value, depth) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'function' || typeof value === 'symbol') return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return stringifyString(value);
  if (Array.isArray(value)) return stringifyArray(value, depth);
  if (typeof value === 'object') return stringifyObject(value, depth);
  return undefined;
}

function stringifyString(s) {
  // Single-quote based, escape inner single quotes
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function stringifyKey(key) {
  if (IDENT_RE.test(key)) return key;
  return stringifyString(key);
}

function stringifyObject(obj, depth) {
  const entries = Object.entries(obj)
    .map(([k, v]) => {
      const valueStr = stringifyValue(v, depth + 1);
      if (valueStr === undefined) return null;
      return `${INDENT.repeat(depth + 1)}${stringifyKey(k)}: ${valueStr}`;
    })
    .filter(Boolean);
  if (!entries.length) return '{}';
  return `{\n${entries.join(',\n')},\n${INDENT.repeat(depth)}}`;
}

function stringifyArray(arr, depth) {
  const items = arr
    .map((v) => stringifyValue(v, depth + 1))
    .filter((v) => v !== undefined);
  if (!items.length) return '[]';
  const inlineThreshold = 6;
  const isAllPrimitive = items.every((i) => !i.includes('\n'));
  if (isAllPrimitive && items.length <= inlineThreshold) {
    return `[${items.join(', ')}]`;
  }
  return `[\n${items.map((i) => `${INDENT.repeat(depth + 1)}${i}`).join(',\n')},\n${INDENT.repeat(depth)}]`;
}
