import baseConfig from '../../../eslint.config.mjs';
import globals from 'globals';
import nx from '@nx/eslint-plugin';
import pluginImport from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.config.js', '**/*.config.mjs', 'vite.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      import: pluginImport,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/order': ['warn', {
        'groups': [
          'builtin',    // Node.js modules (fs, path)
          'external',   // node_modules libraries (react, zustand)
          'internal',   // Alias de importación configurados en tsconfig (@/components)
          'parent',     // Relative imports ('../')
          'sibling',    // Relative imports ('./')
          'index',      // Index files from a directoy imports
          'object',     // "import { type X } from '...'" type imports
          'type'        // "import type { Y } from '...'" type imports
        ],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
    },
  },
];
