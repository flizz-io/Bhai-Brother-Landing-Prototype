"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = (t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (t === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bhai-brothers-theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setTimeout(() => setThemeState(saved), 0);
        applyTheme(saved);
      } else {
        // Check system preference
        const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initial = systemPrefersLight ? "light" : "dark";
        setTimeout(() => setThemeState(initial), 0);
        applyTheme(initial);
      }
    } catch {
      applyTheme("dark");
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("bhai-brothers-theme", t);
    } catch {}
    applyTheme(t);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
