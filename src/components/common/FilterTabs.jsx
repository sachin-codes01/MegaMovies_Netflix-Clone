import { memo } from "react";
import Chip from "@mui/material/Chip";

/*
  ===== FILTER TABS =====

  Movies page par "Popular / Top Rated / Upcoming" aur
  Trending page par "Today / This Week" chunne ke liye buttons.

  options  -> [{ label: "Popular", value: "movie/popular" }, ...]
  active   -> abhi konsa chuna hua hai
  onChange -> naya chunne par ye function chalta hai
*/
function FilterTabs({ options, active, onChange }) {
  return (
    // flex-wrap se chhoti screen par buttons agli line me chale jaate hain
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === active;

        return (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => onChange(option.value)}
            // Chuna hua button bhara blue, baaki sirf outline
            variant={isActive ? "filled" : "outlined"}
            sx={{
              fontWeight: 600,
              bgcolor: isActive ? "var(--brand)" : "transparent",
              color: isActive ? "#fff" : "inherit",
              borderColor: "var(--app-line)",
              "&:hover": {
                bgcolor: isActive ? "var(--brand-dark)" : "var(--brand-soft)",
              },
            }}
          />
        );
      })}
    </div>
  );
}

export default memo(FilterTabs);
