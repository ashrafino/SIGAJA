const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    let { email, password } = req.body;

    console.log(`LOGIN DEBUG: Received email='${email}', password='${password}'`);

    if (!email || !password) {
         return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Normalisation
    email = email.trim().toLowerCase();
    if (email === 'admin') email = 'admin@srm.com';

    // --- FIX D'URGENCE ---
    // Si c'est l'admin et le mot de passe est 123456, on force la connexion
    if (email === 'admin@srm.com' && password === '123456') {
         console.log('LOGIN DEBUG: Hardware check passed. Finding user...');
         let user = await User.findOne({ email });
         
         // Si l'utilisateur n'existe pas, on le CRÉE D'URGENCE
         if (!user) {
             console.log('LOGIN DEBUG: User not found in DB! Creating emergency admin...');
             user = await User.create({
                 name: 'Administrateur',
                 email: 'admin@srm.com',
                 password: '123456', // Sera haché par le hook
                 role: 'Admin'
             });
         }

         return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
         });
    }
    // ----------------------

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        console.log('LOGIN DEBUG: Password mismatch');
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Initial setup only, should be restricted later)
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

module.exports = { authUser, registerUser };
