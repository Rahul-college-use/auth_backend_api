import config from './config.js';
import mongoose from 'mongoose';

const connectDB = async()=>{
   await mongoose.connect(config.MONGO_URL)
    console.log("Connected to MongoDB")
}
export default connectDB;