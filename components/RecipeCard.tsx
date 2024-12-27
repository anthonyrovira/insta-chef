import { Recipe } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ChevronRight, BookmarkPlus, Refrigerator } from "lucide-react";
import { useState } from "react";

export default function RecipeCard({ recipes }: { recipes: Recipe[] }) {
  const { push } = useRouter();
  const [showMore, setShowMore] = useState<boolean[]>(Array(recipes.length).fill(false));

  const handleShowMore = (index: number) => {
    setShowMore((prev) => {
      const newShowMore = [...prev];
      newShowMore[index] = !newShowMore[index];
      return newShowMore;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 pb-8">
      {recipes.map((recipe, index) => (
        <div key={recipe.id} className="flex-none rounded-xl w-[312px] bg-gradient-to-br from-white/50 to-white/00 p-[1px]">
          <div className="relative bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark rounded-xl shadow-sm drop-shadow-sm hover:shadow-orange-400  hover:shadow-sm h-full w-fit">
            {recipe.image ? (
              <Image
                src={`${recipe.image}?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`}
                alt={recipe.title}
                width={312}
                height={231}
                objectFit="cover"
                className="rounded-xl p-1"
              />
            ) : (
              <Image src={"/no_image_placeholder.png"} alt="No image available" width={312} height={231} className="rounded-xl" />
            )}

            <button
              role="button"
              className="absolute top-2 right-2 bg-tertiary-light shadow-lg rounded-full p-2 drop-shadow-sm hover:bg-background-light hover:shadow-xl"
            >
              <BookmarkPlus className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            </button>

            <div className="p-4 h-full">
              <h3 className="title font-medium text-lg text-secondary-light dark:text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                {recipe.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-primary-light dark:text-primary-dark fill-current" />
                  <span className="text-secondary-light dark:text-secondary-dark text-sm">{recipe.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Refrigerator className="w-4 h-4 text-primary-light dark:text-primary-dark " />
                  <span className="text-secondary-light dark:text-secondary-dark text-sm">
                    {recipe.usedIngredientCount + recipe.missedIngredientCount}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">
                  <span className=" text-primary-light dark:text-primary-dark ">{recipe.usedIngredientCount}</span> Matching
                  ingredients:
                </h4>
                <ul className="flex flex-wrap gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70">
                  {recipe.usedIngredients.slice(0, 3).map((ingredient) => (
                    <li key={ingredient.id}>
                      <span className="px-2 py-1 text-xs rounded-full bg-tags-green text-secondary-light dark:text-secondary-dark">
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">
                  <span className="text-primary-light dark:text-primary-dark ">{recipe.missedIngredientCount}</span> Missing
                  ingredients:
                </h4>
                <ul className="mb-12 flex flex-wrap gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70">
                  {showMore[index]
                    ? recipe.missedIngredients.map((ingredient) => (
                        <li key={ingredient.id}>
                          <span className="px-2 py-1 text-xs truncate hover:text-clip rounded-full bg-tags-red text-secondary-light dark:text-secondary-dark">
                            {ingredient.name}
                          </span>
                        </li>
                      ))
                    : recipe.missedIngredients.slice(0, 5).map((ingredient) => (
                        <li key={ingredient.id}>
                          <span className="px-2 py-1 text-xs truncate hover:text-clip rounded-full bg-tags-red text-secondary-light dark:text-secondary-dark">
                            {ingredient.name}
                          </span>
                        </li>
                      ))}
                  {recipe.missedIngredientCount > 5 && !showMore[index] && (
                    <button
                      onClick={() => handleShowMore(index)}
                      className="text-xs text-primary-light dark:text-primary-dark mt-1"
                    >
                      +{recipe.missedIngredientCount - 5} more...
                    </button>
                  )}
                </ul>
              </div>

              <button
                className="absolute bottom-2 left-2 right-2  flex items-center justify-center py-2 px-4 rounded-lg border border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition-colors text-sm font-medium"
                onClick={() => push(`/recipe/${recipe.id}`)}
              >
                <span className="mr-2">View Recipe</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
