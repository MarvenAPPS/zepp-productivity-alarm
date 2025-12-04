# Installation Guide

## Prerequisites

1. **Zepp OS Development Environment**
   - Zeus CLI (`@zeppos/zeus-cli`) version 1.2.0 or higher
   - Node.js ≥ 18.0.0
   - Amazfit Balance watch
   - Zepp mobile app with developer mode enabled

2. **Install Zeus CLI**
   ```bash
   npm install -g @zeppos/zeus-cli
   # or
   yarn global add @zeppos/zeus-cli
   ```

## Building the Watch App

### 1. Clone and Setup

```bash
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm
```

### 2. Configure App ID

Before building, you need to update the `appId` in `app.json`:

1. Go to [Zepp Developer Console](https://console.zepp.com/)
2. Create a new application
3. Get your unique `appId`
4. Update `app.json`:
   ```json
   "app": {
     "appId": YOUR_APP_ID_HERE,
     ...
   }
   ```

### 3. Build the Package

```bash
# Build for Amazfit Balance
zeus build
```

The build output will be in the `dist/` directory.

### 4. Install on Watch

#### Option A: Via Zeus Preview (Recommended)

```bash
zeus preview
```

This will:
1. Generate a QR code in your terminal
2. Open Zepp mobile app
3. Go to: **Profile → [Your Watch] → Scroll to bottom → Developer Mode**
4. Tap **Scan QR Code**
5. Scan the QR code from terminal
6. App will install on your watch

#### Option B: Manual Installation

1. Build the app: `zeus build`
2. Find the `.zab` file in `dist/` directory
3. Use Zepp developer tools to sideload

## Enabling Developer Mode in Zepp App

1. Open **Zepp** mobile app
2. Go to **Profile** tab
3. Tap on your **Amazfit Balance**
4. Scroll to the **bottom** of the device page
5. Tap **Developer Mode** multiple times until it activates
6. You'll see additional developer options

## Verifying Installation

1. On your Amazfit Balance, swipe to app list
2. Look for **Productivity Alarm** icon
3. Tap to open
4. You should see the main dashboard with:
   - Points: 0
   - TND equivalent
   - Menu buttons (Alarms, Questions, History, Settings)

## Troubleshooting

### Build Errors

**Error: `configVersion` required**
- Solution: This is fixed in the latest version. Make sure you pulled the latest code.

**Error: `platforms` required**
- Solution: Updated in latest `app.json`. The platforms array is now correctly configured.

**Error: Invalid appId**
- Solution: You must use your own appId from Zepp Developer Console.

### Installation Errors

**QR Code not scanning**
- Ensure developer mode is enabled in Zepp app
- Try `zeus login` first, then `zeus preview`
- Check that watch is connected to Zepp app

**App not appearing on watch**
- Wait 30-60 seconds after installation
- Restart the watch
- Check Zepp app for installation status

**Permission errors**
- The app requires alarm, vibration, and device info permissions
- These should be auto-granted, but check watch settings if issues persist

## Next Steps

After installation:
1. Configure your first alarm via the watch or Zepp app
2. Set up questions via the backend server (see [Backend Setup](../README.md#4-backend-server--setup-run--integration))
3. Enable server sync in Settings (optional)

## Updating the App

```bash
git pull origin main
zeus build
zeus preview
# Scan new QR code - this will update the existing installation
```
