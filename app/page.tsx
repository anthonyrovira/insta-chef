"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import { Recipe } from "@/types";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetRecipes = (newRecipes: Recipe[]) => {
    setError(null);
    setRecipes(newRecipes);
  };

  return (
    <div className="min-h-screen t-24 p-4 md:p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-secondary-light/70 dark:text-secondary-dark/70 mb-12 max-w-xl mx-auto">
          Pick the ingredients you have and we&apos;ll find the perfect recipe for you!
        </p>

        <div className="p-0 md:p-8 rounded-2xl">
          <SearchBar handleSetRecipes={handleSetRecipes} setIsSearching={setIsSearching} />
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
  );
}
