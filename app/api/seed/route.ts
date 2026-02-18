import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { gameServices } from "@/lib/db-services";

export async function POST() {
  try {
    const [userRows] = await pool.query("SELECT id FROM users WHERE id = 1 LIMIT 1");
    const hasUser = Array.isArray(userRows) && userRows.length > 0;
    if (!hasUser) {
      await pool.query(
        "INSERT INTO users (id, username, email, password_hash, is_verified) VALUES (1, 'demo', 'demo@example.com', 'hash-demo', true)"
      );
    }

    const slugs = [
      "pubg-mobile",
      "valorant",
      "fortnite",
      "call-of-duty-mobile",
    ];
    const games: { slug: string; id: number | null }[] = [];
    for (const slug of slugs) {
      const g = await gameServices.getGameBySlug(slug);
      games.push({ slug, id: g ? g.id : null });
    }

    const samples = [
      {
        slug: "pubg-mobile",
        title: "Compte PUBG Mobile – Niveau 85 | Skins Rares",
        description: "Skins mythiques, armes rares, véhicules exclusifs",
        level: 85,
        items_count: 156,
        price: 89.99,
      },
      {
        slug: "valorant",
        title: "Compte Valorant – Rang Immortel",
        description: "Skins premium, collection complète",
        level: 234,
        items_count: 78,
        price: 199.99,
      },
      {
        slug: "fortnite",
        title: "Compte Fortnite – Skins Légendaires",
        description: "Bundle exclusif, emotes rares",
        level: 70,
        items_count: 120,
        price: 129.0,
      },
      {
        slug: "call-of-duty-mobile",
        title: "Compte COD Mobile – Prestige Max",
        description: "Armes dorées, camos rares",
        level: 150,
        items_count: 234,
        price: 75.0,
      },
    ];

    const inserted: any[] = [];
    for (const s of samples) {
      const gameId = games.find((g) => g.slug === s.slug)?.id;
      if (!gameId) continue;
      const [existsRows] = await pool.query(
        "SELECT id FROM game_accounts WHERE seller_id = 1 AND game_id = ? AND title = ? LIMIT 1",
        [gameId, s.title]
      );
      const exists = Array.isArray(existsRows) && existsRows.length > 0;
      if (!exists) {
        const [result] = await pool.query(
          "INSERT INTO game_accounts (seller_id, game_id, title, description, level, items_count, price, status) VALUES (1, ?, ?, ?, ?, ?, ?, 'active')",
          [gameId, s.title, s.description, s.level, s.items_count, s.price]
        );
        const id = (result as any).insertId;
        inserted.push({ id, ...s, game_id: gameId });
      }
      // Ajout d'entrées supplémentaires pour tester la pagination
      for (let i = 1; i <= 20; i++) {
        const title = `${s.title} • Démo #${i}`;
        const [existsRows2] = await pool.query(
          "SELECT id FROM game_accounts WHERE seller_id = 1 AND game_id = ? AND title = ? LIMIT 1",
          [gameId, title]
        );
        const exists2 = Array.isArray(existsRows2) && existsRows2.length > 0;
        if (exists2) continue;
        const dynamicPrice = Number((s.price + i * 0.5).toFixed(2));
        const [result2] = await pool.query(
          "INSERT INTO game_accounts (seller_id, game_id, title, description, level, items_count, price, status) VALUES (1, ?, ?, ?, ?, ?, ?, 'active')",
          [gameId, title, s.description, s.level, s.items_count, dynamicPrice]
        );
        const id2 = (result2 as any).insertId;
        inserted.push({ id: id2, title, game_id: gameId });
      }
    }

    return NextResponse.json({ success: true, data: { insertedCount: inserted.length, inserted } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to seed demo data" },
      { status: 500 }
    );
  }
}
