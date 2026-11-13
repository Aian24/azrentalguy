import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <span className="text-xs font-mono font-black uppercase tracking-widest text-red-600 mb-2 inline-block bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
          404 Error
        </span>
        <h1 className="text-5xl font-black text-gray-950 tracking-tight mt-2">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          The equipment rental page or resource you are looking for does not exist or has been relocated.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="btn-red px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
          >
            <Home className="w-4 h-4 text-white" />
            <span>Return to Fleet Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

