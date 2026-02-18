import { NextResponse } from "next/server";
import { gameServices } from "@/lib/db-services";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const gameId = searchParams.get("gameId");

    const accounts = await gameServices.getGameAccounts({
      page,
      limit,
      search,
      gameId: gameId ? parseInt(gameId) : undefined,
    });

    const total = await gameServices.countGameAccounts({
      search,
      gameId: gameId ? parseInt(gameId) : undefined,
    });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      success: true,
      data: accounts,
      meta: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error("Error fetching game accounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch game accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const account = await gameServices.createGameAccount(data);
    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    console.error("Error creating game account:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create game account" },
      { status: 500 }
    );
  }
}
