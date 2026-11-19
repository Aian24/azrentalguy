"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAdminPassword } from "@/lib/settings";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Standard credential validation (admin / dynamic admin password)
    setTimeout(() => {
      const activePassword = getAdminPassword();
      if (username.trim() === "admin" && password === activePassword) {
        // Set authentication state in localStorage and Cookie
        if (typeof window !== "undefined") {
          localStorage.setItem("az_admin_auth", "true");
          document.cookie = "az_admin_auth=true; path=/; max-age=86400; SameSite=Lax";
        }
        router.push("/admin");
      } else {
        setError("Invalid operator credentials. Access restricted to authorized personnel.");
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* LOGO & HEADING */}
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/images/logo.webp"
              alt="AZ Rental Guy"
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="mt-4 text-2xl font-black text-gray-950 tracking-tight">
            Operator Admin Portal
          </h2>
          <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
            J-Bone Industries LLC — Operations & Dispatch
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-xl border-2 border-yellow-500">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-300 flex items-start gap-2.5 text-xs text-red-800 font-bold animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-black text-gray-800 uppercase tracking-wider"
              >
                Operator Username
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-black text-gray-800 uppercase tracking-wider"
              >
                Security Password
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full pl-9 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-black text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* BACK TO SITE */}
          <div className="mt-6 pt-5 border-t border-gray-200 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-gray-600 hover:text-red-600 transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>

        {/* SECURITY FOOTER */}
        <p className="mt-4 text-center text-xs text-gray-500 font-medium">
          Protected Operator Environment • Cave Creek & Phoenix Operations
        </p>
      </div>
    </div>
  );
}
