/**
 * Main Dashboard Page
 * Shows balance, TND equivalent, and navigation
 */

import { createWidget, widget, align, prop } from '@zos/ui';
import { push } from '@zos/router';
import { localStorage } from '@zos/storage';

Page({
  state: {
    balance: 0,
    tndRate: 0.001,
    activeAlarms: 0
  },

  build() {
    this.loadData();
    this.renderUI();
  },

  loadData() {
    try {
      const balanceStr = localStorage.getItem('balance');
      this.state.balance = balanceStr ? parseInt(balanceStr) : 0;
      
      const rateStr = localStorage.getItem('tnd_rate');
      this.state.tndRate = rateStr ? parseFloat(rateStr) : 0.001;
      
      const alarmsStr = localStorage.getItem('alarms');
      if (alarmsStr) {
        const alarms = JSON.parse(alarmsStr);
        this.state.activeAlarms = alarms.filter(a => a.enabled).length;
      }
    } catch (e) {
      console.log('Error loading data:', e);
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
      y: 60,
      w: 466,
      h: 60,
      text: 'Productivity Alarm',
      text_size: 32,
      color: 0x32B8C6,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Balance Display
    createWidget(widget.TEXT, {
      x: 0,
      y: 140,
      w: 466,
      h: 50,
      text: `Points: ${this.state.balance}`,
      text_size: 28,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // TND Equivalent
    const tndValue = (this.state.balance * this.state.tndRate).toFixed(3);
    createWidget(widget.TEXT, {
      x: 0,
      y: 190,
      w: 466,
      h: 40,
      text: `≈ ${tndValue} TND`,
      text_size: 20,
      color: 0xA7A9A9,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Active Alarms Count
    createWidget(widget.TEXT, {
      x: 0,
      y: 240,
      w: 466,
      h: 40,
      text: `Active Alarms: ${this.state.activeAlarms}`,
      text_size: 18,
      color: 0xA7A9A9,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Menu Buttons
    const buttonY = 300;
    const buttonSpacing = 55;

    this.createMenuButton('Alarms', buttonY, () => {
      push({ url: 'page/alarms.page' });
    });

    this.createMenuButton('History', buttonY + buttonSpacing, () => {
      push({ url: 'page/history.page' });
    });

    this.createMenuButton('Settings', buttonY + buttonSpacing * 2, () => {
      push({ url: 'page/settings.page' });
    });
  },

  createMenuButton(text, y, callback) {
    createWidget(widget.BUTTON, {
      x: 83,
      y: y,
      w: 300,
      h: 50,
      text: text,
      text_size: 20,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: callback
    });
  },

  onDestroy() {}
});
