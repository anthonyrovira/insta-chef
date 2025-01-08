export const useLastSearch = () => {
  const STORAGE_KEY = "instachef-last-search" as const;

  const saveLastSearch = (searchParams: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, searchParams);
    }
  };

  const getLastSearch = (): string => {
    if (typeof window !== "undefined") {
      const lastSearch = localStorage.getItem(STORAGE_KEY);
      return lastSearch || "/";
    }
    return "/";
  };

  return { saveLastSearch, getLastSearch };
};
