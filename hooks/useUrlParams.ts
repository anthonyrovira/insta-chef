import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter, Sort, View } from "@/types";

interface SearchUrlParams {
  ingredients: string[];
  sort: Sort | null;
  filter: Filter | null;
  view: View | null;
}

export const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current params
  const getCurrentParams = useCallback((): SearchUrlParams => {
    return {
      ingredients: searchParams.get("ingredients")?.split(",") || [],
      sort: searchParams.get("sort") as Sort | null,
      filter: searchParams.get("filter") as Filter | null,
      view: searchParams.get("view") as View | null,
    };
  }, [searchParams]);

  // Update params
  const updateParams = useCallback(
    (updates: Partial<SearchUrlParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update ingredients
      if (updates.ingredients !== undefined) {
        if (updates.ingredients.length > 0) {
          params.set("ingredients", updates.ingredients.map((i) => encodeURIComponent(i)).join(","));
        } else {
          params.delete("ingredients");
        }
      }

      // Update sort
      if (updates.sort !== undefined) {
        if (updates.sort) {
          params.set("sort", updates.sort);
        } else {
          params.delete("sort");
        }
      }

      // Update filter
      if (updates.filter !== undefined) {
        if (updates.filter) {
          params.set("filter", updates.filter);
        } else {
          params.delete("filter");
        }
      }

      // Update view
      if (updates.view !== undefined) {
        if (updates.view) {
          params.set("view", updates.view);
        } else {
          params.delete("view");
        }
      }

      // Update URL
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return {
    params: getCurrentParams(),
    updateParams,
  };
};
