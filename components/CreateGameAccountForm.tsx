"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Game } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";

interface FormData {
  game_id: string;
  title: string;
  description: string;
  level: string;
  items_count: string;
  price: string;
}

export function CreateGameAccountForm() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Load games for the dropdown
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
        setError("Failed to load games");
        console.error("Error loading games:", err);
      }
    };
    loadGames();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/game-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          seller_id: 1, // TODO: Get from auth context
          price: parseFloat(data.price),
          level: data.level ? parseInt(data.level) : null,
          items_count: data.items_count ? parseInt(data.items_count) : null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create game account");
      }

      setSuccess(true);
      reset(); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/15 text-green-500 p-3 rounded-md">
          Game account created successfully!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="game">Game</Label>
        <Select
          onValueChange={(value: string) => setValue("game_id", value)}
          {...register("game_id", { required: "Please select a game" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.id.toString()}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.game_id && (
          <p className="text-sm text-destructive">{errors.game_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Level 85 PUBG Account with Rare Skins"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your account (skins, achievements, etc.)"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            type="number"
            placeholder="e.g., 85"
            {...register("level")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="items_count">Number of Items</Label>
          <Input
            id="items_count"
            type="number"
            placeholder="e.g., 156"
            {...register("items_count")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (€)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="e.g., 89.99"
          {...register("price", {
            required: "Price is required",
            min: { value: 0.01, message: "Price must be greater than 0" },
          })}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Listing"
        )}
      </Button>
    </form>
  );
}
