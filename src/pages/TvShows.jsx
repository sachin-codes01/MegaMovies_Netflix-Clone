import { useEffect } from "react";

import PageHeader from "../components/common/PageHeader";
import MovieRow from "../components/movie/MovieRow";
import ErrorBox from "../components/common/ErrorBox";
import { MovieRowSkeleton } from "../components/common/Skeletons";

import { useMovies } from "../context/MovieContext";

/*
  ===== TV SHOWS PAGE =====

  Home page jaisa hi hai, bas yahan movies ki jagah TV shows hain.

  Dhyaan dijiye: MovieRow me mediaType="tv" bhej rahe hain.
  Iske bina card click karne par galat details khulti,
  kyunki TMDB me movie aur tv ke endpoint alag-alag hain.
*/
export default function TvShows() {
  const { tvRows, tvLoading, tvError, loadTvRows } = useMovies();

  // Page khulte hi TV rows laao (data pehle se ho to call nahi hogi)
  useEffect(() => {
    loadTvRows();
  }, [loadTvRows]);

  if (tvError) {
    return <ErrorBox message={tvError} onRetry={() => loadTvRows(true)} />;
  }

  return (
    <div className="pb-10">
      <PageHeader title="TV Shows" subtitle="Binge-worthy series and shows" />

      {/* Data aane tak grey skeleton */}
      {tvLoading || tvRows.length === 0 ? (
        <>
          <MovieRowSkeleton />
          <MovieRowSkeleton />
          <MovieRowSkeleton />
        </>
      ) : (
        tvRows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} mediaType="tv" />
        ))
      )}
    </div>
  );
}
