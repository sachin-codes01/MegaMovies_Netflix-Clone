import { memo } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

import { getPosterUrl, getTitle, getReleaseDate, getYear, formatRating } from "../../utils/helpers";
import { useList } from "../../context/ListContext";
import { useUi } from "../../context/UiContext";

/*
  ===== MOVIE CARD =====

  Ye ek movie ka poster card hai. Poore app me yahi card use hota hai -
  Home rows me bhi, Movies grid me bhi, Watchlist me bhi.

  Ek hi card sab jagah use karne se code repeat nahi hota
  aur design har page par same dikhta hai.

  ===== inRow PROP =====

  Card do jagah use hota hai aur dono ki chaudai ki zarurat alag hai:

  1. MovieRow (side me scroll wali line) -> yahan card ki chaudai FIXED
     honi chahiye, warna flex use ichha se chhota-bada kar deta hai.

  2. MovieGrid (Movies / Trending / Watchlist wala grid) -> yahan card ko
     apne column ki POORI chaudai lena chahiye (w-full).

     Pehle yahan bhi fixed chaudai thi aur grid me justify-items-center laga
     tha. Isse bade screen par column 300px ka ban jaata tha aur usme 185px
     ka card beech me aa jaata - yani pehla card heading aur logo se
     ~55px andar khisak jaata tha. Wahi "cards heading se match nahi kar rahe"
     wali problem thi.
*/
function MovieCard({ movie, mediaType = "movie", inRow = false }) {
  // Watchlist / Favorites ke functions Context se le rahe hain
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isFavorite } = useList();

  // Snackbar dikhane ke liye
  const { showToast } = useUi();

  const title = getTitle(movie);
  const year = getYear(getReleaseDate(movie));
  const rating = formatRating(movie.vote_average);

  // Card par icon bhara dikhana hai ya khaali
  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isFavorite(movie.id);

  /*
    Movie ka type "movie" hai ya "tv".

    Watchlist me save karte waqt hum type bhi saath me save karte hain.
    Isliye saved list me movie.mediaType pehle se hota hai -
    use pehle dekhte hain, warna prop wala use karte hain.
  */
  const type = movie.mediaType || mediaType;

  // Details page ka rasta. TV show ka alag hai kyunki API endpoint alag hai
  const detailsPath = `/${type}/${movie.id}`;

  // Watchlist button dabane par
  const handleWatchlistClick = () => {
    const wasAdded = toggleWatchlist({ ...movie, mediaType: type });
    showToast(wasAdded ? `Added to Watchlist` : `Removed from Watchlist`);
  };

  // Favorite (dil) button dabane par
  const handleFavoriteClick = () => {
    const wasAdded = toggleFavorite({ ...movie, mediaType: type });
    showToast(wasAdded ? `Added to Favorites` : `Removed from Favorites`);
  };

  return (
    // "group" class isliye lagayi hai taaki card par hover karne se
    // andar ke elements (overlay, buttons) bhi react karein
    <div
      className={`group relative ${
        inRow ? "w-[145px] shrink-0 sm:w-[165px] md:w-[185px]" : "w-full"
      }`}
    >
      {/* Poster par click karne se details page khulta hai */}
      <Link to={detailsPath} aria-label={title}>
        <div className="bg-card-2 card-glow relative aspect-[2/3] overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:-translate-y-1">
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={title}
            // loading="lazy" -> image tabhi download hogi jab screen ke paas aayegi
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Rating ka chhota badge - upar left corner me */}
          <div className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <StarRoundedIcon sx={{ fontSize: 14, color: "var(--brand)" }} />
            {rating}
          </div>

          {/* Kaala overlay - normally chhupa rehta hai, hover par dikhta hai */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="clamp-2 text-sm leading-tight font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs text-brand-400">{year}</p>
          </div>
        </div>
      </Link>

      {/*
        Action buttons Link ke bahar rakhe hain.
        Agar inhe Link ke andar rakhte to click karne par details page khul jaata.
      */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} placement="left">
          <IconButton
            size="small"
            onClick={handleWatchlistClick}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: inWatchlist ? "var(--brand)" : "#fff",
              "&:hover": { bgcolor: "var(--brand)", color: "#fff" },
            }}
          >
            {/* List me hai to tick, warna plus */}
            {inWatchlist ? (
              <CheckRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={inFavorites ? "Remove from Favorites" : "Add to Favorites"} placement="left">
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: inFavorites ? "var(--brand)" : "#fff",
              "&:hover": { bgcolor: "var(--brand)", color: "#fff" },
            }}
          >
            {/* Favorite hai to bhara dil, warna khaali dil */}
            {inFavorites ? (
              <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </div>

      {/* Card ke niche title aur saal - mobile par hover nahi hota isliye ye hamesha dikhta hai */}
      <div className="mt-2 px-0.5">
        <h3 className="clamp-2 text-main text-xs leading-snug font-medium">{title}</h3>
        <p className="text-sub mt-0.5 text-[11px]">{year}</p>
      </div>
    </div>
  );
}

/*
  React.memo ka matlab: agar is card ki props nahi badli
  to ise dobara render mat karo.

  Home page par 100+ cards hote hain. Bina memo ke,
  ek bhi state badalne par saare 100 card dobara render hote.
*/
export default memo(MovieCard);
