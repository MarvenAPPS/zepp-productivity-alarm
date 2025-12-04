import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { push } from '@zos/router';

Page({
  state: {
    balance: 0
  },

  build() {
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
      y: 100,
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
      y: 200,
      w: 466,
      h: 50,
      text: `Points: ${this.state.balance}`,
      text_size: 28,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Info Text
    createWidget(widget.TEXT, {
      x: 0,
      y: 300,
      w: 466,
      h: 40,
      text: 'App is working!',
      text_size: 20,
      color: 0xA7A9A9,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });
  },

  onDestroy() {
    // Cleanup
  }
});
