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
import { getListByEndpoint, getMoviesByGenre } from "../services/movieService";
import { HOME_MOVIE_ROWS, GENRE_ROWS, TV_ROWS } from "../utils/constants";

/*
  ===== MOVIE CONTEXT =====

  Iska kaam: Home page aur TV Shows page ki rows laana aur unhe yaad rakhna.

  Sabse bada faayda "caching" hai:
  Ek baar data aa gaya to user Home -> Details -> Home jaaye to
  dobara API call nahi hogi. Page turant khulega.
*/

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // Home page ki rows: [{ title: "Trending Now", movies: [...] }, ...]
  const [homeRows, setHomeRows] = useState([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState(null);

  // TV Shows page ki rows
  const [tvRows, setTvRows] = useState([]);
  const [tvLoading, setTvLoading] = useState(false);
  const [tvError, setTvError] = useState(null);

  /*
    useRef ka use "flag" ki tarah kar rahe hain.
    Ye batata hai ki call ek baar chal chuki hai ya nahi.

    useState ki jagah useRef isliye kyunki ise badalne par
    component dobara render nahi hota - aur yaha render ki zarurat bhi nahi hai.
  */
  const homeLoadedRef = useRef(false);
  const tvLoadedRef = useRef(false);

  /*
    Home page ki saari rows laata hai.
    forceReload = true bhejo to cache ignore karke dobara call hogi (Retry button ke liye).
  */
  const loadHomeRows = useCallback(async (forceReload = false) => {
    // Data pehle se hai to dobara call mat karo
    if (homeLoadedRef.current && !forceReload) return;

    homeLoadedRef.current = true;
    setHomeLoading(true);
    setHomeError(null);

    try {
      // Pehle normal endpoint waali rows (Trending, Popular, Top Rated...)
      const endpointRows = await Promise.all(
        HOME_MOVIE_ROWS.map(async (row) => {
          const movies = await getListByEndpoint(row.endpoint);
          return { title: row.title, movies };
        })
      );

      // Phir genre waali rows (Action, Comedy, Drama, Sci-Fi...)
      // Alag batch me isliye taaki ek saath 10 request na jaayein
      const genreRows = await Promise.all(
        GENRE_ROWS.map(async (row) => {
          const movies = await getMoviesByGenre(row.genreId);
          return { title: row.title, movies };
        })
      );

      setHomeRows([...endpointRows, ...genreRows]);
    } catch (err) {
      setHomeError(err.message);
      homeLoadedRef.current = false; // fail hua to agli baar dobara try kar sakein
    } finally {
      setHomeLoading(false);
    }
  }, []);

  // TV Shows page ki rows - kaam bilkul upar jaisa hai
  const loadTvRows = useCallback(async (forceReload = false) => {
    if (tvLoadedRef.current && !forceReload) return;

    tvLoadedRef.current = true;
    setTvLoading(true);
    setTvError(null);

    try {
      const rows = await Promise.all(
        TV_ROWS.map(async (row) => {
          const shows = await getListByEndpoint(row.endpoint);
          return { title: row.title, movies: shows };
        })
      );
      setTvRows(rows);
    } catch (err) {
      setTvError(err.message);
      tvLoadedRef.current = false;
    } finally {
      setTvLoading(false);
    }
  }, []);

  /*
    Hero slider ke liye movies.

    Pehli row (Trending Now) me se 5 movies utha lete hain jinke paas
    backdrop image ho (bina image ke hero khaali dikhta).

    Alag se API call karne ki zarurat nahi padi - ye ek performance optimization hai.

    useMemo isliye lagaya hai taaki ye filter har render par dobara na chale.
  */
  const heroMovies = useMemo(() => {
    const firstRow = homeRows[0];
    if (!firstRow) return [];

    return firstRow.movies.filter((movie) => movie.backdrop_path).slice(0, 5);
  }, [homeRows]);

  const value = useMemo(
    () => ({
      homeRows,
      homeLoading,
      homeError,
      loadHomeRows,
      heroMovies,
      tvRows,
      tvLoading,
      tvError,
      loadTvRows,
    }),
    [homeRows, homeLoading, homeError, loadHomeRows, heroMovies, tvRows, tvLoading, tvError, loadTvRows]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

// Custom hook
export function useMovies() {
  return useContext(MovieContext);
}
