/**
 * App Lifecycle Management
 * Handles app initialization and global state
 */

import { initializeDefaultData } from './utils/storage';
import { initializeAlarms } from './utils/alarm-engine';

App({
  globalData: {
    appVersion: '1.0.0',
    apiLevel: '4.2'
  },

  onCreate(options) {
    console.log('App onCreate');
    
    // Initialize default data structure
    initializeDefaultData();
    
    // Initialize and schedule enabled alarms
    initializeAlarms();
    
    console.log('App initialized successfully');
  },

  onDestroy(options) {
    console.log('App onDestroy');
  }
});
