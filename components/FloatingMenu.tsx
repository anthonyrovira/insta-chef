"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary-light dark:bg-primary-dark shadow-lg z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}

      <div
        className={`fixed bottom-24 right-6 p-4 rounded-lg bg-background-light dark:bg-background-dark border border-tertiary-light dark:border-tertiary-dark shadow-lg z-50 transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4">
          <AuthButton withText />
          <ThemeToggle withText />
        </div>
      </div>
    </div>
  );
}
