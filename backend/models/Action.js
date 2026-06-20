const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
    titre: { type: String, required: true },
    type: { type: String, required: true }, // Ex: Recouvrement, Contrat...
    dateEcheance: { type: Date, required: true },
    statut: { type: String, enum: ['Urgent', 'À renouveler', 'En cours', 'Traité'], default: 'En cours' },
    priorite: { type: String, enum: ['Haute', 'Moyenne', 'Basse'], default: 'Moyenne' }
}, { timestamps: true });

module.exports = mongoose.model('Action', actionSchema);
