# Zepp OS Productivity Alarm App

Productivity-focused alarm app for **Amazfit Balance** built with the latest **Zepp OS SDK**, allowing:

- Multiple alarms per day
- Each alarm requires answering a configurable number of **yes/no questions** to stop
- Up to **30 configurable questions**, edited from the **Zepp mobile app**
- Each answer affects a **points balance** (add or subtract points)
- In-app balance displayed in **points + TND equivalent** (rate set from Zepp App/server)
- **History view** of point changes with **reset** and **redeem** actions
- Redeem allowed only in **multiples of 1000 points** (min 1000)
- Optional sync of balance & history with an **external server**

---

## 1. Project Structure

```bash
zepp-productivity-alarm/
├── app.json                  # Zepp OS app manifest
├── page/
│   ├── index.js              # Dashboard: balance, TND value, navigation
│   ├── alarms.js             # Alarm list / enable-disable
│   ├── questions.js          # Question browser (watch view)
│   ├── history.js            # Points history + reset/redeem
│   ├── settings.js           # Local settings summary (read-only, configured via Zepp App / server)
│   └── alarm-trigger.js      # Alarm firing screen + question answering + vibration logic
├── utils/
│   ├── storage.js            # Local persistence (balance, history, questions, alarms, settings)
│   ├── sync.js               # HTTP sync with external server
│   └── alarm-engine.js       # Alarm scheduling/triggering abstraction
└── server/                   # External sync backend (Node.js + SQLite)
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── models/
    │   ├── database.js
    │   ├── user.js
    │   └── config.js
    └── routes/
        ├── sync.js
        └── config.js
```

> Note: The watch app is pure Zepp OS JS code. The `server/` directory contains a reference backend implementation you can deploy anywhere (VPS, Raspberry Pi, etc.) to support balance/history sync.

---

## 2. Zepp OS App – Functional Overview

### 2.1 Alarms & Questions Flow

- You can define **multiple alarms per day** (stored in `utils/storage.js` → `alarms` array).
- Each alarm has:
  - `hour`, `minute`
  - `enabled`
  - `repeat` (Mon–Sun mask)
  - `questionsToAnswer` (how many questions must be answered to stop that alarm)
- There are **up to 30 questions** in total, shared by all alarms:
  - Each question has: `text`, `yesPoints`, `noPoints`.
  - Questions are **configured from Zepp App / backend** and synced to the watch.

**When an alarm fires:**
1. `alarm-engine.js` routes to `page/alarm-trigger.js`.
2. `alarm-trigger.js`:
   - Starts vibration that **keeps repeating up to 5 minutes**.
   - Randomly picks `questionsToAnswer` questions from the 30 pool.
   - Shows **one question at a time** with **YES / NO buttons**.
3. Each answer:
   - Adds `yesPoints` or `noPoints` to `balance`.
   - Writes an entry to `history` (local storage).
   - Optionally calls `utils/sync.js` to push the update to the remote server.
4. Once the required number of questions for that alarm is answered:
   - Vibration stops.
   - The alarm view exits.

### 2.2 Points, Redeem & TND Conversion

- `balance` is stored as an integer number of **points**.
- `tnd_rate` defines the value of 1 point in **TND**.
- The **main page (`index.js`)** shows:
  - `Points: <balance>`
  - `≈ <balance * tnd_rate> TND`
- **History page (`history.js`)**:
  - Shows last operations (answers, redeem, reset).
  - Has **Reset** and **Redeem** buttons.
  - **Redeem logic**:
    - Only enabled if `balance >= 1000`.
    - Redeemable amount = `floor(balance / 1000) * 1000`.
    - After redeem, that amount is subtracted from balance and written to history.

### 2.3 Sync with External Server

- Sync is abstracted in `utils/sync.js` using `@zos/http`.
- Settings used:
  - `server_url` – base URL of your backend (e.g. `https://your.domain.com`).
  - `sync_enabled` – boolean flag to allow/deny sync.
- Main operations:
  - `syncBalance(balance, historyEntry)` – send latest balance and last history entry.
  - `syncFullHistory()` – send full local history + balance.
  - `fetchServerConfig()` – pull configuration (TND rate, questions, etc.) from server.

The included backend implements:

- `POST /api/sync/balance` – lightweight push of balance + single history entry.
- `POST /api/sync/full` – sync full history.
- `GET /api/config` – get current config (TND rate, questions...).
- `PUT /api/config` – update config.
- `GET /api/config/questions` / `PUT /api/config/questions` – manage question list (max 30).

> On the Zepp side we assume the Zepp mobile app or a companion management UI talks to this backend to change questions, TND rate, etc., which are then periodically pulled to the watch.

---

## 3. Zepp OS Side – Compilation & Installation

### 3.1 Prerequisites

- Latest **Zepp OS Developer** environment installed (CLI + IDE).
- Zepp OS SDK compatible with **Amazfit Balance** (Zepp OS 2.x+).
- Node.js ≥ 18 installed on your dev machine (for tooling + backend).

### 3.2 Project Setup

```bash
# Clone the repo
git clone https://github.com/MarvenAPPS/zepp-productivity-alarm.git
cd zepp-productivity-alarm
```

