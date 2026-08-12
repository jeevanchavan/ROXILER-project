import 'dotenv/config';
import app from './src/app.js';
import pool from './src/config/db.js';
import redis from './src/config/cache.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // PostgreSQL
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error.message);
    process.exit(1);
  }
};

startServer();
