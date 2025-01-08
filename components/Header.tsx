"use client";

import ScrollToTopButton from "./ScrollToTopButton";
import ThemeToggle from "./ThemeToggle";
import HomeButton from "./HomeButton";
import AuthButton from "./AuthButton";
import FloatingMenu from "./FloatingMenu";

const Header = () => {
  return (
    <nav className="relative flex justify-center items-center p-8 mt-4">
      <HomeButton />
      <div className="hidden lg:flex items-center gap-4 absolute right-8">
        <AuthButton withText={false} />
        <ThemeToggle withText={false} />
      </div>
      <FloatingMenu />
      <ScrollToTopButton />
    </nav>
  );
};

export default Header;
