"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark">Oops! Something went wrong</h1>

        <p className="text-lg text-secondary-light dark:text-secondary-dark max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            aria-label="Try again"
            name="try-again"
            className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try again
          </button>

          <button
            onClick={() => router.push("/")}
            aria-label="Go home"
            name="go-home"
            className="px-6 py-2 bg-tertiary-light dark:bg-tertiary-dark text-secondary-light dark:text-secondary-dark rounded-lg hover:opacity-90 transition-opacity"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
