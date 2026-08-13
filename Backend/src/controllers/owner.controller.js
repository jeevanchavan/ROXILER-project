import pool from "../config/db.js";

export const getOwnerDashboard = async (req, res) => {
    try{
        const ownerId = req.user.id;
        
        const storeResult = await pool.query(
            "SELECT id, storename,email, address FROM stores WHERE owner_id = $1",
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ 
                message: "No store found for this owner" 
            });
        }

        const store = storeResult.rows[0];
        // console.log("Store found:", store);

        // get avg rating
        const averageRatingResult = await pool.query(
            "SELECT COALESCE(AVG(rating), 0) AS average_rating FROM ratings WHERE store_id = $1",
            [store.id]
        );

        // get users who rated the store
        const usersResult = await pool.query(
            `SELECT u.id, u.username, r.rating 
             FROM users u 
             JOIN ratings r ON u.id = r.user_id 
             WHERE r.store_id = $1`,
            [store.id]
        );

        // console.log(usersResult.rows);

        res.status(200).json({
            store: {
                id: store.id,
                storename: store.storename,
                email: store.email,
                address: store.address,
                averageRating: averageRatingResult.rows[0].average_rating || 0
            },
            ratings: usersResult.rows
        });
    } catch (error) {
        console.error("Error fetching owner dashboard:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}