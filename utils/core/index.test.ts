import { describe, it, expect } from "vitest";
import { filterIngredients, filterRecipes, getHealthScoreColor, paginateRecipes, sortRecipes } from ".";
import { mockRecipes } from "@/mocks/recipes";

describe("getHealthScoreColor", () => {
  it("should return red for scores <= 33", () => {
    expect(getHealthScoreColor(0)).toBe("text-red-500");
    expect(getHealthScoreColor(33)).toBe("text-red-500");
  });

  it("should return yellow for scores between 34 and 66", () => {
    expect(getHealthScoreColor(34)).toBe("text-yellow-500");
    expect(getHealthScoreColor(66)).toBe("text-yellow-500");
  });

  it("should return green for scores > 66", () => {
    expect(getHealthScoreColor(67)).toBe("text-green-500");
    expect(getHealthScoreColor(100)).toBe("text-green-500");
  });
});

describe("filterIngredients", () => {
  const mockIngredients = [
    { id: "1", name: "Tomato" },
    { id: "2", name: "Potato" },
    { id: "3", name: "Onion" },
  ];

  it("should filter out selected ingredients", () => {
    const selectedTags = [{ id: "1", name: "Tomato" }];
    const result = filterIngredients(mockIngredients, selectedTags, "");
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).not.toContain("Tomato");
  });

  it("should filter by input value", () => {
    const result = filterIngredients(mockIngredients, [], "to");
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).toEqual(["Tomato", "Potato"]);
  });

  it("should handle case insensitive search", () => {
    const result = filterIngredients(mockIngredients, [], "TO");
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.name)).toEqual(["Tomato", "Potato"]);
  });
});

describe("sortRecipes", () => {
  it("should sort recipes by likes ascending", () => {
    const sorted = sortRecipes(mockRecipes, "likes-asc");
    expect(sorted[0].likes).toBeLessThanOrEqual(sorted[1].likes);
  });

  it("should sort recipes by likes descending", () => {
    const sorted = sortRecipes(mockRecipes, "likes-desc");
    expect(sorted[0].likes).toBeGreaterThanOrEqual(sorted[1].likes);
  });

  it("should sort recipes by used ingredients count ascending", () => {
    const sorted = sortRecipes(mockRecipes, "ingredients-asc");
    expect(sorted[0].usedIngredientCount).toBeLessThanOrEqual(sorted[1].usedIngredientCount);
  });

  it("should sort recipes by used ingredients count descending", () => {
    const sorted = sortRecipes(mockRecipes, "ingredients-desc");
    expect(sorted[0].usedIngredientCount).toBeGreaterThanOrEqual(sorted[1].usedIngredientCount);
  });

  it("should sort recipes by missing ingredients count ascending", () => {
    const sorted = sortRecipes(mockRecipes, "missing-asc");
    expect(sorted[0].missedIngredientCount).toBeLessThanOrEqual(sorted[1].missedIngredientCount);
  });

  it("should sort recipes by missing ingredients count descending", () => {
    const sorted = sortRecipes(mockRecipes, "missing-desc");
    expect(sorted[0].missedIngredientCount).toBeGreaterThanOrEqual(sorted[1].missedIngredientCount);
  });

  it("should return original array if sort parameter is invalid", () => {
    const result = sortRecipes(mockRecipes, "invalid-sort" as any);
    expect(result).toEqual(mockRecipes);
  });
});

describe("filterRecipes", () => {
  const favorites = [652819]; // first mock recipe id

  it("should filter favorites recipes", () => {
    const filtered = filterRecipes(mockRecipes, "favorites", favorites);
    expect(filtered.every((recipe) => favorites.includes(recipe.id))).toBe(true);
  });

  it("should filter recipes with 5 or less missing ingredients", () => {
    const filtered = filterRecipes(mockRecipes, "missing-5", favorites);
    expect(filtered.every((recipe) => recipe.missedIngredientCount <= 5)).toBe(true);
  });

  it("should filter recipes with 3 or less missing ingredients", () => {
    const filtered = filterRecipes(mockRecipes, "missing-3", favorites);
    expect(filtered.every((recipe) => recipe.missedIngredientCount <= 3)).toBe(true);
  });

  it("should filter recipes with 10 or more likes", () => {
    const filtered = filterRecipes(mockRecipes, "likes-10", favorites);
    expect(filtered.every((recipe) => recipe.likes >= 10)).toBe(true);
  });

  it("should filter recipes with 50 or more likes", () => {
    const filtered = filterRecipes(mockRecipes, "likes-50", favorites);
    expect(filtered.every((recipe) => recipe.likes >= 50)).toBe(true);
  });

  it("should return all recipes if filter is 'all'", () => {
    const filtered = filterRecipes(mockRecipes, "all", favorites);
    expect(filtered).toEqual(mockRecipes);
  });

  it("should return all recipes if filter is invalid", () => {
    const filtered = filterRecipes(mockRecipes, "invalid-filter" as any, favorites);
    expect(filtered).toEqual(mockRecipes);
  });
});

describe("paginateRecipes", () => {
  it("should return correct number of recipes for first page", () => {
    const recipesPerPage = 2;
    const result = paginateRecipes(mockRecipes, 1, recipesPerPage);
    expect(result).toHaveLength(recipesPerPage);
    expect(result[0]).toEqual(mockRecipes[0]);
    expect(result[1]).toEqual(mockRecipes[1]);
  });

  it("should return correct recipes for second page", () => {
    const recipesPerPage = 2;
    const result = paginateRecipes(mockRecipes, 2, recipesPerPage);
    expect(result).toHaveLength(recipesPerPage);
    expect(result[0]).toEqual(mockRecipes[2]);
    expect(result[1]).toEqual(mockRecipes[3]);
  });

  it("should handle last page with fewer items", () => {
    const lastPage = Math.ceil(mockRecipes.length / 2);
    const result = paginateRecipes(mockRecipes, lastPage, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("should return empty array for page beyond total pages", () => {
    const result = paginateRecipes(mockRecipes, 1000, 2);
    expect(result).toHaveLength(0);
  });
});
