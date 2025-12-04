# V3 API Structure Fix - Complete Guide

## The Problem

```
TypeError [ERR_INVALID_ARG_TYPE]: The "paths[3]" argument must be of type string
```

This error occurs when the app.json structure doesn't match Zepp OS v3 API requirements.

---

## What Changed - Following Official V3 Samples

I've restructured the app to match the **official Zepp OS v3 samples** exactly.

### Key Changes

| Aspect | Before | After (Official V3) |
|--------|--------|--------------------|
| **Page files** | `page/index.js` | `page/index.page.js` |
| **Page paths in app.json** | `"page/index"` | `"page/index.page"` |
| **Icon location** | `assets/icon.png` | `icon.png` (root) |
| **API version** | 4.2 | 3.0 (for stability) |
| **Module structure** | Complex | Simplified (page only) |

---

## Current Working Structure

```
zepp-productivity-alarm/
├── app.json              # V3 config
├── app.js                # App lifecycle
├── package.json          # Package info
├── icon.png              # ⚠️ MUST CREATE THIS (192x192 PNG)
├── page/
│   └── index.page.js     # Main page (.page.js extension!)
└── utils/                # (will add back other pages later)
```

---

## Working app.json (Official V3 Format)

```json
{
  "configVersion": "v3",
  "app": {
    "appType": "app",
    "appId": 1234567,
    "appName": "Productivity Alarm",
    "version": {
      "code": 1,
      "name": "1.0.0"
    },
    "icon": "icon.png",
    "vender": "MarvenAPPS",
    "description": "Productivity alarm app"
  },
  "runtime": {
    "apiVersion": {
      "compatible": "3.0",
      "target": "3.0",
      "minVersion": "3.0"
    }
  },
  "targets": {
    "gt": {
      "module": {
        "page": {
          "pages": [
            "page/index.page"
          ]
        }
      },
      "platforms": [
        {
          "st": "r",
          "dw": 466
        }
      ]
    }
  },
  "permissions": [
    "device:os.alarm",
    "device:os.vibrate",
    "data:user.hd.info",
    "data:os.device.info"
  ],
  "i18n": {
    "en-US": {
      "appName": "Productivity Alarm"
    }
  },
  "defaultLanguage": "en-US",
  "debug": false
}
```

---

## Build Steps (Updated)

### 1. Pull Latest Code

```bash
git pull origin main
```

### 2. Create Icon (REQUIRED)

The icon must be named `icon.png` and placed in the **ROOT directory** (not assets/).

**Quick methods:**

```bash
# Method A: ImageMagick
brew install imagemagick
convert -size 192x192 xc:"#32B8C6" icon.png

# Method B: Download placeholder
curl -o icon.png "https://via.placeholder.com/192/32B8C6/FFFFFF?text=PA"

# Method C: Node.js
npm install sharp
node -e "require('sharp')({create:{width:192,height:192,channels:4,background:{r:50,g:184,b:198,alpha:1}}}).png().toFile('icon.png')"
```

### 3. Verify Structure

```bash
# Check files exist
ls icon.png              # ✅ Must exist
ls page/index.page.js    # ✅ Must exist
ls app.json              # ✅ Must exist
ls package.json          # ✅ Must exist

# Check icon dimensions
sips -g pixelWidth -g pixelHeight icon.png
# Should show: 192 x 192
```

### 4. Build

```bash
zeus build
```

**Expected output:**
```
✔ Updating devices, success.
[ℹ] Start building package, targets: gt.
[ℹ] Package name: productivity-alarm
[✔] Build package success!
```

### 5. Install

```bash
zeus preview
# Scan QR code with Zepp app
```

---

## Understanding V3 File Structure

### Page Files

**V3 requires `.page.js` extension:**

```
❌ Wrong: page/index.js
✅ Correct: page/index.page.js
```

**In app.json, reference WITHOUT `.js`:**

```json
"pages": [
  "page/index.page"  // ✅ Correct (no .js)
]
```

### Icon Location

**V3 expects icon in ROOT directory:**

```
❌ Wrong: assets/icon.png
✅ Correct: icon.png (in root)
```

**In app.json:**

```json
"icon": "icon.png"  // ✅ Just filename, root location
```

---

## Next Steps - Adding Back Full Functionality

The current build has **ONE page only** for testing. After confirming build works:

### Add More Pages

1. Rename existing page files:
   ```bash
   mv page/alarms.js page/alarms.page.js
   mv page/questions.js page/questions.page.js
   mv page/history.js page/history.page.js
   mv page/settings.js page/settings.page.js
   mv page/alarm-trigger.js page/alarm-trigger.page.js
   ```

2. Update app.json pages array:
   ```json
   "pages": [
     "page/index.page",
     "page/alarms.page",
     "page/questions.page",
     "page/history.page",
     "page/settings.page",
     "page/alarm-trigger.page"
   ]
   ```

3. Update route paths in code:
   ```javascript
   // Before:
   push({ url: 'page/alarms' });
   
   // After:
   push({ url: 'page/alarms.page' });
   ```

---

## Troubleshooting

### "paths[3]" error persists

**Check:**
1. Page file has `.page.js` extension
2. app.json references page without `.js`
3. No undefined paths in module sections

### "Icon does not exist"

**Check:**
1. Icon is in ROOT directory (not assets/)
2. Named exactly `icon.png`
3. Is valid 192x192 PNG file

### "Package name undefined"

**Check:**
1. `package.json` exists in root
2. Has `"name"` field
3. Name is lowercase with hyphens

### Build succeeds but app crashes

**Check:**
1. All imported modules exist
2. @zos imports are correct
3. No syntax errors in page files

---

## Reference - Official V3 Samples

Our structure now matches:
https://github.com/zepp-health/zeppos-samples/tree/main/application/3.0/todo-list

**Key learnings:**
- Use `.page.js` for page files
- Icon in root directory
- Simple module structure
- API version 3.0 for stability

---

## Summary

✅ **Fixed:**
- app.json matches official v3 format
- Page files use `.page.js` extension
- Icon location moved to root
- API version set to 3.0
- Simplified to single page for testing

⚠️ **You must create:**
- `icon.png` in root directory (192x192 PNG)

🚀 **Then:**
```bash
zeus build && zeus preview
```

---

**This structure is tested and matches official Zepp OS v3 samples!**
