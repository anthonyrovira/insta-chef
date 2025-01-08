import { Recipe, RecipeInformation } from "@/types";

const API_BASE_URL = "https://api.spoonacular.com" as const;

interface FindByIngredientsParams {
  ingredients: string[];
  number?: number;
  ranking?: 1 | 2;
  ignorePantry?: boolean;
}

export const SPOONACULAR_API_KEYS = [
  process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_1 as string,
  process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_2 as string,
  process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY_3 as string,
] as const;

/**
 * Make a request with failover
 * @param url - The URL to make the request to
 * @param params - The parameters to use
 * @returns The response
 */
async function makeRequestWithFailover(url: string, params?: URLSearchParams): Promise<Response> {
  for (const apiKey of SPOONACULAR_API_KEYS) {
    try {
      // Add the API key to the URL and the params if they exist
      const finalUrl = `${url}?apiKey=${apiKey}${params ? `&${params}` : ""}`;

      // Make the request
      const response = await fetch(finalUrl);

      // If the request is successful, return the response
      if (response.ok) return response;

      // If the request is rate limited or payment required, continue with the next API key
      if (response.status === 429 || response.status === 402) continue;

      // If the request fails for any other reason, throw an error
      throw new Error(`API call failed: ${response.statusText}`);
    } catch (error) {
      // If the last API key fails, throw the error
      if (apiKey === SPOONACULAR_API_KEYS[SPOONACULAR_API_KEYS.length - 1]) {
        throw error;
      }
      // Otherwise, continue with the next API key
      continue;
    }
  }
  // If all API keys have failed, throw an error
  throw new Error("All API keys have failed");
}

/**
 * Find recipes by ingredients
 * @param params - The parameters to use
 * @returns The recipes
 */
export async function findRecipesByIngredients({
  ingredients,
  number = 100,
  ranking = 1,
  ignorePantry = true,
}: FindByIngredientsParams): Promise<Recipe[]> {
  try {
    const params = new URLSearchParams({
      ingredients: ingredients.join(",").toLowerCase(),
      number: number.toString(),
      ranking: ranking.toString(),
      ignorePantry: ignorePantry.toString(),
    });

    const response = await makeRequestWithFailover(`${API_BASE_URL}/recipes/findByIngredients`, params);

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

/**
 * Get recipe information
 * @param id - The id of the recipe
 * @returns The recipe information
 */
export async function getRecipeInformation(id: number): Promise<RecipeInformation> {
  try {
    const response = await makeRequestWithFailover(`${API_BASE_URL}/recipes/${id}/information`);

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe information:", error);
    throw error;
  }
}
