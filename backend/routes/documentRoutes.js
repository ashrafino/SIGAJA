const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadDocument, getDocuments, downloadDocument, deleteDocument } = require('../controllers/documentController');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage
});

router.route('/')
    .post(protect, upload.single('file'), uploadDocument)
    .get(protect, getDocuments);

router.route('/:id/download')
    .get(protect, downloadDocument);

router.route('/:id')
    .delete(protect, admin, deleteDocument);

module.exports = router;
