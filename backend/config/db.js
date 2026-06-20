const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/srm_db', {
            serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of 30 to prevent Vercel 10s function timeout
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Removed process.exit(1) to prevent Vercel function crash
    }
};

module.exports = connectDB;
