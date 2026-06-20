const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        console.log('MongoDB: Using cached connection');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('MongoDB: Creating new connection');
        mongoose.set('strictQuery', false);
        
        cached.promise = mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/srm_db', {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        }).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error; // Let the caller know the connection failed
    }
};

module.exports = connectDB;
