const mongoose = require('mongoose');

const etudeSchema = mongoose.Schema({
    titre: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['Note de synthèse', 'Note de présentation', 'Consultation', 'Service / Assistance']
    },
    reference: { type: String },
    demandeur: { type: String, required: true },
    dateDemande: { type: Date, required: true },
    dateRendu: { type: Date },
    statut: { 
        type: String, 
        default: 'En cours',
        enum: ['En cours', 'En attente', 'Clôturé', 'Annulé']
    },
    juristeEnCharge: { type: String },
    commentaires: { type: String },
    piecesJointes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Etude', etudeSchema);
