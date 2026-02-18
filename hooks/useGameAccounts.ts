"use client";

import { useState, useEffect } from "react";
import type { GameAccount } from "@/lib/db";

interface UseGameAccountsProps {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialGameId?: string | null;
}

interface UseGameAccountsReturn {
  accounts: GameAccount[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  gameId: string | null;
  setGameId: (gameId: string | null) => void;
  refreshAccounts: () => Promise<void>;
  total: number;
  totalPages: number;
}

export function useGameAccounts({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = "",
  initialGameId = null,
}: UseGameAccountsProps = {}): UseGameAccountsReturn {
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [gameId, setGameId] = useState<string | null>(initialGameId);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (gameId) {
        params.append("gameId", gameId);
      }

      const response = await fetch(`/api/game-accounts?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch game accounts");
      }

      setAccounts(data.data);
      const meta = data.meta || { total: 0, totalPages: 1 };
      setTotal(meta.total || 0);
      setTotalPages(meta.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, search, gameId]);

  return {
    accounts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    gameId,
    setGameId,
    refreshAccounts: fetchAccounts,
    total,
    totalPages,
  };
}
