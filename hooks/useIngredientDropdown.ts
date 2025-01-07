import { useState, useRef, useEffect } from "react";
import { Ingredient } from "@/types";

export const useIngredientDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    /**
     * Handles the click outside event to close the dropdown.
     * @param event - The mouse event.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Filter ingredients
   * @param ingredients - The ingredients to filter
   * @param selectedTags - The selected tags
   * @param inputValue - The input value
   * @returns The filtered ingredients
   */
  const filteredIngredients = (ingredients: Ingredient[], selectedTags: Ingredient[], inputValue: string) => {
    const filtered = ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some((tag) => tag.name === ingredient.name)
    );

    // If the input is not empty and does not match any existing ingredient
    if (inputValue && !ingredients.some((ing) => ing.name.toLowerCase() === inputValue.toLowerCase())) {
      const newIngredient: Ingredient = {
        id: `custom-${inputValue}`,
        name: inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
      };

      // Check that the ingredient is not already in the selected tags
      if (!selectedTags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase())) {
        filtered.push(newIngredient);
      }
    }

    return filtered;
  };

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    inputRef,
    dropdownRef,
    filteredIngredients,
  };
};
