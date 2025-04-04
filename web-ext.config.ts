// ~/web-ext.config.ts
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  disabled: true,
  binaries: {
    chrome: '/path/to/chrome-beta', // Use Chrome Beta instead of regular Chrome
    firefox: 'firefoxdeveloperedition', // Use Firefox Developer Edition instead of regular Firefox
    edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", // Open MS Edge when running "wxt -b edge"
  },
});