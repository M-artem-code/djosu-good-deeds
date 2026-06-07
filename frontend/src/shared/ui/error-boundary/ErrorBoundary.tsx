"use client";

import { Component, type ReactNode } from "react";
import { Button } from "../button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Catches render-time errors anywhere below it and shows a recovery UI. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Uncaught render error:", error);
    }
  }

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred. Please reload the page.
          </p>
        </div>
        <Button variant="primary" onClick={this.handleReload}>
          Reload
        </Button>
      </div>
    );
  }
}
