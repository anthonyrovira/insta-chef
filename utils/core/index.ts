import { Filter, Ingredient, Recipe, Sort } from "@/types";

/**
 * Get the health score color based on the score
 * @param score - The health score (0-100)
 * @returns The health score color (red, yellow, green)
 */
export const getHealthScoreColor = (score: number) => {
  if (score <= 33) return "text-red-500";
  if (score <= 66) return "text-yellow-500";
  return "text-green-500";
};

/**
 * Filter ingredients that are not already selected and that match the input value
 * @param ingredients - The ingredients to filter
 * @param selectedTags - The selected tags
 * @param inputValue - The input value
 * @returns The filtered ingredients that are not already selected and that match the input value
 */
export const filterIngredients = (ingredients: Ingredient[], selectedTags: Ingredient[], inputValue: string) => {
  return ingredients.filter(
    (ingredient) =>
      !selectedTags.some((tag) => tag.name === ingredient.name) &&
      ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
  );
};

/**
 * Sort recipes based on the sort parameter
 * @param recipes - The recipes to sort
 * @param sort - The sort parameter
 * @returns The sorted recipes
 */
export const sortRecipes = (recipes: Recipe[], sort: Sort) => {
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
};

/**
 * Filter recipes based on the filter parameter
 * @param recipes - The recipes to filter
 * @param filter - The filter parameter
 * @param favorites - The favorites recipes
 * @returns The filtered recipes
 */
export const filterRecipes = (recipes: Recipe[], filter: Filter, favorites: number[]) => {
  const filteredRecipes = [...recipes];

  switch (filter) {
    case "favorites":
      return filteredRecipes.filter((recipe) => favorites.includes(recipe.id));
    case "missing-5":
      return filteredRecipes.filter((recipe) => recipe.missedIngredientCount <= 5);
    case "missing-3":
      return filteredRecipes.filter((recipe) => recipe.missedIngredientCount <= 3);
    case "likes-10":
      return filteredRecipes.filter((recipe) => recipe.likes >= 10);
    case "likes-50":
      return filteredRecipes.filter((recipe) => recipe.likes >= 50);
    case "all":
    default:
      return filteredRecipes; // Default: all
  }
};

/**
 * Compute paginated recipes
 * @param recipes - The recipes to paginate
 * @param currentPage - The current page
 * @param recipesPerPage - The number of recipes per page
 * @returns The paginated recipes
 */
export const paginateRecipes = (recipes: Recipe[], currentPage: number, recipesPerPage: number) => {
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  return recipes.slice(startIndex, endIndex);
};
