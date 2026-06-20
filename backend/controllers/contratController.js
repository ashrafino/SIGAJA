const asyncHandler = require('express-async-handler');
const Contrat = require('../models/Contrat');

const getContrats = asyncHandler(async (req, res) => {
    const contrats = await Contrat.find();
    res.json(contrats);
});

const createContrat = asyncHandler(async (req, res) => {
    const contrat = await Contrat.create(req.body);
    res.status(201).json(contrat);
});

// @desc    Update contrat
// @route   PUT /api/contrats/:id
// @access  Private
const updateContrat = asyncHandler(async (req, res) => {
    const contrat = await Contrat.findById(req.params.id);

    if (contrat) {
        Object.assign(contrat, req.body);
        const updatedContrat = await contrat.save();
        res.json(updatedContrat);
    } else {
        res.status(404);
        throw new Error('Contrat not found');
    }
});

// @desc    Delete contrat
// @route   DELETE /api/contrats/:id
// @access  Private
const deleteContrat = asyncHandler(async (req, res) => {
    const contrat = await Contrat.findById(req.params.id);

    if (contrat) {
        await contrat.deleteOne();
        res.json({ message: 'Contrat supprimé' });
    } else {
        res.status(404);
        throw new Error('Contrat not found');
    }
});

const getContratById = asyncHandler(async (req, res) => {
    const contrat = await Contrat.findById(req.params.id);
    if(contrat) res.json(contrat);
    else {
        res.status(404);
        throw new Error('Contrat not found');
    }
});

module.exports = { getContrats, createContrat, updateContrat, deleteContrat, getContratById };
