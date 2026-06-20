const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const createUsers = async () => {
    try {
        await User.deleteMany();

        const admin = new User({
            name: 'Administrateur',
            email: 'admin@srm.com',
            password: '123456',
            role: 'Admin'
        });
        await admin.save();

        const user = new User({
            name: 'Utilisateur Juriste',
            email: 'user@srm.com',
            password: '123456',
            role: 'Juriste'
        });
        await user.save();

        console.log('Utilisateurs Admin et User créés avec succès !');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUsers();
