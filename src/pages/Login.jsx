import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import { useUi } from "../context/UiContext";

/*
  ===== LOGIN PAGE =====

  App khulte hi sabse pehle yahi page aata hai.
  Bina login kiye andar nahi ja sakte (dekho ProtectedRoute.jsx).

  Layout bilkul seedha hai:
  upar left me logo, aur beech me ek input + ek button.

  ZARURI - ye DEMO login hai.
  Koi password nahi maangte aur kuch verify nahi karte.
  Bas email ya number leke localStorage me rakh lete hain,
  taaki har account ki apni watchlist aur favorites ban sake.
*/

/*
  ===== VALIDATION =====

  Ye do chhote functions check karte hain ki user ne sahi cheez daali ya nahi.

  Email ka rule: kuch@kuch.kuch
  ^[^\s@]+  -> shuru me @ aur space ke alawa kuch bhi (1 ya zyada)
  @         -> ek @ zaruri hai
  [^\s@]+   -> phir domain ka naam
  \.        -> ek dot zaruri hai
  [^\s@]+$  -> aakhir me com/in/org waala hissa
*/
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/*
  Mobile number ka rule:
  Pehle +, space aur - hata dete hain, phir sirf digits bachte hain.
  10 se 15 digit ke beech ho to sahi maante hain
  (10 = India ka number, 15 = country code ke saath sabse lamba).
*/
function isValidPhone(value) {
  const digitsOnly = value.replace(/[\s\-()+]/g, "");

  // Sirf digits hone chahiye, koi letter nahi
  if (!/^\d+$/.test(digitsOnly)) return false;

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useUi();

  // Ek hi input hai - usme email ya number kuch bhi aa sakta hai
  const [identifier, setIdentifier] = useState("");

  // Galti hone par message
  const [error, setError] = useState("");

  // Continue dabane ke baad loading screen dikhane ke liye
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleContinue = () => {
    const value = identifier.trim();

    // Case 1: kuch daala hi nahi
    if (!value) {
      setError("Email or mobile number is required.");
      return;
    }

    // Case 2: na email sahi hai, na number
    if (!isValidEmail(value) && !isValidPhone(value)) {
      setError("Please enter a valid email address or a 10-digit mobile number.");
      return;
    }

    // Sab theek hai - ab loading screen dikhao
    setIsSigningIn(true);

    /*
      Yaha setTimeout kyun lagaya?

      Hamara login turant ho jaata hai (koi server call nahi hai).
      Bina rukavat ke loading screen ek pal ko flash hokar gayab ho jaati,
      jo ajeeb lagta hai.

      Isliye thoda ruk kar aage badhte hain. Asli project me yahan
      server ka jawab aane ka intezaar hota hai.
    */
    setTimeout(() => {
      login(value);
      showToast("Signed in successfully");
      // replace se back button dabane par login page wapas nahi aata
      navigate("/", { replace: true });
    }, 1200);
  };

  return (
    <div className="bg-surface relative min-h-screen">
      {/*
        Peeche halka blue glow.
        Netflix par yahan laal rang ka glow hota hai, humne theme
        ke hisaab se blue rakha hai.
      */}
      <div className="bg-brand-500/25 pointer-events-none absolute top-0 left-0 h-[420px] w-full blur-[120px]" />

      {/* ===== Upar ka header - sirf logo ===== */}
      <header className="border-line relative z-10 border-b px-6 py-5 md:px-12">
        <Logo height="h-7 md:h-8" />
      </header>

      {/* ===== Beech ka form ===== */}
      <main className="relative z-10 flex justify-center px-4 pt-16 pb-24 md:pt-24">
        <div className="fade-up w-full max-w-md">
          <h1 className="text-display text-main mb-2 text-3xl leading-tight font-bold md:text-4xl">
            Enter your info to sign in
          </h1>

          <p className="text-sub mb-8 text-base">Or get started with a new account.</p>

          {/* Ek hi input - email ya mobile number */}
          <TextField
            fullWidth
            label="Email or mobile number"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              setError(""); // type karte hi purana error hata do
            }}
            // Enter dabane par bhi login ho jaye
            onKeyDown={(event) => event.key === "Enter" && handleContinue()}
            // error true hone par MUI input ko laal kar deta hai
            error={Boolean(error)}
            helperText={error}
            autoFocus
            // Loading ke dauran input band rahe
            disabled={isSigningIn}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                bgcolor: "var(--app-card)",
                // 4px = halke se gol kone. Poora gol (pill) nahi chahiye,
                // login form me seedha rectangle box saaf lagta hai
                borderRadius: "4px",
              },
            }}
          />

          {/* Continue button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleContinue}
            // Loading ke dauran dobara click na ho sake
            disabled={isSigningIn}
            sx={{
              bgcolor: "var(--brand)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              py: 1.6,
              // Rectangle shape ab muiTheme.js se apne aap aata hai
              "&:hover": { bgcolor: "var(--brand-dark)" },
            }}
          >
            Continue
          </Button>

          {/* Saaf-saaf bata rahe hain ki ye demo hai */}
          <p className="text-sub mt-10 text-xs leading-relaxed">
            This is a demo sign-in. No password is asked and nothing is verified. Your watchlist and
            favorites are saved against this email or number, on this device only.
          </p>
        </div>
      </main>

      {/*
        ===== LOADING OVERLAY =====

        Continue dabate hi poore page ke upar ye halki kaali parat aa jaati hai
        aur beech me ek ghoomta hua circle dikhta hai (Netflix jaisa).

        Dhyaan dein: form neeche waisa ka waisa dikhta rehta hai.

        Pehle hum poora page hata kar alag loading screen dikhate the,
        jiski wajah se ek pal ko khaali input flash hota tha. Overlay
        wale tareeke me aisa nahi hota, kyunki neeche kuch badalta hi nahi.

        fixed inset-0 -> poori screen dhak leta hai, isliye peeche kuch
        click nahi ho sakta. Yahi "page not clickable" wala kaam karta hai.
      */}
      {isSigningIn && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
          <CircularProgress size={56} thickness={4} sx={{ color: "var(--brand)" }} />
        </div>
      )}
    </div>
  );
}
