import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // ── Boundary rules: feature isolation ──
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'features', pattern: 'src/features/*/**' },
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'config', pattern: 'src/config/**' },
      ],
      'boundaries/ignore': ['src/main.tsx'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // app puede importar de features, shared y config
            {
              from: { type: 'app' },
              allow: [
                { to: { type: 'features' } },
                { to: { type: 'shared' } },
                { to: { type: 'config' } },
              ],
            },
            // features pueden importar de shared y config, NUNCA de otra feature
            {
              from: { type: 'features' },
              allow: [
                { to: { type: 'shared' } },
                { to: { type: 'config' } },
              ],
            },
            // shared solo puede importar de config
            {
              from: { type: 'shared' },
              allow: [{ to: { type: 'config' } }],
            },
            // config es autónomo
            {
              from: { type: 'config' },
              allow: [],
            },
          ],
        },
      ],
    },
  },
])
