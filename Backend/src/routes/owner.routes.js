import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getOwnerDashboard } from "../controllers/owner.controller.js";

const ownerRouter = express.Router();

ownerRouter.get("/dashboard",authUser,authorizeRoles("store_owner"),getOwnerDashboard)

export default ownerRouter;