import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import redis from "../config/cache.js";


// This function provides reusability of code and better production practice.
const getJsonWebToken = async (user,res,message) => {
    const token = jwt.sign(
        {
            id: user.rows[0].id,
            username: user.rows[0].username,
            email: user.rows[0].email,
            role: user.rows[0].role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    )
    res.cookie("token", token)

    res.status(200).json({
        message: message,
        user: {
            id: user.rows[0].id,
            username: user.rows[0].username,
            email: user.rows[0].email,
            address: user.rows[0].address,
            role: user.rows[0].role
        }
    })
}

// This controller handle registering a new user.
export const registerUser = async (req, res) => {
    const { username, email, password, address } = req.body;

    try{
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await pool.query(
            "INSERT INTO users (username, email, password, address) VALUES ($1, $2, $3, $4) RETURNING *",
             [username, email, hash, address]
        );

        await getJsonWebToken(user,res,"User registered successfully");
    }catch (error) {
        res.status(500).json({
            message: "Error registering user",
        })
    }
}

// This controller handle logging in a user.
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if(!user.rows.length){
        return res.status(400).json({
            message: "User does not exist",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);

    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    await getJsonWebToken(user,res,"User logged in successfully");
}

// This controller handle logging out a user.
export const logoutUser = async (req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({
            message: "User is not logged in",
        });
    }

    try{
        
        await redis.set(token,Date.now().toString(),"EX",60 * 60)
        
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

// This controller is used to get logged in user's profile.
export const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await pool.query("SELECT id, username, email, address, role FROM users WHERE id = $1", [userId]);

        res.status(200).json({
            message: "User profile fetched successfully",
            user: user.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user profile",
        });
    }
}

// This controller is used to update logged in user's password.
export const updateUserPassword = async (req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({
            message: "User is not logged in",
        });
    }

    const { oldPassword, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.rows[0].password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hash, decoded.id]);

        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating password",
        });
    }
}