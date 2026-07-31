import Skeleton from "@mui/material/Skeleton";

/*
  ===== SKELETONS =====

  Skeleton = data aane se pehle dikhne wala grey dhancha.

  Sirf "Loading..." likhne se page khaali lagta hai aur jhatka lagta hai.
  Skeleton se user ko pehle hi pata chal jaata hai ki kahan kya aane wala hai.
  Isse app tez lagti hai.

  Yaha 3 tarah ke skeleton hain: card, row aur grid.
*/

/*
  Ek movie card jitna bada grey box.

  inRow bilkul MovieCard jaisa hi kaam karta hai:
  row me chaudai fixed, grid me poore column jitni (w-full).
  Isse loading ke waqt bhi cards heading ke saath seedh me rehte hain.
*/
export function MovieCardSkeleton({ inRow = false }) {
  return (
    <div className={inRow ? "w-[145px] shrink-0 sm:w-[165px] md:w-[185px]" : "w-full"}>
      {/* Poster ki jagah */}
      <Skeleton variant="rounded" className="!aspect-[2/3] !h-auto !w-full !rounded-xl" />
      {/* Title ki jagah */}
      <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
      {/* Saal ki jagah */}
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

/*
  Poori row ka skeleton (heading + 6 card)
  Array.from se bina kuch likhe 6 card bana lete hain
*/
export function MovieRowSkeleton() {
  return (
    <section className="mb-8">
      <div className="px-4 md:px-10">
        <Skeleton variant="text" width={180} height={30} />
      </div>

      <div className="no-scrollbar flex gap-3 overflow-hidden px-4 py-4 md:px-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <MovieCardSkeleton key={index} inRow />
        ))}
      </div>
    </section>
  );
}

// Grid wale pages (Movies, Search, Trending) ka skeleton
export function MovieGridSkeleton({ count = 12 }) {
  return (
    // Ye class list MovieGrid.jsx se bilkul same hai - dono ek jaise dikhne chahiye
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-3 gap-y-6 px-4 sm:grid-cols-[repeat(auto-fill,minmax(155px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:px-10">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Hero banner ka skeleton
export function HeroSkeleton() {
  return (
    <div className="relative h-[75vh] min-h-[460px] w-full md:h-[85vh]">
      <Skeleton variant="rectangular" className="!h-full !w-full" />

      {/* Image ke upar title aur button ki jagah */}
      <div className="absolute bottom-16 left-4 w-[85%] max-w-2xl md:left-10 md:bottom-24">
        <Skeleton variant="text" width="70%" height={70} />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="60%" />
        <div className="mt-4 flex gap-3">
          <Skeleton variant="rounded" width={150} height={45} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={130} height={45} sx={{ borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}
