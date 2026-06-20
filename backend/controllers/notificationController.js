const asyncHandler = require('express-async-handler');
const { generateAlerts } = require('../scheduler');

// @desc    Get all notifications (auto-generated from scheduler)
// @route   GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
    try {
        const alerts = await generateAlerts();
        res.json(alerts);
    } catch (error) {
        console.error('Notification error:', error);
        res.json([]);
    }
});

module.exports = { getNotifications };
