import config from './config.js';
import mongoose from 'mongoose';

let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

const connectDB = async()=>{
    // if (cached.conn) {
    //     return cached.conn;
    // }
    // if (!cached.promise){
    //     const opts={
    //         bufferCommands: false,
    //     };
    //     cached.promise = mongoose.connect(config.MONGO_URL, opts).then((mongoose)=>{
    //         console.log("Connected to MongoDB");
    //         return mongoose;
    //     })
    //     try{
    //         cached.conn = await cached.promise;

    //     }catch(err){
    //         cached.promise = null;
    //         console.log("Error connecting to MongoDB", err);
    //         throw err;
    //     }
    //     return cached.conn;
    // }
   await mongoose.connect(config.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
   })
    console.log("Connected to MongoDB")
}
export default connectDB;