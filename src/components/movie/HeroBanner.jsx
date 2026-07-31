import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import {
  getBackdropUrl,
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
  getGenreNames,
  shortenText,
} from "../../utils/helpers";
import { useUi } from "../../context/UiContext";
import { useList } from "../../context/ListContext";

/*
  ===== HERO BANNER (ek slide) =====

  Ye slider ka EK slide hai - ek movie ki badi backdrop image,
  uska naam, overview aur buttons.

  Iski apni height nahi hai (h-full lagaya hai). Height uske parent
  HeroSlider se aati hai. Isse saare slides ek hi size ke rehte hain.

  isActive -> ye slide abhi screen par dikh raha hai ya peeche chhupa hai.
              Chhupe slide ki image lazy load hoti hai (net bachta hai).
*/
function HeroBanner({ movie, mediaType = "movie", isActive = true }) {
  const navigate = useNavigate();
  // Ek hi baar useUi() bulakar dono cheezein le li hain
  const { openTrailer, showToast } = useUi();
  const { toggleWatchlist, isInWatchlist } = useList();

  // Movie hi nahi aayi to kuch mat dikhao
  if (!movie) return null;

  const title = getTitle(movie);
  const year = getYear(getReleaseDate(movie));
  const rating = formatRating(movie.vote_average);
  const genres = getGenreNames(movie.genre_ids); // ["Action", "Drama"]
  const inWatchlist = isInWatchlist(movie.id);

  const handleAddToList = () => {
    const wasAdded = toggleWatchlist({ ...movie, mediaType });
    showToast(wasAdded ? `Added to Watchlist` : `Removed from Watchlist`);
  };

  return (
    <section className="relative h-full w-full">
      {/* Sabse peeche movie ki badi image */}
      <img
        src={getBackdropUrl(movie.backdrop_path)}
        alt={title}
        // Jo slide abhi dikh raha hai wo turant load ho, baaki baad me
        loading={isActive ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/*
        Image ke upar 2 gradient layer daali hain.
        Inke bina safed text safed image par padha nahi jaata.
      */}
      <div className="hero-fade-left absolute inset-0" />
      <div className="hero-fade-bottom absolute inset-0" />

      {/*
        Saara text aur buttons.

        Netflix jaisa look: ye poora block niche-left kone me rehta hai,
        upar nahi. Isse movie ka poster (hero image) saaf dikhta hai aur
        uske character ka chehra text ke peeche nahi chhupta.

        pb (niche ki jagah) itni hi rakhi hai jitni chahiye - kyunki
        Home page par movie rows -mt se thoda upar khinchi jaati hain.
        Chhoti aur badi dono screen par same behaviour hai.
      */}
      <div className="fade-up relative z-10 flex h-full flex-col justify-end px-4 pb-14 md:px-10 md:pb-16">
        <div className="max-w-xl">
          {/*
            Movie ka naam.
            Size pehle se chhota rakha hai taaki title 2-3 line me na phaile
            aur poora block compact rahe (bilkul Netflix jaisa).
          */}
          <h1 className="text-display mb-2 text-2xl leading-tight font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* Rating, saal aur genres ek line me */}
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-brand-500/20 px-3 py-1 font-semibold text-brand-400">
              <StarRoundedIcon sx={{ fontSize: 16 }} />
              {rating}
            </span>

            <span className="text-white/80">{year}</span>

            {/* Har genre ka apna chhota chip */}
            {genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/80"
              >
                {genre}
              </span>
            ))}
          </div>

          {/*
            Movie ki kahani.

            clamp-2 = sirf 2 line dikhengi (pehle 3 thi).
            Netflix par bhi chhota sa description hota hai - poori kahani
            details page par milti hai. Isse hero block chhota rehta hai
            aur image zyada dikhti hai.
          */}
          <p className="clamp-2 mb-5 text-sm leading-relaxed text-white/85">
            {shortenText(movie.overview, 150) || "No description available for this title."}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Watch Now -> trailer wala popup khulta hai */}
            <Button
              variant="contained"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={() => openTrailer({ ...movie, mediaType })}
              sx={{
                bgcolor: "var(--brand)",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { bgcolor: "var(--brand-dark)", color: "#fff" },
              }}
            >
              Watch Now
            </Button>

            {/* My List -> watchlist me add / remove */}
            <Button
              variant="outlined"
              startIcon={inWatchlist ? <CheckRoundedIcon /> : <AddRoundedIcon />}
              onClick={handleAddToList}
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.35)",
                "&:hover": { borderColor: "var(--brand)", bgcolor: "var(--brand-soft)" },
              }}
            >
              {inWatchlist ? "In My List" : "My List"}
            </Button>

            {/* More Info -> details page par le jaata hai */}
            <Button
              variant="text"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => navigate(`/${mediaType}/${movie.id}`)}
              sx={{ color: "#fff", "&:hover": { color: "var(--brand)" } }}
            >
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroBanner);
