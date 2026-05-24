import config from './config.js';
import mongoose from 'mongoose';

let cached = global.mongoose;

const connectDB = async() => {
    if (!cached) {
        cached = global.mongoose = { conn: null, promise: null };
    }

    if (cached.conn) {
        console.log("Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        };

        try {
            cached.promise = mongoose.connect(config.MONGO_URL, opts)
                .then((mongoose) => {
                    console.log("✓ Connected to MongoDB successfully");
                    return mongoose;
                })
                .catch((err) => {
                    cached.promise = null;
                    console.error("✗ MongoDB Connection Error:", err.message);
                    throw err;
                });

            cached.conn = await cached.promise;
        } catch (err) {
            cached.promise = null;
            console.error("Failed to connect to MongoDB:", err);
            throw new Error(`Database connection failed: ${err.message}`);
        }
    }

    return cached.conn;
};

export default connectDB;