const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/srm_db'); // Fallback to local if env variable missing
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Removed process.exit(1) to prevent Vercel function crash
    }
};

module.exports = connectDB;
