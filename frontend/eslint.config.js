import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,vue}'],
    extends: [
      tsPlugin.configs.recommended,
      'plugin:vue/vue3-recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
