import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

import SavedMoviesView from "../components/movie/SavedMoviesView";
import { useList } from "../context/ListContext";
import { useUi } from "../context/UiContext";

/*
  ===== WATCHLIST PAGE =====

  Jo movies user ne "baad me dekhni hai" karke save ki hain.

  Is page me sirf 8 line ka kaam hai kyunki
  saara design SavedMoviesView component me hai.
*/
export default function Watchlist() {
  const { watchlist, clearWatchlist } = useList();
  const { showToast } = useUi();

  // Clear All dabane par list khaali karo aur message dikhao
  const handleClearAll = () => {
    clearWatchlist();
    showToast("Watchlist cleared", "info");
  };

  return (
    <SavedMoviesView
      title="My Watchlist"
      subtitle={`${watchlist.length} titles saved to watch later`}
      movies={watchlist}
      onClearAll={handleClearAll}
      emptyTitle="Your watchlist is empty"
      emptyMessage="Tap the + button on any movie card to save it here for later."
      emptyIcon={<BookmarkBorderRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />}
    />
  );
}
