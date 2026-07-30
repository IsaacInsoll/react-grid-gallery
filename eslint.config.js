import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sourceFiles = ['src/**/*.{ts,tsx}'];
const testFiles = ['test/**/*.{ts,tsx}', 'vitest.setup.ts'];
const configFiles = ['*.config.ts'];
const consumerTypeFiles = [
  'test/fixtures/packed-consumer/**/*.{ts,tsx}',
  'test/fixtures/types/consumer.tsx',
];

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'examples/**',
      'playground/**',
      'test-results/**',
      'test/browser/__screenshots__/**',
      '**/.type-package/**',
      '**/node_modules/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['eslint.config.js', '**/scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: [...sourceFiles, ...testFiles, ...configFiles],
    extends: [...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    files: consumerTypeFiles,
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: sourceFiles,
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-console': 'error',
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: configFiles,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/**/*.tsx', 'test/**/*.tsx'],
    extends: [
      eslintReact.configs['recommended-typescript'],
      eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'],
      reactHooks.configs.flat['recommended-latest'],
    ],
    rules: {
      '@eslint-react/dom-no-missing-button-type': 'error',
      // Images and tags expose optional keys, so an index remains the fallback.
      '@eslint-react/no-array-index-key': 'off',
    },
  },
  {
    files: ['test/**/*.tsx'],
    rules: {
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
    },
  },
  {
    files: ['test/unit/**/*.{ts,tsx}'],
    extends: [vitest.configs.recommended],
  },
  {
    files: ['test/browser/**/*.spec.ts'],
    extends: [playwright.configs['flat/recommended']],
  },
  eslintConfigPrettier,
);
