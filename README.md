# Gaming Marketplace — Architecture et Guide de Test

Ce document présente l’architecture du projet, la structure des dossiers/fichiers, les prérequis, et un guide de test pas‑à‑pas pour un nouvel utilisateur.

## Sommaire
- Stack technique et objectifs
- Architecture fonctionnelle et flux de données
- Arborescence et documentation de chaque fichier
- Configuration et démarrage
- Guide de test pas‑à‑pas (manuel et API)
- Dépannage et bonnes pratiques

## Stack Technique et Objectifs
- Framework: Next.js (App Router) `next@15`
- UI: Tailwind CSS + composants `shadcn/ui`
- Icônes: `lucide-react`
- Formulaires: `react-hook-form`
- Base de données: MySQL (`mysql2/promise`)
- Gestion thème: `next-themes`
- Build et tooling: PostCSS, Tailwind, ESLint

Objectif: Application web de présentation permettant de lister et publier des comptes de jeux, avec filtrage et une API REST simple pour récupérer/créer des annonces (listings).

## Architecture et Flux de Données
- Front (App Router): pages dans `app/` (ex. `app/page.tsx`, `app/sell/page.tsx`). Rendu côté client pour les interactions (ex. composants dans `components/`).
- API: route `GET/POST /api/game-accounts` qui interagit avec la BD via le module services.
  - `app/api/game-accounts/route.ts:4` expose `GET` et `POST`.
- Service BD: `lib/db-services.ts` regroupe les opérations SQL (jeux, comptes, transactions, avis).
  - `lib/db-services.ts:52` récupère tous les jeux.
  - `lib/db-services.ts:65` liste les comptes avec pagination/filtre.
  - `lib/db-services.ts:97` crée une annonce de compte.
- Connexion BD: `lib/db.ts` initialise un pool MySQL et fournit `query`.
  - `lib/db.ts:25` exécute les requêtes.
- Hooks client: `hooks/useGameAccounts.ts` gère état/pagination/filtre et appelle l’API.
  - `hooks/useGameAccounts.ts:39` construit la requête et fetch l’API.
- UI: composants réutilisables `components/ui/*` (boutons, inputs, cartes, sélecteurs…).

## Arborescence et Documentation de Chaque Fichier

### Racine
- `.gitignore` — Fichiers à ignorer par Git.
- `components.json` — Configuration des composants UI (shadcn).
- `database.sql` — Script SQL pour créer la base et tables (voir Guide de test).
- `next.config.mjs` — Config Next.js (désactive échecs TypeScript/ESLint en build, images non optimisées).
- `package.json` — Dépendances et scripts (`dev`, `build`, `start`, `lint`).
- `pnpm-lock.yaml` — Lockfile PNPM.
- `postcss.config.mjs` — Configuration PostCSS avec Tailwind.
- `tailwind.config.ts` — Config Tailwind (thème étendu, plugins).
- `tsconfig.json` — Configuration TypeScript.
- `styles/globals.css` — Styles globaux Tailwind (optionnel si doublon avec `app/globals.css`).
- `public/` — Assets statiques (images placeholders).
- `.next/` — Sortie de build/développement (générée automatiquement, ne pas modifier).

### Dossier `app/` (App Router)
- `app/globals.css` — Styles globaux chargés par l’App Router.
- `app/layout.tsx` — Layout racine HTML/body et métadonnées.
- `app/loading.tsx` — Écran de chargement global.
- `app/page.tsx` — Page d’accueil affichant `GameAccountsList`.
- `app/sell/page.tsx` — Page “Sell” avec le formulaire `CreateGameAccountForm`.
- `app/api/game-accounts/route.ts` — Route API:
  - `GET` — liste paginée et filtrée des comptes.
  - `POST` — crée une annonce de compte.
- `app/games/[game]/page.tsx` — Page dynamique par jeu (contenu mock de présentation).
- `app/games/[game]/loading.tsx` — Écran de chargement pour la page dynamique.

