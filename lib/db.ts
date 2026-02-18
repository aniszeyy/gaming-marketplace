import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "gaming_marketplace",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to get a connection from the pool
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("Error getting database connection:", error);
    throw error;
  }
}

// Helper function to execute a query
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results as T;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Database interface types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  is_verified: boolean;
  avatar_url: string | null;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface GameAccount {
  id: number;
  seller_id: number;
  game_id: number;
  title: string;
  description: string;
  level?: number;
  items_count?: number;
  price: number;
  status: "active" | "sold" | "deleted";
  created_at: Date;
  updated_at: Date;
  game_name?: string;
}

export interface AccountImage {
  id: number;
  account_id: number;
  url: string;
  created_at: Date;
}

export interface Transaction {
  id: number;
  buyer_id: number;
  seller_id: number;
  account_id: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: number;
  transaction_id: number;
  reviewer_id: number;
  rating: number;
  comment: string;
  created_at: Date;
}
