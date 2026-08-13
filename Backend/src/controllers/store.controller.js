import pool from "../config/db.js";

export const getStore = async (req, res) => {
    try{
        const {storename,address,sortBy="storename", order="asc"} = req.query;
        
        let query = `
             SELECT
                s.id,
                s.storename,
                s.address,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                MAX(
                    CASE
                        WHEN r.user_id = $1 THEN r.rating
                    END
                ) AS my_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `

        const values = [req.user.id];
        const conditions = [];

         if (storename) {
            values.push(`%${storename}%`);
            conditions.push(`s.storename ILIKE $${values.length}`);
        }

        if (address) {
            values.push(`%${address}%`);
            conditions.push(`s.address ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " GROUP BY s.id";

        const allowedSort = ["storename", "address"];

        const sortColumn = allowedSort.includes(sortBy)
            ? sortBy
            : "storename";

        const sortOrder = order === "desc" ? "DESC" : "ASC";

        query += ` ORDER BY s.${sortColumn} ${sortOrder}`;

        const result = await pool.query(query, values);

        res.status(200).json({
            stores: result.rows
        });
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}