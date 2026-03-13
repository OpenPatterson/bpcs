"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-4xl font-bold text-navy mb-4">
          Something went wrong
        </h1>
        <p className="text-muted mb-8">
          An unexpected error occurred. If this keeps happening, please contact us
          at carlos@openpatterson.org.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-1.5 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
