"use client";

import ScrollToTopButton from "./ScrollToTopButton";
import ThemeToggle from "./ThemeToggle";
import HomeButton from "./HomeButton";
import AuthButton from "./AuthButton";

const Header = () => {
  return (
    <nav className="flex justify-between items-center p-8 mt-4">
      <HomeButton />
      <AuthButton />
      <ThemeToggle />
      <ScrollToTopButton />
    </nav>
  );
};

export default Header;
