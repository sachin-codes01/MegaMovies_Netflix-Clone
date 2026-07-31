import { useState, useEffect, useCallback } from "react";

/*
  ===== usePaginatedList =====

  Ye hook Movies, Trending aur Search - teeno pages me use hota hai.
  Teeno ka kaam same hai: list laao, neeche scroll karo, agla page jodo.

  Isliye logic ek hi jagah likh diya (code repeat nahi hua).

  fetchPage -> ek function jo page number leta hai aur
               { results, page, totalPages } return karta hai
  enabled   -> false ho to koi call nahi hogi (Search page me khaali query ke liye)

  ZARURI: fetchPage ko useCallback me wrap karna hoga,
  warna wo har render par naya banega aur API baar-baar call hogi.
*/
export default function usePaginatedList(fetchPage, enabled = true) {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // pehli baar load ho raha hai
  const [loadingMore, setLoadingMore] = useState(false); // scroll par aur load ho raha hai
  const [error, setError] = useState(null);

  // Ek page ka data laata hai
  const load = useCallback(
    async (pageNumber) => {
      // Page 1 hai to poori screen ka loader, warna niche wala chhota loader
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      setError(null);

      try {
        const data = await fetchPage(pageNumber);

        // Page 1 = nayi list, warna purani list ke aage jod do
        setList((prev) => (pageNumber === 1 ? data.results : [...prev, ...data.results]));
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchPage]
  );

  /*
    Jab bhi fetchPage badlega (matlab category ya search query badli),
    purani list saaf karke page 1 se dobara shuru karte hain.
  */
  useEffect(() => {
    if (!enabled) {
      setList([]);
      setPage(1);
      setTotalPages(1);
      setError(null);
      return;
    }

    setList([]);
    setPage(1);
    load(1);
  }, [load, enabled]);

  // Aur movies hain ya list khatam ho gayi
  const hasMore = page < totalPages;

  // Neeche scroll karne par ye chalta hai
  const loadMore = useCallback(() => {
    // Pehle se koi call chal rahi ho ya list khatam ho to kuch mat karo
    if (loading || loadingMore || !hasMore) return;
    load(page + 1);
  }, [loading, loadingMore, hasMore, page, load]);

  // Error aane par "Retry" button ke liye
  const retry = useCallback(() => load(1), [load]);

  return { list, loading, loadingMore, error, hasMore, loadMore, retry };
}
