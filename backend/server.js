const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recouvrementRoutes = require('./routes/recouvrementRoutes');
const contratRoutes = require('./routes/contratRoutes');
const assuranceRoutes = require('./routes/assuranceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const actionRoutes = require('./routes/actionRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Cors setup
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://sigaja.vercel.app'] // Add production URLs here or use env var
        : '*', 
    credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false,
});
// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recouvrement', recouvrementRoutes);
app.use('/api/contrats', contratRoutes);
app.use('/api/assurances', assuranceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('SIGAJA API is running... (Production Ready)');
});

// Custom error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler Caught:', err);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        code: err.code
    });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
}

module.exports = app;
