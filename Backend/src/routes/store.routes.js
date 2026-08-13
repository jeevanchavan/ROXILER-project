import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getStore } from "../controllers/store.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createRating,updateRating } from "../controllers/rating.controller.js";
import { storeValidator } from "../validators/store.validator.js";
import { validateRating } from "../validators/rating.validator.js";

const storeRouter = express.Router();

// This is protected route and fetches the list of stores with average ratings and user's rating if available
storeRouter.get("/",authUser,authorizeRoles("user"),storeValidator,getStore);

// this endpoint will create the rating upon applied checks and validations
storeRouter.post("/:storeId/rating",authUser,authorizeRoles("user"),validateRating,createRating);

// this allow only logged in user can update their own rating
storeRouter.put("/:storeId/rating",authUser,authorizeRoles("user"),validateRating,updateRating);

export default storeRouter;