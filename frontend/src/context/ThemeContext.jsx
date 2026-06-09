import { createContext, useState } from "react";

export const ThemeContext =
  createContext();

export const ThemeProvider = ({
  children
}) => {

  const [darkMode,
    setDarkMode] =
    useState(

      JSON.parse(
        localStorage.getItem(
          "darkMode"
        )
      ) || false

    );

  const toggleTheme = () => {

    const newMode =
      !darkMode;

    setDarkMode(
      newMode
    );

    localStorage.setItem(
      "darkMode",
      JSON.stringify(
        newMode
      )
    );

  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
