import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  TreeNode,
} from '../../components/storybookDocumentation';

export default {
  title: 'Overview/Page Composition',
  parameters: {
    layout: 'padded',
  },
};

/**
 * Shared layout at the routing level. AppShell lives here only once.
 * Shared by every route (Archive / ProjectList / ProjectCreate / ProjectDetail / Settings).
 * Page templates do not include this shell.
 *
 * (start-point: auth/AuthGuard not included. The learner adds it during the Supabase integration step)
 */
const routeLayout = {
  BrowserRouter: {
    'Route /': {
      AppShellLayout: {
        Role: 'Injects MuseNav into AppShell and renders child route pages via Outlet',
        AppShell: {
          Role: 'Top-level shell with a built-in GNB (header). The header is not unmounted on page transitions',
          'logo slot ← <MuseNav />': {
            left_logo: 'MUSE logo + /archive link',
            'left_nav links': 'Archive / Projects / Settings (NavLink isActive style)',
          },
          'main (children) ← <Outlet />': 'Child route pages are rendered here',
        },
      },
    },
  },
  body_background: {
    ambient_3layer: 'multi-radial + linear (index.css)',
  },
};

/**
 * The component tree each page (template) contains.
 * AppShell / GNB are not here. The route layout owns them.
 * Page templates own only the "body" below PageContainer.
 */
const pageStructure = {
  'ArchivePage (Reference Archive)': {
    Role: 'Upload → Auto-tagging (T1) → Filter → Infinite grid',
    PageContainer: {
      'Hero (title + New Project button)': {
        Typography_Archive: 'h3 title',
        Button_NewProject: 'onNewProject → navigate("/projects/new")',
      },
      'Upload area': {
        FileDropzone: 'Multi-file drop (concurrency 3)',
        Alert_error: 'Upload failure banner',
        Alert_tagging: 'Shows pendingCount',
      },
      FilterPanel: {
        'Color SuperSection': 'hex swatch 26px (HSL similarity OR)',
        'Design Layer SuperSection': 'Typography / Layout / Gradient chips',
        'Visual Direction SuperSection': 'Genre / Style / Subject chips',
      },
      InfiniteMasonry: {
        ArchiveCard: {
          ImageCard: 'dominantColors 14px swatch',
          pending_skeleton: 'When _pending flag is set',
          retry_button: 'On _tagError, 🔄 (no auto-delete)',
          delete_button: '✕',
        },
      },
    },
    Dialog_deleteConfirm: '(outside PageContainer, portal)',
  },

  'ProjectListPage (Project List)': {
    Role: 'Grid of created project cards',
    PageContainer: {
      'Hero (title + New Project button)': '',
      'Grid (MUI)': {
        MoodboardCard: {
          thumbnail: 'Derived from project.referenceIds[0]',
          title: 'project.name',
          type_chip_overlay: 'Brand / Editorial / Space / Web',
          'Caller-side adapter': 'Field mapping in ProjectListPage instead of extending the MoodboardCard API',
        },
      },
    },
  },

  'ProjectCreateWizard (Project Creation)': {
    Role: '3-step Wizard. useReducer-based state. T2/T3 injected externally. Works even outside AppShell',
    Stepper: {
      'Step 1: Intent input': {
        TextField_name: '',
        TextField_intent: 'Free-form sentence like "minimal luxury"',
        Select_type: 'Brand / Editorial / Space / Web',
      },
      'Step 2: Reference selection': {
        ReferencePicker: {
          ImageCard_grid: 'Selectable grid',
          recommended_highlight: 'Highlights T2 recommended IDs (recommendedLoader prop)',
        },
      },
      'Step 3: Run Analysis': {
        AnalysisProgress: 'Shows T3 call progress (analyze prop, text-only compose)',
      },
    },
  },

  'ProjectDetailPage (Token editing)': {
    Role: 'SplitScreen 60:40. Left edit / Right real-time preview',
    PageContainer: {
      'Project header (back + title + Export button)': '',
      CategoryTab: 'color / typography / layout / gradient / visualDirection',
      SplitScreen: {
        'Left 60%: Edit area': {
          TokenListItem: {
            slot_preview: 'Injects a per-layer preview component',
            toggle_on_off: '',
            emphasis_0_1_2: '3 emphasis levels',
          },
          'preview slot (per layer)': {
            ColorSwatchList: 'color layer',
            TypographyPreview: 'typography layer',
            LayoutTokenPreview: 'layout layer',
            GradientPreview: 'gradient layer',
            VisualDirection_Markdown: 'visualDirection layer (MD render)',
          },
        },
        'Right 40%: Real-time preview': {
          buildThemeObject: 'Reduces only active tokens back to an MUI theme',
          sample_UI: 'Sample with the reduced theme applied to real components',
        },
      },
      ThemeExportDialog: {
        Radio_format: 'JSON (general) / ZIP (bundle)',
        'ZIP bundle contents': 'README.md + muse.json + visualDirection.md + references/',
        'Rule': 'Strips MUI identifiers, keeps only hex/CSS values (framework-agnostic)',
      },
    },
  },

  'SettingsPage (Settings)': {
    Role: '4-section form. The Save button renders only when the onSave prop is present',
    PageContainer: {
      'Hero (title)': '',
      'Section: AI model': { Select: 'claude-haiku-4-5-20251001, etc.' },
      'Section: Auto-tagging': { Switch: 'isAutoTagEnabled' },
      'Section: Storage': { RadioGroup: 'local / cloud' },
      'Section: Theme': { RadioGroup: 'light / dark' },
      Button_save: 'Only when the onSave prop is present',
    },
  },
};

