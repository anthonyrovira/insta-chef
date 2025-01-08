"use client";

import { useState, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import { Recipe } from "@/types";
import { Loader } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <Loader className="text-primary-dark animate-spin size-10" />
        </div>
      }
    >
      <div className="min-h-screen t-24 p-4 md:p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-secondary-light/70 dark:text-secondary-dark/70 mb-12 max-w-xl mx-auto">
            Pick the ingredients you have and we&apos;ll find the perfect recipe for you!
          </p>

          <div className="p-0 md:p-8 rounded-2xl">
            <SearchBar setIsSearching={setIsSearching} setError={setError} setRecipes={setRecipes} />
          </div>

          {error && <div className="text-red-500 text-center mt-4">{error}</div>}

          {isSearching ? (
            <div className="text-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
            </div>
          ) : (
            recipes.length > 0 && <SearchResult recipes={recipes} />
          )}
        </div>
      </div>
    </Suspense>
  );
}
