const express = require('express');
const router = express.Router();
const { getDossiers, createDossier, updateDossier, deleteDossier, getDossierById } = require('../controllers/recouvrementController');

router.route('/').get(getDossiers).post(createDossier);
router.route('/:id').get(getDossierById).put(updateDossier).delete(deleteDossier);

module.exports = router;
