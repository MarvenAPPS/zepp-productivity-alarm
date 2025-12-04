/**
 * Configuration model
 * Handles app configuration storage and retrieval
 */

const { getDatabase } = require('./database');

/**
 * Get configuration
 */
function getConfig() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    db.all('SELECT key, value FROM config', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const config = {};
      rows.forEach(row => {
        try {
          // Try to parse as JSON
          config[row.key] = JSON.parse(row.value);
        } catch (e) {
          // If not JSON, use as string
          config[row.key] = row.value;
        }
      });

      // Convert tndRate to number
      if (config.tndRate) {
        config.tndRate = parseFloat(config.tndRate);
      }

      resolve(config);
    });
  });
}

/**
 * Update configuration
 */
function updateConfig(updates) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO config (key, value, updated_at)
      VALUES (?, ?, strftime('%s', 'now'))
      ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = excluded.updated_at
    `);

    const promises = [];

    for (const [key, value] of Object.entries(updates)) {
      const serialized = typeof value === 'object' 
        ? JSON.stringify(value) 
        : String(value);

      promises.push(new Promise((res, rej) => {
        stmt.run([key, serialized], (err) => {
          if (err) rej(err);
          else res();
        });
      }));
    }

    Promise.all(promises)
      .then(() => {
        stmt.finalize();
        resolve();
      })
      .catch(reject);
  });
}

/**
 * Get specific config value
 */
function getConfigValue(key) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    db.get('SELECT value FROM config WHERE key = ?', [key], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (!row) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(row.value));
      } catch (e) {
        resolve(row.value);
      }
    });
  });
}

module.exports = {
  getConfig,
  updateConfig,
  getConfigValue
};
