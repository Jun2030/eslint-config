import type { OptionsStylistic, TypedFlatConfigItem } from '../types'
import { pluginImport, pluginJun } from '../plugins'
import { GLOB_SRC_EXT } from '../globs'

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true,
  } = options

  return [
    {
      name: 'jun/imports/rules',
      plugins: {
        import: pluginImport,
        jun: pluginJun,
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',

        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': 'error',
        'jun/import-dedupe': 'error',
        'jun/no-import-dist': 'error',
        'jun/no-import-node-modules-by-path': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }],
            }
          : {},
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'jun/imports/disables/bin',
      rules: {
        'jun/no-import-dist': 'off',
        'jun/no-import-node-modules-by-path': 'off',
      },
    },
  ]
}
