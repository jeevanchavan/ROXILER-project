import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAdminDashboard = async(req, res) => {
    try{
        const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
        const totalStores = await pool.query("SELECT COUNT(*) FROM stores");
        const totalRatings = await pool.query("SELECT COUNT(*) FROM ratings");

        res.status(200).json({
            message: "Admin dashboard fetched successfully",
            data: {
                totalUsers: totalUsers.rows[0].count,
                totalStores: totalStores.rows[0].count,
                totalRatings: totalRatings.rows[0].count,
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "Error fetching admin dashboard data",
        });
    }
}

export const createUser = async (req, res) => {
    const { username, email, password, address, role } = req.body;

    try{
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(existingUser.rows.length > 0){
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        // hash pass
        const hash = await bcrypt.hash(password, 10);

        const user = await pool.query(
            "INSERT INTO users (username, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
             [username, email, hash, address, role]
        );

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                address: user.rows[0].address,
                role: user.rows[0].role
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const users = await pool.query("SELECT id, username,email, address, role FROM users");
        if(users.rows.length === 0){
            return res.status(404).json({
                message: "No users found",
            });
        }

        res.status(200).json({
            message: "Users fetched successfully",
            users: users.rows
        });
    }catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try{
        const user = await pool.query("SELECT id, username,email, address, role FROM users WHERE id = $1", [id]);
        if(user.rows.length === 0){
            return res.status(404).json({
                message: "User not found",
            });
        }

        // If the user is a Store Owner, their Rating should also be displayed
        let averageRating = null;
        if(user.rows[0].role === 'store_owner'){
            const ratingResult = await pool.query(
                `SELECT AVG(r.rating) AS average_rating
                 FROM ratings r
                 JOIN stores s ON r.store_id = s.id
                 WHERE s.owner_id = $1`,
                [id]
            );
            averageRating = ratingResult.rows[0].average_rating;
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                address: user.rows[0].address,
                role: user.rows[0].role,
                averageRating: averageRating
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "Error fetching user",
            error: error.message
        })
    }
}

export const createStore = async (req, res) => {
    try {
        const { storename, email, address, ownerId } = req.body;

        // Check if owner exists
        const ownerResult = await pool.query(
            `SELECT id, role
             FROM users
             WHERE id = $1`,
            [ownerId]
        );

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({
                message: "Store owner not found"
            });
        }

        // Check if user is a store owner
        if (ownerResult.rows[0].role !== "store_owner") {
            return res.status(400).json({
                message: "User is not a store owner"
            });
        }

        // Check if store email already exists
        const existingStore = await pool.query(
            `SELECT id
             FROM stores
             WHERE email = $1`,
            [email]
        );

        if (existingStore.rows.length > 0) {
            return res.status(409).json({
                message: "Store email already exists"
            });
        }

        // Create store
        const result = await pool.query(
            `INSERT INTO stores
             (storename, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, storename, email, address, owner_id`,
            [storename, email, address, ownerId]
        );

        res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating store",
            error: error.message
        });
    }
}

export const getAllStores = async (req, res) => {
    try{
        const stores = await pool.query("SELECT * FROM stores");
        if(stores.rows.length === 0){
            return res.status(404).json({
                message: "No stores found",
            });
        }
        res.status(200).json({
            message: "Stores fetched successfully",
            stores: stores.rows
        });
    }catch (error) {
        res.status(500).json({
            message: "Error fetching stores",
            error: error.message
        });
    }
}