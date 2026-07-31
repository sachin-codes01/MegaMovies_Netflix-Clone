import { createTheme } from "@mui/material/styles";

/*
  Ye MUI ka apna theme banata hai.

  Tailwind se hum layout aur spacing karte hain,
  aur MUI se Button, Dialog, Drawer, Skeleton jaise ready components lete hain.

  Dono ka color same rahe isliye yaha bhi wahi Blue + Black colors daale hain.

  Ye ek function hai (constant nahi) kyunki theme dark ya light dono ho sakta hai.
  ThemeContext ise mode ke saath bulata hai: createAppTheme("dark")
*/
export default function createAppTheme(mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode, // "dark" ya "light"
      primary: {
        main: "#3b82f6", // hamara brand blue - dono theme me same
        dark: "#1d4ed8",
      },
      background: {
        // Light mode me poora safed nahi, halka grey - aankhon ko aaram milta hai
        default: isDark ? "#0a0a0a" : "#e6e6e9", // page ka background
        paper: isDark ? "#121212" : "#f2f2f4", // card / dialog / drawer ka background
      },
      text: {
        primary: isDark ? "#ffffff" : "#18181b",
        secondary: isDark ? "#a1a1aa" : "#52525b",
      },
    },

    shape: { borderRadius: 10 },

    typography: {
      // MUI components (Button, Menu, Dialog) bhi wahi Sofia Pro use karein
      fontFamily: '"Sofia Pro", "Segoe UI", system-ui, sans-serif',
      button: { textTransform: "none", fontWeight: 600 }, // button ka text CAPITAL na ho
    },

    components: {
      /*
        ===== ZARURI FIX =====

        MUI ka CssBaseline khud body par background-color lagata hai.
        Uski CSS "layer" ke bahar hoti hai, aur CSS ka niyam hai ki
        layer ke bahar wali CSS hamesha jeet jaati hai.

        Matlab hamari index.css wali body rule kaam hi nahi karti thi,
        aur light theme me body kaala reh jaata tha.

        Isliye body ka color yahi se de rahe hain - aur wahi CSS variable
        use kar rahe hain jo baaki app use karti hai. Ab ek hi malik hai.
      */
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "var(--app-bg)",
            color: "var(--app-text)",
            // theme badalne par color halke se badle, jhatke se nahi
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },

      /*
        ===== BUTTON SHAPE =====

        Pehle yaha borderRadius 999 tha, jisse har button poora gol
        (pill / capsule) ban jaata tha.

        Ab 4px hai - matlab seedha rectangle button jiske kone
        halke se gol hain. Ye zyada saaf aur professional lagta hai,
        aur login page ke input ke shape se bhi match karta hai.

        Yaha ek jagah badalne se poore app ke buttons badal jaate hain -
        har file me alag-alag likhne ki zarurat nahi padti.
      */
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 4, paddingInline: 20 },
        },
      },

      /*
        ===== ICON BUTTON = POORA GOL =====

        Sirf icon wale buttons (search, theme toggle, profile, footer ke
        social icons, row ke arrows, card ke + aur dil) ab circle hain.

        Kyun? Icon apne aap me chakor nahi hota - uske chaaro taraf barabar
        jagah hoti hai. Circle us jagah ko barabar ghera deta hai aur
        button saaf dikhta hai. Rectangle me icon ke upar-neeche zyada
        khaali jagah lagti thi.

        Dhyaan dein: text wale Button (Continue, Clear All) aur Chip
        (Popular / Top Rated) rectangle hi rahenge - un par text hai,
        aur lambe text ko circle me daalna theek nahi lagta.

        aspectRatio + padding se width aur height barabar rehti hain,
        warna icon ke hisaab se button anda (oval) ban jaata.
      */
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "50%",
            aspectRatio: "1 / 1",
          },
        },
      },

      /*
        Chip ka use humne filter buttons ki tarah kiya hai
        (Popular / Top Rated / Today / This Week).
        Isliye iska shape bhi button jaisa hi rakha hai.
      */
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 4 },
        },
      },
      // Skeleton ka color hamare card jaisa rahe
      MuiSkeleton: {
        styleOverrides: {
          root: { backgroundColor: isDark ? "#1c1c1c" : "#e4e4e7" },
        },
      },
    },
  });
}
