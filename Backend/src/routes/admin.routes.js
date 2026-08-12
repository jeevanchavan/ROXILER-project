import express from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { getAdminDashboard, createUser, getAllUsers, getUserById, createStore, getAllStores } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// fetch all data of all stores,ratings and users.
adminRouter.get("/dashboard",authUser,authorizeRoles("admin"), getAdminDashboard);

// this api will create new user, owner and admin itself and admin can have this access
adminRouter.post("/users",authUser,authorizeRoles("admin"),createUser);

// this api fetches all the users from db
adminRouter.get("/users",authUser,authorizeRoles("admin"),getAllUsers);

// fetches a single user by id from db and ratings if user is store_owner.
adminRouter.get("/users/:id",authUser,authorizeRoles("admin"),getUserById);

// this api will create new store and only store_owner can have this access
adminRouter.post("/stores",authUser,authorizeRoles("admin"),createStore);

adminRouter.get("/stores",authUser,authorizeRoles("admin"),getAllStores);

export default adminRouter;