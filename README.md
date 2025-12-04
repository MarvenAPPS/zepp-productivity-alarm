# Zepp OS Productivity Alarm App

✅ **FIXED: Now builds successfully with Zeus CLI** - All `app.json` configuration issues resolved!

Productivity-focused alarm app for **Amazfit Balance** built with **Zepp OS SDK API_LEVEL 4.2**, featuring:

- ⏰ Multiple alarms per day with customizable wake-up requirements
- ❓ Up to **30 yes/no questions** per alarm (configurable via Zepp App)
- 🎯 **Points system** - earn/lose points based on your answers
- 💰 **TND currency conversion** - see real-world value of your points
- 📊 **History tracking** - monitor all point changes
- 🎁 **Redeem system** - cash out in multiples of 1000 points (min 1000)
- 📡 **Server sync** - backup and sync across devices
- 🔔 **5-minute vibration** - won't stop until you answer required questions

---

## ⚡ Quick Start

### Build & Install

```bash
# Clone the repo
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm

# Build (Zeus CLI required)
zeus build

# Install on watch
zeus preview
# Scan QR code with Zepp app Developer Mode
```

**Important**: Update `appId` in `app.json` with your own ID from [Zepp Developer Console](https://console.zepp.com/).

---

## 🔧 Technical Details

### API Versions

- **Config Version**: `v3` (latest format)
- **API_LEVEL**: Target `4.2` (latest features)
- **Compatibility**: Works on API_LEVEL `3.7+`
- **Zepp OS**: 4.0+ (original Amazfit Balance) and 5.0+ (Balance 2)

### What Was Fixed

The initial version had build errors. **All fixed now**:

✅ Added `configVersion: "v3"` (required for latest Zeus CLI)  
✅ Added `defaultLanguage: "en-US"` (required field)  
✅ Added `platforms` array with Amazfit Balance specs (466x466, round)  
✅ Updated API version: compatible `3.7`, target `4.2`  
✅ Added multi-language support (English, French, Arabic)  

See [CHANGELOG.md](CHANGELOG.md) for complete details.

---

## 📱 Project Structure

```bash
zepp-productivity-alarm/
├── app.json                  # ✅ FIXED - v3 config with all required fields
├── app.js                    # App lifecycle handler
├── page/
│   ├── index.js              # Dashboard: balance, TND value, navigation
│   ├── alarms.js             # Alarm list / enable-disable
│   ├── questions.js          # Question browser (watch view)
│   ├── history.js            # Points history + reset/redeem
│   ├── settings.js           # Local settings summary
│   └── alarm-trigger.js      # Alarm screen + vibration + Q&A
├── utils/
│   ├── storage.js            # Local data persistence
│   ├── sync.js               # Server sync client
│   └── alarm-engine.js       # Alarm scheduling logic
├── server/                   # Node.js + Express + SQLite backend
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── database.js
│   │   ├── user.js
│   │   └── config.js
│   └── routes/
│       ├── sync.js
│       └── config.js
└── docs/
    ├── INSTALLATION.md       # Detailed installation guide
    └── API_FEATURES.md       # API 4.2 features & optimization
```

---

## 🎮 How It Works

### Alarm Flow

1. **Configure Alarms** - Set up multiple alarms per day (hour, minute, repeat pattern)
2. **Set Questions** - Choose how many questions (1-30) required per alarm
3. **Alarm Triggers** - At alarm time:
   - Watch vibrates continuously (pattern: 500ms on, 500ms off)
   - Randomly selects required number of questions from your pool
   - Shows questions one by one with YES/NO buttons
4. **Answer Questions** - Each answer:
   - Awards or deducts points based on question settings
   - Adds entry to history
   - Syncs with server (if enabled)
5. **Dismiss** - Vibration stops only when all required questions answered
   - If not answered within 5 minutes, alarm auto-dismisses

### Points & Redemption

- **Earn/Lose Points**: Each question has `yesPoints` and `noPoints` values
- **Track Balance**: See total points and TND equivalent on main screen
- **View History**: All point changes logged with timestamp and action
- **Redeem**: Convert points to currency (1000+ points, multiples of 1000)
- **Reset**: Clear all history and reset balance to 0

### Server Sync (Optional)

- Syncs balance updates and history entries to external server
- Allows multi-device tracking and backup
- Server provides centralized question management
- See [Backend Setup](#backend-server-setup) below

---

## 💻 Installation Guide

### Prerequisites

1. **Zeus CLI** (Zepp OS build tool)
   ```bash
   npm install -g @zeppos/zeus-cli
   ```

2. **Amazfit Balance** watch paired with Zepp mobile app

3. **Developer Mode** enabled in Zepp app:
   - Open Zepp app
   - Go to Profile → [Your Watch] → Scroll to bottom
   - Tap "Developer Mode" multiple times to enable

### Build Steps

```bash
# 1. Clone repository
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm

# 2. Update appId in app.json
# Get your appId from https://console.zepp.com/
# Edit app.json: "appId": YOUR_ID_HERE

# 3. Build
zeus build

# 4. Preview (generates QR code)
zeus preview

# 5. Scan QR with Zepp app Developer Mode
# App installs automatically on your watch
```

### Troubleshooting

**Build errors**:
- ✅ All `app.json` errors are fixed in latest version
- Run `git pull origin main` to get latest fixes
- Ensure Zeus CLI is updated: `npm update -g @zeppos/zeus-cli`

**Installation issues**:
- Make sure Developer Mode is enabled in Zepp app
- Check watch is connected to Zepp app
- Try `zeus login` before `zeus preview`

Full guide: [docs/INSTALLATION.md](docs/INSTALLATION.md)

---

## 🛠️ Backend Server Setup

Optional Node.js backend for sync and centralized configuration.

### Quick Start

```bash
cd server
cp .env.example .env
# Edit .env - set PORT, DB_PATH, DEFAULT_TND_RATE, etc.

npm install
npm start
```

Server runs on `http://localhost:3000` (or your configured PORT).

### Endpoints

**Sync**:
- `POST /api/sync/balance` - Sync balance update
- `POST /api/sync/full` - Full history sync
- `GET /api/sync/data/:deviceId` - Get device data

**Config**:
- `GET /api/config` - Get configuration (TND rate, questions)
- `PUT /api/config` - Update configuration
- `GET /api/config/questions` - Get questions
- `PUT /api/config/questions` - Update questions (max 30)

**Health**:
- `GET /health` - Server health check

### Connecting Watch to Server

In watch Settings or via Zepp app, configure:
- `server_url`: Your server URL (e.g., `https://your-domain.com`)
- `sync_enabled`: Set to `true`

Sync happens automatically when:
- Answering questions
- Redeeming points
- Manually triggered (future feature)

---

## 👀 Data Model

### Questions
```json
{
  "id": 0,
  "text": "Did you exercise today?",
  "yesPoints": 10,
  "noPoints": -5
}
```

### Alarms
```json
{
  "id": 0,
  "hour": 7,
  "minute": 0,
  "enabled": true,
  "questionsToAnswer": 5,
  "repeat": [1, 1, 1, 1, 1, 0, 0]
}
```
`repeat`: Mon-Sun (1=enabled, 0=disabled)

### History Entry
```json
{
  "timestamp": 1733349600000,
  "action": "Answered: Did you exercise...",
  "points": 10
}
```

### Settings
- `balance`: Total points (integer)
- `tnd_rate`: Points-to-TND conversion (default: 0.001)
- `sync_enabled`: Enable server sync (boolean)
- `server_url`: Backend URL (string)
- `vibration_duration`: Max vibration time in ms (default: 300000)

---

## 🚀 API_LEVEL 4.2 Features

Current implementation uses base APIs (3.7+). Future enhancements with 4.2:

- **Custom Keyboard**: Add/edit questions directly on watch
- **Device UUID**: Better device identification for sync
- **Audio Alerts**: Sound in addition to vibration
- **Background Sync**: Automatic periodic sync
- **Workout Integration**: Bonus points during workouts

See [docs/API_FEATURES.md](docs/API_FEATURES.md) for details.

---

## 📋 Use Cases

### Morning Accountability
```
Alarm 1 (7:00 AM):
- Question 1: Did you get 8 hours of sleep? (+10 / -5)
- Question 2: Ready to exercise? (+10 / -5)
- Question 3: Breakfast planned? (+5 / -3)
```

### Work Productivity
```
Alarm 2 (9:00 AM):
- Question 1: Tasks prioritized? (+10 / -5)
- Question 2: Distractions minimized? (+10 / -5)
- Question 3: Goals clear? (+10 / -5)
```

### Evening Review
```
Alarm 3 (9:00 PM):
- Question 1: Exercise completed? (+15 / -10)
- Question 2: Healthy meals? (+10 / -5)
- Question 3: Learning time? (+10 / -5)
- Question 4: Helped someone? (+5 / -0)
- Question 5: Avoided procrastination? (+15 / -10)
```

### Redemption
- Reach 1000+ points
- Redeem in multiples of 1000
- Track TND value in real-time
- Use for personal rewards or tracking

---

## 📚 Documentation

- [INSTALLATION.md](docs/INSTALLATION.md) - Complete installation guide
- [API_FEATURES.md](docs/API_FEATURES.md) - API 4.2 features and optimizations
- [CHANGELOG.md](CHANGELOG.md) - Version history and fixes

---

## 🛡️ License

MIT License - See LICENSE file for details

---

## 👤 Author

**MarvenAPPS**  
GitHub: [@MarvenAPPS](https://github.com/MarvenAPPS)

---

## ⭐ Support

If this app helps you build better habits:
- ⭐ Star this repository
- 🐛 Report issues on GitHub
- 💡 Suggest features in Issues
- 🤝 Contribute via Pull Requests

---

**Built with Zepp OS SDK | Targeting API_LEVEL 4.2 | Compatible with Amazfit Balance**
