/*
  Ye file poore app ka sirf ek hi API helper rakhti hai.

  Faayda: agar kal ko API ka URL ya key badalni ho,
  to sirf yahi file change karni padegi, baaki 20 files ko haath nahi lagana padega.
*/

/*
  Ab hum TMDB ko seedha call nahi karte.

  Kyun: kai ISPs api.themoviedb.org ko block kar dete hain, aur key bhi
  client bundle me dikh jaati thi. Isliye apni hi Netlify function ko call
  karte hain (netlify/functions/tmdb.js), jo server se TMDB ko poochti hai.

  Key ab server par TMDB_KEY naam se rehti hai - VITE_ prefix ke bina.
*/
const API_ENDPOINT = "/.netlify/functions/tmdb";

/*
  Ye main function hai jo TMDB se data laata hai.

  endpoint -> "movie/popular" jaisa path
  params   -> extra cheezein jaise { page: 2, query: "batman" }

  Example: fetchFromTmdb("movie/popular", { page: 1 })
*/
export async function fetchFromTmdb(endpoint, params = {}) {
  // endpoint aur baaki params function ko bhej rahe hain - api_key server lagata hai
  const searchParams = new URLSearchParams({ endpoint, ...params });

  const finalUrl = `${API_ENDPOINT}?${searchParams.toString()}`;

  const response = await fetch(finalUrl);

  // Agar server ne error status bheja (404, 500 etc) to hum khud error throw karte hain
  // taaki Redux ka rejected case chal jaye aur user ko error screen dikhe
  if (!response.ok) {
    throw new Error("Could not load data. Please try again in a moment.");
  }

  return response.json();
}
