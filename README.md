# Productivity Alarm - Amazfit Balance App

<div align="center">

**A productivity-focused alarm app with question-based dismissal and point rewards system**

[![Zepp OS](https://img.shields.io/badge/Zepp%20OS-3.0-blue)](https://github.com/zepp-health/zeppos-samples)
[![Amazfit Balance](https://img.shields.io/badge/Device-Amazfit%20Balance-orange)](https://www.amazfit.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📱 Features

### Core Functionality

- ⏰ **Multiple Daily Alarms** - Configure up to 10 alarms per day
- ❓ **Question-Based Dismissal** - Answer questions to stop vibration (won't stop for 5 minutes otherwise)
- 🎯 **30 Customizable Questions** - Add/edit via Zepp mobile app
- 📊 **Flexible Question Count** - Choose 1-30 questions per alarm
- 💰 **Points System** - Earn/lose points based on answers
- 📈 **Points History** - Track all point transactions
- 💵 **TND Currency** - View balance in Tunisian Dinars (configurable rate)
- 🔄 **Server Sync** - Sync balance with external server
- 🏍️ **Redeem System** - Cash out points (minimum 1000, multiples of 1000)
- 🛠️ **Reset Function** - Clear balance and history

### Technical Features

- ✅ Built with **Zepp OS v3 API**
- ✅ Compatible with **Amazfit Balance**
- ✅ Persistent storage with `localStorage`
- ✅ Vibration motor integration
- ✅ Clean, modern UI with dark theme
- ✅ No external dependencies
- ✅ Production-ready code

---

## 📖 Table of Contents

- [Installation](#-installation)
- [Compilation](#-compilation)
- [Usage](#-usage)
- [Configuration](#%EF%B8%8F-configuration)
- [App Structure](#-app-structure)
- [Server Integration](#-server-integration)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🛠️ Installation

### Prerequisites

1. **Node.js** v16+ installed
2. **Zeus CLI** installed globally:
   ```bash
   npm install -g @zeppos/zeus-cli
   ```
3. **Zepp Mobile App** on your phone
4. **Amazfit Balance** watch paired with phone

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm

# 2. Create icon (required)
curl -o icon.png "https://via.placeholder.com/192/32B8C6/FFFFFF?text=PA"
# OR use ImageMagick:
# convert -size 192x192 xc:"#32B8C6" icon.png

# 3. Build
zeus build

# 4. Install on watch
zeus preview
# Scan QR code with Zepp app (Developer Mode enabled)
```

### Enable Developer Mode

1. Open **Zepp mobile app**
2. Go to **Profile** → **About**
3. Tap version number **10 times**
4. Developer mode enabled!
5. Scan QR code from `zeus preview`

---

## 🔨 Compilation

### Build for Production

```bash
# Standard build
zeus build

# Clean build (recommended after changes)
rm -rf dist/
zeus build

# Preview on watch
zeus preview
```

### Expected Build Output

```
✔ Updating devices, success.
[ℹ] Start building package, targets: gt.
[ℹ] Bundling app ...
[ℹ] Package name: productivity-alarm
[✔] Build package success!
```

### Build Troubleshooting

| Error | Solution |
|-------|----------|
| "package name undefined" | Add `package.json` with `name` field |
| "icon does not exist" | Create `icon.png` (192x192) in root |
| "no matching target devices" | Check `app.json` uses `"gt"` target |
| "paths[3] undefined" | Use `.page.js` extension for page files |

See [BUILD_FIX.md](BUILD_FIX.md) and [V3_RESTRUCTURE.md](V3_RESTRUCTURE.md) for details.

---

## 📱 Usage

### Dashboard (Main Page)

- **View Balance** - Total points earned
- **TND Equivalent** - Real currency value
- **Active Alarms** - Number of enabled alarms
- **Navigation** - Access Alarms, History, Settings

### Alarms Page

- **View Alarms** - List of 10 configurable alarms
- **Toggle ON/OFF** - Enable/disable individual alarms
- **View Details** - See time and question count
- **Configure** - Set via Zepp mobile app

### Alarm Trigger

When alarm fires:

1. 🔴 Screen turns **RED**
2. 🔔 Watch **vibrates** continuously
3. ❓ **Question appears**
4. ✅ Answer **YES** or **NO**
5. 🔁 **Repeat** for N questions
6. ✅ **Alarm stops** after all answered
7. 📊 **Points updated** automatically

**Note:** Vibration won't stop for **5 minutes** unless you answer all questions!

### Questions Page

- **Browse** all 30 questions
- **View points** for YES/NO answers
- **Navigate** with < > buttons
- **Edit** via Zepp mobile app

### History Page

- **View transactions** - Recent point changes
- **See timestamps** - When points were earned/lost
- **Reset balance** - Clear everything
- **Redeem points** - Cash out (min 1000 pts)

### Settings Page

- **TND Rate** - View conversion rate
- **Server Sync** - Toggle ON/OFF
- **Server URL** - View configured endpoint
- **Configure** - All settings via Zepp app

---

## ⚙️ Configuration

### Via LocalStorage (Watch)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `balance` | number | 0 | Current point balance |
| `tnd_rate` | float | 0.001 | Points to TND conversion |
| `alarms` | JSON | [] | Array of alarm objects |
| `questions` | JSON | [] | Array of 30 questions |
| `history` | JSON | [] | Point transaction history |
| `sync_enabled` | boolean | false | Enable server sync |
| `server_url` | string | "" | Server endpoint URL |

### Via Zepp Mobile App (Companion App)

**Note:** Companion app development is separate from watch app. You'll need to create:

1. **Settings page** in companion app
2. **Question editor** with add/edit/delete
3. **Alarm configurator** with time picker
4. **Sync settings** with server URL input

Data is synced between watch and phone using Zepp OS APIs.

### Alarm Object Structure

```javascript
{
  id: 0,                    // Unique ID
  hour: 8,                  // 0-23
  minute: 0,                // 0-59
  enabled: false,           // true/false
  questionsToAnswer: 5,     // 1-30
  repeat: [1,1,1,1,1,0,0]  // Mon-Sun (1=enabled)
}
```

### Question Object Structure

```javascript
{
  id: 0,                       // Unique ID
  text: "Did you exercise?",   // Question text
  yesPoints: 10,               // Points for YES
  noPoints: -5                 // Points for NO
}
```

### History Entry Structure

```javascript
{
  timestamp: 1234567890,    // Unix timestamp (ms)
  action: "Question text",  // What happened
  points: 10                // Points change (+/-)
}
```

---

## 📚 App Structure

### File Organization

```
zepp-productivity-alarm/
├── app.json                 # App configuration
├── app.js                   # App lifecycle
├── package.json             # Package info
├── icon.png                 # App icon (192x192)
├── page/
│   ├── index.page.js        # Main dashboard
│   ├── alarms.page.js       # Alarm list
│   ├── history.page.js      # Points history
│   ├── settings.page.js     # App settings
│   ├── alarm-trigger.page.js # Alarm UI
│   └── questions.page.js    # Question browser
├── README.md                # This file
├── BUILD_FIX.md             # Build troubleshooting
├── V3_RESTRUCTURE.md        # v3 API guide
└── ICON_SETUP.md            # Icon creation guide
```

### Page Descriptions

| Page | File | Purpose |
|------|------|----------|
| **Dashboard** | `index.page.js` | Main screen with balance and navigation |
| **Alarms** | `alarms.page.js` | View and toggle alarms |
| **History** | `history.page.js` | View transactions, reset, redeem |
| **Settings** | `settings.page.js` | App configuration |
| **Trigger** | `alarm-trigger.page.js` | Alarm dismissal UI |
| **Questions** | `questions.page.js` | Browse questions |

### Data Flow

```
1. Alarm fires → alarm-trigger.page.js
2. Questions loaded from localStorage
3. User answers → Points calculated
4. Balance updated → localStorage
5. History entry added
6. [Optional] Sync to server
7. Return to dashboard
```

---

## 🌐 Server Integration

### API Endpoint (Expected)

Your server should expose:

```
POST /api/sync-balance
Content-Type: application/json

{
  "deviceId": "amazfit_balance_123",
  "balance": 1250,
  "timestamp": 1234567890,
  "history": [
    {
      "timestamp": 1234567890,
      "action": "Question answered",
      "points": 10
    }
  ]
}
```

### Server Response

```json
{
  "success": true,
  "serverBalance": 1250,
  "synced": true
}
```

### Implementation Notes

1. Sync is **triggered** when `sync_enabled` is true
2. Sync happens after **each point change**
3. Server URL from `localStorage.getItem('server_url')`
4. Use Zepp OS `fetch()` API for HTTP requests
5. Handle **offline mode** gracefully
6. Queue failed requests for **retry**

### Example Sync Code (Add to `alarm-trigger.page.js`)

```javascript
syncToServer() {
  const syncEnabled = localStorage.getItem('sync_enabled') === 'true';
  const serverUrl = localStorage.getItem('server_url');
  
  if (!syncEnabled || !serverUrl) return;
  
  const balance = parseInt(localStorage.getItem('balance') || '0');
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  
  fetch(serverUrl + '/api/sync-balance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId: 'amazfit_balance_' + Date.now(),
      balance: balance,
      timestamp: Date.now(),
      history: history.slice(0, 10) // Last 10 entries
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Sync success:', data);
  })
  .catch(err => {
    console.log('Sync failed:', err);
  });
}
```

---

## 👨‍💻 Development

### Prerequisites

```bash
# Install dependencies
npm install -g @zeppos/zeus-cli

# Check version
zeus --version
```

### Development Workflow

```bash
# 1. Make changes to page/*.page.js files

# 2. Build
zeus build

# 3. Test on watch
zeus preview

# 4. Commit
git add .
git commit -m "Add feature X"
git push origin main
```

### Adding New Features

1. **New Page:**
   ```bash
   # Create page/new-feature.page.js
   # Add to app.json pages array
   # Add navigation button in index.page.js
   ```

2. **New Storage:**
   ```javascript
   // Save
   localStorage.setItem('key', 'value');
   
   // Load
   const value = localStorage.getItem('key');
   ```

3. **New Navigation:**
   ```javascript
   import { push } from '@zos/router';
   push({ url: 'page/new-feature.page' });
   ```

### Code Style

- Use **ES6+** syntax
- **Descriptive** variable names
- **Comments** for complex logic
- **Error handling** with try/catch
- **Consistent** indentation (2 spaces)

---

## ⚠️ Troubleshooting

### Build Errors

**"Package name is undefined"**
```bash
# Solution: Add package.json
cat > package.json << 'EOF'
{
  "name": "productivity-alarm",
  "version": "1.0.0"
}
EOF
```

**"Icon does not exist"**
```bash
# Solution: Create icon.png
curl -o icon.png "https://via.placeholder.com/192/32B8C6/FFFFFF?text=PA"
```

**"No matching target devices"**
```bash
# Solution: Check app.json uses "gt" target
cat app.json | grep '"gt"'
```

### Runtime Errors

**Alarm doesn't fire**
- Check alarm is **enabled**
- Verify **system permissions**
- Check **time format** (24-hour)

**Points not saving**
- Check **localStorage** quota
- Verify **JSON.stringify** valid
- Clear cache and rebuild

**Vibration not stopping**
- Answer **all questions**
- Check **vibration interval** cleared
- Force close and reopen app

### Performance Issues

**App slow to load**
- Reduce **history** size (keep last 100)
- Optimize **rendering** (fewer widgets)
- Clear old **localStorage** data

**Battery drain**
- Reduce **vibration** duration
- Optimize **alarm checks**
- Disable **sync** when not needed

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👥 Credits

**Developer:** MarvenAPPS  
**Repository:** https://github.com/MarvenAPPS/zepp-productivity-alarm  
**Zepp OS:** https://github.com/zepp-health/zeppos-samples

---

## 📞 Support

For issues, questions, or contributions:

- **Issues:** https://github.com/MarvenAPPS/zepp-productivity-alarm/issues
- **Pull Requests:** https://github.com/MarvenAPPS/zepp-productivity-alarm/pulls

---

<div align="center">

**Built with ❤️ for Amazfit Balance**

[Report Bug](https://github.com/MarvenAPPS/zepp-productivity-alarm/issues) · [Request Feature](https://github.com/MarvenAPPS/zepp-productivity-alarm/issues)

</div>
