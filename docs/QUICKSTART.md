# Quick Start Guide - 3 Minutes to Running App

## Step 1: Get the Code (30 seconds)

```bash
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm
```

## Step 2: Create Icon (30 seconds)

**Option A - Download:**
```bash
curl -o icon.png "https://via.placeholder.com/192/32B8C6/FFFFFF?text=PA"
```

**Option B - ImageMagick:**
```bash
brew install imagemagick
convert -size 192x192 xc:"#32B8C6" icon.png
```

**Option C - Node.js:**
```bash
npm install sharp
node -e "require('sharp')({create:{width:192,height:192,channels:4,background:{r:50,g:184,b:198,alpha:1}}}).png().toFile('icon.png')"
```

## Step 3: Build (30 seconds)

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

## Step 4: Install on Watch (90 seconds)

### First Time Setup

1. **Open Zepp App** on phone
2. **Enable Developer Mode:**
   - Profile → About
   - Tap version 10 times
   - See "Developer Mode Enabled"

3. **Preview on watch:**
   ```bash
   zeus preview
   ```

4. **Scan QR code** with Zepp app
5. **App installs** automatically
6. **Done!** 🎉

---

## Quick Test

### On Your Watch:

1. **Open app** from watch menu
2. **See dashboard** with 0 points
3. **Tap "Alarms"**
4. **Toggle first alarm ON**
5. **Wait for alarm** or test trigger page

### Test Alarm Trigger:

```javascript
// Temporarily change alarm time to test
// In page/alarms.page.js, set alarm to current time + 1 min
```

---

## Common First-Time Issues

### "Zeus command not found"
```bash
npm install -g @zeppos/zeus-cli
```

### "Icon does not exist"
```bash
# Make sure icon.png is in ROOT directory
ls icon.png
# Should show the file
```

### "Can't scan QR code"
- Enable **Developer Mode** in Zepp app first
- Make sure phone and computer on **same WiFi**
- Try `zeus preview --host 0.0.0.0`

### "Build fails"
```bash
# Clean build
rm -rf dist/
zeus build
```

---

## Next Steps

✅ **Read full docs:** [README.md](../README.md)  
✅ **Configure alarms:** Via Zepp app (coming soon)  
✅ **Customize questions:** Edit in code or via Zepp app  
✅ **Set up server:** See [API.md](API.md)  

---

**Total Time: ~3 minutes** ⏱️

**Having issues?** See [Troubleshooting](../README.md#troubleshooting)
