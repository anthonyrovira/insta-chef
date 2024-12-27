"use client";

import { useEffect, useState } from "react";
import { mockRecipe } from "@/mocks/recipe";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState(mockRecipe);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Simuler un appel API avec le mock
        // Plus tard, vous pourrez remplacer ceci par un vrai appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRecipe(mockRecipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-secondary-light dark:text-secondary-dark">Loading recipe...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto">
        <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
          {recipe.image && <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />}
        </div>

        <h1 className="text-3xl font-bold text-secondary-light dark:text-secondary-dark mb-6">{recipe.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark">
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
