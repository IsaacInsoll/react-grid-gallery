import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const packageManifest = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8'),
) as { version: string };

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    defaultName: 'Documentation',
  },
  viteFinal(viteConfig, { configType }) {
    const isStaticBuild = configType === 'PRODUCTION';
    const galleryEntry = isStaticBuild ? 'dist/index.js' : 'src/index.ts';

    return mergeConfig(viteConfig, {
      define: {
        __STORYBOOK_PACKAGE_MODE__: JSON.stringify(
          isStaticBuild ? 'built package' : 'source with HMR',
        ),
        __STORYBOOK_PACKAGE_VERSION__: JSON.stringify(packageManifest.version),
      },
      resolve: {
        alias: [
          {
            find: '@picr/react-grid-gallery',
            replacement: path.join(repositoryRoot, galleryEntry),
          },
        ],
        dedupe: ['react', 'react-dom'],
      },
    });
  },
};

export default config;
