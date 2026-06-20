const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, adminCreateUser } = require('../controllers/userController');
const { protect, admin, adminOrDG } = require('../middleware/authMiddleware');

router.route('/').get(protect, adminOrDG, getUsers).post(protect, admin, adminCreateUser);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
