/*
  Ye file poore app ka sirf ek hi API helper rakhti hai.

  Faayda: agar kal ko API ka URL ya key badalni ho,
  to sirf yahi file change karni padegi, baaki 20 files ko haath nahi lagana padega.
*/

// TMDB ko seedhe browser se call nahi karte - kuch ISPs api.themoviedb.org
// ko block karte hain (VPN ke bina fail hota tha), aur API key bhi client
// bundle me expose nahi karni thi. Isliye ek apna server-side proxy hai:
// - production me: /api/tmdb/* -> Netlify Function (netlify/functions/tmdb.js)
// - local dev me: /api/tmdb/* -> vite.config.js ka dev-server proxy
const API_BASE = "/api/tmdb";

/*
  Ye main function hai jo TMDB se data laata hai.

  endpoint -> "movie/popular" jaisa path
  params   -> extra cheezein jaise { page: 2, query: "batman" }

  Example: fetchFromTmdb("movie/popular", { page: 1 })
*/
export async function fetchFromTmdb(endpoint, params = {}) {
  const searchParams = new URLSearchParams(params);

  const finalUrl = `${API_BASE}/${endpoint}?${searchParams.toString()}`;

  const response = await fetch(finalUrl);

  // Agar server ne error status bheja (404, 500 etc) to hum khud error throw karte hain
  // taaki Redux ka rejected case chal jaye aur user ko error screen dikhe
  if (!response.ok) {
    throw new Error("Could not load data. Please try again in a moment.");
  }

  return response.json();
}
