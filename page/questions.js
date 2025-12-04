import { createWidget, widget, align } from '@zos/ui';
import { showToast } from '@zos/interaction';
import { back } from '@zos/router';
import { getStorage } from '../utils/storage';

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
    const storage = getStorage();
    this.state.questions = storage.get('questions', []);
    
    // Ensure we have 30 question slots
    while (this.state.questions.length < 30) {
      this.state.questions.push({
        id: this.state.questions.length,
        text: `Question ${this.state.questions.length + 1}`,
        yesPoints: 10,
        noPoints: -5
      });
    }
    
    storage.set('questions', this.state.questions);
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
      text: '←',
      text_size: 24,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => back()
    });

    // Question Counter
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

    // Current Question Display
    const currentQ = this.state.questions[this.state.currentIndex];
    
    createWidget(widget.TEXT, {
      x: 30,
      y: 140,
      w: 406,
      h: 120,
      text: currentQ.text,
      text_size: 22,
      color: 0xFFFFFF,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP
    });

    // Points Display
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

    // Navigation Buttons
    createWidget(widget.BUTTON, {
      x: 40,
      y: 350,
      w: 80,
      h: 50,
      text: '←',
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
      text: '→',
      text_size: 28,
      normal_color: 0x21808D,
      press_color: 0x1D7480,
      radius: 8,
      click_func: () => this.nextQuestion()
    });

    // Info Text
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
      this.renderUI();
    }
  },

  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.renderUI();
    }
  },

  onDestroy() {
    // Cleanup
  }
});
