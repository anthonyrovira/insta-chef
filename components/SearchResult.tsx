"use client";

import { Filter, Recipe, Sort, View } from "@/types";
import RecipeCard from "./RecipeCard";
import { useMemo, useState } from "react";
import { CircleChevronRight, CircleChevronLeft, LayoutGrid, LayoutList, BookmarkX, ChefHat } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useFavorites } from "@/hooks/useFavorites";
import { useUrlParams } from "@/hooks/useUrlParams";
import { filterRecipes, paginateRecipes, sortRecipes } from "@/utils/core";
import { RECIPES_PER_PAGE } from "@/constants";

interface SearchResultProps {
  recipes: Recipe[];
}

export default function SearchResult({ recipes }: SearchResultProps) {
  const { params, updateParams } = useUrlParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const userSession = useUser();
  const { favorites } = useFavorites();

  const handleSortChange = (value: Sort) => {
    updateParams({ sort: value });
  };

  const handleFilterChange = (value: Filter) => {
    updateParams({ filter: value });
  };

  const handleViewModeChange = (mode: View) => {
    updateParams({ view: mode });
  };

  const sortedRecipes = useMemo(() => sortRecipes(recipes, params.sort || "relevance"), [recipes, params.sort]);
  const filteredRecipes = useMemo(
    () => filterRecipes(sortedRecipes, params.filter || "all", favorites),
    [sortedRecipes, params.filter, favorites]
  );

  // Compute paginated recipes
  const paginatedRecipes = useMemo(
    () => paginateRecipes(filteredRecipes, currentPage, RECIPES_PER_PAGE),
    [filteredRecipes, currentPage]
  );

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
          Recipes found <span className="text-primary-light dark:text-primary-dark">({filteredRecipes.length})</span>
        </h2>

        <div className="flex flex-wrap gap-4 ">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-secondary-light dark:text-secondary-dark">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-3 h-9 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              onChange={(e) => handleSortChange(e.target.value as Sort)}
              value={params.sort || "relevance"}
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
              onChange={(e) => handleFilterChange(e.target.value as Filter)}
              value={params.filter || "all"}
            >
              <option value="all">All</option>
              {userSession && <option value="favorites">Favorites only</option>}
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
              onClick={() => handleViewModeChange(params.view === "grid" ? "list" : "grid")}
              className="p-2 w-9 h-9 rounded-lg border border-tertiary-light dark:border-tertiary-dark hover:bg-background-dark/10"
            >
              {params.view === "grid" ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
            </button>
          </div>
        </div>
      </div>

      {params.filter === "favorites" && paginatedRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
          <BookmarkX className="w-16 h-16 text-secondary-light dark:text-secondary-dark opacity-80" />

          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-secondary-light dark:text-secondary-dark">No favorite recipes found</h3>
            <p className="text-secondary-light/70 dark:text-secondary-dark/70">
              Looks like you haven&apos;t bookmarked any recipes from your current search yet.
            </p>
          </div>

          <div className="flex items-center gap-2 text-primary-light dark:text-primary-dark mt-2">
            <ChefHat className="w-5 h-5" />
            <span className="text-sm font-medium">Start bookmarking recipes to see them here!</span>
          </div>
        </div>
      )}

      <RecipeCard recipes={paginatedRecipes} viewMode={params.view || "grid"} />

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
