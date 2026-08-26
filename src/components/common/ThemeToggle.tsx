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
      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
};
