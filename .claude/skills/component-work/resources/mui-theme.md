# MUI Custom Theme (SHOULD)

MUI 커스텀 테마 설정 규칙

## 테마 파일 관리

- 커스텀 테마는 별도의 파일로 관리한다
- 위치: `src/styles/theme.js` 또는 유사 경로

## Typography

### 폰트 패밀리 (System Font)
- 별도 웹폰트를 로드하지 않고 **OS 시스템 폰트**를 사용한다 (`-apple-system, BlinkMacSystemFont, system-ui, ...`).
- **본문과 헤딩 모두 동일한 시스템 폰트 스택**을 공유한다 (`typography.fontFamily === headingFontFamily`).
- 이유: 앱이 웹폰트를 로드하지 않아 실제로 시스템 폰트로 렌더링되며, 이 네이티브한 룩을 디자인 시스템 기준으로 삼는다. (스토리북만 웹폰트를 로드하면 앱과 폰트가 달라 보임)
- 웹폰트(Pretendard/Outfit 등)를 도입하려면 앱(index.html/CSS)과 스토리북(`.storybook/preview.jsx`) 양쪽에 동일하게 로드한 뒤 테마 스택을 함께 바꾼다.

## Color

### Primary Color
```jsx
primary: {
  main: '#0000FF'
}
```

### Secondary Color
```jsx
secondary: {
  main: blueGrey[900]  // blueGrey의 가장 어두운색
}
```

## Elevation

Paper에 기본적으로 사용되는 elevation의 box shadow 설정:

- x, y offset: 0
- opacity 값: 낮춤
- blur 값: 높임 (dimmed shadow)

```jsx
shadows: [
  'none',
  '0 0 8px rgba(0, 0, 0, 0.08)',
  '0 0 16px rgba(0, 0, 0, 0.08)',
  // ...
]
```

## Border Radius

인라인으로 직접 지정하지 않는 이상 모든 컴포넌트의 borderRadius는 **0**

```jsx
shape: {
  borderRadius: 0
}
```

## 테마 적용 예시

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0000FF' },
    secondary: { main: '#263238' },  // blueGrey[900]
  },
  typography: {
    // OS 시스템 폰트 스택 (본문/헤딩 공유)
    fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    // ...
  },
  shape: {
    borderRadius: 0,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 앱 내용 */}
    </ThemeProvider>
  );
}
```
