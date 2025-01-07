"use client";

import { Recipe, Ingredient } from "@/types";
import { defaultIngredients } from "@/constants";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useSelectedIngredients } from "@/hooks/useSelectedIngredients";
import { useIngredientDropdown } from "@/hooks/useIngredientDropdown";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useState } from "react";

export interface SearchBarProps {
  handleSetRecipes: (newRecipes: Recipe[]) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export default function SearchBar({ setIsSearching, handleSetRecipes }: SearchBarProps) {
  const { params } = useUrlParams();
  const { searchRecipes, error } = useRecipeSearch({ handleSetRecipes, setIsSearching });

  const { selectedTags, addIngredient, removeIngredient } = useSelectedIngredients({
    ingredientsFromUrl: params.ingredients,
    onInitialLoad: (ingredients) => {
      // Automatically search recipes when the component is mounted with ingredients in the URL
      searchRecipes(ingredients);
    },
  });

  const handleSearch = useCallback(() => {
    const ingredients = selectedTags.map((tag) => tag.name);
    searchRecipes(ingredients);
  }, [selectedTags, searchRecipes]);

  const { isDropdownOpen, setIsDropdownOpen, inputRef, dropdownRef, filteredIngredients } = useIngredientDropdown();

  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = useCallback(
    (newTag: Ingredient) => {
      addIngredient(newTag);
      setInputValue("");
      setIsDropdownOpen(false);
    },
    [addIngredient, setInputValue, setIsDropdownOpen]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag({
        id: uuidv4(),
        name: inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="ingredients-search"
          id="ingredients-search"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type or select ingredients..."
          className="w-full px-4 py-3 rounded-lg border border-tertiary-light dark:border-tertiary-dark 
                 bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark 
                 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
        />

        {isDropdownOpen && filteredIngredients.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredIngredients(defaultIngredients, selectedTags, inputValue).map((ingredient) => (
              <li
                key={ingredient.id}
                onClick={() => handleAddTag(ingredient)}
                className="px-4 py-2 cursor-pointer text-secondary-light dark:text-secondary-dark 
              hover:bg-tertiary-light/10 dark:hover:bg-tertiary-dark/10"
              >
                {ingredient.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-tertiary-light dark:bg-tertiary-dark 
                   text-secondary-light dark:text-secondary-dark rounded-full 
                   flex items-center gap-2 text-sm"
            >
              {tag.name}
              <button
                type="button"
                name="remove-tag"
                aria-label="Remove tag"
                onClick={() => removeIngredient(tag.id)}
                className="hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={selectedTags.length === 0}
        className="m-auto mt-8 px-10 py-3 bg-primary-light dark:bg-primary-dark 
                 text-white rounded-lg flex items-center justify-center gap-2
                 hover:opacity-90 transition-opacity disabled:opacity-50 
                 disabled:cursor-not-allowed"
      >
        <Search className="w-5 h-5" />
        Search Recipes
      </button>

      {error && (
        <ErrorDisplay
          title="Recipe Search Error"
          message={error}
          onRetry={() => searchRecipes(selectedTags.map((tag) => tag.name))}
        />
      )}
    </div>
  );
}
