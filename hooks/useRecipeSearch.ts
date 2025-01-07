import { useState, useCallback } from "react";
import { Recipe } from "@/types";
import { findRecipesByIngredients } from "@/services/api";
import { useUrlParams } from "@/hooks/useUrlParams";
import { mockRecipes } from "@/mocks/recipes";

interface UseRecipeSearchProps {
  handleSetRecipes: (recipes: Recipe[]) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export const useRecipeSearch = ({ handleSetRecipes, setIsSearching }: UseRecipeSearchProps) => {
  const { updateParams } = useUrlParams();
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for recipes
   * @param ingredients - The ingredients to search for
   * @returns void
   */
  const searchRecipes = useCallback(
    async (ingredients: string[]) => {
      if (ingredients.length === 0) {
        handleSetRecipes([]);
        updateParams({ ingredients: [] });
        return;
      }

      setIsSearching(true);
      setError(null);
      updateParams({ ingredients });

      try {
        const recipes = await findRecipesByIngredients({
          ingredients,
          number: 100,
          ranking: 1,
          ignorePantry: true,
        });
        handleSetRecipes(recipes);
      } catch (error) {
        console.error("Error searching recipes:", error);
        setError("We couldn't find recipes right now. Please try again later.");
      } finally {
        setIsSearching(false);
      }
    },
    [handleSetRecipes]
  );

  return { searchRecipes, error };
};
