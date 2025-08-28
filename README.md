## Pyro Wing Wallet (Chrome Extension)

[English](README.md) | [中文](README_ZH.md)

---

## English

### Overview
This repository contains a Plasmo-based Chrome Extension wallet scaffold. Due to a temporary upstream issue with the official scaffolder, we used a manual minimal setup that works reliably.

### Prerequisites
- Node.js + pnpm installed
- Chrome with Developer Mode enabled (for loading unpacked extensions)

### Manual Minimal Setup
1) Initialize project and install dependencies (run inside your target directory):
```bash
pnpm init -y
pnpm add react react-dom
pnpm add -D plasmo typescript @types/react @types/react-dom
```
2) Initialize TypeScript and set jsx to "react-jsx":
```bash
pnpm tsc --init
```
3) Add scripts to package.json:
```json
{
  "scripts": {
    "dev": "plasmo dev",
    "build": "plasmo build",
    "package": "plasmo package"
  }
}
```
4) Create minimal source files:
- `src/popup.tsx` — popup UI entry
- `src/background.ts` — background service worker

### Run in Dev and Load into Chrome
```bash
pnpm dev
```
Then open Chrome → Extensions → Enable Developer Mode → Load unpacked → select `build/chrome-mv3-dev`.

### Known Errors and Fixes
1) ERROR: "Example with-popup not found" when running `plasmo init` or `create-plasmo`
- Cause: upstream example registry issue.
- Fix: use the manual minimal setup above.

2) ERROR: Failed to resolve `./gen-assets/icon16.plasmo.png` from `./.plasmo/chrome-mv3.plasmo.manifest.json`
- Cause: missing icons expected by Plasmo.
- Fix A: Create these files under project root:
  - `assets/icon16.png` (16x16)
  - `assets/icon48.png` (48x48)
  - `assets/icon128.png` (128x128)
- Fix B (optional): add `src/manifest.ts` and declare icons explicitly:
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