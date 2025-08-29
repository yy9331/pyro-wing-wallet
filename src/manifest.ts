
const manifest = {
  manifest_version: 3,
  name: "Pyro Wing Wallet",
  version: "1.0.0",
  description: "Pyro Wing Wallet",
  action: { default_popup: "popup.html" },
  background: { service_worker: "background.js", type: "module" },
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  permissions: ["storage", "unlimitedStorage"],
  host_permissions: ["<all_urls>"],
}

export default manifest
