const mongoose = require('mongoose');

const assuranceSchema = mongoose.Schema({
    typeAssurance: { type: String, required: true },
    date: { type: Date, required: true },
    lieu: { type: String, required: true },
    service: { type: String, required: true },
    statut: { type: String, default: 'Déclaré' },
    description: { type: String },
    numeroPolice: { type: String },
    compagnieAssurance: { type: String },
    dateDeclaration: { type: Date },
    dateIndemnisation: { type: Date },
    montantDemande: { type: Number, default: 0 },
    montantAccorde: { type: Number, default: 0 },
    montantIndemnisation: { type: Number, default: 0 },
    assuranceConcernee: { type: String },
    piecesJointes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Assurance', assuranceSchema);
