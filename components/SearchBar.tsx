"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Recipe } from "@/types";
import { mockRecipes } from "@/mocks/recipes";
import { findRecipesByIngredients } from "@/services/api";

interface Ingredient {
  id: string;
  name: string;
}

interface SearchBarProps {
  handleSetRecipes: (newRecipes: Recipe[]) => void;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
}

export default function SearchBar({ setIsSearching, handleSetRecipes }: SearchBarProps) {
  const [selectedTags, setSelectedTags] = useState<Ingredient[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const mockIngredients: Ingredient[] = [
    { id: uuidv4(), name: "Tomato" },
    { id: uuidv4(), name: "Potato" },
    { id: uuidv4(), name: "Carrot" },
    { id: uuidv4(), name: "Chicken" },
    { id: uuidv4(), name: "Beef" },
    { id: uuidv4(), name: "Fish" },
    { id: uuidv4(), name: "Pasta" },
    { id: uuidv4(), name: "Rice" },
    { id: uuidv4(), name: "Bread" },
    { id: uuidv4(), name: "Cheese" },
    { id: uuidv4(), name: "Egg" },
    { id: uuidv4(), name: "Milk" },
    { id: uuidv4(), name: "Butter" },
    { id: uuidv4(), name: "Sugar" },
    { id: uuidv4(), name: "Salt" },
    { id: uuidv4(), name: "Banana" },
    { id: uuidv4(), name: "Oil" },
    { id: uuidv4(), name: "Vinegar" },
    { id: uuidv4(), name: "Pepper" },
    { id: uuidv4(), name: "Garlic" },
    { id: uuidv4(), name: "Onion" },
  ];

  const handleSearch = async (ingredients: string[]) => {
    setIsSearching(true);

    try {
      const recipes = await findRecipesByIngredients({
        ingredients,
        number: 100,
        ranking: 1,
        ignorePantry: true,
      });

      handleSetRecipes(recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      handleSetRecipes(mockRecipes);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredIngredients = (ingredients: Ingredient[]) =>
    ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some((tag) => tag.name === ingredient.name)
    );

  const handleAddTag = (newTag: Ingredient) => {
    setSelectedTags([...selectedTags, newTag]);
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  useEffect(() => {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="ingredients-search"
          id="ingredients-search"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Type or select ingredients..."
          className="w-full p-4 rounded-lg border border-tertiary-light dark:border-tertiary-dark bg-background-light dark:bg-background-dark text-secondary-light dark:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark shadow-sm"
        />

        {isDropdownOpen && filteredIngredients.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredIngredients(mockIngredients).map((ingredient) => (
              <li
                key={ingredient.id}
                className="px-4 py-2 text-secondary-light dark:text-secondary-dark hover:bg-tertiary-light dark:hover:bg-tertiary-dark cursor-pointer transition-colors"
                onClick={() => handleAddTag(ingredient)}
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
              className="px-3 py-1.5 bg-tertiary-light dark:bg-tertiary-dark text-secondary-light dark:text-secondary-dark rounded-full flex items-center gap-2 text-sm border border-tertiary-light dark:border-tertiary-dark"
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          handleSearch(selectedTags.map((tag) => tag.name));
        }}
        className="mt-4 py-2 px-10 mx-auto block bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedTags.length === 0}
      >
        Search for recipes
      </button>
    </div>
  );
}
