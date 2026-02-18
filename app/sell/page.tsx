import { CreateGameAccountForm } from "@/components/CreateGameAccountForm";

export default function SellPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Sell Your Game Account</h1>
      <p className="text-gray-600 mb-8">
        Fill out the form below to list your game account for sale.
      </p>
      <div className="max-w-2xl">
        <CreateGameAccountForm />
      </div>
    </main>
  );
}
