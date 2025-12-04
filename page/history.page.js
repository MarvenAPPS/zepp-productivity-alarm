/**
 * Points History Page
 * View history, reset, and redeem points
 */

import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { back } from '@zos/router';
import { localStorage } from '@zos/storage';

Page({
  state: {
    history: [],
    balance: 0,
    tndRate: 0.001
  },

  build() {
    this.loadHistory();
    this.renderUI();
  },

  loadHistory() {
    try {
      const historyStr = localStorage.getItem('history');
      this.state.history = historyStr ? JSON.parse(historyStr) : [];
      
      const balanceStr = localStorage.getItem('balance');
      this.state.balance = balanceStr ? parseInt(balanceStr) : 0;
      
      const rateStr = localStorage.getItem('tnd_rate');
      this.state.tndRate = rateStr ? parseFloat(rateStr) : 0.001;
      
      this.state.history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.log('Error loading history:', e);
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
      text: 'History',
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

    // Balance
    const tndValue = (this.state.balance * this.state.tndRate).toFixed(3);
    createWidget(widget.TEXT, {
      x: 0,
      y: 80,
      w: 466,
      h: 40,
      text: `${this.state.balance} pts (${tndValue} TND)`,
      text_size: 22,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Action Buttons
    createWidget(widget.BUTTON, {
      x: 50,
      y: 130,
      w: 160,
      h: 50,
      text: 'Reset',
      text_size: 18,
      normal_color: 0xC0152F,
      press_color: 0xA01228,
      radius: 8,
      click_func: () => this.resetBalance()
    });

    const canRedeem = this.state.balance >= 1000;
    createWidget(widget.BUTTON, {
      x: 256,
      y: 130,
      w: 160,
      h: 50,
      text: 'Redeem',
      text_size: 18,
      normal_color: canRedeem ? 0x21C090 : 0x777C7C,
      press_color: canRedeem ? 0x1A9A73 : 0x626868,
      radius: 8,
      click_func: () => this.redeemPoints()
    });

    // History List
    const listStartY = 200;
    const itemHeight = 50;
    const visibleItems = Math.min(5, this.state.history.length);

    if (this.state.history.length === 0) {
      createWidget(widget.TEXT, {
        x: 0,
        y: 250,
        w: 466,
        h: 40,
        text: 'No history yet',
        text_size: 18,
        color: 0x777C7C,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V
      });
    } else {
      for (let i = 0; i < visibleItems; i++) {
        this.renderHistoryItem(this.state.history[i], listStartY + (i * itemHeight));
      }
    }
  },

  renderHistoryItem(item, y) {
    const date = new Date(item.timestamp);
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    // Container
    createWidget(widget.FILL_RECT, {
      x: 30,
      y: y,
      w: 406,
      h: 40,
      radius: 6,
      color: 0x262828
    });

    // Time
    createWidget(widget.TEXT, {
      x: 40,
      y: y + 5,
      w: 80,
      h: 30,
      text: timeStr,
      text_size: 16,
      color: 0xA7A9A9
    });

    // Action (truncated)
    const actionText = item.action.length > 20 ? item.action.substring(0, 20) + '...' : item.action;
    createWidget(widget.TEXT, {
      x: 130,
      y: y + 5,
      w: 200,
      h: 30,
      text: actionText,
      text_size: 16,
      color: 0xFFFFFF
    });

    // Points
    const pointsColor = item.points >= 0 ? 0x21C090 : 0xC0152F;
    const pointsText = item.points >= 0 ? `+${item.points}` : `${item.points}`;
    createWidget(widget.TEXT, {
      x: 340,
      y: y + 5,
      w: 80,
      h: 30,
      text: pointsText,
      text_size: 16,
      color: pointsColor,
      align_h: align.RIGHT
    });
  },

  resetBalance() {
    localStorage.setItem('balance', '0');
    localStorage.setItem('history', JSON.stringify([]));
    this.state.balance = 0;
    this.state.history = [];
    showToast({ text: 'Balance reset!' });
    this.build();
  },

  redeemPoints() {
    if (this.state.balance < 1000) {
      showToast({ text: 'Min 1000 pts required' });
      return;
    }

    const redeemable = Math.floor(this.state.balance / 1000) * 1000;
    const newBalance = this.state.balance - redeemable;
    
    const historyEntry = {
      timestamp: Date.now(),
      action: 'Redeemed',
      points: -redeemable
    };
    
    this.state.history.unshift(historyEntry);
    localStorage.setItem('history', JSON.stringify(this.state.history));
    localStorage.setItem('balance', String(newBalance));
    this.state.balance = newBalance;
    
    showToast({ text: `Redeemed ${redeemable} pts!` });
    this.build();
  },

  onDestroy() {}
});
