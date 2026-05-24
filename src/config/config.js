import dotenv from 'dotenv'
dotenv.config();

if(!process.env.MONGO_URL){
    throw new Error("MONGOOSE_URL is not defined in .env file")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SEERET is not defined in .env file")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in .env file")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in .env file")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in .env file")
}
if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined in .env file")
}

const config = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER
}
export default config;