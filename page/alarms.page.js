/**
 * Alarms Management Page
 * List and enable/disable alarms
 */

import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { back } from '@zos/router';
import { localStorage } from '@zos/storage';
import { push } from '@zos/router';

Page({
  state: {
    alarms: [],
    scrollY: 0
  },

  build() {
    this.loadAlarms();
    this.renderUI();
  },

  loadAlarms() {
    try {
      const alarmsStr = localStorage.getItem('alarms');
      if (alarmsStr) {
        this.state.alarms = JSON.parse(alarmsStr);
      } else {
        this.state.alarms = this.createDefaultAlarms();
        localStorage.setItem('alarms', JSON.stringify(this.state.alarms));
      }
    } catch (e) {
      this.state.alarms = this.createDefaultAlarms();
    }
  },

  createDefaultAlarms() {
    const defaults = [];
    for (let i = 0; i < 10; i++) {
      defaults.push({
        id: i,
        hour: 8,
        minute: 0,
        enabled: false,
        questionsToAnswer: 5,
        repeat: [1, 1, 1, 1, 1, 0, 0]
      });
    }
    return defaults;
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
      text: 'Alarms',
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

    // Alarm List
    const listStartY = 80;
    const itemHeight = 70;

    this.state.alarms.slice(0, 5).forEach((alarm, index) => {
      this.renderAlarmItem(alarm, listStartY + (index * itemHeight));
    });

    // Info
    createWidget(widget.TEXT, {
      x: 0,
      y: 420,
      w: 466,
      h: 40,
      text: 'Configure via Zepp App',
      text_size: 16,
      color: 0x777C7C,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });
  },

  renderAlarmItem(alarm, y) {
    // Container
    createWidget(widget.FILL_RECT, {
      x: 20,
      y: y,
      w: 426,
      h: 60,
      radius: 8,
      color: alarm.enabled ? 0x1A6873 : 0x262828
    });

    // Time
    const timeText = `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;
    createWidget(widget.TEXT, {
      x: 40,
      y: y + 10,
      w: 150,
      h: 40,
      text: timeText,
      text_size: 28,
      color: alarm.enabled ? 0x32B8C6 : 0x777C7C
    });

    // Questions count
    createWidget(widget.TEXT, {
      x: 200,
      y: y + 15,
      w: 150,
      h: 30,
      text: `${alarm.questionsToAnswer} Q`,
      text_size: 16,
      color: 0xA7A9A9
    });

    // Toggle
    createWidget(widget.BUTTON, {
      x: 360,
      y: y + 10,
      w: 60,
      h: 40,
      text: alarm.enabled ? 'ON' : 'OFF',
      text_size: 16,
      normal_color: alarm.enabled ? 0x21C090 : 0x777C7C,
      press_color: alarm.enabled ? 0x1A9A73 : 0x626868,
      radius: 6,
      click_func: () => this.toggleAlarm(alarm.id)
    });
  },

  toggleAlarm(alarmId) {
    const alarm = this.state.alarms.find(a => a.id === alarmId);
    if (alarm) {
      alarm.enabled = !alarm.enabled;
      localStorage.setItem('alarms', JSON.stringify(this.state.alarms));
      showToast({ text: alarm.enabled ? 'Alarm ON' : 'Alarm OFF' });
      
      // Re-render
      this.build();
    }
  },

  onDestroy() {}
});
