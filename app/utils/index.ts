import { Recipe } from "@/types";

/**
 * Filters recipes by the selected ingredients and sorts them by the given criteria
 * @param recipes - The recipes to filter
 * @param selectedIngredients - The ingredients to filter by
 * @param sortBy - The criteria to sort by
 * @returns The filtered and sorted recipes
 */
export const filterRecipesByIngredients = (
  recipes: Recipe[],
  selectedIngredients: string[],
  sortBy: "matchingIngredients" | "likes" | "fewerMissingIngredients" = "matchingIngredients"
): Recipe[] => {
  if (selectedIngredients.length === 0 || recipes.length === 0) return [];

  const filteredRecipes = recipes.filter((recipe) => {
    const normalizedRecipeIngredients = recipe.usedIngredients.map((ingredient) => ingredient.name.toLowerCase());

    const normalizedSelectedIngredients = selectedIngredients.map((ingredient) => ingredient.toLowerCase());

    const matchingIngredientsCount = normalizedSelectedIngredients.filter((selectedIngredient) =>
      normalizedRecipeIngredients.includes(selectedIngredient)
    ).length;
    console.log(normalizedRecipeIngredients, normalizedSelectedIngredients, matchingIngredientsCount);

    return matchingIngredientsCount > 0;
  });

  if (sortBy === "matchingIngredients") return sortRecipesByMatchingIngredients(filteredRecipes);
  if (sortBy === "likes") return sortRecipesByLikes(filteredRecipes);

  return filteredRecipes;
};

/**
 * Sorts recipes by the number of matching ingredients in descending order
 * @param recipes - The recipes to sort
 * @param selectedIngredients - The ingredients to filter by
 * @returns The sorted recipes
 */
export const sortRecipesByMatchingIngredients = (recipes: Recipe[]): Recipe[] => {
  return recipes.sort((a, b) => {
    if (b.usedIngredientCount !== a.usedIngredientCount) {
      return b.usedIngredientCount - a.usedIngredientCount;
    }
    return b.likes - a.likes;
  });
};

/**
 * Sorts recipes by likes in descending order
 * @param recipes - The recipes to sort
 * @returns The sorted recipes
 */
export const sortRecipesByLikes = (recipes: Recipe[]): Recipe[] => {
  return recipes.sort((a, b) => b.likes - a.likes);
};

/**
 * Sorts recipes by the number of missing ingredients in ascending order
 * @param recipes - The recipes to sort
 * @returns The sorted recipes
 */
export const sortByFewerMissingIngredients = (recipes: Recipe[]): Recipe[] => {
  return recipes.sort((a, b) => a.missedIngredientCount - b.missedIngredientCount);
};
