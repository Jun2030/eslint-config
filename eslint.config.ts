import { jun } from './src'

export default jun(
  {
    vue: {
      a11y: true,
    },
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    nextjs: false,
    typescript: {
      erasableOnly: true,
    },
    markdown: {
      overrides: {
        'no-dupe-keys': 'off',
      },
    },
    formatters: true,
    pnpm: true,
    type: 'lib',
    jsx: {
      a11y: true,
    },
  },
  {
    ignores: [
      '**/constants-generated.ts',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
