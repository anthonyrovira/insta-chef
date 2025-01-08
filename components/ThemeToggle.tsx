"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ withText }: { withText: boolean }) {
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    if (theme === "system" && systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 w-10 h-auto rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors ${
        withText ? "flex items-center justify-center w-full px-5" : ""
      }`}
      aria-label="Toggle theme"
    >
      <span className="flex items-center justify-center">
        {theme === "dark" ? `🌞 ${withText ? "Light" : ""}` : `🌙 ${withText ? "Dark" : ""}`}
      </span>
    </button>
  );
}
