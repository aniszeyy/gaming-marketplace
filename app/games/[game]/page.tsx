import { Search, Filter, Shield, Zap, Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const accounts = [
  {
    id: 1,
    title: "Compte PUBG Mobile - Niveau 85 | Skins Rares",
    price: 89.99,
    originalPrice: 120.0,
    level: 85,
    items: 156,
    rarity: "Légendaire",
    seller: "ProGamer123",
    rating: 4.9,
    verified: true,
    delivery: "Instantané",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Skins Mythiques", "Armes Rares", "Véhicules Exclusifs"],
  },
  {
    id: 2,
    title: "Compte Free Fire - Diamants + Skins",
    price: 45.5,
    originalPrice: 65.0,
    level: 67,
    items: 89,
    rarity: "Épique",
    seller: "FireMaster",
    rating: 4.8,
    verified: true,
    delivery: "Instantané",
    image: "/placeholder.svg?height=200&width=300",
    features: ["10,000 Diamants", "Skins Exclusifs", "Emotes Rares"],
  },
  {
    id: 3,
    title: "Compte Valorant - Rang Immortel",
    price: 199.99,
    originalPrice: 250.0,
    level: 234,
    items: 78,
    rarity: "Immortel",
    seller: "ValorantPro",
    rating: 5.0,
    verified: true,
    delivery: "Instantané",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Rang Immortel", "Skins Premium", "Collection Complète"],
  },
  {
    id: 4,
    title: "Compte Call of Duty Mobile - Prestige Max",
    price: 75.0,
    originalPrice: 95.0,
    level: 150,
    items: 234,
    rarity: "Prestige",
    seller: "CODLegend",
    rating: 4.7,
    verified: true,
    delivery: "Instantané",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Prestige Max", "Armes Dorées", "Camos Rares"],
  },
]

export default function GameAccountsPage({ params }: { params: { game: string } }) {
  const gameName = params.game.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-white font-bold text-xl">GameVault</span>
              </Link>

              <div className="flex items-center space-x-2 text-gray-400">
                <ArrowLeft className="w-4 h-4" />
                <Link href="/" className="hover:text-white transition-colors">
                  Retour
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Connexion
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Comptes {gameName}</h1>
          <p className="text-gray-300 text-lg">Découvrez notre sélection de comptes {gameName} vérifiés et sécurisés</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un compte..."
                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-high">Prix croissant</SelectItem>
                  <SelectItem value="high-low">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">Niveau 1-50</SelectItem>
                  <SelectItem value="51-100">Niveau 51-100</SelectItem>
                  <SelectItem value="100+">Niveau 100+</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Shield className="w-3 h-3 mr-1" />
              Vérifiés
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Zap className="w-3 h-3 mr-1" />
              Livraison Instantanée
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Star className="w-3 h-3 mr-1" />
              Vendeurs 5 étoiles
            </Badge>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={account.image || "/placeholder.svg"}
                    alt={account.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">{account.rarity}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {account.verified && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/50">
                        <Shield className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{account.title}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
                    Niv. {account.level}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                    {account.items} items
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {account.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="text-xs text-gray-400">
                      • {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-400">Par {account.seller}</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-400">{account.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">€{account.price}</span>
                      {account.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">€{account.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {account.delivery}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Acheter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Charger Plus de Comptes
          </Button>
        </div>
      </div>
    </div>
  )
}
