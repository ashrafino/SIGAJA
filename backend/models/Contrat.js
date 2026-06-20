const mongoose = require('mongoose');

const contratSchema = mongoose.Schema({
    numeroContrat: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    montant: { type: Number },
    duree: { type: String },
    service: { type: String },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    renouvellementAuto: { type: Boolean, default: false },
    statut: { type: String, default: 'Actif' },
    alerteRenouvellement: { type: Number, default: 30 },
    clausesRisque: [{
        clause: { type: String },
        niveauRisque: { type: String, enum: ['Faible', 'Moyen', 'Élevé'] },
        commentaire: { type: String }
    }],
    piecesJointes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Contrat', contratSchema);
