const asyncHandler = require('express-async-handler');
const Recouvrement = require('../models/Recouvrement');

// @desc    Get all dossiers
// @route   GET /api/recouvrement
// @access  Private
const getDossiers = asyncHandler(async (req, res) => {
    const dossiers = await Recouvrement.find();
    res.json(dossiers);
});

// @desc    Create new dossier
// @route   POST /api/recouvrement
// @access  Private
const createDossier = asyncHandler(async (req, res) => {
    const dossier = await Recouvrement.create(req.body);
    res.status(201).json(dossier);
});

// @desc    Update dossier
// @route   PUT /api/recouvrement/:id
// @access  Private
const updateDossier = asyncHandler(async (req, res) => {
    const dossier = await Recouvrement.findById(req.params.id);

    if (dossier) {
        Object.assign(dossier, req.body);
        const updatedDossier = await dossier.save();
        res.json(updatedDossier);
    } else {
        res.status(404);
        throw new Error('Dossier not found');
    }
});

// @desc    Delete dossier
// @route   DELETE /api/recouvrement/:id
// @access  Private
const deleteDossier = asyncHandler(async (req, res) => {
    const dossier = await Recouvrement.findById(req.params.id);

    if (dossier) {
        await dossier.deleteOne();
        res.json({ message: 'Dossier supprimé' });
    } else {
        res.status(404);
        throw new Error('Dossier not found');
    }
});

// @desc    Get single dossier
// @route   GET /api/recouvrement/:id
// @access  Private
const getDossierById = asyncHandler(async (req, res) => {
    const dossier = await Recouvrement.findById(req.params.id);
    if(dossier) {
        res.json(dossier);
    } else {
        res.status(404);
        throw new Error('Dossier not found');
    }
});

module.exports = { getDossiers, createDossier, updateDossier, deleteDossier, getDossierById };
