import { useState, useEffect, useCallback, useRef } from "react";
import { Ingredient } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface UseSelectedIngredientsProps {
  ingredientsFromUrl: string[];
  onInitialLoad?: (ingredients: string[]) => void;
  onEmptyIngredients?: () => void;
}

export const useSelectedIngredients = ({
  ingredientsFromUrl,
  onInitialLoad,
  onEmptyIngredients,
}: UseSelectedIngredientsProps) => {
  const [selectedTags, setSelectedTags] = useState<Ingredient[]>([]);
  const isFirstRender = useRef<boolean>(true);

  /**
   * Add an ingredient
   * @param newTag - The ingredient to add
   * @returns void
   */
  const addIngredient = useCallback((newTag: Ingredient) => {
    setSelectedTags((prev) => [...prev, newTag]);
  }, []);

  /**
   * Remove an ingredient
   * @param tagId - The ID of the ingredient to remove
   * @returns void
   */
  const removeIngredient = useCallback(
    (tagId: string) => {
      setSelectedTags((prev) => {
        const newTags = prev.filter((tag) => tag.id !== tagId);
        if (newTags.length === 0 && onEmptyIngredients) {
          onEmptyIngredients();
        }
        return newTags;
      });
    },
    [onEmptyIngredients]
  );

  useEffect(() => {
    // Only run when the component is mounted and there are ingredients in the URL
    if (isFirstRender.current && ingredientsFromUrl.length > 0) {
      const formattedIngredients = ingredientsFromUrl.map((name) => ({
        id: uuidv4(),
        name: decodeURIComponent(name).charAt(0).toUpperCase() + decodeURIComponent(name).slice(1),
      }));

      setSelectedTags(formattedIngredients);

      // Trigger the search only when the component is mounted with params
      if (onInitialLoad) {
        onInitialLoad(ingredientsFromUrl);
      }
    }
    isFirstRender.current = false;
  }, [ingredientsFromUrl, onInitialLoad]);

  return {
    selectedTags,
    addIngredient,
    removeIngredient,
    setSelectedTags,
  };
};
