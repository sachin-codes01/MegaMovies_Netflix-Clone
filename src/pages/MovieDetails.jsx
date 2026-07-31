import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import CastList from "../components/movie/CastList";
import MovieRow from "../components/movie/MovieRow";
import ErrorBox from "../components/common/ErrorBox";

import useMovieDetails from "../hooks/useMovieDetails";
import { useUi } from "../context/UiContext";
import { useList } from "../context/ListContext";
import {
  getPosterUrl,
  getBackdropUrl,
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
  formatRuntime,
  formatMoney,
  getRuntime,
} from "../utils/helpers";

/*
  ===== MOVIE DETAILS PAGE =====

  Ek movie ki poori jaankari:
  badi image, poster, kahani, genres, cast, trailer aur similar movies.

  mediaType prop route se aata hai:
  /movie/123 -> "movie"
  /tv/123    -> "tv"
*/
export default function MovieDetails({ mediaType = "movie" }) {
  // URL me se id nikal rahe hain. Example: /movie/550 -> id = "550"
  const { id } = useParams();
  const navigate = useNavigate();

  // Saara data laane ka kaam ye hook karta hai
  const { data, loading, error, retry } = useMovieDetails(id, mediaType);

  const { openTrailer, showToast } = useUi();
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isFavorite } = useList();

  // Data aa raha hai - skeleton dikhao
  if (loading) return <DetailsSkeleton />;

  // Error aa gaya - retry ke saath message
  if (error) return <ErrorBox message={error} onRetry={retry} />;

  // Data hi nahi mila
  if (!data?.details) {
    return <ErrorBox message="We could not find this title." onRetry={retry} />;
  }

  const { details, cast, trailer, similar } = data;

  const title = getTitle(details);
  const year = getYear(getReleaseDate(details));
  const rating = formatRating(details.vote_average);
  const runtime = formatRuntime(getRuntime(details));

  const inWatchlist = isInWatchlist(details.id);
  const inFavorites = isFavorite(details.id);

  // Watchlist / Favorites me daalne ke liye chhota sa object banate hain
  const movieForList = { ...details, mediaType };

  const handleWatchlist = () => {
    const wasAdded = toggleWatchlist(movieForList);
    showToast(wasAdded ? `Added to Watchlist` : `Removed from Watchlist`);
  };

  const handleFavorite = () => {
    const wasAdded = toggleFavorite(movieForList);
    showToast(wasAdded ? `Added to Favorites` : `Removed from Favorites`);
  };

  return (
    // -mt-20 se ye page navbar ke peeche tak jaata hai (MainLayout ki padding hata rahe hain)
    <div className="-mt-20 md:-mt-24">
      {/* ===== Upar ki badi backdrop image ===== */}
      <div className="relative h-[45vh] min-h-[280px] w-full md:h-[60vh]">
        <img
          src={getBackdropUrl(details.backdrop_path)}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Image ke upar kaala gradient taaki poster aur text saaf dikhein */}
        <div className="hero-fade-bottom absolute inset-0" />

        {/* Wapas jaane ka button */}
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          sx={{
            position: "absolute",
            top: 80,
            /*
              left ki value page ke content se match karni chahiye.

              Neeche poster aur text "px-4 md:px-10" use karte hain,
              matlab mobile par 16px aur bade screen par 40px.

              Pehle yaha sirf 16 likha tha, isliye bade screen par
              ye button baaki content se 24px zyada left me chala jaata tha.
            */
            left: { xs: 16, md: 40 },
            zIndex: 20,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.6)",
            // Shape ab muiTheme.js se aata hai (saare buttons rectangle hain)
            "&:hover": { bgcolor: "var(--brand-dark)" },
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
      </div>

      {/* ===== Poster + saari details ===== */}
      <div className="relative z-10 -mt-28 px-4 pb-10 md:-mt-40 md:px-10">
        {/* Mobile par upar-niche, bade screen par side-by-side (md:flex-row) */}
        <div className="fade-up flex flex-col gap-6 md:flex-row md:gap-8">
          {/*
            Poster

            ZARURI: "self-center md:self-start" kyun lagaya?

            Iska parent flex container hai. Flex me by default har item
            apne aap khinch kar parent ki poori height le leta hai (align-items: stretch).
            Isliye poster bagal wale lambe text column jitna lamba ho jaata tha
            aur image ekdum khinchi hui (stretched) dikhti thi.

            self-start se poster upar se shuru hota hai aur apni asli
            height rakhta hai. aspect-[2/3] uska sahi shape pakka karta hai
            (movie poster hamesha 2:3 ratio ka hota hai).
          */}
          <img
            src={getPosterUrl(details.poster_path, "w342")}
            alt={title}
            className="bg-card-2 mx-auto aspect-[2/3] w-[180px] shrink-0 self-center rounded-xl object-cover shadow-2xl md:mx-0 md:w-[240px] md:self-start"
          />

          {/* Right side ki saari information */}
          <div className="flex-1">
            <h1 className="text-display mb-2 text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
              {title}
            </h1>

            {/* Tagline har movie me nahi hoti, isliye pehle check kar rahe hain */}
            {details.tagline && (
              <p className="text-brand-400 mb-4 text-sm italic">{details.tagline}</p>
            )}

            {/* Rating, saal, runtime */}
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="bg-brand-500/20 text-brand-400 flex items-center gap-1 rounded-full px-3 py-1 font-semibold">
                <StarRoundedIcon sx={{ fontSize: 16 }} />
                {rating}
              </span>
              <span className="text-sub">{year}</span>
              <span className="text-sub">{runtime}</span>
            </div>

            {/* Genres ke chips - details API me inke poore naam aate hain */}
            <div className="mb-5 flex flex-wrap gap-2">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="border-line text-sub rounded-full border px-3 py-1 text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Kahani */}
            <h2 className="text-main mb-2 text-lg font-semibold">Overview</h2>
            <p className="text-sub mb-6 max-w-3xl text-sm leading-relaxed">
              {details.overview || "No description available for this title."}
            </p>

            {/* ===== Buttons ===== */}
            <div className="mb-6 flex flex-wrap gap-3">
              <Button
                variant="contained"
                startIcon={<PlayArrowRoundedIcon />}
                onClick={() => openTrailer(movieForList)}
                // Trailer hi nahi hai to button dabane layak nahi rakhna
                disabled={!trailer}
                sx={{
                  bgcolor: "var(--brand)",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "var(--brand-dark)", color: "#fff" },
                }}
              >
                {trailer ? "Watch Trailer" : "No Trailer"}
              </Button>

              <Button
                variant="outlined"
                startIcon={inWatchlist ? <CheckRoundedIcon /> : <AddRoundedIcon />}
                onClick={handleWatchlist}
                sx={{ borderColor: "var(--app-line)", color: "inherit" }}
              >
                {inWatchlist ? "In Watchlist" : "Watchlist"}
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  inFavorites ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />
                }
                onClick={handleFavorite}
                sx={{
                  borderColor: "var(--app-line)",
                  color: inFavorites ? "var(--brand)" : "inherit",
                }}
              >
                {inFavorites ? "Favorite" : "Add Favorite"}
              </Button>
            </div>

            {/* ===== Chhoti-moti extra information ===== */}
            <div className="grid max-w-2xl grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <InfoItem label="Status" value={details.status} />
              <InfoItem label="Language" value={details.original_language?.toUpperCase()} />
              <InfoItem label="Votes" value={details.vote_count?.toLocaleString()} />

              {/* Budget aur revenue sirf movies me hota hai, TV shows me nahi */}
              {mediaType === "movie" && (
                <>
                  <InfoItem label="Budget" value={formatMoney(details.budget)} />
                  <InfoItem label="Revenue" value={formatMoney(details.revenue)} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===== Cast ===== */}
        <div className="mt-12">
          <CastList cast={cast} />
        </div>
      </div>

      {/* ===== Similar movies ki row ===== */}
      {similar.length > 0 && (
        <MovieRow title="Similar Movies" movies={similar} mediaType={mediaType} />
      )}
    </div>
  );
}

