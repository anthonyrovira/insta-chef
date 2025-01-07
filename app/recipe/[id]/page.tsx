"use client";

import { useEffect, useState } from "react";
import { mockRecipe } from "@/mocks/recipe";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { RecipeInformation } from "@/types";
import { Loader, ArrowLeft, Leaf, Salad, Heart, BookmarkPlus, WheatOff, Milk, Bookmark } from "lucide-react";
import { getRecipeInformation } from "@/services/api";
import { useFavorites } from "@/hooks/useFavorites";
import { toast, Toaster } from "sonner";
import { useUser } from "@/hooks/useUser";
import { getHealthScoreColor } from "@/utils/core";
import { track } from "@vercel/analytics";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const userSession = useUser();
  const [recipe, setRecipe] = useState<RecipeInformation>(mockRecipe);
  const [loading, setLoading] = useState<boolean>(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeInformation(Number(params.id));
        setRecipe(recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const handleToggleFavorite = async () => {
    const recipeId = Number(params.id);
    try {
      if (isFavorite(recipeId)) {
        track("recipe_bookmark_remove", {
          recipe_id: recipeId,
          timestamp: new Date().toISOString(),
        });

        await removeFavorite(recipeId);
        toast.success("Recipe removed from favorites");
      } else {
        track("recipe_bookmark_add", {
          recipe_id: recipeId,
          timestamp: new Date().toISOString(),
        });

        await addFavorite(recipeId);
        toast.success("Recipe added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Loader className="text-primary-dark animate-spin size-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <Toaster position="bottom-center" richColors />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          type="button"
          name="back"
          aria-label="Back to home"
          className="mb-6 text-lg flex items-center gap-2 text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
          {recipe.image && <Image src={recipe.image} alt={recipe.title} priority fill className="object-cover" />}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-secondary-light dark:text-secondary-dark">{recipe.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-light dark:text-primary-dark">
                <Heart className="size-5" />
                <span>{recipe.aggregateLikes}</span>
              </div>
              {userSession && (
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity"
                  aria-label={isFavorite(Number(params.id)) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {isFavorite(Number(params.id)) ? (
                    <Bookmark className="size-5 fill-primary-light dark:fill-primary-dark" />
                  ) : (
                    <BookmarkPlus className="size-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-primary-light/10 rounded-lg dark:bg-white/10">
              <p className="text-sm text-primary-dark/70">Preparation time</p>
              <p className="text-lg font-semibold text-secondary-light dark:text-secondary-dark">{recipe.readyInMinutes} min</p>
            </div>
            <div className="p-4 bg-primary-light/10 rounded-lg dark:bg-white/10">
              <p className="text-sm text-primary-dark/70">Portions</p>
              <p className="text-lg font-semibold text-secondary-light dark:text-secondary-dark">{recipe.servings} servings</p>
            </div>
            <div className="p-4 bg-primary-light/10 rounded-lg dark:bg-white/10">
              <p className="text-sm text-primary-dark/70">Health score</p>
              <p className={`text-lg font-semibold ${getHealthScoreColor(recipe.healthScore)}`}>{recipe.healthScore}/100</p>
            </div>
            <div className="p-4 bg-primary-light/10 rounded-lg dark:bg-white/10">
              <p className="text-sm text-primary-dark/70">Price per serving</p>
              <p className="text-lg font-semibold text-secondary-light dark:text-secondary-dark">
                ${(recipe.pricePerServing / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.vegetarian && (
              <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                <Salad className="size-4" />
                Vegetarian
              </span>
            )}
            {recipe.vegan && (
              <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                <Leaf className="size-4" />
                Vegan
              </span>
            )}
            {recipe.glutenFree && (
              <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                <WheatOff className="size-4" />
                Gluten-free
              </span>
            )}
            {recipe.dairyFree && (
              <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                <Milk className="size-4" />
                Dairy-free
              </span>
            )}

            {recipe.cuisines?.map((cuisine) => (
              <span
                key={cuisine}
                className="px-3 py-1 text-sm rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li
                  key={`${ingredient.name}-${index}`}
                  className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark" />
                  {ingredient.original}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.analyzedInstructions[0]?.steps.map((step) => (
                <li key={step.number} className="text-secondary-light dark:text-secondary-dark">
                  <span className="font-medium text-primary-light dark:text-primary-dark mr-2">{step.number}.</span>
                  {step.step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
