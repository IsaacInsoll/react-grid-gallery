import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(fixtureRoot, '../../..');

const createReactAliases = (packageJsonPath: string) => {
  const packageRequire = createRequire(packageJsonPath);

  return [
    {
      find: /^react$/,
      replacement: packageRequire.resolve('react'),
    },
    {
      find: /^react\/jsx-runtime$/,
      replacement: packageRequire.resolve('react/jsx-runtime'),
    },
    {
      find: /^react\/jsx-dev-runtime$/,
      replacement: packageRequire.resolve('react/jsx-dev-runtime'),
    },
    {
      find: /^react-dom$/,
      replacement: packageRequire.resolve('react-dom'),
    },
    {
      find: /^react-dom\/client$/,
      replacement: packageRequire.resolve('react-dom/client'),
    },
    {
      find: /^react-dom\/server$/,
      replacement: packageRequire.resolve('react-dom/server.browser'),
    },
  ];
};

export default defineConfig(({ mode }) => {
  const reactPackage =
    mode === 'react19'
      ? path.join(fixtureRoot, '../react-19/package.json')
      : path.join(repositoryRoot, 'package.json');

  return {
    root: fixtureRoot,
    define: {
      __REACT_VERSION__: JSON.stringify(mode === 'react19' ? '19' : '18'),
    },
    resolve: {
      alias: [
        {
          find: '@gallery',
          replacement: path.join(
            repositoryRoot,
            'dist/react-grid-gallery.esm.js',
          ),
        },
        ...createReactAliases(reactPackage),
      ],
    },
  };
});
