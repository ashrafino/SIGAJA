const asyncHandler = require('express-async-handler');
const Assurance = require('../models/Assurance');

const getAssurances = asyncHandler(async (req, res) => {
    const assurances = await Assurance.find();
    res.json(assurances);
});

const createAssurance = asyncHandler(async (req, res) => {
    const assurance = await Assurance.create(req.body);
    res.status(201).json(assurance);
});

// @desc    Update assurance
// @route   PUT /api/assurances/:id
// @access  Private
const updateAssurance = asyncHandler(async (req, res) => {
    const assurance = await Assurance.findById(req.params.id);

    if (assurance) {
        Object.assign(assurance, req.body);
        const updatedAssurance = await assurance.save();
        res.json(updatedAssurance);
    } else {
        res.status(404);
        throw new Error('Assurance not found');
    }
});

// @desc    Delete assurance
// @route   DELETE /api/assurances/:id
// @access  Private
const deleteAssurance = asyncHandler(async (req, res) => {
    const assurance = await Assurance.findById(req.params.id);

    if (assurance) {
        await assurance.deleteOne();
        res.json({ message: 'Assurance supprimé' });
    } else {
        res.status(404);
        throw new Error('Assurance not found');
    }
});

const getAssuranceById = asyncHandler(async (req, res) => {
    const assurance = await Assurance.findById(req.params.id);
    if(assurance) res.json(assurance);
    else {
        res.status(404);
        throw new Error('Assurance not found');
    }
});

module.exports = { getAssurances, createAssurance, updateAssurance, deleteAssurance, getAssuranceById };
