import { SUPABASE_CONFIG } from "@/config/supabase";
import { Recipe } from "@/types";

const API_BASE_URL = "https://api.spoonacular.com" as const;

interface FindByIngredientsParams {
  ingredients: string[];
  number?: number;
  ranking?: 1 | 2;
  ignorePantry?: boolean;
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

    const response = await fetch(
      `${API_BASE_URL}/recipes/findByIngredients?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&${params}`,
      {
        headers: {
          "x-api-key": SUPABASE_CONFIG.anonKey || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}
