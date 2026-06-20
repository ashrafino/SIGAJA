const asyncHandler = require('express-async-handler');
const Action = require('../models/Action');

// @desc    Get all actions
// @route   GET /api/actions
// @access  Private
const getActions = asyncHandler(async (req, res) => {
    const actions = await Action.find().sort({ dateEcheance: 1 });
    res.json(actions);
});

// @desc    Create new action
// @route   POST /api/actions
// @access  Private
const createAction = asyncHandler(async (req, res) => {
    const action = await Action.create(req.body);
    res.status(201).json(action);
});

// @desc    Update action
// @route   PUT /api/actions/:id
// @access  Private
const updateAction = asyncHandler(async (req, res) => {
    const action = await Action.findById(req.params.id);
    if (action) {
        action.titre = req.body.titre || action.titre;
        action.type = req.body.type || action.type;
        action.dateEcheance = req.body.dateEcheance || action.dateEcheance;
        action.statut = req.body.statut || action.statut;
        
        const updatedAction = await action.save();
        res.json(updatedAction);
    } else {
        res.status(404);
        throw new Error('Action non trouvée');
    }
});

// @desc    Delete action
// @route   DELETE /api/actions/:id
// @access  Private
const deleteAction = asyncHandler(async (req, res) => {
    const action = await Action.findById(req.params.id);
    if (action) {
        await action.deleteOne();
        res.json({ message: 'Action supprimée' });
    } else {
        res.status(404);
        throw new Error('Action non trouvée');
    }
});

module.exports = { getActions, createAction, updateAction, deleteAction };
