import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import '../stories/storybook.css';

const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches;

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      if (context.viewMode === 'docs') {
        return (
          <div
            className="docs-story-surface"
            data-testid="story-surface"
            data-package-mode={__STORYBOOK_PACKAGE_MODE__}
          >
            <Story />
          </div>
        );
      }

      return (
        <div
          className="story-surface"
          data-testid="story-surface"
          data-package-mode={__STORYBOOK_PACKAGE_MODE__}
        >
          <div className="story-surface__inner">
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: prefersDarkMode ? themes.dark : themes.light,
      toc: {
        title: 'On this page',
        headingSelector: 'h2, h3',
      },
      story: {
        // Keep docs canvases in the document flow. Storybook's auto-sized
        // iframe mode can feed responsive gallery height changes back into its
        // own measurements and visibly oscillate.
        inline: true,
      },
    },
    backgrounds: {
      options: {
        paper: { name: 'Paper', value: '#f7f7fb' },
        white: { name: 'White', value: '#ffffff' },
        midnight: { name: 'Midnight', value: '#181525' },
      },
    },
    viewport: {
      options: {
        phone: {
          name: 'Phone · 390px',
          styles: { width: '390px', height: '844px' },
        },
        tablet: {
          name: 'Tablet · 768px',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop · 1280px',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Start',
          ['Welcome', 'Getting started'],
          'Examples',
          ['Gallery workshop', 'Photo manager', 'Mixed destinations'],
          'Gallery',
          [
            'Playground',
            'Selection',
            'Content',
            'Customization',
            'Layout edge cases',
          ],
          'Advanced',
          ['Headless layout', 'Viewer integration'],
          'Guides',
          [
            'Recipes',
            'Troubleshooting',
            'API reference',
            'Migration',
            'Releases',
            'Acknowledgements',
          ],
          'Contributors',
          ['Contributing', 'Testing & checks'],
        ],
      },
    },
  },
};

export default preview;
