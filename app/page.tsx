import { Search, Shield, Zap, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GameAccountsList } from "@/components/GameAccountsList";

const games = [
  {
    name: "eFootball",
    icon: "⚽",
    accounts: 245,
    category: "Sports",
  },
  {
    name: "PUBG Mobile",
    icon: "🔫",
    accounts: 892,
    category: "Battle Royale",
  },
  {
    name: "Free Fire",
    icon: "🔥",
    accounts: 567,
    category: "Battle Royale",
  },
  {
    name: "FIFA 24",
    icon: "⚽",
    accounts: 334,
    category: "Sports",
  },
  {
    name: "Call of Duty Mobile",
    icon: "🎯",
    accounts: 445,
    category: "FPS",
  },
  {
    name: "Valorant",
    icon: "🎮",
    accounts: 678,
    category: "FPS",
  },
  {
    name: "Arena Breakout",
    icon: "🏟️",
    accounts: 123,
    category: "Tactical",
  },
  {
    name: "Fortnite",
    icon: "🏗️",
    accounts: 1234,
    category: "Battle Royale",
  },
];

const features = [
  {
    icon: Shield,
    title: "Sécurité Garantie",
    description: "Tous les comptes sont vérifiés et sécurisés",
  },
  {
    icon: Zap,
    title: "Livraison Instantanée",
    description: "Recevez vos comptes immédiatement après achat",
  },
  {
    icon: Users,
    title: "Support 24/7",
    description: "Notre équipe est disponible pour vous aider",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Gaming Marketplace</h1>
      <GameAccountsList />
    </main>
  );
}
