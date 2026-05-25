// import config from './config.js';
// import mongoose from 'mongoose';


// const connectDB = async()=>{
 
//    await mongoose.connect(config.MONGO_URL)
//     console.log("Connected to MongoDB")
// }
// export default connectDB;


import mongoose from 'mongoose';
import config from './config.js';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(config.MONGO_URL, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default connectDB;