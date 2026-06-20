const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Accessible to both Admin and Juriste (any authenticated user)
router.post('/', protect, handleChat);

module.exports = router;
