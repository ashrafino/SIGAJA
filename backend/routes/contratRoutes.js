const express = require('express');
const router = express.Router();
const { getContrats, createContrat, updateContrat, deleteContrat, getContratById } = require('../controllers/contratController');

router.route('/').get(getContrats).post(createContrat);
router.route('/:id').get(getContratById).put(updateContrat).delete(deleteContrat);

module.exports = router;
