/**
 * Alarm engine utility
 * Manages alarm scheduling and triggering logic
 */

import { setAlarm, cancelAlarm, getAllAlarms } from '@zos/alarm';
import { push } from '@zos/router';
import { getStorage } from './storage';

class AlarmEngine {
  constructor() {
    this.storage = getStorage();
    this.activeAlarms = new Map();
  }

  /**
   * Initialize all enabled alarms
   */
  initializeAlarms() {
    const alarms = this.storage.get('alarms', []);
    
    alarms.forEach(alarm => {
      if (alarm.enabled) {
        this.scheduleAlarm(alarm);
      }
    });
  }

  /**
   * Schedule a single alarm
   * @param {object} alarm - Alarm configuration
   * @returns {boolean} Success status
   */
  scheduleAlarm(alarm) {
    try {
      // Cancel existing alarm if any
      if (this.activeAlarms.has(alarm.id)) {
        this.cancelAlarm(alarm.id);
      }

      const alarmId = setAlarm({
        hour: alarm.hour,
        minute: alarm.minute,
        repeat: alarm.repeat,
        callback: () => this.triggerAlarm(alarm.id)
      });

      this.activeAlarms.set(alarm.id, alarmId);
      console.log(`Alarm ${alarm.id} scheduled for ${alarm.hour}:${alarm.minute}`);
      return true;
    } catch (error) {
      console.error(`Failed to schedule alarm ${alarm.id}:`, error);
      return false;
    }
  }

  /**
   * Cancel a specific alarm
   * @param {number} alarmId - Alarm ID
   * @returns {boolean} Success status
   */
  cancelAlarm(alarmId) {
    try {
      if (this.activeAlarms.has(alarmId)) {
        const systemAlarmId = this.activeAlarms.get(alarmId);
        cancelAlarm(systemAlarmId);
        this.activeAlarms.delete(alarmId);
        console.log(`Alarm ${alarmId} cancelled`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to cancel alarm ${alarmId}:`, error);
      return false;
    }
  }

  /**
   * Cancel all alarms
   */
  cancelAllAlarms() {
    this.activeAlarms.forEach((systemAlarmId, alarmId) => {
      try {
        cancelAlarm(systemAlarmId);
        console.log(`Alarm ${alarmId} cancelled`);
      } catch (error) {
        console.error(`Failed to cancel alarm ${alarmId}:`, error);
      }
    });
    this.activeAlarms.clear();
  }

  /**
   * Trigger alarm (called when alarm time arrives)
   * @param {number} alarmId - Alarm ID
   */
  triggerAlarm(alarmId) {
    console.log(`Alarm ${alarmId} triggered`);
    
    // Navigate to alarm trigger page
    try {
      push({
        url: 'page/alarm-trigger',
        params: { alarmId: alarmId }
      });
    } catch (error) {
      console.error(`Failed to navigate to alarm trigger:`, error);
    }
  }

  /**
   * Update alarm configuration
   * @param {number} alarmId - Alarm ID
   * @param {object} updates - Updated alarm properties
   * @returns {boolean} Success status
   */
  updateAlarm(alarmId, updates) {
    try {
      const alarms = this.storage.get('alarms', []);
      const alarmIndex = alarms.findIndex(a => a.id === alarmId);
      
      if (alarmIndex === -1) {
        console.error(`Alarm ${alarmId} not found`);
        return false;
      }

      // Update alarm properties
      Object.assign(alarms[alarmIndex], updates);
      this.storage.set('alarms', alarms);

      // Reschedule if enabled
      if (alarms[alarmIndex].enabled) {
        this.scheduleAlarm(alarms[alarmIndex]);
      } else {
        this.cancelAlarm(alarmId);
      }

      return true;
    } catch (error) {
      console.error(`Failed to update alarm ${alarmId}:`, error);
      return false;
    }
  }

  /**
   * Toggle alarm enabled state
   * @param {number} alarmId - Alarm ID
   * @returns {boolean} New enabled state
   */
  toggleAlarm(alarmId) {
    const alarms = this.storage.get('alarms', []);
    const alarm = alarms.find(a => a.id === alarmId);
    
    if (!alarm) {
      console.error(`Alarm ${alarmId} not found`);
      return false;
    }

    alarm.enabled = !alarm.enabled;
    this.storage.set('alarms', alarms);

    if (alarm.enabled) {
      this.scheduleAlarm(alarm);
    } else {
      this.cancelAlarm(alarmId);
    }

    return alarm.enabled;
  }

  /**
   * Get all alarms
   * @returns {Array} Array of alarms
   */
  getAllAlarms() {
    return this.storage.get('alarms', []);
  }

  /**
   * Get active alarms count
   * @returns {number} Active alarms count
   */
  getActiveAlarmsCount() {
    const alarms = this.getAllAlarms();
    return alarms.filter(a => a.enabled).length;
  }
}

// Singleton instance
let engineInstance = null;

/**
 * Get alarm engine instance
 * @returns {AlarmEngine} Alarm engine instance
 */
export function getAlarmEngine() {
  if (!engineInstance) {
    engineInstance = new AlarmEngine();
  }
  return engineInstance;
}

// Convenience exports
export const initializeAlarms = () => {
  return getAlarmEngine().initializeAlarms();
};

export const scheduleAlarm = (alarm) => {
  return getAlarmEngine().scheduleAlarm(alarm);
};

export const toggleAlarm = (alarmId) => {
  return getAlarmEngine().toggleAlarm(alarmId);
};
