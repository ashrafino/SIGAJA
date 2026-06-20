const asyncHandler = require('express-async-handler');
const Document = require('../models/documentModel');
const path = require('path');
const fs = require('fs');

// @desc    Télécharger un document
// @route   POST /api/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Aucun fichier sélectionné');
    }

    const { originalname, mimetype, size, filename, path: filePath } = req.file;
    const { category } = req.body;

    const document = await Document.create({
        originalName: originalname,
        filename,
        path: filePath,
        mimeType: mimetype,
        size,
        uploadedBy: req.user._id,
        category: category || 'General'
    });

    res.status(201).json(document);
});

// @desc    Récupérer tous les documents
// @route   GET /api/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find({}).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(documents);
});

// @desc    Télécharger un fichier spécifique
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        // Rediriger vers l'URL Cloudinary
        res.redirect(document.path);
    } else {
        res.status(404);
        throw new Error('Document non trouvé');
    }
});

// @desc    Supprimer un document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (document) {
        // Supprimer le fichier de Cloudinary
        const { cloudinary } = require('../config/cloudinary');
        if (document.filename) {
            try {
                await cloudinary.uploader.destroy(document.filename);
            } catch (error) {
                console.error("Erreur lors de la suppression sur Cloudinary:", error);
            }
        }

        await document.deleteOne();
        res.json({ message: 'Document supprimé' });
    } else {
        res.status(404);
        throw new Error('Document non trouvé');
    }
});

module.exports = {
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument
};
