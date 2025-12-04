# API Documentation - Productivity Alarm

## Storage API

### LocalStorage Keys

All data persisted using Zepp OS `localStorage` API.

#### Balance

```javascript
// Save
localStorage.setItem('balance', String(points));

// Load
const balance = parseInt(localStorage.getItem('balance') || '0');
```

**Type:** `number`  
**Default:** `0`  
**Range:** `-999999999` to `999999999`

---

#### TND Rate

```javascript
// Save
localStorage.setItem('tnd_rate', String(rate));

// Load
const rate = parseFloat(localStorage.getItem('tnd_rate') || '0.001');
```

**Type:** `float`  
**Default:** `0.001`  
**Typical Range:** `0.0001` to `0.01`  
**Example:** `0.001` means 1 point = 0.001 TND (1000 points = 1 TND)

---

#### Alarms Array

```javascript
// Save
localStorage.setItem('alarms', JSON.stringify(alarmsArray));

// Load
const alarms = JSON.parse(localStorage.getItem('alarms') || '[]');
```

**Type:** `Array<AlarmObject>`  
**Default:** Empty array or 10 default alarms

**AlarmObject Structure:**
```typescript
interface Alarm {
  id: number;                    // 0-9 (unique)
  hour: number;                  // 0-23
  minute: number;                // 0-59
  enabled: boolean;              // true/false
  questionsToAnswer: number;     // 1-30
  repeat: number[];              // [1,1,1,1,1,0,0] Mon-Sun
}
```

**Example:**
```json
[
  {
    "id": 0,
    "hour": 8,
    "minute": 0,
    "enabled": true,
    "questionsToAnswer": 5,
    "repeat": [1, 1, 1, 1, 1, 0, 0]
  }
]
```

---

#### Questions Array

```javascript
// Save
localStorage.setItem('questions', JSON.stringify(questionsArray));

// Load
const questions = JSON.parse(localStorage.getItem('questions') || '[]');
```

**Type:** `Array<QuestionObject>`  
**Default:** 30 default questions  
**Max Length:** 30

**QuestionObject Structure:**
```typescript
interface Question {
  id: number;           // 0-29 (unique)
  text: string;         // Question text (max 100 chars recommended)
  yesPoints: number;    // Points for YES answer
  noPoints: number;     // Points for NO answer (usually negative)
}
```

**Example:**
```json
[
  {
    "id": 0,
    "text": "Did you exercise today?",
    "yesPoints": 10,
    "noPoints": -5
  },
  {
    "id": 1,
    "text": "Did you drink 8 glasses of water?",
    "yesPoints": 15,
    "noPoints": -3
  }
]
```

---

#### History Array

```javascript
// Save
localStorage.setItem('history', JSON.stringify(historyArray));

// Load
const history = JSON.parse(localStorage.getItem('history') || '[]');
```

**Type:** `Array<HistoryEntry>`  
**Default:** Empty array  
**Recommended Max:** 100 entries (for performance)

**HistoryEntry Structure:**
```typescript
interface HistoryEntry {
  timestamp: number;    // Unix timestamp in milliseconds
  action: string;       // Description (max 50 chars recommended)
  points: number;       // Point change (positive or negative)
}
```

**Example:**
```json
[
  {
    "timestamp": 1733347200000,
    "action": "Did you exercise today?",
    "points": 10
  },
  {
    "timestamp": 1733347260000,
    "action": "Redeemed",
    "points": -1000
  }
]
```

---

#### Sync Settings

```javascript
// Sync Enabled
localStorage.setItem('sync_enabled', 'true'); // or 'false'
const syncEnabled = localStorage.getItem('sync_enabled') === 'true';

// Server URL
localStorage.setItem('server_url', 'https://api.example.com');
const serverUrl = localStorage.getItem('server_url') || '';
```

**sync_enabled Type:** `boolean` (stored as string)  
**server_url Type:** `string`  
**Default:** `false`, empty string

---

## Server Sync API

### Endpoint: POST /api/sync-balance

**Description:** Sync watch balance with server

**Request:**
```http
POST /api/sync-balance HTTP/1.1
Host: your-server.com
Content-Type: application/json

{
  "deviceId": "amazfit_balance_1733347200000",
  "balance": 1250,
  "timestamp": 1733347200000,
  "history": [
    {
      "timestamp": 1733347200000,
      "action": "Question answered",
      "points": 10
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "serverBalance": 1250,
  "synced": true,
  "timestamp": 1733347200000
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Database error",
  "code": "DB_ERROR"
}
```

**Implementation (Watch Side):**
```javascript
function syncBalance() {
  const syncEnabled = localStorage.getItem('sync_enabled') === 'true';
  const serverUrl = localStorage.getItem('server_url');
  
  if (!syncEnabled || !serverUrl) return;
  
  const balance = parseInt(localStorage.getItem('balance') || '0');
  const historyStr = localStorage.getItem('history');
  const history = historyStr ? JSON.parse(historyStr) : [];
  
  const payload = {
    deviceId: 'amazfit_balance_' + Date.now(),
    balance: balance,
    timestamp: Date.now(),
    history: history.slice(0, 10) // Last 10 entries only
  };
  
  fetch(serverUrl + '/api/sync-balance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Sync successful:', data);
    } else {
      console.error('Sync failed:', data.error);
    }
  })
  .catch(err => {
    console.error('Network error:', err);
  });
}
```

