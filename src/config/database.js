// import config from './config.js';
// import mongoose from 'mongoose';


// const connectDB = async()=>{
 
//    await mongoose.connect(config.MONGO_URL)
//     console.log("Connected to MongoDB")
// }
// export default connectDB;


// import mongoose from 'mongoose';
// import config from './config.js';

// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) {
//     console.log('Using existing database connection');
//     return;
//   }

//   try {
//     const db = await mongoose.connect(config.MONGO_URL, {
//       bufferCommands: false,
//     });
//     isConnected = db.connections[0].readyState === 1;
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };

// export default connectDB;


import config from './config.js';
import mongoose from 'mongoose';

const MONGODB_URI = config.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("=> MongoDB connected successfully");
      return mongoose;
    }).catch((err) => {
      console.error("=> MongoDB connection error:", err);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;