### Dossier `components/`
- `components/GameAccountsList.tsx` — Grille d’annonces côté client; recherche, filtre, pagination.
- `components/CreateGameAccountForm.tsx` — Formulaire client pour créer une annonce.
- `components/theme-provider.tsx` — Provider de thème (si utilisé).
- `components/ui/` — Composants UI réutilisables (shadcn). Chaque fichier:
  - `accordion.tsx` — Accordéon.
  - `alert-dialog.tsx` — Modale d’alerte avec actions.
  - `alert.tsx` — Bloc d’alerte.
  - `aspect-ratio.tsx` — Conteneur respectant un ratio.
  - `avatar.tsx` — Avatar utilisateur.
  - `badge.tsx` — Badges/étiquettes.
  - `breadcrumb.tsx` — Fil d’Ariane.
  - `button.tsx` — Bouton.
  - `calendar.tsx` — Sélecteur de date.
  - `card.tsx` — Carte avec header/content.
  - `carousel.tsx` — Carrousel.
  - `chart.tsx` — Wrapper chart.
  - `checkbox.tsx` — Case à cocher.
  - `collapsible.tsx` — Bloc repliable.
  - `command.tsx` — Palette de commande.
  - `context-menu.tsx` — Menu contextuel.
  - `dialog.tsx` — Boîte de dialogue.
  - `drawer.tsx` — Tiroir latéral.
  - `dropdown-menu.tsx` — Menu déroulant.
  - `form.tsx` — Aides pour formulaires.
  - `hover-card.tsx` — Carte au survol.
  - `input-otp.tsx` — Champ OTP.
  - `input.tsx` — Champ texte.
  - `label.tsx` — Label.
  - `menubar.tsx` — Barre de menu.
  - `navigation-menu.tsx` — Menu de navigation.
  - `pagination.tsx` — Pagination.
  - `popover.tsx` — Popover.
  - `progress.tsx` — Barre de progression.
  - `radio-group.tsx` — Boutons radio.
  - `resizable.tsx` — Panneaux redimensionnables.
  - `scroll-area.tsx` — Zone scrollable.
  - `select.tsx` — Sélecteur.
  - `separator.tsx` — Séparateur.
  - `sheet.tsx` — Sheet/modale.
  - `sidebar.tsx` — Sidebar.
  - `skeleton.tsx` — Skeleton loading.
  - `slider.tsx` — Slider.
  - `sonner.tsx` — Toast via sonner.
  - `switch.tsx` — Interrupteur.
  - `table.tsx` — Tableau.
  - `tabs.tsx` — Onglets.
  - `textarea.tsx` — Zone de texte.
  - `toast.tsx` — API toast.
  - `toaster.tsx` — Conteneur toasts.
  - `toggle-group.tsx` — Groupe de toggles.
  - `toggle.tsx` — Toggle.
  - `tooltip.tsx` — Infobulle.
  - `use-mobile.tsx` — Hook utilitaire UI mobile.
  - `use-toast.ts` — Hook toast.

### Dossier `hooks/`
- `hooks/useGameAccounts.ts` — Hook client pour gérer recherche/filtre/pagination et fetch API.
- `hooks/use-mobile.tsx` — Détection mobile.
- `hooks/use-toast.ts` — Gestion toasts.

### Dossier `lib/`
- `lib/db.ts` — Pool MySQL + helpers `getConnection`, `query`, et interfaces (`User`, `Game`, `GameAccount`, `Transaction`, `Review`).
- `lib/db-services.ts` — Services applicatifs (users, games, game_accounts, transactions, reviews) utilisant `pool`/`query`.
- `lib/utils.ts` — Utilitaire `cn` (merge classes Tailwind via `clsx`/`tailwind-merge`).

### Dossier `public/`
- `placeholder-*.png/svg/jpg` — Images placeholder pour maquettes.

### Dossier `styles/`
- `styles/globals.css` — Styles globaux (si utilisés en plus de `app/globals.css`).

