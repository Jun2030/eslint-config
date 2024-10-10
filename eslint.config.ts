// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import { jun } from './src'

export default jun(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
    type: 'lib',
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
      'dist',
      'node_modules',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  },
)
