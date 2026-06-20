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

const app = express();

// Ensure DB is connected before handling requests (Serverless pattern)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Failed to connect to database in middleware:', error);
        
        // Check if MONGO_URI is defined
        const isMongoUriDefined = !!process.env.MONGO_URI;
        
        res.status(500).json({ 
            message: 'Database connection failed',
            details: error.message,
            env_status: {
                MONGO_URI_CONFIGURED: isMongoUriDefined
            },
            instruction: 'If MONGO_URI_CONFIGURED is true, this is almost certainly a MongoDB Atlas Network Access issue. You MUST allow 0.0.0.0/0 in your Atlas Dashboard.'
        });
    }
});

// Set security HTTP headers - Configure helmet before CORS
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS setup with proper origin validation
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sigaja.vercel.app',
    'https://sigaja-48gowzv4j-achrafs-projects-36584b1a.vercel.app',
    'https://sigaja-c8iqf8cjm-achrafs-projects-36584b1a.vercel.app',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or matches Vercel pattern
        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // 10 minutes
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

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
