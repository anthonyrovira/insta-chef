import { useState, useCallback } from "react";
import { Recipe, RecipeInformation } from "@/types";
import { findRecipesByIngredients as getRecipesByIngredients } from "@/services/api";
import { useUrlParams } from "@/hooks/useUrlParams";

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
        const recipes = await getRecipesByIngredients({
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

  const getRecipeInformation = useCallback(async (id: number): Promise<RecipeInformation> => {
    try {
      return await getRecipeInformation(id);
    } catch (error) {
      console.error("Error fetching recipe information:", error);
      throw error;
    }
  }, []);

  return { searchRecipes, getRecipeInformation, error };
};
