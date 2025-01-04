import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from './useUser';

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
  const { user } = useUser();
  const supabase = createClient();

  const loadFavorites = async () => {
    if (!user) {
      setFavoritesState({ favorites: [], isLoading: false, error: null });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavoritesState({ favorites: data.map(fav => fav.recipe_id), isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setFavoritesState({ favorites: [], isLoading: false, error: null });
    }
  };

  const addFavorite = async (recipeId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, recipe_id: recipeId });

      if (error) throw error;

      setFavoritesState(prev => ({ ...prev, favorites: [...prev.favorites, recipeId] }));
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  // Retirer des favoris
  const removeFavorite = async (recipeId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      setFavoritesState(prev => ({ ...prev, favorites: prev.favorites.filter(id => id !== recipeId) }));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };


  const isFavorite = (recipeId: number) => favoritesState.favorites.includes(recipeId);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites: favoritesState.favorites,
    isLoading: favoritesState.isLoading,
    error: favoritesState.error,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}; 