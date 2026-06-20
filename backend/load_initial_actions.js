const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Action = require('./models/Action');

dotenv.config();
connectDB();

const initialActions = [
    {
        titre: '#REC-2023-001',
        type: 'Recouvrement',
        dateEcheance: new Date('2023-10-15'),
        statut: 'Urgent'
    },
    {
        titre: '#CTR-2023-045',
        type: 'Contrat',
        dateEcheance: new Date('2023-10-20'),
        statut: 'À renouveler'
    },
    {
        titre: '#SIN-2023-012',
        type: 'Assurance',
        dateEcheance: new Date('2023-10-22'),
        statut: 'En cours'
    }
];

const loadData = async () => {
    try {
        await Action.deleteMany();
        await Action.insertMany(initialActions);
        console.log('Données initiales chargées !');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

loadData();
