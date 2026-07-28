import { useGNB } from './GNB';

/**
 * useAppShell hook - access AppShell/GNB state
 *
 * Accesses drawer state and responsive information from inside the AppShell component.
 * Uses the GNB context.
 *
 * @returns {Object} { isDrawerOpen, toggleDrawer, closeDrawer, isMobile }
 *
 * Example usage:
 * const { isDrawerOpen, toggleDrawer, isMobile } = useAppShell();
 */
export const useAppShell = () => useGNB();
