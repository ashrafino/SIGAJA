const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const resetUsers = async () => {
    try {
        console.log('1. Suppression des utilisateurs...');
        await User.deleteMany();
        
        console.log('2. Création des utilisateurs...');
        // Hash manuel pour être sûr
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);

        // Créer l'admin SANS passer par le User.create() qui utilise le hook (parfois capricieux si mal configuré)
        // Ou utiliser User.create() avec un log.
        // Utilisons User.create() standard, car on a corrigé le hook.

        const adminUser = new User({
            name: 'Administrateur',
            email: 'admin@srm.com',
            password: 'admin', // Le hook va le hacher
            role: 'Admin'
        });

        await adminUser.save();
        console.log(`- Admin créé (ID: ${adminUser._id})`);

        const simpleUser = new User({
            name: 'Utilisateur Juriste',
            email: 'user@srm.com',
            password: 'admin',
            role: 'Juriste'
        });

        await simpleUser.save();
        console.log(`- User créé (ID: ${simpleUser._id})`);

        // Vérification immédiate
        console.log('3. Test de vérification du mot de passe admin...');
        const user = await User.findOne({ email: 'admin@srm.com' });
        if (user) {
            const isMatch = await user.matchPassword('admin');
            console.log(`- Mot de passe 'admin' pour admin@srm.com valide ? ${isMatch}`);
            
            if (!isMatch) {
                console.error('ERREUR CRITIQUE: Le mot de passe ne correspond pas malgré la création récente !');
                console.log('Hash stocké:', user.password);
            }
        } else {
            console.error('ERREUR: Utilisateur admin non trouvé après création !');
        }

        console.log('Opération terminée.');
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

resetUsers();
