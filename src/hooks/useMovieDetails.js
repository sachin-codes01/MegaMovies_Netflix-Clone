import { useState, useEffect, useCallback } from "react";
import { getMovieDetails } from "../services/movieService";

/*
  ===== useMovieDetails =====

  Ye hook ek movie ki poori detail laata hai:
  detail + cast + trailer + similar movies.

  Ise Context me nahi rakha kyunki ye data sirf ek hi page ko chahiye
  (Movie Details page). Jo data sirf ek page use kare use global banane
  ka koi faayda nahi hota - ulta app slow hoti hai.
*/
export default function useMovieDetails(movieId, mediaType = "movie") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!movieId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getMovieDetails(movieId, mediaType);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [movieId, mediaType]);

  // movieId badalte hi naya data laao (dusri movie par click karne par)
  useEffect(() => {
    load();
    // Nayi movie khulte hi page upar se shuru ho
    window.scrollTo(0, 0);
  }, [load]);

  return { data, loading, error, retry: load };
}
