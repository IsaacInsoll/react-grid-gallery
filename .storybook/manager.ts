import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const setNativeTheme = (isDark: boolean) => {
  addons.setConfig({
    theme: create({
      base: isDark ? 'dark' : 'light',
      brandTitle: '@picr/react-grid-gallery',
      brandUrl: './',
      colorPrimary: '#8d79f2',
      colorSecondary: '#7b61ed',
      appBg: isDark ? '#12101a' : '#f7f7fb',
      appContentBg: isDark ? '#1b1825' : '#ffffff',
      appBorderColor: isDark ? '#383243' : '#e6e3f1',
      appBorderRadius: 10,
      fontBase:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontCode:
        '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
      textColor: isDark ? '#f1edf8' : '#211c35',
      textMutedColor: isDark ? '#aaa3b9' : '#716b82',
      barTextColor: isDark ? '#c1bacd' : '#625c72',
      barSelectedColor: isDark ? '#a995ff' : '#6246ea',
      barHoverColor: isDark ? '#c4b8ff' : '#4930c7',
      inputBg: isDark ? '#24202f' : '#ffffff',
      inputBorder: isDark ? '#494254' : '#d8d3e6',
      inputTextColor: isDark ? '#f1edf8' : '#211c35',
      inputBorderRadius: 8,
    }),
  });
};

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
setNativeTheme(colorScheme.matches);
colorScheme.addEventListener('change', (event) => {
  setNativeTheme(event.matches);
});
