/**
 * Questions Preview Page
 * Browse through the 30 questions
 */

import { createWidget, widget, align } from '@zos/ui';
import { back } from '@zos/router';
import { localStorage } from '@zos/storage';

Page({
  state: {
    questions: [],
    currentIndex: 0
  },

  build() {
    this.loadQuestions();
    this.renderUI();
  },

  loadQuestions() {
    try {
      const questionsStr = localStorage.getItem('questions');
      if (questionsStr) {
        this.state.questions = JSON.parse(questionsStr);
      } else {
        this.state.questions = this.getDefaultQuestions();
        localStorage.setItem('questions', JSON.stringify(this.state.questions));
      }
    } catch (e) {
      this.state.questions = this.getDefaultQuestions();
    }
  },

  getDefaultQuestions() {
    const defaults = [];
    const templates = [
      'Did you exercise today?',
      'Did you drink enough water?',
      'Did you study for your goals?',
      'Did you take breaks during work?',
      'Did you eat healthy meals?',
      'Did you avoid procrastination?',
      'Did you help someone today?',
      'Did you learn something new?',
      'Did you maintain good posture?',
      'Did you get enough sleep?'
    ];
    
    for (let i = 0; i < 30; i++) {
      defaults.push({
        id: i,
        text: templates[i % templates.length] || `Did you complete task ${i + 1}?`,
        yesPoints: 10,
        noPoints: -5
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
      text: 'Questions',
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

    // Counter
    createWidget(widget.TEXT, {
      x: 0,
      y: 80,
      w: 466,
      h: 40,
      text: `${this.state.currentIndex + 1} / 30`,
      text_size: 20,
      color: 0xA7A9A9,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });

    // Current Question
    const currentQ = this.state.questions[this.state.currentIndex];
    if (currentQ) {
      createWidget(widget.TEXT, {
        x: 30,
        y: 140,
        w: 406,
        h: 120,
        text: currentQ.text,
        text_size: 22,
        color: 0xFFFFFF,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V
      });

      // Points
      createWidget(widget.TEXT, {
        x: 60,
        y: 280,
        w: 346,
        h: 40,
        text: `Yes: +${currentQ.yesPoints}  |  No: ${currentQ.noPoints}`,
        text_size: 18,
        color: 0xA7A9A9,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V
      });
    }

    // Navigation
    createWidget(widget.BUTTON, {
      x: 40,
      y: 350,
      w: 80,
      h: 50,
      text: '<',
      text_size: 28,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => this.previousQuestion()
    });

    createWidget(widget.BUTTON, {
      x: 346,
      y: 350,
      w: 80,
      h: 50,
      text: '>',
      text_size: 28,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => this.nextQuestion()
    });

    // Info
    createWidget(widget.TEXT, {
      x: 0,
      y: 420,
      w: 466,
      h: 40,
      text: 'Edit via Zepp App',
      text_size: 16,
      color: 0x777C7C,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    });
  },

  previousQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.build();
    }
  },

  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.build();
    }
  },

  onDestroy() {}
});
