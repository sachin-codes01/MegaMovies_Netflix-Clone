/*
  Neeche wali line ek lint rule ko band karti hai. Ye rule sirf development ke
  "Fast Refresh" ke baare me hai - code me koi galti nahi hai.

  Wo chahta hai ki ek file sirf component export kare. Lekin hum yaha
  Provider (component) aur uska custom hook - dono ek saath rakhte hain,
  kyunki dono ek hi cheez ka hissa hain aur alag karne se samajhna mushkil ho jata.
  Isliye is rule ko is file me band kar diya hai.
*/
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { USER_STORAGE_KEY } from "../utils/constants";

/*
  ===== AUTH CONTEXT =====

  Iska kaam: logged-in user ki detail sambhalna.

  ZARURI BAAT (interview me ye zaroor batayein):
  Ye ASLI Google login NAHI hai. Ye sirf ek demo hai.

  Asli Google login me "OAuth" hota hai - user Google ke apne page par
  jaata hai, wahan password daalta hai, aur Google wapas ek token bhejta hai.
  Uske liye Google Cloud Console se Client ID lena padta hai.

  Yaha hum sirf user ka naam aur email localStorage me rakh lete hain.
  Koi password nahi maangte aur kuch verify nahi karte -
  kyunki ye ek learning project hai.
*/

const AuthContext = createContext();

/*
  ===== localStorage SE USER PADHNA =====

  Ye function jaan-boojh kar "shakki" (suspicious) hai.

  Pehle ye sirf JSON.parse karta tha aur jo bhi milta wapas de deta tha.
  Problem: agar localStorage me aadha-adhoora ya purane version ka data
  pada ho (jaise { email: "..." } bina id/name ke), to user object to
  ban jaata tha par uska naam khaali hota.

  Aisi haalat me navbar ka avatar "U" dikhata tha aur profile menu
  khaali - yani logged in hone ke baad bhi account anjaan (guest jaisa)
  lagta tha.

  Ab hum shape CHECK karte hain. Kuch bhi galat mila to null de dete hain,
  taaki user saaf-saaf login page par jaaye aur dobara sahi data ban jaaye.
*/
function loadUser() {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // Object hona chahiye, aur usme id (email/number) zaroor honi chahiye
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.id !== "string" || !parsed.id.trim()) return null;

    /*
      name kabhi missing ho to yahi bana dete hain.
      Isse avatar par kabhi bhi generic "U" nahi aayega.
    */
    return {
      id: parsed.id,
      name: typeof parsed.name === "string" && parsed.name ? parsed.name : deriveName(parsed.id),
    };
  } catch {
    // Data kharab hai to use hata do, warna har baar yahi error aayegi
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // localStorage hi band hai (private mode) - kuch nahi kar sakte
    }
    return null;
  }
}

/*
  User ko localStorage me likhta hai.

  try/catch zaruri hai: private/incognito window me ya storage full hone par
  setItem ERROR THROW karta hai. Pehle ye seedha likha tha, isliye wahan
  Continue dabate hi login ka function beech me hi ruk jaata tha.

  true/false return karta hai taaki call karne wala jaan sake ki
  data sach me save hua ya nahi.
*/
function saveUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

/*
  User ne sirf email ya number diya hai, naam nahi.
  Isliye usi me se ek dikhane layak naam bana lete hain.

  "sachin.codes01@gmail.com" -> "Sachin.codes01"
  "9876543210"               -> "User 3210"
*/
function deriveName(identifier) {
  if (identifier.includes("@")) {
    const localPart = identifier.split("@")[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  // Number hai to sirf aakhri 4 digit dikhate hain
  const digits = identifier.replace(/\D/g, "");
  return `User ${digits.slice(-4)}`;
}

export function AuthProvider({ children }) {
  /*
    user null hai = koi login nahi hai
    user object hai = { name, email }

    Page refresh karne par bhi login bana rahe, isliye
    shuruaat me hi localStorage se padh lete hain.
  */
  const [user, setUser] = useState(() => loadUser());

  /*
    Login page se ye function call hota hai.

    identifier = user ne jo daala - email ya mobile number.
    Isi ko hum uski pehchaan (id) maante hain, aur isi ke naam se
    uski watchlist / favorites localStorage me save hoti hai.
  */
  const login = useCallback((identifier) => {
    const cleanId = identifier.trim().toLowerCase();

    const newUser = {
      id: cleanId,
      name: deriveName(cleanId), // screen par dikhane ke liye chhota naam
    };

    // Pehle save, phir state - taaki agar save fail ho to hume pata chal jaaye
    const saved = saveUser(newUser);
    setUser(newUser);

    // false ka matlab: is browser me storage band hai, refresh par login chala jayega
    return saved;
  }, []);

  /*
    Logout par sirf user hatate hain.

    Dhyaan dein: watchlist aur favorites DELETE nahi karte.
    Wo email ke naam se save hain, isliye dobara usi email se
    login karne par purani list wapas mil jaati hai.
  */
  const logout = useCallback(() => {
    setUser(null);

    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // storage band hai - state to hat hi gaya hai, itna kaafi hai
    }
  }, []);

  /*
    ===== DUSRI TAB SE SYNC =====

    "storage" event tab chalta hai jab USI website ki KISI DUSRI tab me
    localStorage badalta hai.

    Iske bina ye hota tha: do tab khuli hain, ek me sign out kiya,
    dusri tab abhi bhi logged in dikhati rehti thi. Us tab ko refresh
    karte hi user achanak login page par pahunch jaata tha.

    Ab dono tab hamesha ek jaisi haalat me rehti hain.
  */
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Sirf hamari user wali key par dhyaan dena hai
      if (event.key !== USER_STORAGE_KEY) return;
      setUser(loadUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      // Chhota shortcut - components me user && ... likhne se bach jaate hain
      isLoggedIn: Boolean(user),
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook - component me bas useAuth() likho
export function useAuth() {
  return useContext(AuthContext);
}
