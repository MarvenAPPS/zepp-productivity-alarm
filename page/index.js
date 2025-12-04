import { createWidget, widget, align, text_style, prop } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { push } from '@zos/router';
import { getStorage } from '../utils/storage';

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
    const storage = getStorage();
    this.state.balance = storage.get('balance', 0);
    this.state.tndRate = storage.get('tnd_rate', 0.001);
    const alarms = storage.get('alarms', []);
    this.state.activeAlarms = alarms.filter(a => a.enabled).length;
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
    const balanceText = createWidget(widget.TEXT, {
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
    const buttonSpacing = 60;

    this.createMenuButton('Alarms', buttonY, () => {
      push({ url: 'page/alarms' });
    });

    this.createMenuButton('Questions', buttonY + buttonSpacing, () => {
      push({ url: 'page/questions' });
    });

    this.createMenuButton('History', buttonY + buttonSpacing * 2, () => {
      push({ url: 'page/history' });
    });

    this.createMenuButton('Settings', buttonY + buttonSpacing * 3, () => {
      push({ url: 'page/settings' });
    });
  },

  createMenuButton(text, y, callback) {
    const btn = createWidget(widget.BUTTON, {
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

  onDestroy() {
    // Cleanup
  }
});
