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
    console.error(error);
    // Auto-reload once when a chunk hash mismatch occurs after a new server deployment
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch");

    if (isChunkError && typeof window !== "undefined") {
      const lastReload = sessionStorage.getItem("az_chunk_reload_ts");
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("az_chunk_reload_ts", String(now));
        window.location.reload();
      }
    }
  }, [error]);

  const handleHardReload = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("az_chunk_reload_ts");
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <h2 className="text-3xl font-black text-gray-950 mb-3">
        Updating Application
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-md font-medium">
        A new version was deployed. Click below to load the latest updates.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleHardReload}
          className="btn-red px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <RefreshCw className="w-4 h-4 text-white animate-spin" />
          <span>Reload Application</span>
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

