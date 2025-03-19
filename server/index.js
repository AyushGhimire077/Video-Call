import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import http from "http";
import cookieParser from "cookie-parser";

//files import
import { connectDb } from "./config/connectDb.js";
import AuthRouter from "./routes/authRoutes.js";
import { setUpSocket } from "./socket/scoket.js";


//initialize express app
const app = express();
//socket server
const server = http.createServer(app);


//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//Database connection 
connectDb();

//socket server
setUpSocket();

//Rest api routes
app.use("/api/auth", AuthRouter);


//cheecking route
app.listen(process.env.PORT, () => {
    console.log("Servr is listen on port:", process.env.PORT)
})
