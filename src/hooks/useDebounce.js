import { useState, useEffect } from "react";

/*
  ===== useDebounce =====

  Problem: search box me user "batman" type karta hai to 6 letter = 6 API call.
  Ye API par bekaar ka load daalta hai.

  Solution: user ke rukne ka intezaar karo.
  Jab tak wo type kar raha hai, timer baar-baar reset hota rahega.
  Jab 500ms tak koi typing nahi hui, tabhi value update hogi aur API call jayegi.

  Use: const debouncedQuery = useDebounce(query, 500);
*/
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay ke baad value update karne ka timer laga do
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /*
      Ye cleanup function hai.
      Value dobara badalne se pehle React ise chalata hai,
      jisse purana timer cancel ho jaata hai. Yahi debounce ka asli jaadu hai.
    */
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
