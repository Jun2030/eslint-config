# @2030/eslint-config

![NPM Version](https://img.shields.io/npm/v/%402030%2Feslint-config)

- 自动修复格式（旨在在没有 Prettier 的情况下独立使用）
- 合理的默认值，最佳实践，只需一行配置
- 专为 TypeScript、JSX、Vue、JSON、YAML、Toml、Markdown 等而设计,开箱即用
- 配置化，且非常容易定制
- ESLint Flat 配置，轻松组合
- 可选的 React、Svelte、UnoCSS、Astro、Solid 支持
- 可选的格式化程序支持格式化 CSS、HTML、XML 等
- 样式原则：最小读取，稳定差异，一致
  - 排序的导入，悬空的逗号
  - 单引号，无分
  - 使用ESLint Stylistic
- 默认遵守.gitignore
- 要求ESLint v9.5.0+

## 用法

### 入门向导

我们提供了一个 CLI 工具来帮助您设置项目，或者使用一个命令从旧配置迁移到新的平面配置

```bash
pnpm dlx @2030/eslint-config@latest
```

### 手动安装

如果您更喜欢手动设置:

```bash
pnpm i -D eslint @2030/eslint-config
```

并在您的项目根目录中创建： `eslint.config.mjs`

```js
// eslint.config.mjs
import jun from '@2030/eslint-config'

export default jun()
```

### 添加脚本至 `package.json`

例如:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## IDE 支持（保存时自动修复）

<details>
<summary>🟦 VS Code 支持</summary>

<br>

安装 [VS Code ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

将以下设置添加到您的 `.vscode/settings.json`:

```jsonc
{
  // 禁用prettier格式，使用eslint替代
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // 自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // 在IDE中保持默认规则，但仍然会自动修复它们
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

  // 开启eslint的语言支持
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

## 定制

通常，您只需导入预设 `jun`:

```js
// eslint.config.js
import jun from '@jun/eslint-config'

export default jun()
```

就是这样。或者您可以单独配置每个集成，例如:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  /**
   * 项目的类型,'lib' 为库, 默认为 'app'
   * @default 默认值: 'app'
   */
  type: 'lib',

  /**
   * 是否启用 stylistic 格式化规则
   * @default 默认值: true
   * @example 可选: false | { indent?: number | 'tab'; quotes?: 'single' | 'double'; jsx?: boolean; semi?: boolean; lessOpinionated?: boolean; }
   */
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  /**
   * 是否启用 typescript 规则
   * @default 默认值: 检测是否安装typescript依赖
   * @example 可选: false | true | { parserOptions: {}; files?: string[] }
   */
  typescript: true,

  /**
   * 是否启用 vue 规则
   * @default 默认值: 检测是否安装vue依赖
   * @example 可选: false | true | { files?: string[]; sfcBlocks: boolean }
   */
  vue: true,

  /**
   * 是否启用 jsx 规则
   * @default 默认值: true
   * @example 可选: false
   */
  jsx: true,

  /**
   * 是否启用 react 规则
   * @default 默认值: 检测是否安装react依赖
   * @example 可选: false | true | { jsx?: boolean; version?: string; files?: string[] }
   */
  react: true,

  /**
   * 是否启用 unocss 规则
   * @default 默认值: false,
   * @example 可选: true | { attributify?: boolean; strict?: boolean }
   */
  unocss: true,

  /**
   * 是否启用 jsonc 规则
   * @default 默认值: true
   * @example 可选: false | { files?: string[] }
   */
  jsonc: false,

  /**
   * 是否启用 yaml 规则
   * @default 默认值: true
   * @example 可选: false | { files?: string[] }
   */
  yaml: false,

  /**
   * 是否启用 .gitignore 文件
   * @default 默认值: true
   * @example 可选: false | { ignores?: string[] }
   */
  ignores: [
    '**/fixtures',
    // ...globs
  ]
})
```

工厂函数还接受任意数量的任意自定义配置覆盖 `jun`:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun(
  {
    // 原始库（jun）配置
  },

  // 从第二个参数开始,它们是 ESLint 扁平配置,可做多个设置
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

更高级地说，你还可以导入细粒度的配置并根据需要组合它们：

<details>
<summary>高级示例</summary>

除非你确切地知道它们在做什么，否则我们通常不建议使用这种样式，因为配置之间存在共享选项，可能需要格外小心才能使它们保持一致

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@2030/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
)
```

</details>

### 插件重命名

由于平面配置要求我们显式提供插件名称（而不是 npm 包名称中的强制性约定），因此我们重命名了一些插件，以使整体范围更加一致且更易于编写。

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-x/*`           | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

当您想要覆盖规则或内联禁用它们时，您需要更新到新前缀:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

</details>

### 规则覆盖

某些规则将仅在特定文件中启用，例如，规则将仅在文件中启用，而规则将仅在文件中启用。如果要覆盖规则，则需要指定文件扩展名, `ts/*` `.ts` `vue/*` `.vue`:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun(
  {
    vue: true,
    typescript: true
  },
  {
    // 请记住在这里指定文件 glob，否则它可能导致 vue 插件处理非 vue 文件
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // 没有 `file`，它们就是所有文件的一般规则
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
```

我们还在每个集成中提供了选项，以使其更容易 `overrides` :

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

通过检查您的项目中是否安装了 Vue 支持，会自动检测到 Vue 支持。您还可以显式启用/禁用它:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  vue: true
})
```

#### Vue 2

我们对 Vue 2 的支持有限。如果你仍在使用 Vue 2，你可以通过设置为:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  vue: {
    vueVersion: 2
  },
})
```

#### 格式化

使用外部格式化程序来格式化 ESLint 还无法支持的文件 (`.css`, `.html`, etc)。[`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format)。

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier'
  }
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们:

