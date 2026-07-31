import { useState, useCallback } from "react";

import PageHeader from "../components/common/PageHeader";
import FilterTabs from "../components/common/FilterTabs";
import MovieGrid from "../components/movie/MovieGrid";
import ErrorBox from "../components/common/ErrorBox";
import Loader from "../components/common/Loader";
import { MovieGridSkeleton } from "../components/common/Skeletons";

import usePaginatedList from "../hooks/usePaginatedList";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { getListWithPageInfo } from "../services/movieService";

/*
  ===== MOVIES PAGE =====

  Grid me movies dikhata hai, saath me category chunne ke buttons.
  Niche scroll karte hi agla page apne aap load ho jaata hai (infinite scroll).
*/

// Upar dikhne wale category buttons
const CATEGORY_OPTIONS = [
  { label: "Popular", value: "movie/popular" },
  { label: "Top Rated", value: "movie/top_rated" },
  { label: "Now Playing", value: "movie/now_playing" },
  { label: "Upcoming", value: "movie/upcoming" },
];

export default function Movies() {
  // User ne konsi category chuni hai
  const [category, setCategory] = useState("movie/popular");

  /*
    Ye function usePaginatedList ko batata hai ki data kaise laana hai.

    useCallback bahut zaruri hai yahan!
    Iske bina ye function har render par naya banta,
    hook ko lagta "kuch badal gaya" aur API infinite loop me call hoti rehti.

    category badalne par hi ye naya banta hai - aur tabhi nayi list aati hai.
  */
  const fetchPage = useCallback(
    (page) => getListWithPageInfo(category, page),
    [category]
  );

  const { list, loading, loadingMore, error, hasMore, loadMore, retry } =
    usePaginatedList(fetchPage);

  // Ye ref page ke sabse niche wale khaali div par lagega
  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="pb-10">
      <PageHeader title="Movies" subtitle="Pick a category to explore">
        <FilterTabs options={CATEGORY_OPTIONS} active={category} onChange={setCategory} />
      </PageHeader>

      {/* Pehli baar load ho raha hai */}
      {loading && <MovieGridSkeleton />}

      {/* Error aaya aur list bhi khaali hai to poora error page dikhao */}
      {error && list.length === 0 && <ErrorBox message={error} onRetry={retry} />}

      {/* Movies aa gayin */}
      {!loading && list.length > 0 && <MovieGrid movies={list} />}

      {/* Neeche aur load ho raha hai to spinner */}
      {loadingMore && <Loader />}

      {/*
        Ye khaali div page ke sabse niche hai.
        Jab ye screen par dikhta hai, matlab user niche pahunch gaya
        aur agla page load ho jaata hai.
      */}
      <div ref={sentinelRef} className="h-1" />

      {/* Saari movies dikh gayin */}
      {!hasMore && list.length > 0 && (
        <p className="text-sub py-8 text-center text-sm">You have reached the end</p>
      )}
    </div>
  );
}
