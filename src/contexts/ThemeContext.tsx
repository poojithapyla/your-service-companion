import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "warm";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("servibook_theme");
    return (saved as Theme) || "light";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("servibook_theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "warm");
    if (theme === "dark") root.classList.add("dark");
    if (theme === "warm") root.classList.add("warm");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};