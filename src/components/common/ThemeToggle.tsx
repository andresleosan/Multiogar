"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("multiogar_theme");
  return stored === "dark" ||
    (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const hydrated = useHydrated();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("multiogar_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("multiogar_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
  };

  if (!hydrated) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="rounded-xl p-2 text-blue-700 transition-colors hover:bg-orange-50 dark:text-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-orange-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-700 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
};
