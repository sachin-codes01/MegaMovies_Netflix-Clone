import { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import PageHeader from "../components/common/PageHeader";
import MovieGrid from "../components/movie/MovieGrid";
import ErrorBox from "../components/common/ErrorBox";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import { MovieGridSkeleton } from "../components/common/Skeletons";

import useDebounce from "../hooks/useDebounce";
import usePaginatedList from "../hooks/usePaginatedList";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { searchMovies } from "../services/movieService";

/*
  ===== SEARCH PAGE =====

  Live search hai - button dabane ki zarurat nahi,
  type karte hi result aa jaate hain.

  Lekin har letter par API call karna galat hai.
  Isliye useDebounce lagaya hai: user ke 500ms rukne ke baad hi call jaati hai.
*/
export default function Search() {
  // Box me user ne jo type kiya (turant update hota hai)
  const [query, setQuery] = useState("");

  // 500ms ruk kar update hone wali value - API isi par chalti hai
  const debouncedQuery = useDebounce(query, 500);

  // Khaali ya sirf space wali query par search nahi karna
  const isSearchEnabled = debouncedQuery.trim().length > 0;

  // debouncedQuery badalne par hi naya function banega
  const fetchPage = useCallback(
    (page) => searchMovies(debouncedQuery.trim(), page),
    [debouncedQuery]
  );

  // Doosra parameter (enabled) false hone par koi API call nahi hogi
  const { list, loading, loadingMore, error, hasMore, loadMore, retry } = usePaginatedList(
    fetchPage,
    isSearchEnabled
  );

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="pb-10">
      <PageHeader title="Search" subtitle="Start typing and results appear instantly">
        {/* Search input box */}
        <TextField
          fullWidth
          placeholder="Try Inception, Interstellar, Avengers..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          // Page khulte hi cursor box me aa jaye
          autoFocus
          sx={{
            maxWidth: 560,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: "var(--app-card)",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "var(--brand)" }} />
                </InputAdornment>
              ),
              // Cross button tabhi dikhega jab kuch type kiya ho
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setQuery("")} size="small" aria-label="Clear search">
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </PageHeader>

      {/* Case 1: user ne abhi kuch type hi nahi kiya */}
      {!isSearchEnabled && (
        <EmptyState
          icon={<SearchRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />}
          title="What are you looking for?"
          message="Type a movie name in the box above and results will show up as you type."
        />
      )}

      {/* Case 2: search chal rahi hai */}
      {isSearchEnabled && loading && <MovieGridSkeleton count={12} />}

      {/* Case 3: error aa gaya */}
      {isSearchEnabled && error && list.length === 0 && (
        <ErrorBox message={error} onRetry={retry} />
      )}

      {/* Case 4: search hui lekin kuch mila hi nahi */}
      {isSearchEnabled && !loading && !error && list.length === 0 && (
        <EmptyState
          icon={<SearchOffRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />}
          title="No results found"
          message={`We could not find anything for "${debouncedQuery}". Try checking the spelling.`}
        />
      )}

      {/* Case 5: result mil gaye */}
      {isSearchEnabled && !loading && list.length > 0 && (
        <>
          <p className="text-sub mb-4 px-4 text-sm md:px-10">
            {list.length} results for "{debouncedQuery}"
          </p>
          <MovieGrid movies={list} />
        </>
      )}

      {loadingMore && <Loader />}

      {/* Infinite scroll ka sentinel */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
