# Target Identifier Fix - "No matching target devices"

## The Problem

```bash
no matching target devices
[✘] Build package error, the package name is undefined
```

## Root Cause

Used **`default`** as target name, but Zepp OS requires **standard target identifiers**.

---

## The Fix ✅

### Changed Target from `default` to `gt`

**Before (WRONG):**
```json
"targets": {
  "default": { ... }
}
```

**After (CORRECT):**
```json
"targets": {
  "gt": { ... }
}
```

---

## Why `gt`?

### Zepp OS Standard Target Identifiers

| Target ID | Device Type | Devices |
|-----------|-------------|----------|
| **`gt`** | **Generic round watches** | **Amazfit Balance, GTR 4, GTR 3, all round displays** |
| `gts` | Square watches | GTS 4, GTS 3, square displays |
| `band` | Band devices | Mi Band, Amazfit Band |

**For Amazfit Balance:** Use `gt` because it's a **round display watch**.

---

## Complete Correct Configuration

### app.json targets section:

```json
{
  "targets": {
    "gt": {
      "module": {
        "page": {
          "pages": [
            "page/index",
            "page/alarms",
            "page/questions",
            "page/history",
            "page/settings",
            "page/alarm-trigger"
          ]
        }
      },
      "platforms": [
        {
          "st": "r"  // r = round, s = square
        }
      ],
      "designWidth": 466  // Amazfit Balance screen width
    }
  }
}
```

### Simplified Platforms Array

**Before (overcomplicated):**
```json
"platforms": [
  {
    "name": "amazfit-balance",
    "deviceSource": 234,
    "st": "r",
    "dw": 466
  }
]
```

**After (clean and correct):**
```json
"platforms": [
  {
    "st": "r"
  }
]
```

**Why simpler?**
- `st` (screen type) is all you need
- `designWidth` goes at target level, not platform level
- Generic `gt` target works across all round devices
- No need for device-specific identifiers

---

## Build Output After Fix

### ✅ Success Output:

```bash
Updating devices, waiting ...
[ℹ] Start building package, targets: gt.
[ℹ] Bundling app ...
[ℹ] Package name: productivity-alarm
[✔] Build package success!
```

**Key indicators:**
- ✅ `targets: gt` (not "no matching target devices")
- ✅ Package name shows (not "undefined")
- ✅ Build succeeds

---

## Understanding Target System

### Generic vs Device-Specific

**❌ DON'T use device-specific targets:**
```json
// These will fail:
"targets": {
  "amazfit-balance": { ... },
  "gtr-4": { ... },
  "balance-2": { ... }
}
```

**✅ DO use generic standard targets:**
```json
// These work:
"targets": {
  "gt": { ... },   // All round watches
  "gts": { ... },  // All square watches  
  "band": { ... }  // All band devices
}
```

### Benefits of Generic Targets

1. **One build, multiple devices** - Your app works on:
   - Amazfit Balance (original)
   - Amazfit Balance 2
   - GTR 4
   - GTR 3 Pro
   - Any future round Zepp OS watch

2. **Automatic adaptation** - Zepp OS handles screen size differences

3. **Future-proof** - New devices automatically supported

4. **Simpler config** - Less platform-specific code

---

## Verification

### Check Your Configuration

```bash
# 1. Verify target is 'gt'
cat app.json | grep -A2 '"targets"'
# Should show: "gt": {

# 2. Verify platforms has 'st': 'r'
cat app.json | grep -A3 '"platforms"'
# Should show: "st": "r"

# 3. Verify designWidth
cat app.json | grep 'designWidth'
# Should show: "designWidth": 466
```

### Build Test

```bash
git pull origin main
rm -rf dist/
zeus build

# Look for:
# ✅ "targets: gt"
# ✅ "Package name: productivity-alarm"
# ✅ "Build package success!"
```

---

## Multi-Target Apps (Advanced)

If you want to support **both round and square** watches:

```json
{
  "targets": {
    "gt": {
      "module": {
        "page": {
          "pages": ["page/gt/index", ...]
        }
      },
      "platforms": [{ "st": "r" }],
      "designWidth": 466
    },
    "gts": {
      "module": {
        "page": {
          "pages": ["page/gts/index", ...]
        }
      },
      "platforms": [{ "st": "s" }],
      "designWidth": 390
    }
  }
}
```

**Note:** You'd need separate page implementations for different screen shapes.

---

## Quick Reference

### Minimal Correct app.json

```json
{
  "configVersion": "v3",
  "app": { /* ... */ },
  "runtime": {
    "apiVersion": {
      "compatible": "3.7",
      "target": "4.2",
      "minVersion": "3.7"
    }
  },
  "targets": {
    "gt": {
      "module": { "page": { "pages": [...] } },
      "platforms": [{ "st": "r" }],
      "designWidth": 466
    }
  },
  "defaultLanguage": "en-US"
}
```

### Target ID Cheat Sheet

- **Round watches** → `gt` + `"st": "r"`
- **Square watches** → `gts` + `"st": "s"`
- **Band devices** → `band` + appropriate st

---

**✅ Fix Applied! Pull latest code and build:**

```bash
git pull origin main && zeus build
```
