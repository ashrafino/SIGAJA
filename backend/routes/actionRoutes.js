const express = require('express');
const router = express.Router();
const { getActions, createAction, updateAction, deleteAction } = require('../controllers/actionController');

router.route('/').get(getActions).post(createAction);
router.route('/:id').put(updateAction).delete(deleteAction);

module.exports = router;
