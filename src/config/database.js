import config from './config.js';
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async()=>{
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise){
        const opts={
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(config.MONGO_URL, opts).then((mongoose)=>{
            return mongoose;
        }).catch((err)=>{
            cached.promise = null;
            throw err;
        });
    }
//    await mongoose.connect(config.MONGO_URL)
//     console.log("Connected to MongoDB")
}
export default connectDB;