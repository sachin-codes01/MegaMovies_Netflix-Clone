import { useEffect, useRef } from "react";

/*
  ===== useInfiniteScroll =====

  Iska kaam: page ke sabse niche ek "invisible" div rakhna.
  Jab wo div screen par dikhne lage, samajh jao user niche pahunch gaya
  aur agla page load kar do.

  Isme scroll event listener use nahi kiya kyunki wo second me 100 baar chalta hai.
  IntersectionObserver browser ka apna feature hai aur bahut fast hai.

  Use:
  const sentinelRef = useInfiniteScroll(loadMore, hasMore);
  <div ref={sentinelRef} />
*/
export default function useInfiniteScroll(onLoadMore, canLoadMore) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const element = sentinelRef.current;

    // Element nahi hai ya list khatam ho gayi to observer lagane ki zarurat nahi
    if (!element || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // isIntersecting = ye element ab screen par dikh raha hai
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        // 300px pehle hi load shuru kar do taaki user ko rukna na pade
        rootMargin: "300px",
      }
    );

    observer.observe(element);

    // Component hatte waqt observer band kar dena zaruri hai (memory leak se bachne ke liye)
    return () => observer.disconnect();
  }, [onLoadMore, canLoadMore]);

  return sentinelRef;
}