---

## Router API

### Navigation Between Pages

```javascript
import { push, back, replace } from '@zos/router';

// Navigate to page
push({ url: 'page/alarms.page' });

// Go back
back();

// Replace current page
replace({ url: 'page/index.page' });
```

**Available Pages:**
- `page/index.page` - Dashboard
- `page/alarms.page` - Alarm list
- `page/history.page` - Points history
- `page/settings.page` - Settings
- `page/alarm-trigger.page` - Alarm dismissal
- `page/questions.page` - Question browser

---

## UI Components

### Buttons

```javascript
import { createWidget, widget } from '@zos/ui';

createWidget(widget.BUTTON, {
  x: 83,           // X position
  y: 300,          // Y position
  w: 300,          // Width
  h: 50,           // Height
  text: 'Click Me',
  text_size: 20,
  normal_color: 0x21808D,    // Teal
  press_color: 0x1D7480,     // Dark teal
  radius: 8,                 // Border radius
  click_func: () => {
    // Handle click
  }
});
```

### Text Labels

```javascript
import { createWidget, widget, align } from '@zos/ui';

createWidget(widget.TEXT, {
  x: 0,
  y: 100,
  w: 466,        // Full width for Amazfit Balance
  h: 50,
  text: 'Hello World',
  text_size: 28,
  color: 0xFFFFFF,  // White
  align_h: align.CENTER_H,
  align_v: align.CENTER_V
});
```

### Fill Rectangles (Backgrounds)

```javascript
createWidget(widget.FILL_RECT, {
  x: 0,
  y: 0,
  w: 466,
  h: 466,
  color: 0x000000,  // Black
  radius: 8         // Optional: rounded corners
});
```

---

## Vibration API

```javascript
import { Vibrator } from '@zos/sensor';

const vibrator = new Vibrator();

// Start vibration
vibrator.start();

// Stop vibration
vibrator.stop();

// Pattern: vibrate for 500ms
vibrator.start();
setTimeout(() => vibrator.stop(), 500);

// Interval: vibrate every second
const interval = setInterval(() => {
  vibrator.start();
  setTimeout(() => vibrator.stop(), 500);
}, 1000);

// Stop interval
clearInterval(interval);
```

---

## Toast Notifications

```javascript
import { showToast } from '@zos/interaction';

// Simple toast
showToast({ text: 'Hello!' });

// Success message
showToast({ text: 'Saved!' });

// Error message
showToast({ text: 'Failed!' });
```

---

## Color Constants

### App Theme Colors

```javascript
const COLORS = {
  // Primary
  PRIMARY: 0x32B8C6,      // Teal
  PRIMARY_DARK: 0x21808D,
  PRIMARY_DARKER: 0x1D7480,
  
  // Success/Error
  SUCCESS: 0x21C090,      // Green
  ERROR: 0xC0152F,        // Red
  
  // Neutrals
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  GRAY_LIGHT: 0xA7A9A9,
  GRAY: 0x777C7C,
  GRAY_DARK: 0x262828
};
```

### Usage

```javascript
createWidget(widget.TEXT, {
  color: COLORS.PRIMARY,
  // ...
});
```

---

## Utilities

### Format Time

```javascript
function formatTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Usage
formatTime(8, 5);  // "08:05"
formatTime(14, 30); // "14:30"
```

### Format Currency

```javascript
function formatTND(points, rate = 0.001) {
  return (points * rate).toFixed(3) + ' TND';
}

// Usage
formatTND(1250);      // "1.250 TND"
formatTND(1250, 0.002); // "2.500 TND"
```

### Shuffle Array

```javascript
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Usage
const questions = shuffleArray(allQuestions);
```

---

## Best Practices

### Error Handling

```javascript
try {
  const data = JSON.parse(localStorage.getItem('key'));
  // Use data
} catch (e) {
  console.log('Error:', e);
  // Use default value
}
```

### Performance

```javascript
// ✅ Good: Cache localStorage reads
const balance = parseInt(localStorage.getItem('balance') || '0');

// ❌ Bad: Multiple reads
if (localStorage.getItem('balance')) {
  const bal = parseInt(localStorage.getItem('balance'));
}
```

### Memory Management

```javascript
// Limit history size
if (history.length > 100) {
  history = history.slice(0, 100);
  localStorage.setItem('history', JSON.stringify(history));
}
```

---

## Testing

### Manual Testing Checklist

- [ ] App launches without errors
- [ ] Dashboard shows correct balance
- [ ] Alarms can be toggled ON/OFF
- [ ] Alarm trigger fires at correct time
- [ ] Questions display correctly
- [ ] Points update after answers
- [ ] History shows transactions
- [ ] Reset clears balance
- [ ] Redeem works (min 1000 pts)
- [ ] Settings toggle sync
- [ ] Vibration stops after questions

### Debug Logging

```javascript
// Add to page functions
console.log('Balance:', balance);
console.log('Questions:', questions);
console.log('History:', history);

// View logs
zeus dev  // In development mode
```

---

**For more details, see [README.md](../README.md)**
