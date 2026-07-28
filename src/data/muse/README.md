# MUSE Dummy Data

A dummy data set that directly reflects the data model in `docs/muse/02-ux-flow.md`.
The Storybook page templates (`ArchivePage`, `ProjectListPage`, `ProjectDetailPage`, `SettingsPage`, `ProjectCreateWizard`, `ReferencePicker`) all import their data from this directory.

## File structure

| File | Role |
|------|------|
| `schemas.js` | JSDoc typedefs. For IDE autocomplete. No runtime values |
| `references.js` | 28 References - linked via static import of `dummyImage/reference{N}.jpg` |
| `projects.js` | 4 Projects + id map + thumbnail-assembled version |
| `analysisResults.js` | Per-project 5-layer AnalysisResult |
| `userSettings.js` | Default settings values |
| `dummyImage/` | Actual reference images (reference1.jpg to reference28.jpg / jpeg) |
| `index.js` | barrel export |

## Checking data in Storybook

- **`MUSE/Data/References`** - provides 3 views: full list/schema/grid/id lookup

## How to replace images

### 1) Keep the same filename

Swap the contents of `dummyImage/reference1.jpg` and the like while keeping the filename, and no code change is needed. The whole project reflects it automatically.

### 2) Add an image

Put a new image file in `dummyImage/` and add it only to the import statements at the top of `references.js` and the `IMAGES` array.

```js
import ref29 from './dummyImage/reference29.jpg';
// ...
const IMAGES = [..., ref28, ref29];
```

The length of the `references` array grows automatically, and all stories/pages reflect the new length.

### 3) Project card thumbnails

`projectsWithThumbnails` in `projects.js` auto-derives Reference thumbnails. No separate replacement needed.

### 4) Key visual (project detail)

`buildKeyVisuals` in `analysisResults.js` references thumbnails from the project's referenceIds.

## Usage example

```jsx
import {
  references,
  referencesById,
  projectsWithThumbnails,
  getAnalysisResult,
  defaultUserSettings,
} from '../../data/muse';

<ArchivePage references={ references } ... />
<ProjectListPage projects={ projectsWithThumbnails } ... />
<ProjectDetailPage
  project={ projectsWithThumbnails[0] }
  analysis={ getAnalysisResult(projectsWithThumbnails[0].id).layers }
  ...
/>
```