export const Default = {
  render: () => (
    <>
      <DocumentTitle
        title="Page Composition"
        status="Available"
        note="Tree of component containment relationships between routing layout and page templates"
        brandName="MUSE"
        systemName="Starter Kit"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={ { fontWeight: 700, mb: 1 } }>
          Page Composition
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 3 } }>
          Visualizes the separation of roles between the route layout (which includes AppShell) and page templates (body only) as a tree.
        </Typography>

        <SectionTitle title="1. Route Layout: AppShell only here, once" />
        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1 } }>
          AppShell is the top-level shell with a built-in GNB (header). To keep it from unmounting on page transitions,
          <code>AppShellLayout</code> is used as the shared layout element in the nested routes of <code> App.jsx </code>.
        </Typography>
        <Box sx={ { p: 2, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
          <Box sx={ { fontFamily: 'monospace' } }>
            { Object.entries(routeLayout).map(([key, value]) => (
              <TreeNode
                key={ key }
                keyName={ key }
                value={ value }
                depth={ 0 }
                defaultOpen
              />
            )) }
          </Box>
        </Box>

        <SectionTitle title="2. Per-page Body Composition: each page owns only what is below PageContainer" />
        <Typography variant="caption" color="text.secondary" sx={ { display: 'block', mb: 1 } }>
          Page templates are stateless. They are not responsible for the header (GNB) or the shared background. Click to expand and see the contained component tree.
        </Typography>
        <Box sx={ { p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 } }>
          <Box sx={ { fontFamily: 'monospace' } }>
            { Object.entries(pageStructure).map(([key, value]) => (
              <TreeNode
                key={ key }
                keyName={ key }
                value={ value }
                depth={ 0 }
                defaultOpen
              />
            )) }
          </Box>
        </Box>

        <Divider sx={ { my: 3 } } />

        <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
          <strong>Principles</strong>
        </Typography>
        <Box component="ul" sx={ { pl: 3, mb: 2, '& li': { fontSize: 14, color: 'text.secondary', mb: 0.5 } } }>
          <li><strong>AppShell is the route layout</strong>: if a page component includes AppShell, the header unmounts/remounts on every page, and logo and nav definitions are duplicated once per page.</li>
          <li>Page templates are <strong>stateless</strong>: props in / callbacks out. State is injected from the <code>*Route.jsx</code> container.</li>
          <li>Instead of extending the API of shared components (such as MoodboardCard), map fields with a <strong>caller-side adapter</strong>.</li>
          <li>AI calls (T2/T3) are placed at the boundary as callback props, so Storybook mocks and production coexist.</li>
          <li>The Wizard uses <strong>useReducer + boundary callbacks</strong> (<code>recommendedLoader</code>, <code>analyze</code>).</li>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Actual implementation: route structure in <code>src/App.jsx</code>, shared layout in <code>src/pages/AppShellLayout.jsx</code>,
          page bodies in <code>src/components/templates/*.jsx</code>.
        </Typography>
      </PageContainer>
    </>
  ),
};
