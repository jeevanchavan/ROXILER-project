import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import path from 'path'
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.static("./public"));

// health check api
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is healthy",
    });
});

import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import storeRouter from "./routes/store.routes.js";
import ownerRouter from "./routes/owner.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stores", storeRouter);
app.use("/api/owner", ownerRouter);

// wildcard api
app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"));
})

export default app;