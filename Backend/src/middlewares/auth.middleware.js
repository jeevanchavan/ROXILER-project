import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "User is not authenticated",
        });
    }

    // check if token is blacklisted
    const isTokenBlacklisted = await redis.get(token)

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Invalid token",
        });
    }

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );

        // new property 
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "User is not authenticated",
        });
    }
}