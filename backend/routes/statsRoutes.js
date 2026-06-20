const express = require('express');
const router = express.Router();
const { getOverview, getContentieuxStats, getContratsStats, getAssurancesStats, getTimeline } = require('../controllers/statsController');

router.get('/overview', getOverview);
router.get('/contentieux', getContentieuxStats);
router.get('/contrats', getContratsStats);
router.get('/assurances', getAssurancesStats);
router.get('/timeline', getTimeline);

module.exports = router;
