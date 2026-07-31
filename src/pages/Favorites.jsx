import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

import SavedMoviesView from "../components/movie/SavedMoviesView";
import { useList } from "../context/ListContext";
import { useUi } from "../context/UiContext";

/*
  ===== FAVORITES PAGE =====

  User ki pasandeeda movies.

  Watchlist page jaisa hi hai - dono ek hi component use kar rahe hain.
  Isi ko code reuse kehte hain.
*/
export default function Favorites() {
  const { favorites, clearFavorites } = useList();
  const { showToast } = useUi();

  const handleClearAll = () => {
    clearFavorites();
    showToast("Favorites cleared", "info");
  };

  return (
    <SavedMoviesView
      title="My Favorites"
      subtitle={`${favorites.length} titles you loved`}
      movies={favorites}
      onClearAll={handleClearAll}
      emptyTitle="No favorites yet"
      emptyMessage="Tap the heart icon on any movie card to add it to your favorites."
      emptyIcon={<FavoriteBorderRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />}
    />
  );
}
