import pool from "../config/db.js";

export const createRating = async (req, res) => {
    try{
        const { storeId } = req.params;
        const userId = req.user.id;
        const { rating } = req.body;
        
        // Check if the store exists
        if (!storeId) {
            return res.status(400).json({ message: "Store ID is required" });
        }

        // Check if the rating is valid
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
        }

        // Check if user already rated this store
        const existingRating = await pool.query(
            "SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2",
            [userId, storeId]
        );

        if (existingRating.rows.length > 0) {
            return res.status(400).json({
                message: "You have already rated this store"
            });
        }

        // Create rating
        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, storeId, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating rating:", error);
        res.status(500).json({ 
            message: "Error submitting rating", 
            error: error.message 
        });
    }
}

export const updateRating = async (req, res) => {
    try{
        const storeId = req.params.storeId;
        const userId = req.user.id;
        const { rating } = req.body;

        // Check if the rating is valid
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: "Rating must be a number between 1 and 5" 
            });
        }

        // Check if user has already rated this store
        const existingRating = await pool.query(
            "SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2",
            [userId, storeId]
        );

        // if user has not rated before.
        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                message: "You have not rated this store yet"
            });
        }

        // Update rating
        const result = await pool.query(
            `UPDATE ratings
             SET rating = $1
             WHERE user_id = $2 AND store_id = $3
             RETURNING *`,
            [rating, userId, storeId]
        );

        res.status(200).json({
            message: "Rating updated successfully",
            rating: result.rows[0]
        });
    }catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ 
            message: "Error updating rating", 
            error: error.message 
        });
    }
}