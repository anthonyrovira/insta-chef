import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

export default function ErrorDisplay({
  title = "Oops! Something went wrong",
  message = "We're having trouble processing your request right now.",
  showRetryButton = true,
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 m-auto text-red-500/20 dark:text-red-400/20 animate-pulse" />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">{title}</h1>
          <p className="text-secondary-light/70 dark:text-secondary-dark/70">{message}</p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          {showRetryButton && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
