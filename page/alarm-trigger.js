import { createWidget, widget, align, text_style } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { Vibrator } from '@zos/sensor';
import { back } from '@zos/router';
import { getStorage } from '../utils/storage';

const vibrator = new Vibrator();

Page({
  state: {
    alarmId: null,
    questions: [],
    currentQuestionIndex: 0,
    questionsToAnswer: 5,
    answeredCount: 0,
    vibrating: true,
    vibrationInterval: null,
    startTime: Date.now()
  },

  build() {
    this.loadAlarmData();
    this.startVibration();
    this.renderUI();
  },

  loadAlarmData() {
    const params = hmApp.routeParams || {};
    this.state.alarmId = params.alarmId || 0;
    
    const storage = getStorage();
    const alarms = storage.get('alarms', []);
    const alarm = alarms.find(a => a.id === this.state.alarmId);
    
    if (alarm) {
      this.state.questionsToAnswer = alarm.questionsToAnswer;
    }
    
    // Load all questions
    const allQuestions = storage.get('questions', []);
    
    // Randomly select questions to answer
    this.state.questions = this.shuffleArray(allQuestions)
      .slice(0, this.state.questionsToAnswer);
  },

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  startVibration() {
    // Vibrate pattern: on for 500ms, off for 500ms
    this.state.vibrationInterval = setInterval(() => {
      if (this.state.vibrating) {
        vibrator.start();
        setTimeout(() => vibrator.stop(), 500);
      }
      
      // Check if 5 minutes elapsed
      const elapsed = Date.now() - this.state.startTime;
      if (elapsed >= 300000) { // 5 minutes
        this.stopVibration();
        showToast({ text: 'Time expired!' });
        setTimeout(() => back(), 2000);
      }
    }, 1000);
  },

  stopVibration() {
    this.state.vibrating = false;
    vibrator.stop();
    if (this.state.vibrationInterval) {
      clearInterval(this.state.vibrationInterval);
    }
  },

  renderUI() {
    // Background
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 466,
      h: 466,
      color: 0xC0152F // Red background for alarm
    });

    // Title
    createWidget(widget.TEXT, {
      x: 0,
      y: 40,
      w: 466,
      h: 60,
      text: '⏰ ALARM!',
      text_size: 36,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Progress
    createWidget(widget.TEXT, {
      x: 0,
      y: 100,
      w: 466,
      h: 40,
      text: `Question ${this.state.answeredCount + 1} / ${this.state.questionsToAnswer}`,
      text_size: 20,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Current Question
    const currentQ = this.state.questions[this.state.currentQuestionIndex];
    if (currentQ) {
      createWidget(widget.TEXT, {
        x: 30,
        y: 160,
        w: 406,
        h: 120,
        text: currentQ.text,
        text_size: 24,
        color: 0xFFFFFF,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.WRAP
      });

      // Yes Button
      createWidget(widget.BUTTON, {
        x: 50,
        y: 310,
        w: 160,
        h: 80,
        text: 'YES',
        text_size: 28,
        normal_color: 0x21C090,
        press_color: 0x1A9A73,
        radius: 12,
        click_func: () => this.answerQuestion(true)
      });

      // No Button
      createWidget(widget.BUTTON, {
        x: 256,
        y: 310,
        w: 160,
        h: 80,
        text: 'NO',
        text_size: 28,
        normal_color: 0x777C7C,
        press_color: 0x626868,
        radius: 12,
        click_func: () => this.answerQuestion(false)
      });
    }
  },

  answerQuestion(isYes) {
    const storage = getStorage();
    const currentQ = this.state.questions[this.state.currentQuestionIndex];
    
    // Calculate points
    const points = isYes ? currentQ.yesPoints : currentQ.noPoints;
    
    // Update balance
    let balance = storage.get('balance', 0);
    balance += points;
    storage.set('balance', balance);
    
    // Add to history
    const history = storage.get('history', []);
    history.unshift({
      timestamp: Date.now(),
      action: `Answered: ${currentQ.text.substring(0, 20)}...`,
      points: points
    });
    storage.set('history', history);
    
    // Sync with server
    const sync = require('../utils/sync');
    sync.syncBalance(balance, history[0]);
    
    // Move to next question
    this.state.answeredCount++;
    this.state.currentQuestionIndex++;
    
    if (this.state.answeredCount >= this.state.questionsToAnswer) {
      // All questions answered - stop alarm
      this.stopVibration();
      showToast({ text: `Alarm dismissed! ${points > 0 ? '+' : ''}${points} points` });
      setTimeout(() => back(), 2000);
    } else {
      // Show next question
      showToast({ text: `${points > 0 ? '+' : ''}${points} points` });
      this.renderUI();
    }
  },

  onDestroy() {
    this.stopVibration();
  }
});
