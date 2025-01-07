import { Github, Linkedin, Code2, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-20 border-t border-tertiary-light dark:border-tertiary-dark">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Colonne À propos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">About InstaChef</h3>
            <p className="text-sm text-secondary-light/70 dark:text-secondary-dark/70">
              A web application that helps you find recipes based on the ingredients available in your kitchen.
            </p>
            <div className="flex items-center gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70">
              <Code2 className="size-4  text-primary-light dark:text-primary-dark" />
              <span>Developed with</span>
              <Heart fill="currentColor" className="size-4 text-primary-light dark:text-primary-dark" />
              <span>by Anthony Rovira</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">Useful links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/anthonyrovira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70 hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  <Github className="size-4 " />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/anthonyrovira/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70 hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  <Linkedin className="size-4 " />
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">Technologies</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-secondary-light/70 dark:text-secondary-dark/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#61DAFB]" />
                Next.js
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                Tailwind
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                Supabase
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF69B4]" />
                Spoonacular
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-tertiary-light/20 dark:border-tertiary-dark/20">
          <p className="text-center text-xs text-secondary-light/50 dark:text-secondary-dark/50">
            © {new Date().getFullYear()} InstaChef. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