/*
  Chhota sa helper component - label aur value dikhata hai.
  Isse upar wala JSX 5 baar repeat karne se bach gaya.
*/
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sub text-xs">{label}</p>
      <p className="text-main font-medium">{value || "N/A"}</p>
    </div>
  );
}

/*
  Details page ka skeleton - data aane tak yahi dikhta hai.
  Iska dhancha asli page jaisa hi hai taaki data aane par jhatka na lage.
*/
function DetailsSkeleton() {
  return (
    <div className="-mt-20 md:-mt-24">
      <Skeleton variant="rectangular" className="!h-[45vh] !w-full md:!h-[60vh]" />

      <div className="relative z-10 -mt-28 px-4 md:-mt-40 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {/* Poster ki jagah */}
          <Skeleton
            variant="rounded"
            className="!mx-auto !h-[270px] !w-[180px] md:!mx-0 md:!h-[360px] md:!w-[240px]"
          />

          {/* Text ki jagah */}
          <div className="flex-1">
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="90%" sx={{ mt: 3 }} />
            <Skeleton variant="text" width="85%" />
            <Skeleton variant="text" width="70%" />

            <div className="mt-6 flex gap-3">
              <Skeleton variant="rounded" width={160} height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rounded" width={130} height={40} sx={{ borderRadius: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
