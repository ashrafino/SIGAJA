const Recouvrement = require('./models/Recouvrement');
const Contrat = require('./models/Contrat');
const Assurance = require('./models/Assurance');
const Action = require('./models/Action');

const generateAlerts = async () => {
    const notifications = [];
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Audiences approaching (within 7 days)
    const dossiersAudience = await Recouvrement.find({
        prochaineAudience: { $gte: now, $lte: in7Days }
    }).lean();

    dossiersAudience.forEach(d => {
        const days = Math.ceil((new Date(d.prochaineAudience) - now) / (1000 * 60 * 60 * 24));
        notifications.push({
            type: days <= 3 ? 'danger' : 'warning',
            message: `Audience dans ${days} jour(s) pour le dossier ${d.numeroDossier}`,
            date: now,
            link: '/app/recouvrement'
        });
    });

    // 2. Contrats expiring (within 30 days)
    const contratsExpirant = await Contrat.find({
        statut: 'Actif',
        dateFin: { $gte: now, $lte: in30Days }
    }).lean();

    contratsExpirant.forEach(c => {
        const days = Math.ceil((new Date(c.dateFin) - now) / (1000 * 60 * 60 * 24));
        notifications.push({
            type: days <= 7 ? 'danger' : 'warning',
            message: `Contrat ${c.numeroContrat} expire dans ${days} jour(s)`,
            date: now,
            link: '/app/contrats'
        });
    });

    // 3. Expired contrats not yet marked
    const contratsExpires = await Contrat.find({
        statut: 'Actif',
        dateFin: { $lt: now }
    }).lean();

    contratsExpires.forEach(c => {
        notifications.push({
            type: 'danger',
            message: `Contrat ${c.numeroContrat} a expiré et n'est pas traité`,
            date: now,
            link: '/app/contrats'
        });
    });

    // 4. Assurances declared > 30 days without progress
    const assurancesEnAttente = await Assurance.find({
        statut: { $in: ['Déclaré', 'En expertise'] },
        date: { $lt: thirtyDaysAgo }
    }).lean();

    assurancesEnAttente.forEach(a => {
        const days = Math.ceil((now - new Date(a.date)) / (1000 * 60 * 60 * 24));
        notifications.push({
            type: 'warning',
            message: `Assurance ${a.typeAssurance} en attente depuis ${days} jours`,
            date: now,
            link: '/app/assurances'
        });
    });

    // 5. Overdue actions
    const actionsEnRetard = await Action.find({
        dateEcheance: { $lt: now },
        statut: { $ne: 'Traité' }
    }).lean();

    actionsEnRetard.forEach(a => {
        const days = Math.ceil((now - new Date(a.dateEcheance)) / (1000 * 60 * 60 * 24));
        notifications.push({
            type: 'danger',
            message: `Action "${a.titre}" en retard de ${days} jour(s)`,
            date: now,
            link: '/app'
        });
    });

    return notifications;
};

module.exports = { generateAlerts };
