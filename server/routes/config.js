/**
 * Configuration API Routes
 * Manages app configuration and settings
 */

const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../models/config');

/**
 * GET /api/config
 * Get current configuration
 */
router.get('/', async (req, res) => {
  try {
    const config = await getConfig();

    res.json({
      success: true,
      config: config
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({
      error: 'Failed to retrieve configuration',
      message: error.message
    });
  }
});

/**
 * PUT /api/config
 * Update configuration
 */
router.put('/', async (req, res) => {
  try {
    const updates = req.body;

    await updateConfig(updates);

    res.json({
      success: true,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({
      error: 'Failed to update configuration',
      message: error.message
    });
  }
});

/**
 * GET /api/config/questions
 * Get questions list
 */
router.get('/questions', async (req, res) => {
  try {
    const config = await getConfig();

    res.json({
      success: true,
      questions: config.questions || []
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      error: 'Failed to retrieve questions',
      message: error.message
    });
  }
});

/**
 * PUT /api/config/questions
 * Update questions list
 */
router.put('/questions', async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Questions must be an array'
      });
    }

    if (questions.length > 30) {
      return res.status(400).json({
        error: 'Maximum 30 questions allowed'
      });
    }

    await updateConfig({ questions });

    res.json({
      success: true,
      message: 'Questions updated successfully'
    });
  } catch (error) {
    console.error('Update questions error:', error);
    res.status(500).json({
      error: 'Failed to update questions',
      message: error.message
    });
  }
});

module.exports = router;
