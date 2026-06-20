const express = require('express');
const router = express.Router();
const { getAssurances, createAssurance, updateAssurance, deleteAssurance, getAssuranceById } = require('../controllers/assuranceController');

router.route('/').get(getAssurances).post(createAssurance);
router.route('/:id').get(getAssuranceById).put(updateAssurance).delete(deleteAssurance);

module.exports = router;
