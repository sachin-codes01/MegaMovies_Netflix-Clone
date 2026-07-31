/*
  Neeche wali line ek lint rule ko band karti hai. Ye rule sirf development ke
  "Fast Refresh" ke baare me hai - code me koi galti nahi hai.

  Wo chahta hai ki ek file sirf component export kare. Lekin hum yaha
  Provider (component) aur uska custom hook - dono ek saath rakhte hain,
  kyunki dono ek hi cheez ka hissa hain aur alag karne se samajhna mushkil ho jata.
  Isliye is rule ko is file me band kar diya hai.
*/
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { WATCHLIST_STORAGE_KEY, FAVORITES_STORAGE_KEY } from "../utils/constants";
import { useAuth } from "./AuthContext";

/*
  ===== LIST CONTEXT =====

  Iska kaam: user ki apni 2 lists sambhalna
  1. Watchlist (baad me dekhni hai)
  2. Favorites (pasandeeda movies)

  KHAAS BAAT - har account ki apni alag list hoti hai.

  Kaise? localStorage ki key me user ka email jod dete hain:
  megamovies_watchlist_sachin@gmail.com
  megamovies_watchlist_guest@megamovies.app

  Isse ek hi browser me alag-alag log apni-apni list rakh sakte hain,
  aur ek ki list dusre ko nahi dikhti.
*/

const ListContext = createContext();

// localStorage se list padhta hai. Agar data kharab ho to khaali array de deta hai
function loadFromStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// list ko localStorage me save karta hai
function saveToStorage(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // storage full ho to bhi app crash nahi honi chahiye
  }
}

// Ek user ki dono list ek saath localStorage se padhta hai
function loadListsFor(email) {
  return {
    email,
    watchlist: loadFromStorage(`${WATCHLIST_STORAGE_KEY}_${email}`),
    favorites: loadFromStorage(`${FAVORITES_STORAGE_KEY}_${email}`),
  };
}

export function ListProvider({ children }) {
  // Konsa user logged in hai - ye AuthContext se aata hai
  const { user } = useAuth();

  /*
    Login nahi hai to "guest" laga dete hain (waise ProtectedRoute
    bina login ke andar aane hi nahi deta, ye sirf safety ke liye hai).
  */
  const email = user?.id || "guest";

  /*
    Dono list ek hi state object me rakhi hain, saath me ye bhi ki
    ye list KIS user ki hai. Isse pata chal jaata hai ki user badla ya nahi.
  */
  const [lists, setLists] = useState(() => loadListsFor(email));

  /*
    ===== USER BADALNE PAR LIST BADALNA =====

    Ye "render ke dauran state update" wala tarika hai, jo React
    officially allow karta hai jab state kisi prop/value par depend karti ho.

    Pehle humne do galat tarike try kiye the:

    1. useEffect me setState -> React ki guideline ke against hai
       (ek extra render hota hai)

    2. <ListStore key={email}> -> isme sabse badi problem thi:
       key badalte hi React POORA andar ka app (routes samet) hata kar
       naya bana deta tha. Isi wajah se login ke baad ek pal ke liye
       khaali login page flash hota tha, phir movies page khulta tha.

    Ye tarika sabse saaf hai - koi remount nahi, koi extra effect nahi.
    React turant dobara render karta hai, screen par kuch galat dikhta hi nahi.
  */
  if (lists.email !== email) {
    setLists(loadListsFor(email));
  }

  // Aage ka code seedha padhne ke liye alag naam de diye
  const watchlist = lists.watchlist;
  const favorites = lists.favorites;

  /*
    ===== SAVE KARNA =====

    Jab bhi lists badle, use localStorage me likh dete hain.

    Pehle ye kaam har toggle ke andar hota tha aur save karte waqt
    email alag se (state ke bahar se) liya jaata tha. Ab email khud
    `lists` object ke andar hi hai, isliye data aur uska maalik hamesha
    saath-saath chalte hain - ek user ka data kabhi dusre ki key me
    nahi ja sakta. Purani wajah jiske liye useEffect se bacha gaya tha,
    ab bachi hi nahi.

    guest wali list save nahi karte. Bina login ke koi page khulta hi
    nahi, isliye wo bas khaali kachra keys banati thi.
  */
  useEffect(() => {
    if (lists.email === "guest") return;

    saveToStorage(`${WATCHLIST_STORAGE_KEY}_${lists.email}`, lists.watchlist);
    saveToStorage(`${FAVORITES_STORAGE_KEY}_${lists.email}`, lists.favorites);
  }, [lists]);

  /*
    ===== TOGGLE (add / remove) =====

    Ye function ek hi kaam karta hai: movie list me hai to hata do,
    nahi hai to daal do. Isse ek hi button se dono kaam ho jaate hain.

    ===== setLists(prev => ...) KYUN? (ek asli bug ka ilaaj) =====

    Pehle ye code seedha `watchlist` (render wali value) padhta tha:

        const newList = [...watchlist, movie];   // <- purani value

    setState turant state nahi badalta. Isliye agar do add ek hi pal me
    ho jaayein (jaldi-jaldi do card par + dabana), to dusra wala ABHI BHI
    purani list dekhta tha aur pehli movie ko mita deta tha.

    Test me humne yahi pakda: do movie add ki, localStorage me sirf ek bachi.

    `prev` wale roop me React hamesha sabse taaza list deta hai,
    isliye ab dono movie bach jaati hain.

    Return value (true = add hui, false = hat gayi) render wali list se
    nikaal rahe hain - kyunki toast usi cheez ke baare me hai jo user ne
    abhi screen par dekh kar dabaya tha.
  */
  const toggleInList = useCallback((listName, movie) => {
    setLists((prev) => {
      const current = prev[listName];
      const alreadyThere = current.some((m) => m.id === movie.id);

      const newList = alreadyThere
        ? current.filter((m) => m.id !== movie.id)
        : [...current, movie];

      return { ...prev, [listName]: newList };
    });
  }, []);

  const toggleWatchlist = useCallback(
    (movie) => {
      const wasAdded = !watchlist.some((m) => m.id === movie.id);
      toggleInList("watchlist", movie);
      return wasAdded;
    },
    [watchlist, toggleInList]
  );

  const toggleFavorite = useCallback(
    (movie) => {
      const wasAdded = !favorites.some((m) => m.id === movie.id);
      toggleInList("favorites", movie);
      return wasAdded;
    },
    [favorites, toggleInList]
  );

  // "Clear All" ke liye - poori list khaali kar deta hai
  const clearList = useCallback((listName) => {
    setLists((prev) => ({ ...prev, [listName]: [] }));
  }, []);

  // Card par icon bhara dikhana hai ya khaali - ye batata hai
  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  const isFavorite = useCallback(
    (movieId) => favorites.some((m) => m.id === movieId),
    [favorites]
  );

  // "Clear All" button ke liye
  const clearWatchlist = useCallback(() => clearList("watchlist"), [clearList]);
  const clearFavorites = useCallback(() => clearList("favorites"), [clearList]);

  const value = useMemo(
    () => ({
      watchlist,
      favorites,
      toggleWatchlist,
      toggleFavorite,
      isInWatchlist,
      isFavorite,
      clearWatchlist,
      clearFavorites,
    }),
    [
      watchlist,
      favorites,
      toggleWatchlist,
      toggleFavorite,
      isInWatchlist,
      isFavorite,
      clearWatchlist,
      clearFavorites,
    ]
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

// Custom hook
export function useList() {
  return useContext(ListContext);
}
