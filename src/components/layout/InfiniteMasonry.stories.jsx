import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { InfiniteMasonry } from './InfiniteMasonry.jsx';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/InfiniteMasonry',
  component: InfiniteMasonry,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## InfiniteMasonry

An infinite scroll grid based on the MUI \`Masonry\` component.

- Calls \`onLoadMore\` when an \`IntersectionObserver\` based sentinel enters the viewport
- The sentinel is placed outside Masonry so it does not interfere with Masonry column calculation
- The sentinel observer is temporarily disabled while loading to prevent duplicate calls
- Responsive column support (\`xs/sm/md/lg\`), default \`{ xs: 2, sm: 3, md: 4 }\`

### Use Cases

- MUSE archive infinite grid
- Reference selection panel during Project creation
- General card and image catalogs
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of items to render',
    },
    renderItem: {
      control: false,
      description: 'Render function for each item (item, index) => ReactNode',
    },
    onLoadMore: {
      action: 'loadMore',
      description: 'Called when the sentinel enters the viewport',
    },
    hasMore: {
      control: 'boolean',
      description: 'Whether more items can be loaded',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether it is currently loading',
    },
    columns: {
      control: 'object',
      description: 'Number of Masonry columns or a responsive object',
    },
    spacing: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'Spacing between items (in units of 8px)',
    },
    keyExtractor: {
      control: 'text',
      description: 'Name of the field to extract the key from each item',
    },
    emptyContent: {
      control: false,
      description: 'Content to show when items is empty',
    },
  },
};

/** Mock data factory (deterministic, reproducible from index alone) */
const makeMockItems = (start, count) =>
  Array.from({ length: count }, (_, i) => {
    const idx = start + i;
    return {
      id: `ref-${idx}`,
      index: idx,
      height: 120 + ((idx * 37) % 160),
    };
  });

/** Default: incremental loading (real infinite scroll) */
export const Default = {
  render: () => {
    const [items, setItems] = useState(() => makeMockItems(0, 24));
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = useCallback(() => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      // Simulate a real API call (600ms delay)
      setTimeout(() => {
        setItems((prev) => {
          const next = makeMockItems(prev.length, 12);
          const total = prev.length + next.length;
          if (total >= 72) setHasMore(false);
          return [...prev, ...next];
        });
        setIsLoading(false);
      }, 600);
    }, [isLoading, hasMore]);

    return (
      <Box sx={ { width: '100%', height: '70vh', overflowY: 'auto', px: 2 } }>
        <InfiniteMasonry
          items={ items }
          hasMore={ hasMore }
          isLoading={ isLoading }
          onLoadMore={ handleLoadMore }
          renderItem={ (item) => (
            <Placeholder.Box label={ `#${item.index}` } height={ item.height } />
          ) }
        />
      </Box>
    );
  },
};

/** Loading: automatic load from an initially empty state */
export const InitiallyEmpty = {
  render: () => {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      const t = setTimeout(() => {
        setItems(makeMockItems(0, 12));
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(t);
    }, []);

    const handleLoadMore = useCallback(() => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      setTimeout(() => {
        setItems((prev) => {
          const next = makeMockItems(prev.length, 12);
          if (prev.length + next.length >= 48) setHasMore(false);
          return [...prev, ...next];
        });
        setIsLoading(false);
      }, 600);
    }, [isLoading, hasMore]);

    return (
      <Box sx={ { width: '100%', height: '70vh', overflowY: 'auto', px: 2 } }>
        <InfiniteMasonry
          items={ items }
          hasMore={ hasMore }
          isLoading={ isLoading }
          onLoadMore={ handleLoadMore }
          renderItem={ (item) => (
            <Placeholder.Box label={ `#${item.index}` } height={ item.height } />
          ) }
        />
      </Box>
    );
  },
};

/** Empty state: custom emptyContent */
export const EmptyState = {
  render: () => (
    <Box sx={ { width: '100%', px: 2 } }>
      <InfiniteMasonry
        items={ [] }
        hasMore={ false }
        isLoading={ false }
        renderItem={ () => null }
        emptyContent={ 'No References have been collected yet. Try dragging an image or pasting a URL.' }
      />
    </Box>
  ),
};

/** Image gallery: Placeholder.Media combination example */
export const ImageGallery = {
  render: () => {
    const [items, setItems] = useState(() =>
      Array.from({ length: 12 }, (_, i) => ({ id: `img-${i}`, index: i })),
    );
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = useCallback(() => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      setTimeout(() => {
        setItems((prev) => {
          const next = Array.from({ length: 8 }, (_, i) => ({
            id: `img-${prev.length + i}`,
            index: prev.length + i,
          }));
          if (prev.length + next.length >= 40) setHasMore(false);
          return [...prev, ...next];
        });
        setIsLoading(false);
      }, 600);
    }, [isLoading, hasMore]);

    return (
      <Box sx={ { width: '100%', height: '70vh', overflowY: 'auto', px: 2 } }>
        <InfiniteMasonry
          items={ items }
          hasMore={ hasMore }
          isLoading={ isLoading }
          onLoadMore={ handleLoadMore }
          columns={ { xs: 2, sm: 3, md: 4 } }
          renderItem={ (item) => (
            <Placeholder.Media index={ item.index } category="abstract" />
          ) }
        />
      </Box>
    );
  },
};
