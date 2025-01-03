import { SUPABASE_CONFIG } from "@/config/supabase";
import { Recipe } from "@/types";

const API_BASE_URL = "https://api.spoonacular.com";

interface FindByIngredientsParams {
  ingredients: string[];
  number?: number;
  ranking?: 1 | 2;
  ignorePantry?: boolean;
}

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

    const response = await fetch(`${API_BASE_URL}/recipes/findByIngredients?${params}`, {
      headers: {
        "x-api-key": SUPABASE_CONFIG.anonKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}
