/**
 * Server synchronization utility
 * Handles communication with external server for balance and history sync
 */

import { request } from '@zos/http';
import { getStorage } from './storage';

class SyncManager {
  constructor() {
    this.storage = getStorage();
    this.syncing = false;
  }

  /**
   * Get server configuration
   * @returns {object} Server config
   */
  getServerConfig() {
    return {
      url: this.storage.get('server_url', ''),
      enabled: this.storage.get('sync_enabled', false)
    };
  }

  /**
   * Check if sync is enabled
   * @returns {boolean} Sync enabled status
   */
  isSyncEnabled() {
    const config = this.getServerConfig();
    return config.enabled && config.url !== '';
  }

  /**
   * Sync balance update with server
   * @param {number} balance - Current balance
   * @param {object} historyEntry - Latest history entry
   * @returns {Promise<boolean>} Success status
   */
  async syncBalance(balance, historyEntry) {
    if (!this.isSyncEnabled() || this.syncing) {
      return false;
    }

    this.syncing = true;
    const config = this.getServerConfig();

    try {
      const response = await request({
        method: 'POST',
        url: `${config.url}/api/sync/balance`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance: balance,
          history: historyEntry,
          timestamp: Date.now(),
          deviceId: this.getDeviceId()
        }),
        timeout: 10000
      });

      if (response.statusCode === 200) {
        console.log('Balance synced successfully');
        this.storage.set('last_sync', Date.now());
        return true;
      } else {
        console.error('Sync failed with status:', response.statusCode);
        return false;
      }
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Sync full history with server
   * @returns {Promise<boolean>} Success status
   */
  async syncFullHistory() {
    if (!this.isSyncEnabled() || this.syncing) {
      return false;
    }

    this.syncing = true;
    const config = this.getServerConfig();

    try {
      const history = this.storage.get('history', []);
      const balance = this.storage.get('balance', 0);

      const response = await request({
        method: 'POST',
        url: `${config.url}/api/sync/full`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          balance: balance,
          history: history,
          timestamp: Date.now(),
          deviceId: this.getDeviceId()
        }),
        timeout: 15000
      });

      if (response.statusCode === 200) {
        console.log('Full history synced successfully');
        this.storage.set('last_sync', Date.now());
        return true;
      } else {
        console.error('Full sync failed with status:', response.statusCode);
        return false;
      }
    } catch (error) {
      console.error('Full sync error:', error);
      return false;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Fetch configuration from server
   * @returns {Promise<object|null>} Server configuration or null
   */
  async fetchServerConfig() {
    if (!this.isSyncEnabled() || this.syncing) {
      return null;
    }

    this.syncing = true;
    const config = this.getServerConfig();

    try {
      const response = await request({
        method: 'GET',
        url: `${config.url}/api/config`,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.statusCode === 200) {
        const data = JSON.parse(response.body);
        
        // Update local settings from server
        if (data.tndRate) {
          this.storage.set('tnd_rate', data.tndRate);
        }
        
        if (data.questions) {
          this.storage.set('questions', data.questions);
        }
        
        console.log('Server config fetched successfully');
        return data;
      } else {
        console.error('Fetch config failed with status:', response.statusCode);
        return null;
      }
    } catch (error) {
      console.error('Fetch config error:', error);
      return null;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Get device identifier
   * @returns {string} Device ID
   */
  getDeviceId() {
    let deviceId = this.storage.get('device_id', null);
    if (!deviceId) {
      // Generate unique device ID
      deviceId = `amazfit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.storage.set('device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Get last sync timestamp
   * @returns {number|null} Last sync timestamp or null
   */
  getLastSyncTime() {
    return this.storage.get('last_sync', null);
  }
}

// Singleton instance
let syncInstance = null;

/**
 * Get sync manager instance
 * @returns {SyncManager} Sync manager instance
 */
export function getSyncManager() {
  if (!syncInstance) {
    syncInstance = new SyncManager();
  }
  return syncInstance;
}

// Convenience exports
export const syncBalance = (balance, historyEntry) => {
  return getSyncManager().syncBalance(balance, historyEntry);
};

export const syncFullHistory = () => {
  return getSyncManager().syncFullHistory();
};

export const fetchServerConfig = () => {
  return getSyncManager().fetchServerConfig();
};
