import {
  IMAGE_BASE_URL,
  NO_POSTER_IMAGE,
  NO_BACKDROP_IMAGE,
  NO_PROFILE_IMAGE,
  GENRE_NAMES,
} from "./constants";

/*
  Ye chhote helper functions hain
  Inka kaam API se aaye raw data ko screen par dikhane layak banana hai
*/

// Poster ka poora URL banata hai. Agar poster na ho to placeholder deta hai
export function getPosterUrl(posterPath, size = "w342") {
  if (!posterPath) return NO_POSTER_IMAGE;
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
}

// Backdrop (badi chaudi image) ka URL banata hai
export function getBackdropUrl(backdropPath, size = "original") {
  if (!backdropPath) return NO_BACKDROP_IMAGE;
  return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
}

// Cast member ki photo ka URL
export function getProfileUrl(profilePath) {
  if (!profilePath) return NO_PROFILE_IMAGE;
  return `${IMAGE_BASE_URL}/w185${profilePath}`;
}

/*
  TMDB me movie ka naam "title" me aata hai
  aur TV show ka naam "name" me aata hai
  Isliye dono check karte hain
*/
export function getTitle(item) {
  return item.title || item.name || "Untitled";
}

// Release date ya first air date me se jo mile wo le lo
export function getReleaseDate(item) {
  return item.release_date || item.first_air_date || "";
}

// Date me se sirf saal nikalta hai. Example: "2024-05-10" -> "2024"
export function getYear(dateString) {
  if (!dateString) return "N/A";
  return dateString.slice(0, 4);
}

// Rating ko 1 decimal tak dikhate hain. Example: 7.844 -> "7.8"
export function formatRating(voteAverage) {
  if (!voteAverage) return "N/A";
  return Number(voteAverage).toFixed(1);
}

// Minute ko ghante-minute me badalta hai. Example: 142 -> "2h 22m"
export function formatRuntime(minutes) {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Paise ko readable banata hai. Example: 1000000 -> "$1,000,000"
export function formatMoney(amount) {
  if (!amount || amount <= 0) return "N/A";
  return `$${amount.toLocaleString()}`;
}

/*
  Genre IDs ko naam me badalta hai.
  Example: [28, 35] -> ["Action", "Comedy"]

  limit se batate hain ki kitne genre dikhane hain (hero me 3 kaafi hain)
*/
export function getGenreNames(genreIds, limit = 3) {
  if (!genreIds || genreIds.length === 0) return [];

  return genreIds
    .map((id) => GENRE_NAMES[id]) // id se naam nikalo
    .filter(Boolean) // jiska naam na mila use hata do
    .slice(0, limit);
}

/*
  Movie details API me runtime "runtime" me aata hai,
  lekin TV show me "episode_run_time" naam ke array me aata hai.
  Ye function dono ko sambhal leta hai.
*/
export function getRuntime(details) {
  if (!details) return null;
  if (details.runtime) return details.runtime;
  if (details.episode_run_time?.length > 0) return details.episode_run_time[0];
  return null;
}

// Lamba text ko chhota karta hai taaki card ka layout na bigde
export function shortenText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
