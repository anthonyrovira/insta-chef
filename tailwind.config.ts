import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FFA726",
          dark: "#FF8A50",
        },
        secondary: {
          light: "#4A4A4A",
          medium: "#918A7F",
          dark: "#E0E0E0",
        },
        tertiary: {
          light: "#FFF3E0",
          dark: "#303030",
        },
        tags: {
          red: "rgba(245, 141, 145, 0.5)",
          green: "rgba(148, 211, 148, 0.5)",
        },
        background: {
          light: "#FFFFFF",
          dark: "#121212",
        },
      },
    },
  },
  plugins: [],
};
export default config;
