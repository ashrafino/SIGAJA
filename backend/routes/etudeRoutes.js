const express = require('express');
const router = express.Router();
const {
    getEtudes,
    createEtude,
    updateEtude,
    deleteEtude
} = require('../controllers/etudeController');

router.route('/')
    .get(getEtudes)
    .post(createEtude);

router.route('/:id')
    .put(updateEtude)
    .delete(deleteEtude);

module.exports = router;
