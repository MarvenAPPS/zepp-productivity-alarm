/**
 * Settings Page
 * View app settings (TND rate, sync status)
 */

import { createWidget, widget, align } from '@zos/ui';
import { back } from '@zos/router';
import { localStorage } from '@zos/storage';
import { showToast } from '@zos/interaction';

Page({
  state: {
    tndRate: 0.001,
    syncEnabled: false,
    serverUrl: ''
  },

  build() {
    this.loadSettings();
    this.renderUI();
  },

  loadSettings() {
    try {
      const rateStr = localStorage.getItem('tnd_rate');
      this.state.tndRate = rateStr ? parseFloat(rateStr) : 0.001;
      
      const syncStr = localStorage.getItem('sync_enabled');
      this.state.syncEnabled = syncStr === 'true';
      
      this.state.serverUrl = localStorage.getItem('server_url') || '';
    } catch (e) {
      console.log('Error loading settings:', e);
    }
  },

  renderUI() {
    // Background
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 466,
      h: 466,
      color: 0x000000
    });

    // Title
    createWidget(widget.TEXT, {
      x: 0,
      y: 20,
      w: 466,
      h: 50,
      text: 'Settings',
      text_size: 28,
      color: 0x32B8C6,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Back Button
    createWidget(widget.BUTTON, {
      x: 20,
      y: 20,
      w: 60,
      h: 40,
      text: '<',
      text_size: 24,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => back()
    });

    // TND Rate
    createWidget(widget.TEXT, {
      x: 30,
      y: 90,
      w: 406,
      h: 30,
      text: 'TND Conversion Rate',
      text_size: 18,
      color: 0xFFFFFF
    });

    createWidget(widget.TEXT, {
      x: 30,
      y: 120,
      w: 406,
      h: 40,
      text: `1 point = ${this.state.tndRate} TND`,
      text_size: 16,
      color: 0xA7A9A9
    });

    // Server Sync
    createWidget(widget.TEXT, {
      x: 30,
      y: 180,
      w: 250,
      h: 30,
      text: 'Server Sync',
      text_size: 18,
      color: 0xFFFFFF
    });

    createWidget(widget.BUTTON, {
      x: 300,
      y: 175,
      w: 120,
      h: 40,
      text: this.state.syncEnabled ? 'ON' : 'OFF',
      text_size: 16,
      normal_color: this.state.syncEnabled ? 0x21C090 : 0x777C7C,
      press_color: this.state.syncEnabled ? 0x1A9A73 : 0x626868,
      radius: 6,
      click_func: () => this.toggleSync()
    });

    // Server URL (if enabled)
    if (this.state.syncEnabled && this.state.serverUrl) {
      const displayUrl = this.state.serverUrl.length > 30 
        ? this.state.serverUrl.substring(0, 30) + '...'
        : this.state.serverUrl;
      
      createWidget(widget.TEXT, {
        x: 30,
        y: 230,
        w: 406,
        h: 60,
        text: `Server: ${displayUrl}`,
        text_size: 14,
        color: 0x777C7C
      });
    }

    // Info
    createWidget(widget.TEXT, {
      x: 30,
      y: 350,
      w: 406,
      h: 80,
      text: 'Configure all settings via Zepp mobile app',
      text_size: 16,
      color: 0x777C7C,
      align_h: align.CENTER_H
    });
  },

  toggleSync() {
    this.state.syncEnabled = !this.state.syncEnabled;
    localStorage.setItem('sync_enabled', String(this.state.syncEnabled));
    showToast({ text: this.state.syncEnabled ? 'Sync ON' : 'Sync OFF' });
    this.build();
  },

  onDestroy() {}
});
