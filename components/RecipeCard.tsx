import { Recipe } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ChevronRight, BookmarkPlus, Refrigerator, Bookmark } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useFavorites } from "@/hooks/useFavorites";
import ErrorDisplay from "@/components/ErrorDisplay";
import { toast, Toaster } from "sonner";

const IngredientPill = ({ name }: { name: string }) => (
  <span className="text-xs table-cell max-w-[150px] truncate" title={name}>
    {name}
  </span>
);

export default function RecipeCard({ recipes, viewMode = "grid" }: { recipes: Recipe[]; viewMode?: "grid" | "list" }) {
  const { push } = useRouter();
  const { user } = useUser();
  const [showMore, setShowMore] = useState<boolean[]>(Array(recipes.length).fill(false));
  const { isFavorite, addFavorite, removeFavorite, error, clearError } = useFavorites();

  const handleShowMore = (index: number) => {
    setShowMore((prev) => {
      const newShowMore = [...prev];
      newShowMore[index] = !newShowMore[index];
      return newShowMore;
    });
  };

  const handleBookmark = async (recipeId: number) => {
    try {
      if (isFavorite(recipeId)) {
        await removeFavorite(recipeId);
        toast.success("Recipe removed from favorites");
      } else {
        await addFavorite(recipeId);
        toast.success("Recipe added to favorites");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      {error && <ErrorDisplay title="Favorite Action Failed" message={error} onRetry={clearError} />}
      <Toaster position="bottom-center" richColors />
      <div
        className={`grid gap-6 pb-8 place-items-center ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {recipes.map((recipe, index) =>
          viewMode === "grid" ? (
            <div
              key={recipe.id}
              className="flex-none rounded-xl w-[312px] bg-gradient-to-br from-white/50 to-white/00 p-[1px] h-full"
            >
              <div className="relative bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark rounded-xl shadow-sm drop-shadow-sm hover:shadow-orange-400  hover:shadow-sm h-full w-fit">
                {recipe.image ? (
                  <Image
                    src={`${recipe.image}?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`}
                    alt={recipe.title}
                    width={312}
                    height={231}
                    priority
                    className="rounded-xl p-1"
                  />
                ) : (
                  <Image
                    src={"/no_image_placeholder.png"}
                    alt="No image available"
                    width={312}
                    height={231}
                    className="rounded-xl"
                  />
                )}

                {user && (
                  <button
                    role="button"
                    name="toggle-favorite"
                    onClick={() => handleBookmark(recipe.id)}
                    className="absolute top-2 right-2 bg-tertiary-light shadow-lg rounded-full p-2 drop-shadow-sm hover:bg-background-light hover:shadow-xl"
                  >
                    {isFavorite(recipe.id) ? (
                      <Bookmark className="w-6 h-6 text-primary-light dark:text-primary-dark fill-current" />
                    ) : (
                      <BookmarkPlus className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                    )}
                  </button>
                )}

                <div className="p-4 flex-grow">
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
                      <span className="text-primary-light dark:text-primary-dark">{recipe.usedIngredientCount}</span> Matching
                      ingredients:
                    </h4>
                    <ul className="flex flex-wrap gap-2 text-sm">
                      {recipe.usedIngredients.slice(0, 3).map((ingredient) => (
                        <li key={ingredient.id} className="flex-shrink-0">
                          <span className="px-2 py-1 bg-tags-green text-secondary-light dark:text-secondary-dark rounded-full">
                            <IngredientPill name={ingredient.name} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-2">
                      <span className="text-primary-light dark:text-primary-dark">{recipe.missedIngredientCount}</span> Missing
                      ingredients:
                    </h4>
                    <ul className="flex flex-wrap gap-2 text-sm mb-12">
                      {(showMore[index] ? recipe.missedIngredients : recipe.missedIngredients.slice(0, 5)).map((ingredient) => (
                        <li key={ingredient.id} className="flex-shrink-0">
                          <span className="px-2 py-1 bg-tags-red text-secondary-light dark:text-secondary-dark rounded-full">
                            <IngredientPill name={ingredient.name} />
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
                    className="absolute bottom-2 left-2 right-2 button dark:border-primary-dark  dark:text-primary-dark hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white"
                    onClick={() => push(`/recipe/${recipe.id}`)}
                  >
                    <span className="mr-2">View Recipe</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={recipe.id} className="flex-none rounded-xl w-full bg-gradient-to-br from-white/50 to-white/00 p-[1px]">
              <div className="relative bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark rounded-xl shadow-sm drop-shadow-sm hover:shadow-orange-400 hover:shadow-sm">
                <button
                  role="button"
                  className="absolute top-2 right-2 bg-tertiary-light shadow-lg rounded-full p-2 drop-shadow-sm hover:bg-background-light hover:shadow-xl"
                >
                  <BookmarkPlus className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                </button>

                <div className="flex flex-col sm:flex-row p-2">
                  <div className="flex justify-center items-center w-full sm:w-[200px] h-auto flex-shrink-0 mr-0 mb-4 sm:mb-0 sm:mr-4">
                    {recipe.image ? (
                      <Image
                        src={`${recipe.image}?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`}
                        alt={recipe.title}
                        width={200}
                        height={148}
                        priority
                        className="rounded-xl"
                      />
                    ) : (
                      <Image
                        src={"/no_image_placeholder.png"}
                        alt="No image available"
                        width={200}
                        height={148}
                        className="rounded-xl"
                      />
                    )}
                  </div>

                  <div className="flex flex-col flex-grow w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="title font-medium text-lg text-secondary-light dark:text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-0 sm:ml-4 relative group">
                        <Heart className="w-4 h-4 text-primary-light dark:text-primary-dark fill-current" />
                        <span className="text-secondary-light dark:text-secondary-dark text-sm">{recipe.likes}</span>
                        <span
                          className="absolute top-6 -left-4 rounded-lg bg-primary-dark text-white px-2 py-1 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                          pointer-events-none translate-y-1 group-hover:translate-y-0 
                          scale-95 group-hover:scale-100"
                        >
                          Likes
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1 ml-0 sm:ml-4 relative
                       group"
                      >
                        <Refrigerator className="w-4 h-4 text-primary-light dark:text-primary-dark " />
                        <span className="text-secondary-light dark:text-secondary-dark text-sm">
                          {recipe.usedIngredientCount + recipe.missedIngredientCount}
                        </span>
                        <span
                          className="absolute top-6 -left-9 rounded-lg bg-primary-dark text-white px-2 py-1 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                          pointer-events-none translate-y-1 group-hover:translate-y-0 
                          scale-95 group-hover:scale-100"
                        >
                          Ingredients
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <div className="mt-2 sm:mt-1 max-w-[220px]">
                        <h4 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-1">
                          <span className=" text-primary-light dark:text-primary-dark ">{recipe.usedIngredientCount}</span>{" "}
                          Matching ingredients:
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

                      <div className="mt-2 sm:mt-1 max-w-[220px]">
                        <h4 className="text-sm font-medium text-secondary-light dark:text-secondary-dark mb-1">
                          <span className="text-primary-light dark:text-primary-dark ">{recipe.missedIngredientCount}</span>{" "}
                          Missing ingredients:
                        </h4>
                        <ul className="flex flex-wrap gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70">
                          {showMore[index]
                            ? recipe.missedIngredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                  <span className="px-2 py-1 text-xs truncate hover:text-clip rounded-full bg-tags-red text-secondary-light dark:text-secondary-dark">
                                    {ingredient.name}
                                  </span>
                                </li>
                              ))
                            : recipe.missedIngredients.slice(0, 5).map((ingredient) => (
                                <li key={ingredient.id} className="truncate hover:text-clip">
                                  <span className="px-2 py-1 text-xs hover:text-clip rounded-full bg-tags-red text-secondary-light dark:text-secondary-dark">
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
                    </div>
                  </div>

                  <div className="flex items-end justify-end sm:ml-4 mt-4 sm:mt-0">
                    <button
                      className="h-10 w-40 button dark:border-primary-dark dark:text-primary-dark hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white"
                      onClick={() => push(`/recipe/${recipe.id}`)}
                    >
                      <span className="mr-2 px-4">View Recipe</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
