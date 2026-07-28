import { useCallback, useState } from 'react';
import { ArchivePage } from './ArchivePage';
import { references as allReferences, projects as allProjects } from '../../data/muse';
import { createMockClient } from '../../lib/supabaseMock';
import { withAppShell } from './_appShellDecorator.jsx';

/**
 * Storybook-only mock Supabase client.
 * When useStoreMode=true, it returns fixture data instead of hitting the real DB.
 */
const mockClient = createMockClient({
  reference_items: allReferences.slice(0, 18).map((r) => ({
    id: r.id,
    owner_id: 'mock-uid-0001',
    source: r.source || 'file',
    thumbnail_url: r.thumbnailUrl,
    storage_path: null,
    title: r.title,
    tags: r.tags,
    dominant_colors: r.dominantColors || [],
    extracted: r.extracted || {},
    created_at: r.createdAt || new Date().toISOString(),
  })),
  projects: allProjects,
});

export default {
  title: 'Page/ArchivePage',
  component: ArchivePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [withAppShell],
};

/** Store Mode: showcase based on the mock client. No real Supabase calls */
export const StoreMode = {
  render: () => (
    <ArchivePage
      useStoreMode
      client={mockClient}
      onNewProject={() => {}}
    />
  ),
};

/** External injection: compatible with existing stories */
export const Default = {
  render: () => {
    const [items, setItems] = useState(() => allReferences.slice(0, 18));
    const [hasMore, setHasMore] = useState(allReferences.length > 18);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = useCallback(() => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      setTimeout(() => {
        setItems((prev) => {
          const next = allReferences.slice(prev.length, prev.length + 12);
          const total = prev.length + next.length;
          if (total >= allReferences.length) setHasMore(false);
          return [...prev, ...next];
        });
        setIsLoading(false);
      }, 600);
    }, [isLoading, hasMore]);

    return (
      <ArchivePage
        references={items}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        onUploadFile={() => {}}
        onNewProject={() => {}}
      />
    );
  },
};

export const EmptyState = {
  render: () => (
    <ArchivePage
      references={[]}
      onUploadFile={() => {}}
      onNewProject={() => {}}
    />
  ),
};
