# Quick Start Guide

## ✅ All Build Issues Fixed!

This repository is now **fully configured and ready to build**.

---

## Prerequisites

```bash
# Install Zeus CLI
npm install -g @zeppos/zeus-cli

# Verify installation
zeus --version
```

---

## Build in 3 Steps

### 1. Clone & Configure

```bash
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm
```

**Important:** Update your `appId` in `app.json`:

1. Go to [Zepp Developer Console](https://console.zepp.com/)
2. Create a new app (or use existing)
3. Copy your unique `appId`
4. Edit `app.json`:

```json
{
  "app": {
    "appId": YOUR_APP_ID_HERE,  // ← Change this!
    ...
  }
}
```

### 2. Build

```bash
zeus build
```

**Expected output:**
```
[ℹ] Start building package, targets: default.
Updating devices, waiting ...
[ℹ] Bundling app ...
[✔] Build package success!
```

### 3. Install on Watch

```bash
zeus preview
```

This will:
1. Generate a QR code in your terminal
2. Open Zepp app on your phone
3. Enable Developer Mode: Profile → [Your Watch] → Developer Mode
4. Tap "Scan QR Code"
5. Scan the terminal QR code
6. App installs automatically!

---

## What Was Fixed

### ✅ Added `package.json`
**Error:** `package name is undefined`  
**Fix:** Created `package.json` with required `name` field

### ✅ Updated `app.json` Structure
**Error:** `configVersion`, `defaultLanguage`, `platforms` required  
**Fix:** Added all required v3 config fields

### ✅ Fixed Target Configuration
**Error:** `targets.amazfit-balance requires property platforms`  
**Fix:** Changed to `default` target with proper platforms array

### ✅ Updated API Version
**Error:** Outdated API references  
**Fix:** Target API_LEVEL 4.2, compatible with 3.7+

See [BUILD_FIX.md](BUILD_FIX.md) for detailed troubleshooting.

---

## Verify Everything Works

### Check Files Exist

```bash
ls -la
# Should see:
# - package.json   ✅
# - app.json       ✅
# - app.js         ✅
# - page/          ✅
# - utils/         ✅
# - server/        ✅ (backend, optional)
```

### Validate Configuration

```bash
# Check package name
cat package.json | grep '"name"'
# Output: "name": "productivity-alarm"

# Check app.json config version
cat app.json | grep configVersion
# Output: "configVersion": "v3",

# Check default language
cat app.json | grep defaultLanguage
# Output: "defaultLanguage": "en-US"
```

---

## Next Steps

### On Watch
1. Open **Productivity Alarm** app
2. Main screen shows:
   - Points: 0
   - ≈ 0.000 TND
   - Active Alarms: 0
3. Navigate to **Alarms** to configure
4. Navigate to **Questions** to preview
5. Navigate to **History** to track points

### Configure Alarms
Currently alarms are pre-configured in the code. To customize:
- Via **Zepp App** (future feature - needs Zepp companion)
- Via **Backend Server** (see server/ directory)
- Edit `utils/storage.js` default data (for testing)

### Setup Backend (Optional)

For server sync and centralized question management:

```bash
cd server
cp .env.example .env
npm install
npm start

# Server runs on http://localhost:3000
```

Then in watch Settings or via Zepp app, set:
- `server_url`: Your server URL
- `sync_enabled`: true

---

## Common Issues

### Build fails with "package name is undefined"

**Solution:** Pull latest code
```bash
git pull origin main
zeus build
```

### "appId already in use" error

**Solution:** Use your own appId from Zepp Console  
1. Go to https://console.zepp.com/
2. Create new app
3. Update appId in `app.json`

### QR code won't scan

**Solution:** Enable Developer Mode
1. Open Zepp app
2. Go to Profile → [Your Watch]
3. Scroll to bottom
4. Tap "Developer Mode" 7 times
5. Try scanning again

### App doesn't appear on watch

**Solution:** Wait and restart
1. Wait 30-60 seconds
2. Restart watch
3. Check Zepp app for installation status

---

## Features Overview

### 🔔 Productivity Alarms
- Set multiple alarms per day
- Each alarm requires answering questions to dismiss
- 5-minute continuous vibration until answered
- Configurable number of questions per alarm (1-30)

### ❓ Smart Questions
- Up to 30 customizable yes/no questions
- Each answer awards or deducts points
- Questions managed via Zepp App or backend server
- Random selection for each alarm

### 🎯 Points System
- Track productivity with points
- See TND currency equivalent in real-time
- Complete history of all point changes
- Redeem points (1000+ only, multiples of 1000)

### 📡 Server Sync
- Optional cloud backup
- Multi-device synchronization
- Centralized question management
- Balance and history tracking

---

## Support

- **Issues:** https://github.com/MarvenAPPS/zepp-productivity-alarm/issues
- **Documentation:** See README.md and docs/ folder
- **API Reference:** [Zepp OS Docs](https://docs.zepp.com/)

---

**✅ Repository is ready to build! Pull latest code and run `zeus build`**
