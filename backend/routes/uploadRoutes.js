const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const router = express.Router();

const upload = multer({
    storage: storage,
});

router.post('/', upload.array('documents', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    // With Cloudinary, req.file or req.files[x] has a 'path' property which is the URL.
    const filePaths = req.files.map(file => file.path);
    res.json(filePaths);
});

module.exports = router;
