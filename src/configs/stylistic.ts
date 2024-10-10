import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'

import { pluginJun } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
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
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  })

  return [
    {
      name: 'jun/stylistic/rules',
      plugins: {
        jun: pluginJun,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        'jun/consistent-chaining': 'error',
        'jun/consistent-list-newline': 'error',

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {
              'jun/curly': 'error',
              'jun/if-newline': 'error',
              'jun/top-level-function': 'error',
            }
        ),

        ...overrides,
      },
    },
  ]
}
