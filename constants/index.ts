import { Ingredient } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const defaultIngredients: Ingredient[] = [
  { id: uuidv4(), name: "Tomato" },
  { id: uuidv4(), name: "Potato" },
  { id: uuidv4(), name: "Carrot" },
  { id: uuidv4(), name: "Chicken" },
  { id: uuidv4(), name: "Beef" },
  { id: uuidv4(), name: "Pork" },
  { id: uuidv4(), name: "Fish" },
  { id: uuidv4(), name: "Pasta" },
  { id: uuidv4(), name: "Rice" },
  { id: uuidv4(), name: "Bread" },
  { id: uuidv4(), name: "Cheese" },
  { id: uuidv4(), name: "Pizza" },
  { id: uuidv4(), name: "Salad" },
  { id: uuidv4(), name: "Soup" },
  { id: uuidv4(), name: "Egg" },
  { id: uuidv4(), name: "Milk" },
  { id: uuidv4(), name: "Banana" },
  { id: uuidv4(), name: "Garlic" },
  { id: uuidv4(), name: "Onion" },
] as const;

export const RECIPES_PER_PAGE = 12 as const;
