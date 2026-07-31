import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { UiProvider } from "./UiContext";
import { MovieProvider } from "./MovieContext";
import { ListProvider } from "./ListContext";

/*
  ===== ALL PROVIDERS IN ONE PLACE =====

  Hamare paas 5 alag-alag Context hain. Agar inhe main.jsx me daalte
  to wahan 5 tag ek dusre ke andar likhne padte aur file gandi lagti.

  Isliye sabko ek jagah rakh diya. main.jsx me bas <AppProviders> likhna hai.

  ===== ORDER (kram) BAHUT ZARURI HAI =====

  Niyam simple hai: jo Context kisi dusre ka data use karta hai,
  wo uske ANDAR hona chahiye.

  1. ThemeProvider - sabse bahar, kyunki MUI ka theme sabko chahiye
  2. AuthProvider  - user ki detail rakhta hai
  3. UiProvider    - toast aur modal
  4. MovieProvider - movie rows
  5. ListProvider  - sabse andar, kyunki ye AuthProvider se email
                     leta hai (har user ki alag watchlist banane ke liye)

  Agar ListProvider ko AuthProvider ke BAHAR rakh dete, to use
  user ka email milta hi nahi aur app crash ho jaati.
*/
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UiProvider>
          <MovieProvider>
            <ListProvider>{children}</ListProvider>
          </MovieProvider>
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
