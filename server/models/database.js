/**
 * Database initialization and management
 * Using SQLite for persistence
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/productivity.db';
let db = null;

/**
 * Initialize database connection and create tables
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        reject(err);
        return;
      }

      console.log('✓ Connected to SQLite database');

      // Create tables
      db.serialize(() => {
        // Users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            device_id TEXT PRIMARY KEY,
            balance INTEGER DEFAULT 0,
            last_sync INTEGER,
            created_at INTEGER DEFAULT (strftime('%s', 'now'))
          )
        `, (err) => {
          if (err) console.error('Error creating users table:', err);
          else console.log('✓ Users table ready');
        });

        // History table
        db.run(`
          CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            action TEXT NOT NULL,
            points INTEGER NOT NULL,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (device_id) REFERENCES users(device_id)
          )
        `, (err) => {
          if (err) console.error('Error creating history table:', err);
          else console.log('✓ History table ready');
        });

        // Config table
        db.run(`
          CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at INTEGER DEFAULT (strftime('%s', 'now'))
          )
        `, (err) => {
          if (err) {
            console.error('Error creating config table:', err);
            reject(err);
          } else {
            console.log('✓ Config table ready');
            
            // Initialize default config
            initializeDefaultConfig()
              .then(() => resolve())
              .catch(reject);
          }
        });
      });
    });
  });
}

/**
 * Initialize default configuration
 */
function initializeDefaultConfig() {
  return new Promise((resolve, reject) => {
    const defaultConfig = {
      tndRate: process.env.DEFAULT_TND_RATE || '0.001',
      questions: JSON.stringify(generateDefaultQuestions())
    };

    const stmt = db.prepare('INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)');
    
    stmt.run('tndRate', defaultConfig.tndRate);
    stmt.run('questions', defaultConfig.questions, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✓ Default config initialized');
        resolve();
      }
    });
    
    stmt.finalize();
  });
}

/**
 * Generate default questions
 */
function generateDefaultQuestions() {
  const questions = [];
  const templates = [
    'Did you complete your morning routine?',
    'Did you exercise today?',
    'Did you drink enough water?',
    'Did you study/work for your goals?',
    'Did you take breaks during work?',
    'Did you eat healthy meals?',
    'Did you avoid procrastination?',
    'Did you help someone today?',
    'Did you learn something new?',
    'Did you maintain good posture?'
  ];

  for (let i = 0; i < 30; i++) {
    questions.push({
      id: i,
      text: templates[i % templates.length] || `Did you complete task ${i + 1}?`,
      yesPoints: 10,
      noPoints: -5
    });
  }

  return questions;
}

/**
 * Get database instance
 */
function getDatabase() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
};
