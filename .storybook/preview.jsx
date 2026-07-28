import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { defaultTheme } from '../src/styles/themes';
import { MuseStoreProvider } from '../src/store';
import { MockAuthProvider } from '../src/contexts/AuthContext';

// Dark Reader 차단 — 확장이 페이지 색을 임의로 반전시키지 않도록 opt-out
if (typeof document !== 'undefined' && !document.querySelector('meta[name="darkreader-lock"]')) {
  const darkreaderLock = document.createElement('meta');
  darkreaderLock.name = 'darkreader-lock';
  document.head.appendChild(darkreaderLock);
}

// Google Fonts 로드 (Material Symbols 아이콘 전용)
// 본문/헤딩 폰트는 앱과 동일하게 OS 시스템 폰트를 사용하므로 웹폰트를 로드하지 않는다.
// (앱은 웹폰트를 로드하지 않는데 스토리북만 Outfit 을 로드하면 폰트가 서로 달라 보였음)
const googleFonts = [
  // Material Symbols
  'Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
];

googleFonts.forEach((font) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
  document.head.appendChild(link);
});

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Style',
          ['Overview', 'Colors', 'Typography', 'Icons', 'Spacing', 'Component Tokens'],
          'Component',
          [
            '1. Typography',
            '2. Container',
            '3. Card',
            '4. Media',
            '5. Data Display',
            '6. In-page Navigation',
            '7. Input & Control',
            '8. Layout',
            '9. Overlay & Feedback',
            '10. Navigation',
          ],
          'Interactive',
          ['12. Scroll'],
          'Common',
          'Template',
          'Page',
          'MUSE',
          ['Data', 'AI Tasks', 'AI Playground'],
          'Test Data',
        ],
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <MuseStoreProvider seed="fixtures">
          <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <div style={{ width: '100%', paddingTop: '40px' }}>
              <Story />
            </div>
          </ThemeProvider>
        </MuseStoreProvider>
      </MockAuthProvider>
    ),
  ],
};

export default preview;
