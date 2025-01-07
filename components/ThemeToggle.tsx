"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    if (theme === "system" && systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-4 mt-4 p-2 w-10 h-auto z-20 rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
