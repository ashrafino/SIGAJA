const asyncHandler = require('express-async-handler');
const Recouvrement = require('../models/Recouvrement');
const Contrat = require('../models/Contrat');
const Assurance = require('../models/Assurance');
const Action = require('../models/Action');

// @desc    Get overview stats
// @route   GET /api/stats/overview
const getOverview = asyncHandler(async (req, res) => {
    const totalDossiers = await Recouvrement.countDocuments();
    const dossiersEnCours = await Recouvrement.countDocuments({ statut: { $in: ['En cours', 'En justice'] } });
    const totalContrats = await Contrat.countDocuments();
    const contratsActifs = await Contrat.countDocuments({ statut: 'Actif' });
    const totalAssurances = await Assurance.countDocuments();
    const assurancesDeclarees = await Assurance.countDocuments({ statut: { $in: ['Déclaré', 'En expertise'] } });
    const actionsUrgentes = await Action.countDocuments({ statut: 'Urgent' });

    const recouvrements = await Recouvrement.find().lean();
    const montantTotalContentieux = recouvrements.reduce((sum, r) => sum + (r.montant || 0), 0);
    const montantRecouvre = recouvrements.filter(r => r.statut === 'Réglé').reduce((sum, r) => sum + (r.montant || 0), 0);
    const tauxRecouvrement = montantTotalContentieux > 0 ? Math.round((montantRecouvre / montantTotalContentieux) * 100) : 0;

    const expositionRisque = recouvrements.reduce((sum, r) => sum + (r.montantRisque || 0), 0);

    res.json({
        totalDossiers,
        dossiersEnCours,
        totalContrats,
        contratsActifs,
        totalAssurances,
        assurancesDeclarees,
        actionsUrgentes,
        montantTotalContentieux,
        montantRecouvre,
        tauxRecouvrement,
        expositionRisque
    });
});

// @desc    Get contentieux stats
// @route   GET /api/stats/contentieux
const getContentieuxStats = asyncHandler(async (req, res) => {
    const recouvrements = await Recouvrement.find().lean();

    const parStatut = {};
    const parClassification = {};
    const parActivite = {};
    const parRisque = {};

    recouvrements.forEach(r => {
        parStatut[r.statut] = (parStatut[r.statut] || 0) + 1;
        if (r.classification) parClassification[r.classification] = (parClassification[r.classification] || 0) + 1;
        parActivite[r.activite] = (parActivite[r.activite] || 0) + 1;
        if (r.risqueFinancier) parRisque[r.risqueFinancier] = (parRisque[r.risqueFinancier] || 0) + 1;
    });

    const coutTotal = recouvrements.reduce((sum, r) => sum + (r.montant || 0), 0);
    const coutEnCours = recouvrements.filter(r => r.statut !== 'Réglé' && r.statut !== 'Classé').reduce((sum, r) => sum + (r.montant || 0), 0);

    // Monthly evolution
    const mensuel = {};
    recouvrements.forEach(r => {
        const month = new Date(r.dateOuverture).toISOString().slice(0, 7);
        mensuel[month] = (mensuel[month] || 0) + 1;
    });

    res.json({
        total: recouvrements.length,
        coutTotal,
        coutEnCours,
        parStatut: Object.entries(parStatut).map(([name, value]) => ({ name, value })),
        parClassification: Object.entries(parClassification).map(([name, value]) => ({ name, value })),
        parActivite: Object.entries(parActivite).map(([name, value]) => ({ name, value })),
        parRisque: Object.entries(parRisque).map(([name, value]) => ({ name, value })),
        mensuel: Object.entries(mensuel).sort().map(([month, count]) => ({ month, count }))
    });
});

// @desc    Get contrats stats
// @route   GET /api/stats/contrats
const getContratsStats = asyncHandler(async (req, res) => {
    const contrats = await Contrat.find().lean();
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const parStatut = {};
    const parType = {};
    contrats.forEach(c => {
        parStatut[c.statut] = (parStatut[c.statut] || 0) + 1;
        parType[c.type] = (parType[c.type] || 0) + 1;
    });

    const valeurTotale = contrats.reduce((sum, c) => sum + (c.montant || 0), 0);
    const prochainRenouvellement = contrats
        .filter(c => c.statut === 'Actif' && new Date(c.dateFin) <= in30Days && new Date(c.dateFin) >= now)
        .length;

    const expiresNonTraites = contrats.filter(c => c.statut === 'Actif' && new Date(c.dateFin) < now).length;

    res.json({
        total: contrats.length,
        valeurTotale,
        prochainRenouvellement,
        expiresNonTraites,
        parStatut: Object.entries(parStatut).map(([name, value]) => ({ name, value })),
        parType: Object.entries(parType).map(([name, value]) => ({ name, value }))
    });
});

// @desc    Get assurances stats
// @route   GET /api/stats/assurances
const getAssurancesStats = asyncHandler(async (req, res) => {
    const assurances = await Assurance.find().lean();

    const parStatut = {};
    const parType = {};
    const parService = {};
    assurances.forEach(a => {
        parStatut[a.statut] = (parStatut[a.statut] || 0) + 1;
        parType[a.typeAssurance] = (parType[a.typeAssurance] || 0) + 1;
        parService[a.service] = (parService[a.service] || 0) + 1;
    });

    const totalDemande = assurances.reduce((sum, a) => sum + (a.montantDemande || 0), 0);
    const totalAccorde = assurances.reduce((sum, a) => sum + (a.montantAccorde || 0), 0);
    const tauxIndemnisation = totalDemande > 0 ? Math.round((totalAccorde / totalDemande) * 100) : 0;

    const indemnises = assurances.filter(a => a.dateDeclaration && a.dateIndemnisation);
    const delaiMoyen = indemnises.length > 0
        ? Math.round(indemnises.reduce((sum, a) => {
            return sum + (new Date(a.dateIndemnisation) - new Date(a.dateDeclaration)) / (1000 * 60 * 60 * 24);
        }, 0) / indemnises.length)
        : 0;

    res.json({
        total: assurances.length,
        totalDemande,
        totalAccorde,
        tauxIndemnisation,
        delaiMoyen,
        parStatut: Object.entries(parStatut).map(([name, value]) => ({ name, value })),
        parType: Object.entries(parType).map(([name, value]) => ({ name, value })),
        parService: Object.entries(parService).map(([name, value]) => ({ name, value }))
    });
});

// @desc    Get timeline across all modules
// @route   GET /api/stats/timeline
const getTimeline = asyncHandler(async (req, res) => {
    const recouvrements = await Recouvrement.find().lean();
    const contrats = await Contrat.find().lean();
    const assurances = await Assurance.find().lean();

    const months = {};
    const addToMonth = (date, key) => {
        if (!date) return;
        const m = new Date(date).toISOString().slice(0, 7);
        if (!months[m]) months[m] = { month: m, Contentieux: 0, Contrats: 0, Assurances: 0 };
        months[m][key]++;
    };

    recouvrements.forEach(r => addToMonth(r.dateOuverture, 'Contentieux'));
    contrats.forEach(c => addToMonth(c.dateDebut, 'Contrats'));
    assurances.forEach(a => addToMonth(a.date, 'Assurances'));

    const sortedTimeline = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));

    res.json(sortedTimeline);
});

module.exports = { getOverview, getContentieuxStats, getContratsStats, getAssurancesStats, getTimeline };
