import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
  ===== SCROLL TO TOP =====

  Problem: React Router page badalne par scroll position wahi chhod deta hai.
  Matlab Movies page me niche scroll karke Trending par jaao,
  to Trending bhi beech me se khulta hai. Ye ajeeb lagta hai.

  Solution: route badalte hi page ko upar le aao.

  Ye component screen par kuch dikhata nahi (return null),
  bas ek kaam karta hai. Aise components ko "utility component" kehte hain.
*/
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // pathname badalte hi ye chalega

  return null;
}
