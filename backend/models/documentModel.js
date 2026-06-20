const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        default: 'General'
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
