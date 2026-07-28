import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useInfiniteScroll } from './useInfiniteScroll.js';

/**
 * InfiniteMasonry component
 *
 * An infinite scroll grid based on MUI Masonry.
 * When the bottom sentinel enters the viewport, `onLoadMore` is called to request more items.
 * Supports responsive columns by default and is used in MUSE's archive/reference selection UI.
 *
 * Props:
 * @param {array} items - Array of items to render [Required]
 * @param {function} renderItem - (item, index) => ReactNode, render function for each item [Required]
 * @param {function} onLoadMore - Callback to request the next page [Optional]
 * @param {boolean} hasMore - Whether more items can be loaded [Optional, default: false]
 * @param {boolean} isLoading - Whether it is currently loading (prevents duplicate calls) [Optional, default: false]
 * @param {number|object} columns - Number of Masonry columns or a responsive object [Optional, default: { xs: 2, sm: 3, md: 4 }]
 * @param {number} spacing - Gap between items (in 8px units) [Optional, default: 2]
 * @param {string} keyExtractor - Field name to extract the key from an item (falls back to index) [Optional, default: 'id']
 * @param {node} emptyContent - Content to display when items is empty [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <InfiniteMasonry
 *   items={ references }
 *   renderItem={ (ref) => <ImageCard key={ref.id} src={ref.url} tags={ref.tags} /> }
 *   onLoadMore={ loadMore }
 *   hasMore={ hasMore }
 *   isLoading={ isLoading }
 * />
 */
export function InfiniteMasonry({
  items,
  renderItem,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  columns = { xs: 2, sm: 3, md: 4 },
  spacing = 2,
  keyExtractor = 'id',
  emptyContent,
  sx,
}) {
  const sentinelRef = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isEnabled: !isLoading,
  });

  if (!items?.length && !isLoading) {
    return (
      <Box sx={ { py: 8, textAlign: 'center', ...sx } }>
        { emptyContent || (
          <Typography variant="body2" color="text.secondary">
            No items to display
          </Typography>
        ) }
      </Box>
    );
  }

  return (
    <Box sx={ { width: '100%', ...sx } }>
      <Masonry columns={ columns } spacing={ spacing }>
        { items.map((item, index) => {
          const key = item?.[keyExtractor] ?? index;
          return <Box key={ key }>{ renderItem(item, index) }</Box>;
        }) }
      </Masonry>

      {/* Sentinel: placed outside Masonry so it does not interfere with column calculation */}
      <Box
        ref={ sentinelRef }
        sx={ {
          height: 1,
          width: '100%',
          mt: spacing,
        } }
        aria-hidden
      />

      { isLoading && (
        <Box
          sx={ {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            gap: 1.5,
          } }
        >
          <CircularProgress size={ 20 } thickness={ 4 } />
          <Typography variant="body2" color="text.secondary">
            Loading
          </Typography>
        </Box>
      ) }

      { !hasMore && items?.length > 0 && !isLoading && (
        <Box sx={ { py: 4, textAlign: 'center' } }>
          <Typography variant="caption" color="text.secondary">
            All items loaded
          </Typography>
        </Box>
      ) }
    </Box>
  );
}
