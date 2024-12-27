"use client";

import { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";
import { useCallback, useMemo, useState } from "react";

export default function SearchResult({ recipes }: { recipes: Recipe[] }) {
  const [sort, setSort] = useState<string>("relevance");
  const [filter, setFilter] = useState<string>("all");

  // sort recipes
  const sortRecipes = useCallback(
    (recipes: Recipe[]) => {
      switch (sort) {
        case "likes-asc":
          return [...recipes].sort((a, b) => a.likes - b.likes);
        case "likes-desc":
          return [...recipes].sort((a, b) => b.likes - a.likes);
        case "ingredients-asc":
          return [...recipes].sort((a, b) => a.usedIngredientCount - b.usedIngredientCount);
        case "ingredients-desc":
          return [...recipes].sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);
        case "missing-asc":
          return [...recipes].sort((a, b) => a.missedIngredientCount - b.missedIngredientCount);
        case "missing-desc":
          return [...recipes].sort((a, b) => b.missedIngredientCount - a.missedIngredientCount);
        default:
          return recipes; // Default: relevance
      }
    },
    [sort]
  );

  // filter recipes
  const filterRecipes = useCallback(
    (recipes: Recipe[]) => {
      switch (filter) {
        case "missing-5":
          return recipes.filter((recipe) => recipe.missedIngredientCount <= 5);
        case "missing-3":
          return recipes.filter((recipe) => recipe.missedIngredientCount <= 3);
        case "likes-10":
          return recipes.filter((recipe) => recipe.likes >= 10);
        case "likes-50":
          return recipes.filter((recipe) => recipe.likes >= 50);
        default:
          return recipes; // Default: all
      }
    },
    [filter]
  );

  const sortedRecipes = useMemo(() => sortRecipes(recipes), [recipes, sort]);
  const filteredRecipes = useMemo(() => filterRecipes(sortedRecipes), [sortedRecipes, filter]);

  return (
    <div className="w-full mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-semibold mb-6 text-secondary-light dark:text-secondary-dark">
          Recipes found <span className="text-primary-light dark:text-primary-dark">({recipes.length})</span>
        </h2>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-secondary-light dark:text-secondary-dark">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-3 py-1.5 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="likes-asc">Likes (Low to High)</option>
              <option value="likes-desc">Likes (High to Low)</option>
              <option value="ingredients-asc">Number of ingredients (Low to High)</option>
              <option value="ingredients-desc">Number of ingredients (High to Low)</option>
              <option value="missing-asc">Missing ingredients (Low to High)</option>
              <option value="missing-desc">Missing ingredients (High to Low)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-secondary-light dark:text-secondary-dark">
              Filter by:
            </label>
            <select
              id="filter"
              className="px-3 py-1.5 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="missing-5">5 missing ingredients or less</option>
              <option value="missing-3">3 missing ingredients or less</option>
              <option value="likes-10">10+ likes</option>
              <option value="likes-50">50+ likes</option>
            </select>
          </div>
        </div>
      </div>

      <RecipeCard recipes={filteredRecipes} />
    </div>
  );
}
