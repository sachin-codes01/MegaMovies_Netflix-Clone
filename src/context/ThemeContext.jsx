/*
  Neeche wali line ek lint rule ko band karti hai. Ye rule sirf development ke
  "Fast Refresh" ke baare me hai - code me koi galti nahi hai.

  Wo chahta hai ki ek file sirf component export kare. Lekin hum yaha
  Provider (component) aur uska custom hook - dono ek saath rakhte hain,
  kyunki dono ek hi cheez ka hissa hain aur alag karne se samajhna mushkil ho jata.
  Isliye is rule ko is file me band kar diya hai.
*/
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createAppTheme from "../styles/muiTheme";

/*
  ===== THEME CONTEXT =====

  Iska kaam: poore app ka theme (dark / light) sambhalna.

  Context isliye use kiya kyunki theme ki zarurat har jagah padti hai -
  Navbar me bhi, Cards me bhi, Footer me bhi.
  Agar Context na hota to theme ko har component me props se bhejna padta
  (isi problem ko "prop drilling" kehte hain).
*/

const ThemeContext = createContext();

// localStorage me theme is naam se save hoti hai
const THEME_KEY = "megamovies_theme";

export function ThemeProvider({ children }) {
  /*
    useState ko function de rahe hain (lazy initial state).
    Isse localStorage sirf pehli baar padha jaata hai, har render par nahi.
  */
  const [mode, setMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "dark"; // default dark
  });

  /*
    Jab bhi mode badle:
    1. <html> tag par data-theme laga do -> CSS variables badal jayenge
    2. localStorage me save kar do -> refresh ke baad bhi theme yaad rahe
  */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  // Dark <-> Light switch karne wala function
  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /*
    useMemo isliye lagaya hai kyunki createAppTheme() thoda bhaari kaam hai.
    Ye tab hi dobara chalega jab mode badlega, warna purana theme hi reuse hoga.
  */
  const muiTheme = useMemo(() => createAppTheme(mode), [mode]);

  // Ye value context se poore app ko milegi
  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {/* MUI components ko theme dene ke liye unka apna provider bhi chahiye */}
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/*
  Custom hook - taaki component me har baar useContext(ThemeContext) na likhna pade.
  Bas useTheme() likho aur { mode, toggleTheme } mil jayega.
*/
export function useTheme() {
  return useContext(ThemeContext);
}
