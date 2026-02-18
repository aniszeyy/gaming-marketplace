import { NextResponse } from "next/server";
import { gameServices } from "@/lib/db-services";

const fallbackGames = [
  { id: 1, name: "eFootball", slug: "efootball" },
  { id: 2, name: "PUBG Mobile", slug: "pubg-mobile" },
  { id: 3, name: "Free Fire", slug: "free-fire" },
  { id: 4, name: "FIFA 24", slug: "fifa-24" },
  { id: 5, name: "Call of Duty Mobile", slug: "call-of-duty-mobile" },
  { id: 6, name: "Valorant", slug: "valorant" },
  { id: 7, name: "Arena Breakout", slug: "arena-breakout" },
  { id: 8, name: "Fortnite", slug: "fortnite" },
];

export async function GET() {
  try {
    const games = await gameServices.getAllGames();
    if (Array.isArray(games) && games.length > 0) {
      return NextResponse.json({ success: true, data: games });
    }
    return NextResponse.json({ success: true, data: fallbackGames });
  } catch (error) {
    return NextResponse.json({ success: true, data: fallbackGames });
  }
}

