"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white font-sans">
      <h2 className="text-3xl font-black text-gray-950 mb-3">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-md font-medium">
        An error occurred while loading this view. Click below to try again or return home.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-red px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-white" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="btn-yellow px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-xs active:scale-95"
        >
          <Home className="w-4 h-4 text-gray-950" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}

