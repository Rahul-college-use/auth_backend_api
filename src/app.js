// import express from "express";
// import morgan from "morgan";
// import dns from "dns";
// dns.setServers(['1.1.1.1','8.8.8.8'])
// import authRouter from './routes/auth.routes.js'
// import cookieParser from "cookie-parser";
// import cors from "cors";

// const corsOptions = {
//   origin: 'http://localhost:5174',
//   credentials: true,
// }

// const app = express();
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(cookieParser())


// app.use('/api/auth',authRouter)

// export default app;

import express from "express";
import morgan from "morgan";
import dns from "dns";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import connectDB from "./config/database.js";
import config from "./config/config.js";
config;
connectDB();


// DNS configuration
dns.setServers(["0.0.0.0","1.1.1.1", "8.8.8.8"]);

const app = express();

// CORS configuration
const corsOptions = {
  origin: "https://auth-frontend-alpha-one.vercel.app",
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

export default app;