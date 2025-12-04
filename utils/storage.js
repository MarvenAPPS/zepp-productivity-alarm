/**
 * Storage utility module for persistent data management
 * Uses Zepp OS localStorage API
 */

import { localStorage } from '@zos/storage';

class StorageManager {
  constructor() {
    this.storage = localStorage;
  }

  /**
   * Get value from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const value = this.storage.getItem(key);
      if (value === null || value === undefined) {
        return defaultValue;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Set value in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove value from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  has(key) {
    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      console.error(`Storage has error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all keys
   * @returns {string[]} Array of keys
   */
  keys() {
    try {
      const keys = [];
      const length = this.storage.length;
      for (let i = 0; i < length; i++) {
        keys.push(this.storage.key(i));
      }
      return keys;
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }
}

// Singleton instance
let storageInstance = null;

/**
 * Get storage manager instance
 * @returns {StorageManager} Storage manager instance
 */
export function getStorage() {
  if (!storageInstance) {
    storageInstance = new StorageManager();
  }
  return storageInstance;
}

/**
 * Initialize default data structure
 */
export function initializeDefaultData() {
  const storage = getStorage();
  
  // Initialize balance if not exists
  if (!storage.has('balance')) {
    storage.set('balance', 0);
  }
  
  // Initialize history if not exists
  if (!storage.has('history')) {
    storage.set('history', []);
  }
  
  // Initialize questions if not exists
  if (!storage.has('questions')) {
    const defaultQuestions = [];
    for (let i = 0; i < 30; i++) {
      defaultQuestions.push({
        id: i,
        text: `Did you complete task ${i + 1}?`,
        yesPoints: 10,
        noPoints: -5
      });
    }
    storage.set('questions', defaultQuestions);
  }
  
  // Initialize alarms if not exists
  if (!storage.has('alarms')) {
    const defaultAlarms = [];
    for (let i = 0; i < 10; i++) {
      defaultAlarms.push({
        id: i,
        hour: 8,
        minute: 0,
        enabled: false,
        questionsToAnswer: 5,
        repeat: [1, 1, 1, 1, 1, 0, 0] // Mon-Fri
      });
    }
    storage.set('alarms', defaultAlarms);
  }
  
  // Initialize settings if not exists
  if (!storage.has('tnd_rate')) {
    storage.set('tnd_rate', 0.001); // 1 point = 0.001 TND
  }
  
  if (!storage.has('sync_enabled')) {
    storage.set('sync_enabled', false);
  }
  
  if (!storage.has('server_url')) {
    storage.set('server_url', '');
  }
  
  if (!storage.has('vibration_duration')) {
    storage.set('vibration_duration', 300000); // 5 minutes
  }
}
