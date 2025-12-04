/**
 * User data model
 * Handles user balance and history operations
 */

const { getDatabase } = require('./database');

/**
 * Save or update user balance
 */
function saveBalance(deviceId, balance, timestamp) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const ts = timestamp || Date.now();

    db.run(
      `INSERT INTO users (device_id, balance, last_sync)
       VALUES (?, ?, ?)
       ON CONFLICT(device_id) DO UPDATE SET
       balance = excluded.balance,
       last_sync = excluded.last_sync`,
      [deviceId, balance, ts],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Save history entry
 */
function saveHistory(deviceId, historyEntry) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const { action, points, timestamp } = historyEntry;

    db.run(
      `INSERT INTO history (device_id, action, points, timestamp)
       VALUES (?, ?, ?, ?)`,
      [deviceId, action, points, timestamp || Date.now()],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Get user data including balance and history
 */
function getUserData(deviceId) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    // Get user balance
    db.get(
      'SELECT * FROM users WHERE device_id = ?',
      [deviceId],
      (err, user) => {
        if (err) {
          reject(err);
          return;
        }

        if (!user) {
          resolve(null);
          return;
        }

        // Get user history
        db.all(
          'SELECT * FROM history WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100',
          [deviceId],
          (err, history) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                deviceId: user.device_id,
                balance: user.balance,
                lastSync: user.last_sync,
                createdAt: user.created_at,
                history: history
              });
            }
          }
        );
      }
    );
  });
}

/**
 * Get all users
 */
function getAllUsers() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    db.all('SELECT * FROM users ORDER BY last_sync DESC', (err, users) => {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  });
}

module.exports = {
  saveBalance,
  saveHistory,
  getUserData,
  getAllUsers
};
