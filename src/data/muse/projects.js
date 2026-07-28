import { getReferenceThumbnails } from './references.js';

/**
 * MUSE - Projects dummy data
 *
 * Each project's referenceIds are picked from the `src/data/muse/dummyImage/` image pool (ref-001 to ref-028).
 * Thumbnails are auto-derived in projectsWithThumbnails from the references' thumbnailUrl.
 *
 * @type {import('./schemas.js').Project[]}
 */
export const projects = [
  {
    id: 'proj-001',
    name: 'Editorial Minimal',
    intent: 'Black and white contrast, large typography, and generous whitespace in a magazine tone',
    mode: 'system',
    selectedRefs: [
      { id: 'ref-001', useLayers: ['color', 'typography'] },
      { id: 'ref-002', useLayers: ['layout'] },
      { id: 'ref-003', useLayers: ['color', 'visualDirection'] },
    ],
    referenceIds: ['ref-001', 'ref-002', 'ref-003', 'ref-004', 'ref-005', 'ref-006'],
    createdAt: '2026-04-20',
  },
  {
    id: 'proj-002',
    name: 'Fintech Dashboard',
    intent: 'A data-dense dashboard with a calm blue foundation',
    mode: 'system',
    selectedRefs: [
      { id: 'ref-007', useLayers: ['color'] },
      { id: 'ref-008', useLayers: ['color', 'layout'] },
      { id: 'ref-009', useLayers: ['typography'] },
    ],
    referenceIds: ['ref-007', 'ref-008', 'ref-009', 'ref-010', 'ref-011'],
    createdAt: '2026-04-18',
  },
  {
    id: 'proj-003',
    name: 'Lifestyle App',
    intent: 'A warm-toned mobile app with an everyday texture',
    mode: 'concept',
    selectedRefs: [
      { id: 'ref-012', useLayers: [] },
      { id: 'ref-013', useLayers: [] },
      { id: 'ref-014', useLayers: ['color', 'typography'] },
    ],
    referenceIds: ['ref-012', 'ref-013', 'ref-014', 'ref-015', 'ref-017'],
    createdAt: '2026-04-15',
  },
  {
    id: 'proj-004',
    name: 'Studio Brand',
    intent: 'Branding with bold color and a limited typography set',
    mode: 'system',
    selectedRefs: [
      { id: 'ref-017', useLayers: ['color', 'gradient'] },
      { id: 'ref-018', useLayers: ['typography'] },
      { id: 'ref-019', useLayers: ['layout', 'visualDirection'] },
    ],
    referenceIds: ['ref-017', 'ref-018', 'ref-019', 'ref-020', 'ref-021', 'ref-022', 'ref-023'],
    createdAt: '2026-04-10',
  },
];

export const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

/** A form with thumbnail URLs assembled so it can drop straight into a project card */
export const projectsWithThumbnails = projects.map((p) => ({
  ...p,
  thumbnails: getReferenceThumbnails(p.referenceIds, 4),
}));
