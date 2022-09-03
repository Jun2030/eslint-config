# @2030/eslint-config

## 风格说明 

- 强制使用单引号，分号
- 自动修复eslint问题并格式化
- 支持TypeScript, Vue, React
- 类型检查同时支持json, yaml, markdown
- import导入排序
- 单行配置，迅速接入

## 使用说明

### 安装

```bash
pnpm add -D eslint @2030/eslint-config
```

### 配置 `.eslintrc`

```json
{
  "extends": "@2030"
}
```

> 无需配置 `.eslintignore` ，除非内置的忽略文件配置不满足

### 添加脚本至 `package.json`

代码示例:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### VS Code 编辑器自动修复配置

创建 `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## License

[MIT](./LICENSE) License &copy; 2022 ZiJun
