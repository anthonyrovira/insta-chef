"use client";

import { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";
import { useCallback, useMemo, useState } from "react";
import { CircleChevronRight, CircleChevronLeft, LayoutGrid, LayoutList } from "lucide-react";

export default function SearchResult({ recipes }: { recipes: Recipe[] }) {
  const [sort, setSort] = useState<string>("relevance");
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const RECIPES_PER_PAGE = 12 as const;

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

  // Compute paginated recipes
  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
    const endIndex = startIndex + RECIPES_PER_PAGE;
    return filteredRecipes.slice(startIndex, endIndex);
  }, [filteredRecipes, currentPage]);

  // Compute total pages
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-secondary-light dark:text-secondary-dark">
          Recipes found <span className="text-primary-light dark:text-primary-dark">({recipes.length})</span>
        </h2>

        <div className="flex flex-wrap gap-4 ">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-secondary-light dark:text-secondary-dark">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-3 h-9 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="likes-asc">Likes (Low to High)</option>
              <option value="likes-desc">Likes (High to Low)</option>
              <option value="ingredients-asc">Ingredients (Low to High)</option>
              <option value="ingredients-desc">Ingredients (High to Low)</option>
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
              className="px-3 h-9 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="missing-5">5 missing ingredients or less</option>
              <option value="missing-3">3 missing ingredients or less</option>
              <option value="likes-10">10+ likes</option>
              <option value="likes-50">50+ likes</option>
            </select>
          </div>

          <div className="gap-2 hidden lg:flex lg:items-center">
            <button
              aria-label="Toggle view mode"
              name="view-mode"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 w-9 h-9 rounded-lg border border-tertiary-light dark:border-tertiary-dark hover:bg-background-dark/10"
            >
              {viewMode === "grid" ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
            </button>
          </div>
        </div>
      </div>

      <RecipeCard recipes={paginatedRecipes} viewMode={viewMode} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="mr-2 px-4 py-2  dark:text-primary-dark  hover:text-secondary-medium  dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CircleChevronLeft />
          </button>

          <span className="text-secondary-light dark:text-secondary-dark">
            <span className="font-bold text-primary-light dark:text-primary-dark">{currentPage}</span> of{" "}
            <span className="font-bold text-primary-light dark:text-primary-dark">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="ml-2 px-4 py-2  dark:text-primary-dark  hover:text-secondary-medium  dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CircleChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
