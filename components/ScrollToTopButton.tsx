"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    isScrolled && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed top-20 right-4 mt-4 p-2 w-10 h-auto z-20 rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp className=" text-primary-light dark:text-primary-dark" />
      </button>
    )
  );
}
