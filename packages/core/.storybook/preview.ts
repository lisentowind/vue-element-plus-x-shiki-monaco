import type { Preview } from '@storybook/vue3';
import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      },
      disableSaveFromUI: true
      // expanded: true // 默认展开所有组件描述
    },
    backgrounds: {
      grid: {
        disable: true // 禁用网格
      }
    },
    darkMode: {
      // Override the default dark theme
      dark: { ...themes.dark },
      // Override the default light theme
      light: { ...themes.normal }
    }
  }
};

export default preview;
