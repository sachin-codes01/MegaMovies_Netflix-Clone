import { fetchFromTmdb } from "./api";

/*
  Yaha har API call ka apna chhota function bana diya hai.

  Component ya Redux ko ye nahi pata hona chahiye ki endpoint ka naam kya hai.
  Wo bas movieService.getPopularMovies() bulayega aur data mil jayega.
*/

// Kisi bhi list endpoint se data laata hai (popular, top_rated, trending etc.)
// results ka array wapas karta hai
export async function getListByEndpoint(endpoint, page = 1) {
  const data = await fetchFromTmdb(endpoint, { page });
  return data.results || [];
}

// Same cheez, lekin page info ke saath (infinite scroll me total_pages chahiye hota hai)
export async function getListWithPageInfo(endpoint, page = 1) {
  const data = await fetchFromTmdb(endpoint, { page });
  return {
    results: data.results || [],
    page: data.page || 1,
    totalPages: data.total_pages || 1,
  };
}

// Genre ke hisaab se movies laata hai (Action, Comedy waali rows ke liye)
export async function getMoviesByGenre(genreId, page = 1) {
  const data = await fetchFromTmdb("discover/movie", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
  return data.results || [];
}

// Search box me type karne par ye chalta hai
export async function searchMovies(query, page = 1) {
  const data = await fetchFromTmdb("search/movie", { query, page });
  return {
    results: data.results || [],
    page: data.page || 1,
    totalPages: data.total_pages || 1,
  };
}

/*
  Sirf trailer laata hai.
  Hero banner ke "Watch Now" button ke liye - wahan poori detail ki zarurat nahi,
  isliye sirf videos waali ek hi API call karte hain.
*/
export async function getTrailer(movieId, mediaType = "movie") {
  const data = await fetchFromTmdb(`${mediaType}/${movieId}/videos`);
  return data.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") || null;
}

/*
  Details page ke liye ek hi baar me 4 cheezein chahiye:
  1. basic detail   2. cast   3. trailer video   4. similar movies

  Promise.all se chaaron request ek saath jaati hain - isse page tez khulta hai.

  mediaType "movie" ya "tv" ho sakta hai.
  TMDB me dono ke endpoint alag hain (movie/123 vs tv/123),
  isliye ise parameter bana diya - warna TV show par galat data aata.
*/
export async function getMovieDetails(movieId, mediaType = "movie") {
  const [details, credits, videos, similar] = await Promise.all([
    fetchFromTmdb(`${mediaType}/${movieId}`),
    fetchFromTmdb(`${mediaType}/${movieId}/credits`),
    fetchFromTmdb(`${mediaType}/${movieId}/videos`),
    fetchFromTmdb(`${mediaType}/${movieId}/similar`),
  ]);

  // YouTube wala trailer dhoondh rahe hain
  const trailer =
    videos.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") || null;

  return {
    details,
    cast: credits.cast?.slice(0, 12) || [], // sirf pehle 12 actors dikhayenge
    trailer,
    similar: similar.results?.slice(0, 12) || [],
    mediaType,
  };
}
