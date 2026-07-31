/*
  Yaha app ki fixed values (constants) rakhi hain
  Ek jagah rakhne se baad me change karna aasan ho jata hai
*/

// TMDB images ka base URL - poster aur backdrop yahi se aate hain
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Agar movie ka poster na ho to ye placeholder image dikhate hain
export const NO_POSTER_IMAGE = "https://placehold.co/342x513/1c1c1c/a1a1aa?text=No+Poster";
export const NO_BACKDROP_IMAGE = "https://placehold.co/1280x720/1c1c1c/a1a1aa?text=No+Image";
export const NO_PROFILE_IMAGE = "https://placehold.co/185x278/1c1c1c/a1a1aa?text=No+Photo";

/*
  Home page par jo rows dikhengi unki list
  title = screen par dikhne wala naam
  endpoint = TMDB API ka path
  Naya row add karna ho to bas yaha ek object add kar do
*/
export const HOME_MOVIE_ROWS = [
  { title: "Trending Now", endpoint: "trending/movie/week" },
  { title: "Popular Movies", endpoint: "movie/popular" },
  { title: "Top Rated", endpoint: "movie/top_rated" },
  { title: "Upcoming", endpoint: "movie/upcoming" },
  { title: "Now Playing", endpoint: "movie/now_playing" },
];

/*
  TMDB me har genre ka ek fixed id hota hai
  Hum discover API me ye id bhej kar us genre ki movies laate hain
*/
export const GENRE_ROWS = [
  { title: "Action", genreId: 28 },
  { title: "Comedy", genreId: 35 },
  { title: "Drama", genreId: 18 },
  { title: "Sci-Fi", genreId: 878 },
  { title: "Horror", genreId: 27 },
];

// TV Shows page ki rows
export const TV_ROWS = [
  { title: "Trending TV Shows", endpoint: "trending/tv/week" },
  { title: "Popular on MegaMovies", endpoint: "tv/popular" },
  { title: "Top Rated Shows", endpoint: "tv/top_rated" },
  { title: "Airing Today", endpoint: "tv/airing_today" },
];

// Navbar ke menu links
export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "TV Shows", path: "/tv-shows" },
  { label: "Trending", path: "/trending" },
  { label: "Watchlist", path: "/watchlist" },
  { label: "Favorites", path: "/favorites" },
];

/*
  List waali API (popular, trending) sirf genre ki ID bhejti hai, naam nahi.
  Naam ke liye alag API call karni padti hai.

  Ye IDs kabhi badalti nahi, isliye ek chhota map yahi bana liya.
  Isse ek extra API call bach jaati hai.
*/
export const GENRE_NAMES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10765: "Sci-Fi & Fantasy",
};

/*
  localStorage me watchlist aur favorites is naam se save hoti hai.

  Dhyaan dein: ye poora naam nahi hai. Iske aage user ka email lagta hai.
  Jaise: "megamovies_watchlist_sachin@gmail.com"

  Aisa isliye kiya taaki har account ki apni alag list rahe.
*/
export const WATCHLIST_STORAGE_KEY = "megamovies_watchlist";
export const FAVORITES_STORAGE_KEY = "megamovies_favorites";

// Logged-in user ki detail is naam se save hoti hai
export const USER_STORAGE_KEY = "megamovies_user";

/*
  Footer me dikhne wale social media links.

  Ek array me rakhne ka faayda: naya link add karna ho to bas
  yaha ek object daal do, Footer.jsx ko chhune ki zarurat nahi.

  "icon" me sirf naam rakha hai - asli icon component Footer me chunte hain.
*/
export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/sachin_28022005",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    // Saaf profile URL (authwall wale lambe link ki jagah)
    url: "https://www.linkedin.com/in/sachin-kumar-b814683a9",
  },
  {
    label: "GitHub",
    icon: "github",
    url: "https://github.com/sachin-codes01",
  },
  {
    label: "Email",
    icon: "email",
    // mailto: se click karte hi mail app khul jaata hai
    url: "mailto:sachin.codes01@gmail.com",
  },
];
