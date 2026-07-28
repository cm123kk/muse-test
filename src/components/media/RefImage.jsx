import Box from '@mui/material/Box';

/**
 * RefImage component
 *
 * A simple wrapper that renders a reference image.
 * (start-point version: since the backend is not connected, there is no signed URL retry logic.
 *  The re-signing-on-expiry logic will be added during the Supabase Storage integration step.)
 *
 * Props:
 * @param {string} src - Image URL [Optional]
 * @param {string} storagePath - (reserved) Path for re-signing on expiry after backend integration [Optional]
 * @param {string} alt - Alternative text [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <RefImage src={ ref.thumbnailUrl } alt={ ref.title } />
 */
export function RefImage({ src, storagePath: _storagePath, alt, sx, ...rest }) {
  if (!src) return null;
  return (
    <Box
      component="img"
      src={ src }
      alt={ alt }
      decoding="async"
      sx={ {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...sx,
      } }
      { ...rest }
    />
  );
}
