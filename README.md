# @2030/eslint-config

[![npm](https://img.shields.io/npm/v/@2030/eslint-config?color=444&label=)](https://npmjs.com/package/@2030/eslint-config)

- 自动格式化修复（独立使用，**无需** Prettier）
- 合理的默认配置，最佳实践，只需一行配置
- 开箱即用，支持 TypeScript、JSX、Vue、JSON、YAML、Toml、Markdown 等
- 固执己见，但[高度可定制](#定制化)
- 使用 [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)，轻松组合！
- 可选的 [React](#react)、[Next.js](#nextjs)、[Svelte](#svelte)、[UnoCSS](#unocss)、[Astro](#astro)、[Solid](#solid) 支持
- 可选的 [formatters](#formatters) 支持，用于格式化 CSS、HTML、XML 等
- **代码风格原则**：阅读简洁、差异稳定、保持一致
  - 排序的导入、尾随逗号
  - 单引号、无分号
  - 使用 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- 默认遵循 `.gitignore`
- 需要 ESLint v9.5.0+

> [!WARNING]
> 这是一个 **个人配置**，包含很多主观意见。更改可能不适合所有人和所有用例。
>
> 如果你直接使用此配置，建议 **每次更新时都审查变更**。如果你想要更多控制，请随时 fork。谢谢！

## 使用方法

### 启动向导

我们提供了一个 CLI 工具来帮助你设置项目，或通过一条命令从旧配置迁移到新的 flat config。

```bash
pnpm dlx @2030/eslint-config@latest
```

### 手动安装

如果你更喜欢手动设置：

```bash
pnpm i -D eslint @2030/eslint-config
```

并在项目根目录创建 `eslint.config.mjs`：

```js
// eslint.config.mjs
import jun from '@2030/eslint-config'

export default jun()
```

<details>
<summary>
与旧配置结合使用：
</summary>

如果你仍然使用某些旧的 eslintrc 格式配置，可以使用 [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) 包将它们转换为 flat config。

```js
// eslint.config.mjs
import jun from '@2030/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default jun(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      'eslint:recommended',
      // Other extends...
    ],
  })

  // Other flat configs...
)
```

> 注意：`.eslintignore` 在 Flat config 中不再有效，详见[定制化](#定制化)。

</details>

### 添加 package.json 脚本

例如：

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## IDE 支持（保存时自动修复）

<details>
<summary>🟦 VS Code 支持</summary>

<br>

安装 [VS Code ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

将以下设置添加到你的 `.vscode/settings.json`：

```jsonc
{
  // 禁用默认格式化程序，改用 eslint
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在 IDE 中静默样式规则，但仍然自动修复它们
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // 为所有支持的语言启用 eslint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

## 定制化

从 v1.0 开始，我们迁移到了 [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)。它提供了更好的组织和组合能力。

通常你只需导入 `jun` 预设：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun()
```

就这样！或者你可以单独配置每个集成，例如：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  // 项目类型。'lib' 用于库，默认是 'app'
  type: 'lib',

  // `.eslintignore` 在 Flat config 中不再支持，改用 `ignores`
  // 第一个参数中的 `ignores` 选项被特别处理为始终是全局忽略
  // 并且会 **扩展** 配置的默认忽略，而不是覆盖它们
  // 你也可以传递一个函数来修改默认忽略
  ignores: [
    '**/fixtures',
    // ...globs
  ],

  // 解析 `.gitignore` 文件以获取忽略规则，默认开启
  gitignore: true,

  // 启用样式格式化规则
  // stylistic: true,

  // 或自定义样式规则
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript 和 Vue 会自动检测，你也可以显式启用它们：
  typescript: true,
  vue: true,

  // 禁用 jsonc 和 yaml 支持
  jsonc: false,
  yaml: false,
})
```

`jun` 工厂函数还接受任意数量的自定义配置覆盖：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun(
  {
    // 配置选项
  },

  // 从第二个参数开始，它们都是 ESLint Flat Configs
  // 你可以有多个配置
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

### 插件重命名

由于 flat config 要求我们显式提供插件名称（而不是从 npm 包名强制约定），我们重命名了一些插件以使整体范围更一致且更易编写。

| 新前缀     | 原前缀                 | 源插件                                                                                                |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)                     |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                                |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                                   |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)            |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)                      |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                           |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)             |
| `next/*`   | `@next/next`           | [@next/eslint-plugin-next](https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next) |

当你想要覆盖规则或内联禁用它们时，需要更新到新前缀：

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### 规则覆盖

某些规则只会在特定文件中启用，例如，`ts/*` 规则只会在 `.ts` 文件中启用，`vue/*` 规则只会在 `.vue` 文件中启用。如果你想覆盖规则，需要指定文件扩展名：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun(
  {
    vue: true,
    typescript: true
  },
  {
    // 记住在这里指定文件 glob，否则可能导致 vue 插件处理非 vue 文件
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // 没有 `files`，这些是所有文件的通用规则
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
```

我们还在每个集成中提供了 `overrides` 选项使其更简单：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```

### Vue

Vue 支持通过检查项目中是否安装了 `vue` 来自动检测。你也可以显式启用/禁用它：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  vue: true
})
```

### 可选配置

我们为特定用例提供了一些可选配置，默认情况下不包含它们的依赖项。

#### React

要启用 React 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  react: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Next.js

要启用 Next.js 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  nextjs: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D @next/eslint-plugin-next
```

#### Svelte

要启用 Svelte 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  svelte: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

要启用 Astro 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  astro: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D eslint-plugin-astro
```

#### Solid

要启用 Solid 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  solid: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

要启用 UnoCSS 支持，你需要显式开启：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  unocss: true,
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D @unocss/eslint-plugin
```

#### Formatters

使用外部格式化程序来格式化 ESLint 尚未处理的文件（`.css`、`.html` 等）。由 [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format) 提供支持。

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  formatters: {
    /**
     * 格式化 CSS, LESS, SCSS 文件，以及 Vue 中的 `<style>` 块
     * 默认使用 Prettier
     */
    css: true,
    /**
     * 格式化 HTML 文件
     * 默认使用 Prettier
     */
    html: true,
    /**
     * 格式化 Markdown 文件
     * 支持 Prettier 和 dprint
     * 默认使用 Prettier
     */
    markdown: 'prettier'
  }
})
```

运行 `npx eslint` 会提示你安装所需的依赖，否则，你可以手动安装它们：

```bash
npm i -D eslint-plugin-format
```

### 类型感知规则

你可以通过向 `typescript` 配置传递选项对象来可选地启用[类型感知规则](https://typescript-eslint.io/linting/typed-linting/)：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

## 查看启用了哪些规则

我构建了一个可视化工具来帮助你查看项目中启用了哪些规则以及它们应用于哪些文件，[@eslint/config-inspector](https://github.com/eslint/config-inspector)

进入包含 `eslint.config.js` 的项目根目录并运行：

```bash
npx @eslint/config-inspector
```

## 版本策略

此项目遵循[语义化版本](https://semver.org/)进行发布。但是，由于这只是一个配置并涉及意见和许多动态部分，我们不将规则更改视为破坏性更改。

### 被视为破坏性更改的变更

- Node.js 版本要求变更
- 可能破坏配置的大型重构
- 插件进行了可能破坏配置的重大更改
- 可能影响大多数代码库的更改

### 被视为非破坏性更改的变更

- 启用/禁用规则和插件（可能会变得更严格）
- 规则选项更改
- 依赖项版本升级

## 致谢

本配置基于 [antfu/eslint-config](https://github.com/antfu/eslint-config) 进行，感谢 Anthony Fu 的出色工作！

## 许可证

[MIT](./LICENSE) License &copy; 2019-PRESENT Dai Jun
