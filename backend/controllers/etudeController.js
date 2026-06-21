const asyncHandler = require('express-async-handler');
const Etude = require('../models/Etude');

// @desc    Get all etudes
// @route   GET /api/etudes
// @access  Public (should be private in prod)
const getEtudes = asyncHandler(async (req, res) => {
    const etudes = await Etude.find({}).sort({ createdAt: -1 });
    res.json(etudes);
});

// @desc    Create an etude
// @route   POST /api/etudes
// @access  Public
const createEtude = asyncHandler(async (req, res) => {
    const etude = await Etude.create(req.body);
    res.status(201).json(etude);
});

// @desc    Update an etude
// @route   PUT /api/etudes/:id
// @access  Public
const updateEtude = asyncHandler(async (req, res) => {
    const etude = await Etude.findById(req.params.id);

    if (etude) {
        Object.assign(etude, req.body);
        const updatedEtude = await etude.save();
        res.json(updatedEtude);
    } else {
        res.status(404);
        throw new Error('Étude non trouvée');
    }
});

// @desc    Delete an etude
// @route   DELETE /api/etudes/:id
// @access  Public
const deleteEtude = asyncHandler(async (req, res) => {
    const etude = await Etude.findById(req.params.id);

    if (etude) {
        await etude.deleteOne();
        res.json({ message: 'Étude supprimée' });
    } else {
        res.status(404);
        throw new Error('Étude non trouvée');
    }
});

module.exports = {
    getEtudes,
    createEtude,
    updateEtude,
    deleteEtude
};
