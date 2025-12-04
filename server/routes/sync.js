/**
 * Sync API Routes
 * Handles balance and history synchronization
 */

const express = require('express');
const router = express.Router();
const { saveBalance, saveHistory, getUserData } = require('../models/user');

/**
 * POST /api/sync/balance
 * Sync balance update from watch
 */
router.post('/balance', async (req, res) => {
  try {
    const { balance, history, timestamp, deviceId } = req.body;

    if (balance === undefined || !deviceId) {
      return res.status(400).json({
        error: 'Missing required fields: balance, deviceId'
      });
    }

    // Save balance
    await saveBalance(deviceId, balance, timestamp);

    // Save history entry if provided
    if (history) {
      await saveHistory(deviceId, history);
    }

    res.json({
      success: true,
      message: 'Balance synced successfully',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Balance sync error:', error);
    res.status(500).json({
      error: 'Failed to sync balance',
      message: error.message
    });
  }
});

/**
 * POST /api/sync/full
 * Full history sync from watch
 */
router.post('/full', async (req, res) => {
  try {
    const { balance, history, timestamp, deviceId } = req.body;

    if (balance === undefined || !history || !deviceId) {
      return res.status(400).json({
        error: 'Missing required fields: balance, history, deviceId'
      });
    }

    // Save balance
    await saveBalance(deviceId, balance, timestamp);

    // Save all history entries
    for (const entry of history) {
      await saveHistory(deviceId, entry);
    }

    res.json({
      success: true,
      message: 'Full history synced successfully',
      entriesProcessed: history.length,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Full sync error:', error);
    res.status(500).json({
      error: 'Failed to sync full history',
      message: error.message
    });
  }
});

/**
 * GET /api/sync/data/:deviceId
 * Get user data for a device
 */
router.get('/data/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const userData = await getUserData(deviceId);

    if (!userData) {
      return res.status(404).json({
        error: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user data',
      message: error.message
    });
  }
});

module.exports = router;
