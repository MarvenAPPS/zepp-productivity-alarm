# Build Error Fixes

## Error: "package name is undefined"

### Problem
```
[✘] Build package error, the package name is undefined
```

### Root Cause
Zeus CLI requires a `package.json` file in the root directory with a `name` field.

### Solution ✅

Added `package.json` to root:

```json
{
  "name": "productivity-alarm",
  "version": "1.0.0",
  "description": "Productivity alarm for Amazfit Balance",
  "main": "app.js",
  "author": "MarvenAPPS",
  "license": "MIT",
  "devDependencies": {
    "@zeppos/device-types": "^3.0.0"
  }
}
```

**Key points:**
- `name` field is **required** - this is what Zeus uses as the package name
- Must be lowercase with hyphens (kebab-case)
- Should match your app purpose

---

## Error: "targets.amazfit-balance requires property platforms"

### Problem
```
targets.amazfit-balance requires property "platforms"
```

### Root Cause
Each target in `app.json` must have a `platforms` array.

### Solution ✅

Changed from device-specific target to generic `default` target:

```json
"targets": {
  "default": {
    "module": {
      "page": {
        "pages": ["page/index", ...]
      }
    },
    "platforms": [
      {
        "name": "amazfit-balance",
        "deviceSource": 234,
        "st": "r",
        "dw": 466
      }
    ],
    "designWidth": 466
  }
}
```

**Explanation:**
- `st`: "r" = round display, "s" = square display
- `dw`: Display width in pixels (466 for Amazfit Balance)
- `deviceSource`: Device identifier (234 for Amazfit Balance)
- `designWidth`: Design canvas width

---

## Error: "configVersion required"

### Problem
```
instance requires property "configVersion"
```

### Solution ✅

Added to root of `app.json`:

```json
{
  "configVersion": "v3",
  ...
}
```

---

## Error: "defaultLanguage required"

### Problem
```
instance requires property "defaultLanguage"
```

### Solution ✅

Added to root of `app.json`:

```json
{
  ...
  "defaultLanguage": "en-US"
}
```

---

## Complete Working Configuration

### Required Files Structure

```
zepp-productivity-alarm/
├── package.json          ← REQUIRED - contains package name
├── app.json              ← REQUIRED - v3 config with all fields
├── app.js                ← App lifecycle
├── jsconfig.json         ← TypeScript/JS config (optional but recommended)
├── page/
│   └── *.js             ← Page files
└── utils/
    └── *.js             ← Utility modules
```

### Verification Checklist

Before running `zeus build`, verify:

- [x] `package.json` exists in root with `name` field
- [x] `app.json` has `configVersion: "v3"`
- [x] `app.json` has `defaultLanguage` field
- [x] `app.json` targets have `platforms` array
- [x] `app.json` has valid `appId` from Zepp Console
- [x] All page files referenced in `pages` array exist

### Build Command

```bash
# Clean build
rm -rf dist/
zeus build

# Should output:
# [ℹ] Start building package, targets: default.
# [✔] Build package success!
```

---

## Still Having Issues?

### 1. Update Zeus CLI

```bash
npm update -g @zeppos/zeus-cli
# or
npm install -g @zeppos/zeus-cli@latest
```

### 2. Clear Build Cache

```bash
rm -rf dist/
rm -rf node_modules/
npm install  # if you have dependencies
zeus build
```

### 3. Verify App ID

Make sure your `appId` in `app.json` is registered:

1. Go to https://console.zepp.com/
2. Create/find your app
3. Copy the correct `appId`
4. Update `app.json`

### 4. Check File Names

Ensure all files referenced in `app.json` pages array exist:

```json
"pages": [
  "page/index",        // Requires: page/index.js
  "page/alarms",       // Requires: page/alarms.js
  ...
]
```

---

## Summary of All Fixes Applied

| Issue | Fix |
|-------|-----|
| Package name undefined | Added `package.json` with `name` field |
| Missing configVersion | Added `"configVersion": "v3"` to `app.json` |
| Missing defaultLanguage | Added `"defaultLanguage": "en-US"` to `app.json` |
| Missing platforms | Changed target to `default` with proper `platforms` array |
| API version outdated | Updated to target `4.2`, compatible `3.7+` |

**All fixes are now in the repository. Just pull and build!** ✅