### Dossier `.next/` (généré)
- `server/`, `static/`, `cache/`, manifests… — Artéfacts de build/dev. Ignorer en développement; ne pas éditer.

## Configuration et Démarrage

### Prérequis
- Node.js 18+ (recommandé 20+)
- PNPM ou NPM
- MySQL en local ou distant

### Installation des dépendances
- PNPM: `pnpm install`
- NPM: `npm install`

### Variables d’environnement
Créer `./.env.local` à la racine avec:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=gaming_marketplace
```

### Initialisation de la base
Importer `database.sql` dans votre MySQL:
- En ligne de commande: `mysql -u root -p < database.sql`
- Ou via un client (MySQL Workbench, TablePlus) en exécutant le script.

Important: Le formulaire de création d’annonce utilise `seller_id: 1` par défaut. Créez un utilisateur avec `id=1`:
```
INSERT INTO users (username, email, password_hash, is_verified)
VALUES ('demo', 'demo@example.com', 'hash-demo', true);
```

Les jeux sont pré-remplis par `database.sql`.

### Démarrage en développement
- PNPM: `pnpm dev`
- NPM: `npm run dev`
- Ouvrir `http://localhost:3000`

## Guide de Test Pas‑à‑Pas

### 1) Vérifier la page d’accueil
- Aller sur `/`.
- Attendre le chargement; la grille d’annonces s’affiche via `GameAccountsList`.
- Si la base est vide, la grille peut être vide; poursuivez avec la création d’une annonce.

### 2) Créer une annonce via l’UI
- Naviguer vers `/sell`.
- Renseigner les champs: jeu, titre, description, niveau (optionnel), items (optionnel), prix.
- Soumettre. Vous devriez voir un toast ou message de succès.
- Revenir à `/` et vérifier que l’annonce apparaît dans la liste (filtrer par jeu si besoin).

### 3) Tester le filtrage et la recherche
- Dans la page d’accueil, utiliser le champ “Search” et le filtre “Filter by game”.
- Vérifier que la pagination “Previous/Next” fonctionne.

### 4) Tester l’API directement
- `GET /api/game-accounts?page=1&limit=10` — doit renvoyer `{ success: true, data: [...] }`.
- Ajouter `&search=valorant` ou `&gameId=2` pour tester les filtres.
- `POST /api/game-accounts` — body JSON exemple:
```
{
  "seller_id": 1,
  "game_id": 2,
  "title": "Compte démo",
  "description": "Description démo",
  "level": 50,
  "items_count": 20,
  "price": 99.9
}
```
- Réponse attendue: `{ success: true, data: { ...nouvelle annonce... } }`.

### 5) Tester la page dynamique par jeu
- Ouvrir `/games/pubg-mobile` ou un autre slug; contenu mock de démonstration.

### 6) Lint et santé du projet
- Lancer `npm run lint` pour vérifier les règles ESLint (peut ignorer en build selon `next.config.mjs`).

## Dépannage
- Connexion BD: Vérifier `.env.local` et que MySQL écoute sur `MYSQL_HOST`.
- Droits SQL: Assurez‑vous que l’utilisateur MySQL a les droits de `INSERT/SELECT/UPDATE`.
- Données manquantes: Créez l’utilisateur avec `id=1` avant de publier via `/sell`.
- Typescript/ESLint: La build ignore les erreurs selon `next.config.mjs`; corriger les types si nécessaire en dev.

## Références de Code
- API: `app/api/game-accounts/route.ts:4` (`GET`), `app/api/game-accounts/route.ts:29` (`POST`).
- Services: `lib/db-services.ts:52` (`getAllGames`), `lib/db-services.ts:65` (`getGameAccounts`), `lib/db-services.ts:97` (`createGameAccount`).
- Connexion BD: `lib/db.ts:25` (`query`).
- Hook: `hooks/useGameAccounts.ts:39` (construction des paramètres et fetch).

