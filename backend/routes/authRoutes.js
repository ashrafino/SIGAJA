const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/authController');
const asyncHandler = require('express-async-handler');

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(authUser));

module.exports = router;
