/**
 * Alarm Trigger Page
 * Shows when alarm fires - answer questions to dismiss
 */

import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { Vibrator } from '@zos/sensor';
import { back } from '@zos/router';
import { localStorage } from '@zos/storage';

const vibrator = new Vibrator();

Page({
  state: {
    questions: [],
    currentIndex: 0,
    questionsToAnswer: 5,
    answeredCount: 0,
    vibrating: true,
    vibrationInterval: null,
    startTime: Date.now()
  },

  build() {
    this.loadQuestions();
    this.startVibration();
    this.renderUI();
  },

  loadQuestions() {
    try {
      // Load all questions
      const questionsStr = localStorage.getItem('questions');
      let allQuestions = questionsStr ? JSON.parse(questionsStr) : this.getDefaultQuestions();
      
      // Get number of questions to answer (from alarm or default)
      const questionsToAnswerStr = localStorage.getItem('current_alarm_questions');
      this.state.questionsToAnswer = questionsToAnswerStr ? parseInt(questionsToAnswerStr) : 5;
      
      // Shuffle and select required number
      this.state.questions = this.shuffleArray(allQuestions).slice(0, this.state.questionsToAnswer);
    } catch (e) {
      this.state.questions = this.getDefaultQuestions().slice(0, 5);
    }
  },

  getDefaultQuestions() {
    const defaults = [];
    const templates = [
      'Did you exercise today?',
      'Did you drink enough water?',
      'Did you study for your goals?',
      'Did you eat healthy meals?',
      'Did you avoid procrastination?'
    ];
    
    for (let i = 0; i < 30; i++) {
      defaults.push({
        id: i,
        text: templates[i % templates.length] || `Question ${i + 1}?`,
        yesPoints: 10,
        noPoints: -5
      });
    }
    return defaults;
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
    let vibCount = 0;
    this.state.vibrationInterval = setInterval(() => {
      if (this.state.vibrating && vibCount < 600) { // 5 min = 300 sec = 600 vibrations
        vibrator.start();
        setTimeout(() => vibrator.stop(), 500);
        vibCount++;
      } else if (vibCount >= 600) {
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
    // Red background for alarm
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 466,
      h: 466,
      color: 0xC0152F
    });

    // Title
    createWidget(widget.TEXT, {
      x: 0,
      y: 40,
      w: 466,
      h: 60,
      text: 'ALARM!',
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
    const currentQ = this.state.questions[this.state.currentIndex];
    if (currentQ) {
      // Question text (truncate if too long)
      let questionText = currentQ.text;
      if (questionText.length > 50) {
        questionText = questionText.substring(0, 50) + '...';
      }
      
      createWidget(widget.TEXT, {
        x: 30,
        y: 160,
        w: 406,
        h: 100,
        text: questionText,
        text_size: 22,
        color: 0xFFFFFF,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V
      });

      // YES Button
      createWidget(widget.BUTTON, {
        x: 50,
        y: 300,
        w: 160,
        h: 80,
        text: 'YES',
        text_size: 28,
        normal_color: 0x21C090,
        press_color: 0x1A9A73,
        radius: 12,
        click_func: () => this.answerQuestion(true)
      });

      // NO Button
      createWidget(widget.BUTTON, {
        x: 256,
        y: 300,
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
    const currentQ = this.state.questions[this.state.currentIndex];
    const points = isYes ? currentQ.yesPoints : currentQ.noPoints;
    
    // Update balance
    const balanceStr = localStorage.getItem('balance');
    let balance = balanceStr ? parseInt(balanceStr) : 0;
    balance += points;
    localStorage.setItem('balance', String(balance));
    
    // Add to history
    const historyStr = localStorage.getItem('history');
    const history = historyStr ? JSON.parse(historyStr) : [];
    history.unshift({
      timestamp: Date.now(),
      action: currentQ.text.substring(0, 30),
      points: points
    });
    localStorage.setItem('history', JSON.stringify(history));
    
    // Next question or finish
    this.state.answeredCount++;
    this.state.currentIndex++;
    
    if (this.state.answeredCount >= this.state.questionsToAnswer) {
      this.stopVibration();
      showToast({ text: `Done! ${points > 0 ? '+' : ''}${points} pts` });
      setTimeout(() => back(), 2000);
    } else {
      showToast({ text: `${points > 0 ? '+' : ''}${points} pts` });
      this.build();
    }
  },

  onDestroy() {
    this.stopVibration();
  }
});
