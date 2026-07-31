import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/index.css";
import App from "./App.jsx";
import AppProviders from "./context/AppProviders.jsx";

/*
  ===== ENTRY POINT =====

  Poore app ki shuruaat yahi se hoti hai.

  Yahan wrapper ka order dhyaan se samjhiye (bahar se andar):

  1. StrictMode    -> development me galtiyan pakadta hai
  2. BrowserRouter -> routing chalu karta hai (URL padhta hai)
  3. AppProviders  -> hamare saare Context (theme, ui, movies, list)
  4. App           -> asli app

  BrowserRouter ko AppProviders ke bahar rakha hai kyunki
  hamare kuch components (jaise Navbar) ke andar navigate() use hota hai,
  aur uske liye Router ka upar hona zaruri hai.
*/
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);
