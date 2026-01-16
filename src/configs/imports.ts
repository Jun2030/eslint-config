import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'
import { pluginImportLite, pluginJun } from '../plugins'

export async function imports(options: OptionsOverrides & OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
  } = options

  return [
    {
      name: 'jun/imports/rules',
      plugins: {
        import: pluginImportLite,
        jun: pluginJun,
      },
      rules: {
        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',

        'jun/import-dedupe': 'error',
        'jun/no-import-dist': 'error',
        'jun/no-import-node-modules-by-path': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }],
            }
          : {},

        ...overrides,
      },
    },
  ]
}
