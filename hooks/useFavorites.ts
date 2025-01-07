import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";
import { PostgrestError } from "@supabase/supabase-js";

interface FavoritesState {
  favorites: number[];
  isLoading: boolean;
  error: string | null;
}

export const useFavorites = () => {
  const [favoritesState, setFavoritesState] = useState<FavoritesState>({
    favorites: [],
    isLoading: true,
    error: null,
  });
  const userSession = useUser();
  const supabase = createClient();

  /**
   * Handle Supabase errors
   * @param error - The error to handle
   * @returns A string describing the error
   */
  const handleSupabaseError = (error: PostgrestError) => {
    switch (error.code) {
      case "PGRST116":
        return "Invalid API key or authentication failed";
      case "42501":
        return "You don't have permission to perform this action";
      case "23505":
        return "This recipe is already in your favorites";
      default:
        return `Database error: ${error.message}`;
    }
  };

  /**
   * Load favorites
   * @returns void
   */
  const loadFavorites = async () => {
    if (!userSession) {
      setFavoritesState({ favorites: [], isLoading: false, error: null });
      return;
    }

    try {
      const { data, error } = await supabase.from("favorites").select("recipe_id").eq("user_id", userSession.id);

      if (error) throw error;

      setFavoritesState({
        favorites: data.map((fav) => fav.recipe_id),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load favorites";
      setFavoritesState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  /**
   * Add a favorite recipe
   * @param recipeId - The ID of the recipe to add
   * @returns void
   */
  const addFavorite = async (recipeId: number) => {
    if (!userSession) {
      setFavoritesState((prev) => ({
        ...prev,
        error: "Please log in to save favorites",
      }));
      return;
    }

    try {
      const { error } = await supabase.from("favorites").insert({ user_id: userSession.id, recipe_id: recipeId });

      if (error) throw error;

      setFavoritesState((prev) => ({
        ...prev,
        favorites: [...prev.favorites, recipeId],
        error: null,
      }));
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        setFavoritesState((prev) => ({
          ...prev,
          error: handleSupabaseError(error as PostgrestError),
        }));
      } else {
        setFavoritesState((prev) => ({
          ...prev,
          error: "Failed to add favorite",
        }));
      }
    }
  };

  /**
   * Remove a favorite recipe
   * @param recipeId - The ID of the recipe to remove
   * @returns void
   */
  const removeFavorite = async (recipeId: number) => {
    if (!userSession) {
      setFavoritesState((prev) => ({
        ...prev,
        error: "Please log in to manage favorites",
      }));
      return;
    }

    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", userSession.id).eq("recipe_id", recipeId);

      if (error) throw error;

      setFavoritesState((prev) => ({
        ...prev,
        favorites: prev.favorites.filter((id) => id !== recipeId),
        error: null,
      }));
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        setFavoritesState((prev) => ({
          ...prev,
          error: handleSupabaseError(error as PostgrestError),
        }));
      } else {
        setFavoritesState((prev) => ({
          ...prev,
          error: "Failed to remove favorite",
        }));
      }
    }
  };

  /**
   * Clear the error state
   * @returns void
   */
  const clearError = () => {
    setFavoritesState((prev) => ({ ...prev, error: null }));
  };

  useEffect(() => {
    loadFavorites();
  }, [userSession]);

  return {
    favorites: favoritesState.favorites,
    isLoading: favoritesState.isLoading,
    error: favoritesState.error,
    addFavorite,
    removeFavorite,
    isFavorite: (recipeId: number) => favoritesState.favorites.includes(recipeId),
    clearError,
  };
};