```bash
npm i -D eslint-plugin-format
```

#### React

要启用 React 支持，你需要显式地打开它:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  react: true,
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们:

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

要启用 svelte 支持，您需要显式打开它:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  svelte: true,
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们:

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

要启用 astro 支持，你需要显式地打开它：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  astro: true,
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们::

```bash
npm i -D eslint-plugin-astro
```

#### Solid

要启用 Solid 支持，你需要显式地打开它：

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  solid: true,
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们:

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

要启用 UnoCSS 支持,您需要显式地打开它:

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  unocss: true,
})
```

运行 `npx eslint` 应该会提示你安装所需的依赖项,否则你可以手动安装它们:

```bash
npm i -D @unocss/eslint-plugin
```

### 可选规则

此配置还提供了一些可选的插件/规则以扩展使用

#### `command`

由 [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command)提供支持

对于一些触发器，例如:

- `/// to-function` - 将箭头函数转换为普通函数
- `/// to-arrow` - 将普通函数转换为箭头函数
- `/// to-for-each` - 将 for-in/for-of 遍历转换为 .forEach()
- `/// to-for-of` - 将 .forEach() 转换为 for-of
- `/// keep-sorted` - 对对象/数组/接口进行排序
- ... 等等. - 可参考 [文档](https://github.com/antfu/eslint-plugin-command#built-in-commands)

例如，您可以在要转换的代码上方一行添加触发器注释(注意三斜杠):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

当您使用编辑器点击保存或运行 `eslint . --fix` 时,将转换为此格式:

```ts
async function foo(msg: string): void {
  console.log(msg)
}
```

命令注释通常是一次性的，并且将随转换一起删除

### 类型识别规则

```js
// eslint.config.js
import jun from '@2030/eslint-config'

export default jun({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

### Lint 暂存

如果要在每次提交之前应用 lint 和 auto-fix, 可以将以下内容添加到您的 `package.json`中:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

然后

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

我构建了一个可视化工具来帮助您查看项目中启用了哪些规则并将其应用于哪些文件, [@eslint/config-inspector](https://github.com/eslint/config-inspector), 转到包含并运行以下项目的根目录 `eslint.config.js` 然后执行以下命令即可:

```bash
npx @eslint/config-inspector
```

> Thanks to antfu/eslint-config for the inspiration and reference.

## License

[MIT](./LICENSE) License &copy; 2022-PRESENT Jun2030
