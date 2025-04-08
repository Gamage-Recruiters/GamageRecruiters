import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default {
  ignores: ['dist'],
  extends: [
    js.configs.recommended, // Basic JavaScript linting
    'plugin:react/recommended', // React-specific linting rules
  ],
  files: ['**/*.{js,jsx}'], // Match JavaScript and JSX files
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser, // Browser globals
  },
  plugins: {
    'react-hooks': reactHooks, // Enforce rules for React Hooks
    'react-refresh': reactRefresh, // Enforce React Refresh rules
  },
  rules: {
    ...reactHooks.configs.recommended.rules, // React hooks rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
