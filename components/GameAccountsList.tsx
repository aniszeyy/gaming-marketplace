"use client";

import { useState, useEffect } from "react";
import { useGameAccounts } from "@/hooks/useGameAccounts";
import type { Game, GameAccount } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

export function GameAccountsList() {
  const {
    accounts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    gameId,
    setGameId,
    total,
    totalPages,
  } = useGameAccounts();

  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  // Load games for the filter dropdown
  useEffect(() => {
    const loadGames = async () => {
      try {
        const res = await fetch("/api/games");
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Failed to load games");
        }
        setGames(json.data);
      } catch (err) {
        console.error("Error loading games:", err);
      } finally {
        setLoadingGames(false);
      }
    };
    loadGames();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleGameFilter = (value: string) => {
    setGameId(value === "all" ? null : value);
    setPage(1); // Reset to first page when filtering
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex gap-4">
        <Input
          placeholder="Search game accounts..."
          value={search}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Select value={gameId ?? "all"} onValueChange={handleGameFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by game" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.id.toString()}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-8">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Loading game accounts...</p>
        </div>
      )}

      {/* Game Accounts Grid */}
      {!loading && accounts.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No game accounts found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account: GameAccount & { game_name?: string }) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle className="text-lg">{account.title}</CardTitle>
              <div className="text-sm text-gray-500">
                {account.game_name} • Level {account.level || "N/A"}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm line-clamp-2">{account.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    €{account.price.toFixed(2)}
                  </span>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
        <Button
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1 || loading}
        >
          Previous
        </Button>
        <Button
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
