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
  ===== TRENDING PAGE =====

  Aaj ya is hafte sabse zyada dekhi ja rahi movies.

  Ye page Movies page jaisa hi hai - wahi usePaginatedList aur
  wahi useInfiniteScroll hook use ho raha hai.
  Yahi hooks banane ka faayda hai: logic ek baar likha, do jagah kaam aaya.
*/

const TIME_OPTIONS = [
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
];

export default function Trending() {
  // day ya week
  const [timeWindow, setTimeWindow] = useState("week");

  // timeWindow badalne par hi naya function banega (useCallback)
  const fetchPage = useCallback(
    (page) => getListWithPageInfo(`trending/movie/${timeWindow}`, page),
    [timeWindow]
  );

  const { list, loading, loadingMore, error, hasMore, loadMore, retry } =
    usePaginatedList(fetchPage);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="pb-10">
      <PageHeader title="Trending" subtitle="What everyone is watching right now">
        <FilterTabs options={TIME_OPTIONS} active={timeWindow} onChange={setTimeWindow} />
      </PageHeader>

      {loading && <MovieGridSkeleton />}

      {error && list.length === 0 && <ErrorBox message={error} onRetry={retry} />}

      {!loading && list.length > 0 && <MovieGrid movies={list} />}

      {loadingMore && <Loader />}

      {/* Infinite scroll ka sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {!hasMore && list.length > 0 && (
        <p className="text-sub py-8 text-center text-sm">You have reached the end</p>
      )}
    </div>
  );
}
