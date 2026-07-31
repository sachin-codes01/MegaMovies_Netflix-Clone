import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";

import { useUi } from "../../context/UiContext";
import { getTrailer } from "../../services/movieService";
import { getTitle } from "../../utils/helpers";

/*
  ===== TRAILER MODAL (Global Modal) =====

  Ye poore app ka ek hi popup hai jo trailer chalata hai.

  Ise MainLayout me ek hi baar rakha hai. Koi bhi component
  UiContext ka openTrailer(movie) bulakar ise khol sakta hai.

  Faayda: har page par alag modal banane ki zarurat nahi padti.
*/
export default function TrailerModal() {
  // Konsi movie ka trailer dekhna hai - ye Context se aata hai
  const { selectedMovie, closeTrailer } = useUi();

  return (
    <Dialog
      // selectedMovie null nahi hai to modal khula rahega
      open={Boolean(selectedMovie)}
      onClose={closeTrailer}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { bgcolor: "#0a0a0a", borderRadius: 3, overflow: "hidden" },
      }}
    >
      <div className="relative">
        {/* Band karne wala cross button */}
        <IconButton
          onClick={closeTrailer}
          aria-label="Close trailer"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 20,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.6)",
            "&:hover": { bgcolor: "var(--brand-dark)" },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        {/*
          Video wala hissa alag component me hai aur usme key={id} lagayi hai.

          key badalne par React purana component hata kar naya banata hai.
          Isse har nayi movie par state apne aap null se shuru hoti hai -
          purani video ek second ke liye bhi nahi dikhti.
        */}
        {selectedMovie && <TrailerPlayer key={selectedMovie.id} movie={selectedMovie} />}
      </div>
    </Dialog>
  );
}

/*
  Asli video yahan chalti hai.
  Ye alag component isliye banaya taaki har movie ke liye
  ye poora naya bane (upar wali key ki wajah se).
*/
function TrailerPlayer({ movie }) {
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
    Component bante hi trailer laate hain.
    Trailer pehle se nahi laate kyunki bekaar ki API call hoti.
  */
  useEffect(() => {
    // Component hat gaya to purane result ko ignore karna hai
    let isActive = true;

    getTrailer(movie.id, movie.mediaType || "movie")
      .then((result) => {
        if (isActive) setTrailer(result);
      })
      .catch(() => {
        if (isActive) setTrailer(null);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [movie]);

  return (
    // aspect-video se video ka 16:9 size sahi rehta hai
    <div className="flex aspect-video w-full items-center justify-center bg-black">
      {loading ? (
        // Trailer dhoondha ja raha hai
        <CircularProgress sx={{ color: "var(--brand)" }} />
      ) : trailer ? (
        // Trailer mil gaya - YouTube player dikhao
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        // Is movie ka trailer TMDB par hai hi nahi
        <div className="px-6 text-center">
          <p className="text-lg font-semibold text-white">Trailer not available</p>
          <p className="mt-1 text-sm text-white/60">
            No trailer has been uploaded for {getTitle(movie)} yet.
          </p>
        </div>
      )}
    </div>
  );
}
