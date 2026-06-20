const mongoose = require('mongoose');

const recouvrementSchema = mongoose.Schema({
    numeroDossier: { type: String, required: true, unique: true },
    typeCreance: { type: String, required: true },
    montant: { type: Number, required: true },
    natureLitige: { type: String, required: true },
    dateOuverture: { type: Date, required: true },
    statut: { type: String, default: 'En cours' },
    classification: { type: String },
    tribunal: { type: String },
    prochaineAudience: { type: Date },
    avocat: { type: String },
    partieAdverse: { type: String },
    risqueFinancier: { type: String, default: 'Moyen' },
    directionConcernee: { type: String },
    avancementPourcentage: { type: Number, min: 0, max: 100, default: 0 },
    audiences: [{
        date: { type: Date },
        lieu: { type: String },
        objet: { type: String },
        resultat: { type: String }
    }],
    delaisProceduraux: [{
        description: { type: String },
        dateLimite: { type: Date },
        respecte: { type: Boolean, default: false }
    }],
    piecesJointes: [{ type: String }],
    historique: [{ date: Date, action: String, commentaire: String }],
    typeProcedure: { type: String, default: 'Recours Juridictionnel' },
    propositionsAmiable: { type: String },
    dateCloture: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Recouvrement', recouvrementSchema);
