import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import storeRouter from "./routes/store.routes.js";
import ownerRouter from "./routes/owner.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stores", storeRouter);
app.use("/api/owner", ownerRouter);

export default app;