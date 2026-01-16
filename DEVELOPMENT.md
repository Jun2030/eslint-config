# @2030/eslint-config 开发文档

本文档面向项目贡献者和维护者，包含项目开发、构建、测试和发布的详细说明。

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发环境设置](#开发环境设置)
- [脚本命令详解](#脚本命令详解)
- [开发工作流](#开发工作流)
- [构建流程](#构建流程)
- [测试](#测试)
- [发布流程](#发布流程)
- [依赖管理](#依赖管理)
- [常见问题](#常见问题)

## 技术栈

- **包管理器**: pnpm 10.28.0+
- **运行时**: Node.js (建议使用 LTS 版本)
- **构建工具**: [tsdown](https://tsdown.netlify.app/) - 基于 esbuild 的 TypeScript 打包工具
- **代码检查**: ESLint 9.39.2+ (使用 Flat Config)
- **类型检查**: TypeScript 5.9.3
- **测试框架**: Vitest 4.0.17
- **版本管理**: [bumpp](https://github.com/antfu/bumpp) - 交互式版本升级工具
- **Git Hooks**: [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) + [lint-staged](https://github.com/okonet/lint-staged)

## 项目结构

```
.
├── bin/                      # CLI 入口文件
│   ├── index.js             # CommonJS 入口
│   └── index.mjs            # ESM 入口
├── scripts/                  # 构建辅助脚本
│   ├── typegen.ts           # 生成 ESLint 规则类型定义
│   └── versiongen.ts        # 生成依赖版本常量
├── src/                      # 源代码
│   ├── cli/                 # CLI 相关代码
│   │   ├── stages/          # CLI 各个阶段处理逻辑
│   │   ├── constants.ts     # CLI 常量定义
│   │   ├── constants-generated.ts  # 自动生成的版本常量
│   │   ├── index.ts         # CLI 入口
│   │   ├── run.ts           # CLI 运行逻辑
│   │   ├── types.ts         # CLI 类型定义
│   │   └── utils.ts         # CLI 工具函数
│   ├── configs/             # ESLint 配置模块
│   │   ├── astro.ts         # Astro 配置
│   │   ├── javascript.ts    # JavaScript 基础配置
│   │   ├── typescript.ts    # TypeScript 配置
│   │   ├── vue.ts           # Vue 配置
│   │   ├── react.ts         # React 配置
│   │   ├── svelte.ts        # Svelte 配置
│   │   ├── solid.ts         # Solid 配置
│   │   ├── nextjs.ts        # Next.js 配置
│   │   ├── formatters.ts    # 格式化器配置
│   │   ├── stylistic.ts     # 代码风格配置
│   │   └── ...              # 其他配置模块
│   ├── cli.ts               # CLI 导出
│   ├── config-presets.ts    # 配置预设
│   ├── factory.ts           # 配置工厂函数
│   ├── index.ts             # 主入口
│   ├── plugins.ts           # 插件映射
│   ├── types.ts             # 类型定义
│   └── utils.ts             # 工具函数
├── dist/                     # 构建输出目录 (gitignore)
├── .npmrc                    # pnpm 配置
├── eslint.config.ts         # 项目自身的 ESLint 配置
├── package.json             # 包配置文件
├── tsconfig.json            # TypeScript 配置
└── tsdown.config.ts         # 构建配置
```

## 开发环境设置

### 1. 克隆仓库

```bash
git clone https://github.com/Jun2030/eslint-config.git
cd eslint-config
```

### 2. 安装依赖

```bash
pnpm install
```

安装完成后，会自动执行 `simple-git-hooks` 设置 Git Hooks。

### 3. 验证环境

```bash
# 类型检查
pnpm typecheck

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 脚本命令详解

### 核心开发命令

#### `pnpm build`

**作用**: 完整构建项目

**执行步骤**:

1. 运行 `pnpm gen` 生成类型定义和版本常量
2. 运行 `tsdown --clean --dts` 清理并构建项目

**输出**:

- `dist/index.mjs` - ESM 格式的主入口
- `dist/cli.mjs` - ESM 格式的 CLI 入口
- `dist/index.d.mts` - TypeScript 类型定义

**使用场景**: 发布前、测试构建产物时

```bash
pnpm build
```

#### `pnpm gen`

**作用**: 生成自动生成的文件

**执行步骤**:

1. 运行 `typegen.ts` - 生成 `src/typegen.d.ts` (ESLint 规则类型定义)
2. 运行 `versiongen.ts` - 生成 `src/cli/constants-generated.ts` (依赖版本映射)

**使用场景**:

- 添加新的 ESLint 配置后
- 更新依赖版本后
- 构建前自动执行

```bash
pnpm gen
```

#### `pnpm stub`

**作用**: 开发模式下的快速构建（不生成类型）

**说明**: 使用 tsdown 的 stub 模式，适合快速迭代开发

```bash
pnpm stub
```

#### `pnpm watch`

**作用**: 监听文件变化自动重新构建

**使用场景**: 本地开发时保持运行

```bash
pnpm watch
```

#### `pnpm dev`

**作用**: 启动 ESLint 配置可视化检查器

**说明**:

- 使用 [@eslint/config-inspector](https://github.com/eslint/config-inspector)
- 在浏览器中可视化查看启用的规则
- 默认地址: `http://localhost:7777`

```bash
pnpm dev
```

#### `pnpm build:inspector`

**作用**: 构建配置检查器的静态站点

**执行步骤**:

1. 运行 `pnpm build`
2. 运行 `@eslint/config-inspector build`

**输出**: 生成静态站点到 `.eslint-config-inspector` 目录

```bash
pnpm build:inspector
```

### 代码质量命令

#### `pnpm lint`

**作用**: 检查代码风格和潜在问题

**说明**: 使用项目自身的 ESLint 配置检查代码

```bash
pnpm lint
```

自动修复问题:

```bash
pnpm lint --fix
```

#### `pnpm typecheck`

**作用**: TypeScript 类型检查（不输出编译文件）

```bash
pnpm typecheck
```

### 测试命令

#### `pnpm test`

**作用**: 运行测试套件

**说明**: 使用 Vitest 运行所有测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

### 预处理命令

#### `pnpm prepack`

**作用**: 在 `pnpm pack` 或 `pnpm publish` 前自动执行

**执行内容**: 运行 `pnpm build`

**说明**: 这是 npm 生命周期钩子，确保发布前代码已构建

#### `pnpm prepare`

**作用**: 在 `pnpm install` 后自动执行

**执行内容**: 运行 `simple-git-hooks` 设置 Git Hooks

## 开发工作流

### 添加新功能

1. **创建功能分支**

```bash
git checkout -b feature/new-feature
```

2. **开发功能**

```bash
# 启动监听模式
pnpm watch

# 或启动配置检查器
pnpm dev
```

3. **测试功能**

```bash
# 运行测试
pnpm test

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

4. **提交代码**

Git Hooks 会自动运行 `eslint --fix` 修复代码风格。

```bash
git add .
git commit -m "feat: add new feature"
```

### 添加新的配置模块

1. **创建配置文件** `src/configs/xxx.ts`

```typescript
import type { TypedFlatConfigItem } from '../types'

export async function xxx(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'jun/xxx',
      // ... 配置内容
    },
  ]
}
```

2. **在 factory.ts 中集成**

```typescript
// 添加到 jun() 函数中
if (options.xxx) {
  configs.push(...await xxx())
}
```

3. **更新类型定义**

在 `src/types.ts` 中添加相应的选项类型。

4. **生成类型**

```bash
pnpm gen
```

5. **测试配置**

```bash
pnpm dev  # 在可视化界面中检查
pnpm test
```

## 构建流程

### 构建工具: tsdown

tsdown 是基于 esbuild 的 TypeScript 打包工具，配置文件为 `tsdown.config.ts`。

**配置说明**:

```typescript
export default defineConfig({
  entry: [
    'src/index.ts', // 主入口
    'src/cli.ts', // CLI 入口
  ],
  shims: true, // 添加 Node.js shims
  format: ['esm'], // 输出 ESM 格式
  exports: true, // 自动处理 exports
})
```

### 构建产物

| 文件               | 说明                | 用途                 |
| ------------------ | ------------------- | -------------------- |
| `dist/index.mjs`   | 主入口 ESM 模块     | 用户导入配置工厂函数 |
| `dist/cli.mjs`     | CLI ESM 模块        | CLI 工具导入         |
| `dist/index.d.mts` | TypeScript 类型定义 | 提供类型支持         |
| `bin/index.mjs`    | CLI 入口            | npx 命令执行         |

### 生成文件说明

#### `src/typegen.d.ts`

由 `scripts/typegen.ts` 生成，包含:

- 所有 ESLint 规则的类型定义
- 配置名称的类型联合

**生成逻辑**:

1. 加载所有配置预设
2. 使用 `eslint-typegen` 提取规则定义
3. 生成 TypeScript 类型声明

#### `src/cli/constants-generated.ts`

由 `scripts/versiongen.ts` 生成，包含:

- 所有依赖包的版本号映射

**生成逻辑**:

1. 读取 `package.json` 中的依赖版本
2. 提取 CLI 需要的包版本
3. 生成版本常量对象

**用途**: CLI 在提示安装依赖时显示正确的版本号

## 测试

### 测试框架

使用 Vitest 进行单元测试和集成测试。

### 测试文件

- `test/cli.spec.ts` - CLI 功能测试
- `test/fixtures.test.ts` - 配置测试，验证不同配置组合的效果

### 配置测试说明

`fixtures.test.ts` 测试不同配置预设:

```typescript
runWithConfig('js', {
  typescript: false,
  vue: false,
})

runWithConfig('all', {
  typescript: true,
  vue: true,
  svelte: true,
  astro: true,
})
```

每个测试会:

1. 复制测试输入文件
2. 应用指定配置
3. 运行 `eslint --fix`
4. 对比输出结果

**注意**: 测试需要实际运行 ESLint，可能较慢。

## 发布流程

### 前置检查

发布前确保:

1. ✅ 所有测试通过
2. ✅ 类型检查通过
3. ✅ 代码检查通过
4. ✅ 依赖版本已锁定
5. ✅ 构建成功

### 发布步骤

#### 1. 运行发布命令

```bash
pnpm release
```

这会执行 `bumpp`，提供交互式版本升级流程:

**bumpp 会自动**:

- ✨ 提示选择版本类型 (patch/minor/major)
- 📝 更新 `package.json` 中的版本号
- 🏷️ 创建 Git tag
- 📤 推送 commit 和 tag 到远程仓库

**示例交互**:

```
? Select release type: (Use arrow keys)
❯ patch (2.3.0 → 2.3.1)
  minor (2.3.0 → 2.4.0)
  major (2.3.0 → 3.0.0)
  prepatch (2.3.0 → 2.3.1-0)
  preminor (2.3.0 → 2.4.0-0)
  premajor (2.3.0 → 3.0.0-0)
  custom
```

#### 2. 发布到 npm

```bash
pnpm publish
```

**执行流程**:

1. 自动运行 `prepack` 钩子 (执行 `pnpm build`)
2. 打包 `bin` 和 `dist` 目录
3. 发布到 npm registry

**注意事项**:

- 确保已登录 npm (`npm login`)
- 确保有发布权限
- 确保包名 `@2030/eslint-config` 可用

#### 3. 验证发布

```bash
# 查看 npm 上的版本
npm view @2030/eslint-config version

# 测试安装
npm install @2030/eslint-config@latest
```

### GitHub Actions 自动发布

如果配置了 GitHub Actions 工作流，可以通过推送 tag 触发自动发布:

```bash
git tag v2.3.1
git push origin v2.3.1
```

## 依赖管理

### 依赖版本策略

本项目采用**固定版本号**策略:

- ❌ 不使用 `^` 或 `~` 等语义版本范围
- ✅ 锁定所有依赖的确切版本
- 🔄 通过 `pnpm-lock.yaml` 确保安装一致性

**原因**:

- ESLint 配置对规则行为高度敏感
- 避免依赖更新导致的意外行为变化
- 提供可预测的代码检查体验

### 更新依赖

#### 查看过期依赖

```bash
pnpm outdated
```

#### 更新依赖

```bash
# 交互式选择更新
pnpm update -i

# 更新所有到最新版本
pnpm update --latest
```

#### 更新后锁定版本

```bash
# 1. 运行安装测试
pnpm install

# 2. 如果成功，更新 package.json 为精确版本
# 参考 package.json 中已锁定的格式

# 3. 重新安装验证
pnpm install

# 4. 运行测试
pnpm test
```

### pnpm 配置说明

`.npmrc` 配置:

```ini
enable-pre-post-scripts=true
```

**说明**: 允许运行依赖包的安装脚本，用于:

- `esbuild` - 安装平台特定的二进制文件
- `simple-git-hooks` - 设置 Git hooks

## 常见问题

### Q1: 构建失败，提示类型错误

**解决方案**:

```bash
# 重新生成类型定义
pnpm gen

# 运行类型检查
pnpm typecheck
```

### Q2: Git Hooks 没有生效

**解决方案**:

```bash
# 重新安装 hooks
pnpm prepare

# 或手动运行
npx simple-git-hooks
```

### Q3: 测试失败

**常见原因**:

- ESLint 规则变更
- 测试快照过期

**解决方案**:

```bash
# 更新测试快照
pnpm test -- -u

# 或检查具体失败原因
pnpm test --reporter=verbose
```

### Q4: CLI 安装依赖失败

**原因**: `constants-generated.ts` 中的版本号可能过期

**解决方案**:

```bash
# 重新生成版本常量
pnpm gen
```

### Q5: 发布后 CLI 无法使用

**检查清单**:

- ✅ `bin/index.mjs` 是否包含正确的 shebang (`#!/usr/bin/env node`)
- ✅ `package.json` 中 `bin` 字段是否正确
- ✅ `dist/cli.mjs` 是否正确构建

### Q6: pnpm install 警告构建脚本被忽略

**解决方案**:

```bash
# 已在 .npmrc 中配置 enable-pre-post-scripts=true
# 如果仍有警告，可手动批准
pnpm approve-builds
```

## 开发最佳实践

### 1. 保持类型安全

- 使用 TypeScript 编写所有代码
- 避免使用 `any` 类型
- 运行 `pnpm typecheck` 验证类型

### 2. 遵循代码风格

- 使用项目自身的 ESLint 配置
- 提交前会自动运行 `eslint --fix`
- 保持代码风格一致性

### 3. 编写测试

- 为新功能添加测试
- 确保测试覆盖率
- 测试不同配置组合

### 4. 更新文档

- 修改功能后更新 README.md
- 添加新配置选项时更新文档
- 保持示例代码最新

### 5. 提交规范

使用约定式提交 (Conventional Commits):

```
feat: 添加新功能
fix: 修复问题
docs: 更新文档
chore: 构建/工具变更
test: 测试相关
refactor: 重构代码
```

## 相关资源

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [tsdown 文档](https://tsdown.netlify.app/)
- [bumpp 仓库](https://github.com/antfu/bumpp)
- [Vitest 文档](https://vitest.dev/)
- [antfu/eslint-config](https://github.com/antfu/eslint-config) - 上游项目

## 维护者

- Dai Jun <zijun2030@163.com>

## 许可证

[MIT](./LICENSE) License &copy; 2019-PRESENT Dai Jun
