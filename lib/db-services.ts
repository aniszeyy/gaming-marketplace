import { query, pool } from "./db";
import type {
  User,
  Game,
  GameAccount,
  AccountImage,
  Transaction,
  Review,
} from "./db";

// User Services
export const userServices = {
  async createUser(
    user: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    const sql = `
      INSERT INTO users (username, email, password_hash, is_verified, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
      user.username,
      user.email,
      user.password_hash,
      user.is_verified,
      user.avatar_url,
    ]);
    return { ...user, id: result.insertId } as User;
  },

  async getUserById(id: number): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE id = ?";
    const users = await query<User[]>(sql, [id.toString()]);
    return users[0] || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE email = ?";
    const users = await query<User[]>(sql, [email]);
    return users[0] || null;
  },
};

// Game Services
interface GetGameAccountsOptions {
  page: number;
  limit: number;
  search?: string;
  gameId?: number;
}

export const gameServices = {
  async getAllGames(): Promise<Game[]> {
    const [rows] = await pool.query("SELECT * FROM games ORDER BY name");
    return rows as Game[];
  },

  async getGameBySlug(slug: string): Promise<Game | null> {
    const [rows] = await pool.query("SELECT * FROM games WHERE slug = ?", [
      slug,
    ]);
    const games = rows as Game[];
    return games.length > 0 ? games[0] : null;
  },

  async getGameAccounts({
    page,
    limit,
    search,
    gameId,
  }: GetGameAccountsOptions): Promise<GameAccount[]> {
    const offset = (page - 1) * limit;
    let query = `
      SELECT ga.*, g.name as game_name 
      FROM game_accounts ga
      JOIN games g ON ga.game_id = g.id
      WHERE ga.status = 'active'
    `;
    const params: any[] = [];

    if (search) {
      query += " AND (ga.title LIKE ? OR ga.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (gameId) {
      query += " AND ga.game_id = ?";
      params.push(gameId);
    }

    query += " ORDER BY ga.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows as GameAccount[];
  },

  async countGameAccounts({ search, gameId }: { search?: string; gameId?: number }): Promise<number> {
    let sql = `
      SELECT COUNT(*) as count
      FROM game_accounts ga
      WHERE ga.status = 'active'
    `;
    const params: any[] = [];

    if (search) {
      sql += " AND (ga.title LIKE ? OR ga.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (gameId) {
      sql += " AND ga.game_id = ?";
      params.push(gameId);
    }

    const [rows] = await pool.query(sql, params);
    const r = rows as Array<{ count: number }>;
    return r[0]?.count ?? 0;
  },
};

  async createGameAccount(data: Partial<GameAccount>): Promise<GameAccount> {
    const {
      seller_id,
      game_id,
      title,
      description,
      level,
      items_count,
      price,
    } = data;

    if (!seller_id || !game_id || !title || !description || !price) {
      throw new Error("Missing required fields");
    }

    const [result] = await pool.query(
      `INSERT INTO game_accounts 
       (seller_id, game_id, title, description, level, items_count, price, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        seller_id,
        game_id,
        title,
        description,
        level || null,
        items_count || null,
        price,
      ]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query(
      "SELECT * FROM game_accounts WHERE id = ?",
      [insertId]
    );
    return (rows as GameAccount[])[0];
  },
};

// Game Account Services
export const gameAccountServices = {
  async getGameAccountById(id: number): Promise<GameAccount | null> {
    const sql = "SELECT * FROM game_accounts WHERE id = ?";
    const accounts = await query<GameAccount[]>(sql, [id.toString()]);
    return accounts[0] || null;
  },

  async getActiveGameAccounts(
    limit: number = 10,
    offset: number = 0
  ): Promise<GameAccount[]> {
    const sql = `
      SELECT ga.*, g.name as game_name, u.username as seller_name
      FROM game_accounts ga
      JOIN games g ON ga.game_id = g.id
      JOIN users u ON ga.seller_id = u.id
      WHERE ga.status = 'active'
      ORDER BY ga.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return query<GameAccount[]>(sql, [limit.toString(), offset.toString()]);
  },

  async searchGameAccounts(
    searchTerm: string,
    gameId?: number
  ): Promise<GameAccount[]> {
    let sql = `
      SELECT ga.*, g.name as game_name, u.username as seller_name
      FROM game_accounts ga
      JOIN games g ON ga.game_id = g.id
      JOIN users u ON ga.seller_id = u.id
      WHERE ga.status = 'active'
        AND (ga.title LIKE ? OR ga.description LIKE ?)
    `;
    const params: string[] = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (gameId) {
      sql += " AND ga.game_id = ?";
      params.push(gameId.toString());
    }

    sql += " ORDER BY ga.created_at DESC LIMIT 20";
    return query<GameAccount[]>(sql, params);
  },
};

// Transaction Services
export const transactionServices = {
  async createTransaction(
    transaction: Omit<
      Transaction,
      "id" | "created_at" | "updated_at" | "status"
    >
  ): Promise<Transaction> {
    const sql = `
      INSERT INTO transactions (game_account_id, buyer_id, seller_id, amount)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
      transaction.game_account_id.toString(),
      transaction.buyer_id.toString(),
      transaction.seller_id.toString(),
      transaction.amount.toString(),
    ]);
    return { ...transaction, id: result.insertId } as Transaction;
  },

  async updateTransactionStatus(
    id: number,
    status: Transaction["status"]
  ): Promise<void> {
    const sql = "UPDATE transactions SET status = ? WHERE id = ?";
    await query(sql, [status, id.toString()]);
  },

  async getTransactionById(id: number): Promise<Transaction | null> {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    const transactions = await query<Transaction[]>(sql, [id.toString()]);
    return transactions[0] || null;
  },
};

// Review Services
export const reviewServices = {
  async createReview(
    review: Omit<Review, "id" | "created_at">
  ): Promise<Review> {
    const sql = `
      INSERT INTO reviews (transaction_id, reviewer_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
      review.transaction_id.toString(),
      review.reviewer_id.toString(),
      review.rating.toString(),
      review.comment,
    ]);
    return { ...review, id: result.insertId } as Review;
  },

  async getReviewsByGameAccountId(gameAccountId: number): Promise<Review[]> {
    const sql = `
      SELECT r.*, u.username as reviewer_name
      FROM reviews r
      JOIN transactions t ON r.transaction_id = t.id
      JOIN users u ON r.reviewer_id = u.id
      WHERE t.game_account_id = ?
      ORDER BY r.created_at DESC
    `;
    return query<Review[]>(sql, [gameAccountId.toString()]);
  },
};
