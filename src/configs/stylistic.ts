import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'
import { pluginJun } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  experimental: false,
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    experimental,
    indent,
    jsx,
    lessOpinionated = true,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    experimental,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem

  return [
    {
      name: 'jun/stylistic/rules',
      plugins: {
        jun: pluginJun,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...experimental
          ? {}
          : {
              'jun/consistent-list-newline': 'error',
            },

        'jun/consistent-chaining': 'error',

        ...(lessOpinionated
          ? {
              // curly: ['error', 'multi-line'],
            }
          : {
              'jun/curly': 'error',
              'jun/if-newline': 'error',
              'jun/top-level-function': 'error',
            }
        ),

        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/max-statements-per-line': ['error', { max: 2 }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides,
      },
    },
  ]
}
