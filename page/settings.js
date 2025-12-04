import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { back } from '@zos/router';
import { getStorage } from '../utils/storage';

Page({
  state: {
    tndRate: 0.001,
    serverUrl: '',
    syncEnabled: false,
    vibrationDuration: 300000 // 5 minutes in ms
  },

  build() {
    this.loadSettings();
    this.renderUI();
  },

  loadSettings() {
    const storage = getStorage();
    this.state.tndRate = storage.get('tnd_rate', 0.001);
    this.state.serverUrl = storage.get('server_url', '');
    this.state.syncEnabled = storage.get('sync_enabled', false);
    this.state.vibrationDuration = storage.get('vibration_duration', 300000);
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
      text: '←',
      text_size: 24,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => back()
    });

    // TND Rate Setting
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

    // Sync Status
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
      text: this.state.syncEnabled ? 'Enabled' : 'Disabled',
      text_size: 16,
      normal_color: this.state.syncEnabled ? 0x21C090 : 0x777C7C,
      press_color: this.state.syncEnabled ? 0x1A9A73 : 0x626868,
      radius: 6,
      click_func: () => this.toggleSync()
    });

    // Server URL
    if (this.state.syncEnabled && this.state.serverUrl) {
      createWidget(widget.TEXT, {
        x: 30,
        y: 230,
        w: 406,
        h: 60,
        text: `Server: ${this.state.serverUrl}`,
        text_size: 14,
        color: 0x777C7C,
        text_style: text_style.WRAP
      });
    }

    // Vibration Duration
    createWidget(widget.TEXT, {
      x: 30,
      y: 310,
      w: 406,
      h: 30,
      text: 'Vibration Duration',
      text_size: 18,
      color: 0xFFFFFF
    });

    const minutes = Math.floor(this.state.vibrationDuration / 60000);
    createWidget(widget.TEXT, {
      x: 30,
      y: 340,
      w: 406,
      h: 40,
      text: `${minutes} minutes`,
      text_size: 16,
      color: 0xA7A9A9
    });

    // Info Text
    createWidget(widget.TEXT, {
      x: 30,
      y: 400,
      w: 406,
      h: 60,
      text: 'Configure all settings via Zepp App',
      text_size: 16,
      color: 0x777C7C,
      align_h: align.CENTER_H,
      text_style: text_style.WRAP
    });
  },

  toggleSync() {
    const storage = getStorage();
    this.state.syncEnabled = !this.state.syncEnabled;
    storage.set('sync_enabled', this.state.syncEnabled);
    showToast({ text: this.state.syncEnabled ? 'Sync enabled' : 'Sync disabled' });
    this.renderUI();
  },

  onDestroy() {
    // Cleanup
  }
});
