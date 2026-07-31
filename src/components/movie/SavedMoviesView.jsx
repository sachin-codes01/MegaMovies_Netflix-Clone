import Button from "@mui/material/Button";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";

import PageHeader from "../common/PageHeader";
import MovieGrid from "./MovieGrid";
import EmptyState from "../common/EmptyState";

/*
  ===== SAVED MOVIES VIEW =====

  Watchlist aur Favorites page dekhne me bilkul ek jaise hain.
  Sirf naam, message aur list alag hai.

  Isliye do baar same code likhne ki jagah ek reusable component bana diya.
  Dono pages sirf apna data isme bhej dete hain.
*/
export default function SavedMoviesView({
  title,
  subtitle,
  movies,
  onClearAll,
  emptyTitle,
  emptyMessage,
  emptyIcon,
}) {
  return (
    <div className="pb-10">
      <PageHeader title={title} subtitle={subtitle}>
        {/* Clear All button tabhi dikhao jab list me kuch ho */}
        {movies.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteSweepRoundedIcon />}
            onClick={onClearAll}
            sx={{
              borderColor: "var(--app-line)",
              color: "inherit",
              "&:hover": { borderColor: "#ef4444", color: "#ef4444" },
            }}
          >
            Clear All
          </Button>
        )}
      </PageHeader>

      {/* List khaali hai to friendly message, warna movies ka grid */}
      {movies.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
          actionLabel="Browse movies"
          actionPath="/movies"
        />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
