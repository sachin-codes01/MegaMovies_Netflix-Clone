/*
  Ye file poore app ka sirf ek hi API helper rakhti hai.

  Faayda: agar kal ko API ka URL ya key badalni ho,
  to sirf yahi file change karni padegi, baaki 20 files ko haath nahi lagana padega.
*/

// TMDB API browser se seedhe call ki ja sakti hai (TMDB khud CORS allow karta hai),
// isliye kisi proxy ki zaroorat nahi hai.
// TMDB ka base URL
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// API key .env file se aati hai (VITE_TMDB_KEY)
const API_KEY = import.meta.env.VITE_TMDB_KEY;

/*
  Ye main function hai jo TMDB se data laata hai.

  endpoint -> "movie/popular" jaisa path
  params   -> extra cheezein jaise { page: 2, query: "batman" }

  Example: fetchFromTmdb("movie/popular", { page: 1 })
*/
export async function fetchFromTmdb(endpoint, params = {}) {
  // api_key ke saath baaki params ko URL query string me badal rahe hain
  const searchParams = new URLSearchParams({ api_key: API_KEY, ...params });

  const finalUrl = `${TMDB_BASE_URL}/${endpoint}?${searchParams.toString()}`;

  const response = await fetch(finalUrl);

  // Agar server ne error status bheja (404, 500 etc) to hum khud error throw karte hain
  // taaki Redux ka rejected case chal jaye aur user ko error screen dikhe
  if (!response.ok) {
    throw new Error("Could not load data. Please try again in a moment.");
  }

  return response.json();
}