If you use **Zepp OS IDE**:

1. Open the folder as a Zepp OS project.
2. Confirm `app.json` is recognized and target is set to **Amazfit Balance**.
3. Run "Build" from the IDE to generate the `.mpkg`.

If you use **Zepp CLI** (example):

```bash
# Inside project root
zeus build
# or
npm run build   # if you configure a wrapper script
```

> Depending on Zepp OS SDK version, the actual CLI command name can differ (`zeus`, `zepp`, etc.). Use the current official docs for your environment.

### 3.3 Installing on Amazfit Balance

1. Ensure your Amazfit Balance is **paired** with Zepp mobile app.
2. In Zepp OS IDE, use the **Run on Device** option, or:
3. Export the built `.mpkg` and install it using the provided Zepp debugging tools.

Refer to the official Zepp documentation for the exact sideload procedure as it can change between SDK versions.

---

## 4. Backend Server – Setup, Run & Integration

The backend is a standard Node.js + Express app with SQLite persistence and a simple REST API.

### 4.1 Requirements

- Node.js ≥ 18
- npm or pnpm/yarn

### 4.2 Installation

```bash
cd server
cp .env.example .env
# Edit .env as needed (PORT, DB_PATH, DEFAULT_TND_RATE, etc.)

npm install
```

### 4.3 Running the Server

```bash
# Development (with auto-restart)
npm run dev

# or production
npm start
```

By default the server listens on `PORT` from `.env` (default 3000).

Health check:

```bash
curl http://localhost:3000/health
```

You should get:

```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 12.34
}
```

### 4.4 Endpoints Summary

- `GET /` – API root + description
- `GET /health` – health check

**Sync:**

- `POST /api/sync/balance`
- `POST /api/sync/full`
- `GET  /api/sync/data/:deviceId`

**Config:**

- `GET  /api/config`
- `PUT  /api/config`
- `GET  /api/config/questions`
- `PUT  /api/config/questions`

### 4.5 Wiring Watch App to Backend

On the watch, in your **Zepp App / server config flow**, set:

- `server_url` to your deployed server, e.g.
  - `https://productivity.alarm.yourdomain.com`
- `sync_enabled` to `true` when you are ready.

The code already:

- Uses `syncBalance()` whenever you answer a question or redeem.
- Provides `syncFullHistory()` for manual or periodic full sync (you can trigger this in future updates from a dedicated menu or background task).

---

## 5. Data Model Details

### 5.1 Watch Side Storage (`utils/storage.js`)

**Keys:**

- `balance: number` – total points.
- `history: HistoryEntry[]` – list of point operations.
- `questions: Question[]` – up to 30 questions.
- `alarms: AlarmConfig[]` – alarms configuration.
- `tnd_rate: number` – conversion rate.
- `sync_enabled: boolean` – server sync flag.
- `server_url: string` – backend base URL.
- `vibration_duration: number` – total vibration duration in ms (default 300000).
- `device_id: string` – locally generated ID used by backend.
- `last_sync: number` – last sync timestamp.

**Types (logical):**

```ts
interface Question {
  id: number;
  text: string;
  yesPoints: number;
  noPoints: number;
}

interface AlarmConfig {
  id: number;
  hour: number;      // 0–23
  minute: number;    // 0–59
  enabled: boolean;
  repeat: number[];  // 7-length array, 1 = enabled, 0 = disabled
  questionsToAnswer: number; // how many questions this alarm requires
}

interface HistoryEntry {
  timestamp: number; // ms since epoch
  action: string;    // textual description ("Answered: ...", "Redeemed", "Reset")
  points: number;    // delta, can be negative
}
```

### 5.2 Backend Database (`server/models/*`)

SQLite tables:

- `users` – per-device balance and metadata.
- `history` – per-device history entries.
- `config` – global configuration (TND rate, questions, etc.).

Initial default questions are generated by `generateDefaultQuestions()` in `database.js`, with sensible habits/tasks.

---

## 6. Usage Scenarios

### 6.1 Daily Use

1. Configure alarms via Zepp App or server-side tooling.
2. Configure up to 30 questions and their **Yes/No point values**.
3. When an alarm fires:
   - Watch vibrates continuously (patterned) up to 5 minutes.
   - You have to answer `questionsToAnswer` yes/no questions.
4. Each answer adjusts your point balance.
5. Check the **History** page to see what contributed to the balance.
6. Once you reach **≥ 1000 points**, use **Redeem** to convert in chunks of 1000.

### 6.2 Server-Assisted Coaching

- Use the backend to:
  - Track balances for multiple devices.
  - Generate reports and dashboards per user.
  - Adjust TND rate and questions centrally.
- Ship a web admin UI that talks to the same backend (out of scope here, but API-ready).

---

## 7. Extensibility Notes

- You can:
  - Add **per-alarm question sets** or weights.
  - Extend history entries with **tags** (e.g. "health", "work").
  - Implement **background sync** or scheduled full syncs.
  - Add more screens (e.g. streak tracker, weekly summaries).

The current implementation is structured to keep **watch-side logic clean and testable**, while delegating heavy analytics and long-term storage to your external server.
