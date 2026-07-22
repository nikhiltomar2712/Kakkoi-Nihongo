# 🛡️ Kakkoi Nihongo – Content Protection System

## Overview

This document outlines the multi-layered content protection measures implemented for the Kakkoi Nihongo website. Since this is a **client-side only** static HTML application (no backend server), protection is limited to browser-level deterrents. **No client-side protection is 100% effective** – determined users with DevTools knowledge can always extract content.

---

## 📋 Protection Layers

### Layer 1: DevTools Detection (3 Strategies)

| Strategy | Method | Bypass Difficulty |
|----------|--------|-------------------|
| **Element Detection** | Detects if DevTools causes a hidden element's dimensions to change to 0 (when docked to side) | Medium – using popup/undocked DevTools avoids this |
| **Debugger Trap** | Monitors execution time gaps that indicate a debugger pause | High – but can be bypassed with conditional breakpoints |
| **Console Timing** | Measures execution time of `console.log()` – longer times indicate open console | Medium – disabling console timestamps helps |

**Action on detection:** Optionally redirects to `about:blank` or clears page content.

---

### Layer 2: Keyboard Shortcut Blocking

| Shortcut | Action Blocked | Target |
|----------|---------------|--------|
| `F12` | Open DevTools | Chrome, Edge, Firefox |
| `Ctrl+Shift+I` | Open DevTools | Chrome, Edge, Firefox |
| `Ctrl+Shift+J` | Open Console tab | Chrome, Edge |
| `Ctrl+U` | View Page Source | All browsers |
| `Ctrl+S` | Save Page | All browsers |
| `Ctrl+P` | Print / Save as PDF | All browsers |
| `Ctrl+Shift+C` | Inspect Element | Chrome, Edge |

*Note: Some shortcuts cannot be fully blocked in all browsers (e.g., Firefox's `Ctrl+Shift+K`).*

---

### Layer 3: Context Menu & Right-Click

- ✅ Right-click context menu fully disabled
- ✅ Middle-click context menu disabled
- ✅ `auxclick` event blocked

---

### Layer 4: Text Selection & Drag Protection

- ✅ CSS `user-select: none` globally
- ✅ `selectstart` event prevented
- ✅ `dragstart` and `drop` events prevented
- ✅ Input/textarea fields still allow selection for usability
- ✅ Images set to `draggable="false"`

---

### Layer 5: Console Watermarking

- ✅ Prominent warning banner displayed in console
- ✅ Console methods overridden with `[Kakkoi]` prefix
- ✅ Legal/copyright notice displayed
- ✅ `Function.prototype.toString` overridden to hide custom function bodies

---

### Layer 6: Periodic Integrity Checks

- ✅ Verifies protection elements haven't been removed from DOM
- ✅ Checks every 5 seconds
- ✅ Warns if protections are tampered with

---

## 🔧 Build Obfuscation

### `obfuscate-build.js`

A Node.js build script that uses **javascript-obfuscator** to transform the main JavaScript block.

**Usage:**
```bash
npm install javascript-obfuscator
node obfuscate-build.js
```

**Obfuscation features:**
- **Control Flow Flattening** (75% threshold) – scrambles code flow
- **Dead Code Injection** (40% threshold) – adds misleading code
- **Debug Protection** – prevents DevTools from working
- **Self-Defending** – breaks if code is beautified/transformed
- **String Array Encoding** (base64) – hides strings
- **Identifier Renaming** (hexadecimal) – obfuscates variable names
- **Object Key Transformation** – randomizes property access

**Before running:**
- Creates a backup as `kakkoi-nihongo.html.backup`
- Can be run repeatedly (will overwrite previous obfuscation)

---

## 📁 Files

| File | Purpose |
|------|---------|
| `protections.js` | Client-side runtime protection module |
| `obfuscate-build.js` | Build script for JS obfuscation |
| `robots.txt` | Blocks search engine indexing |
| `CONTENT_PROTECTION.md` | This documentation |

---

## ⚠️ Important Limitations

| Vulnerability | Status | Why |
|--------------|--------|-----|
| View Source (F12 disabled) | ⚠️ Partial | Can use `curl`, `wget`, or browser menu |
| Copy via DevTools Network tab | ❌ Not preventable | All data loads with the page |
| Copy via Extensions | ❌ Not preventable | Browser extensions bypass JS |
| Copy via Disabled JavaScript | ❌ Not preventable | Content IS the page (no server) |
| Copy via Headless Browser (Puppeteer) | ❌ Not preventable | Automated extraction |
| Obfuscation Reverse-Engineering | ❌ Not completely preventable | Deobfuscators exist |
| GitHub Repository Access | ❌ Not preventable | Source is public on GitHub |

---

## 📊 Risk Assessment (Post-Protection)

| Threat | Original Risk | Post-Protection Risk | Notes |
|--------|--------------|---------------------|-------|
| Content Copying | 🔴 High | 🟡 Medium | Still possible via advanced methods |
| Code Viewing | 🔴 High | 🟡 Medium | Obfuscation + protections help |
| Site Defacement | 🟢 Low | 🟢 Very Low | Requires GitHub access |
| Malicious Injection | 🟢 Low | 🟢 Very Low | No user input forms |
| Data Theft | 🟢 Low | 🟢 Very Low | No user data stored |

---

## 📝 Recommended Additional Measures

1. **License & copyright notices** – Already present in footer and console
2. **GitHub Actions** – Auto-obfuscate on commit (optional)
3. **Service Worker** – Block external requests (advanced)
4. **Content Security Policy** – Already added via meta tag (see HTML `<head>`)
5. **Add watermarks to data** – Subtle fake entries to identify scrapers

---

*© 2025 Kakkoi Nihongo. All rights reserved.*
*Last updated: 2025*

