import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";

/*
  ===== EMPTY STATE =====

  Jab list khaali ho tab ye dikhta hai. Jaise:
  - Watchlist me abhi kuch add nahi kiya
  - Search me koi result nahi mila

  Khaali safed page dikhane se user confuse ho jaata hai ki
  app kharab hai ya sach me kuch hai hi nahi. Isliye ye zaruri hai.
*/
export default function EmptyState({ title, message, actionLabel, actionPath, icon }) {
  return (
    <div className="fade-in flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Icon na diya ho to default movie wala icon dikhega */}
      {icon || <MovieFilterRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />}

      <h2 className="text-display text-main mb-2 text-2xl font-bold">{title}</h2>

      <p className="text-sub mb-6 max-w-md text-sm">{message}</p>

      {/* Button tabhi dikhao jab uska naam aur link dono diye gaye hon */}
      {actionLabel && actionPath && (
        <Button
          component={Link}
          to={actionPath}
          variant="contained"
          sx={{ bgcolor: "var(--brand)", color: "#fff", "&:hover": { bgcolor: "var(--brand-dark)", color: "#fff" } }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
