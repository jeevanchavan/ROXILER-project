import express from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { getAdminDashboard, createUser, getAllUsers, getUserById, createStore, getAllStores } from "../controllers/admin.controller.js";
import { validateUser } from "../validators/user.validator.js";

const adminRouter = express.Router();

// fetch all data of all stores,ratings and users.
adminRouter.get("/dashboard",authUser,authorizeRoles("admin"), getAdminDashboard);

// this api will create new user, owner and admin itself and admin can have this access
adminRouter.post("/users",authUser,authorizeRoles("admin"),validateUser,createUser);

// this api fetches all the users from db
adminRouter.get("/users",authUser,authorizeRoles("admin"),getAllUsers);

// fetches a single user by id from db and ratings if user is store_owner.
adminRouter.get("/users/:id",authUser,authorizeRoles("admin"),getUserById);

// admin can create new store and assign it to a store_owner.
adminRouter.post("/stores",authUser,authorizeRoles("admin"),createStore);

// this api fetches all the stores from db and their ratings.
adminRouter.get("/stores",authUser,authorizeRoles("admin"),getAllStores);

export default adminRouter;