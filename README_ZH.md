## Pyro Wing Wallet（Chrome 扩展）

[English](README.md) | [中文](README_ZH.md)

---

### 概述
本仓库是基于 Plasmo 的 Chrome 浏览器钱包扩展脚手架。由于官方脚手架出现临时问题，我们采用“手动最小可行”方案，稳定可用。

### 环境准备
- 已安装 Node.js 与 pnpm
- Chrome 开启开发者模式（用于加载未打包扩展）

### 手动最小搭建
1) 在目标目录初始化并安装依赖：
```bash
pnpm init -y
pnpm add react react-dom
pnpm add -D plasmo typescript @types/react @types/react-dom
```
2) 初始化 TypeScript，并将 tsconfig.json 的 jsx 设为 "react-jsx"：
```bash
pnpm tsc --init
```
3) 在 package.json 中加入脚本：
```json
{
  "scripts": {
    "dev": "plasmo dev",
    "build": "plasmo build",
    "package": "plasmo package"
  }
}
```
4) 创建最小源码：
- `src/popup.tsx` — 弹窗入口
- `src/background.ts` — 后台服务脚本

### 开发模式运行与加载浏览器
```bash
pnpm dev
```
打开 Chrome → 扩展程序 → 启用开发者模式 → 加载已解压的扩展程序 → 选择 `build/chrome-mv3-dev`。

### 已知报错与修复
1) 报错：运行 `plasmo init` 或 `create-plasmo` 出现 “Example with-popup not found”
- 原因：远端示例注册表问题。
- 解决：采用上面的“手动最小搭建”流程。

2) 报错：Failed to resolve `./gen-assets/icon16.plasmo.png` from `./.plasmo/chrome-mv3.plasmo.manifest.json`
- 原因：缺少 Plasmo 期望的图标资源。
- 方案 A：在项目根新增以下文件：
  - `assets/icon16.png`（16x16）
  - `assets/icon48.png`（48x48）
  - `assets/icon128.png`（128x128）
- 方案 B（可选）：新增 `src/manifest.ts` 并显式声明 icons：
```ts
import type { PlasmoManifest } from "plasmo"

const manifest: PlasmoManifest = {
  manifest_version: 3,
  name: "Pyro Wing Wallet",
  version: "0.0.1",
  action: { default_popup: "popup.html" },
  background: { service_worker: "background.js", type: "module" },
  icons: {
    "16": "assets/icon16.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  },
  permissions: []
}

export default manifest
```