import express from "express";
import { registerUser,loginUser, logoutUser, getUserProfile, updateUserPassword } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register",registerUser);

authRouter.post("/login",loginUser);

authRouter.post("/logout",authUser,logoutUser);

authRouter.get("/get-me",authUser,getUserProfile);

authRouter.put("/password",authUser,updateUserPassword);

export default authRouter;