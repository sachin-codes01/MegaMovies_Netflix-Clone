/*
  Neeche wali line ek lint rule ko band karti hai. Ye rule sirf development ke
  "Fast Refresh" ke baare me hai - code me koi galti nahi hai.

  Wo chahta hai ki ek file sirf component export kare. Lekin hum yaha
  Provider (component) aur uska custom hook - dono ek saath rakhte hain,
  kyunki dono ek hi cheez ka hissa hain aur alag karne se samajhna mushkil ho jata.
  Isliye is rule ko is file me band kar diya hai.
*/
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";

/*
  ===== UI CONTEXT =====

  Iska kaam: aise UI states rakhna jo poore app me share hote hain.

  1. Mobile menu (drawer) khula hai ya band
  2. Trailer wala global modal + selected movie
  3. Toast notifications (kone me aane wale chhote message)

  Ye sab API data nahi hai - sirf UI ki halat hai. Isliye alag Context banaya,
  taaki movie data badalne par ye wala part dobara render na ho.
*/

const UiContext = createContext();

// Ek toast kitni der screen par rahe (milliseconds)
const TOAST_DURATION = 3000;

export function UiProvider({ children }) {
  // Mobile ka side menu khula hai ya nahi
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Kis movie ka trailer dekhna hai (null = koi nahi)
  const [selectedMovie, setSelectedMovie] = useState(null);

  /*
    Toasts ek ARRAY hai, ek single message nahi.

    Kyun array? Kyunki user jaldi-jaldi 3 movies add kar sakta hai.
    Single message hota to pehle wale gayab ho jaate.
    Array se sab ek ke neeche ek dikhte hain (stack).
  */
  const [toasts, setToasts] = useState([]);

  /*
    Har toast ko ek unique id chahiye taaki hum usi ko hata sakein.
    useRef me counter rakha hai - ise badalne par re-render nahi hota.
  */
  const toastIdRef = useRef(0);

  /*
    useCallback isliye lagaya hai taaki ye functions har render par naye na banein.
    Naya function banne se wo child components bhi dobara render ho jaate hain
    jinhe humne React.memo se optimize kiya hai.
  */

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // Trailer modal kholne ke liye - movie object bhejo
  const openTrailer = useCallback((movie) => setSelectedMovie(movie), []);
  const closeTrailer = useCallback(() => setSelectedMovie(null), []);

  // Ek toast hatata hai (id ke hisaab se)
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /*
    Naya toast dikhata hai.
    Example: showToast("Added to Watchlist", "success")

    type: "success" | "info" | "error"
  */
  const showToast = useCallback((message, type = "success") => {
    toastIdRef.current += 1;
    const id = toastIdRef.current;

    // Naya toast list me jodo
    setToasts((prev) => [...prev, { id, message, type }]);

    // Kuch second baad apne aap hata do
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_DURATION);
  }, []);

  /*
    useMemo se ye object tabhi naya banega jab andar ki koi value badlegi.
    Warna har render par naya object banta aur poora app re-render ho jaata.
    Ye Context ki sabse badi performance galti hoti hai - isse bacha ja raha hai.
  */
  const value = useMemo(
    () => ({
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      selectedMovie,
      openTrailer,
      closeTrailer,
      toasts,
      showToast,
      removeToast,
    }),
    [
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      selectedMovie,
      openTrailer,
      closeTrailer,
      toasts,
      showToast,
      removeToast,
    ]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

// Custom hook - component me bas useUi() likho
export function useUi() {
  return useContext(UiContext);
}
