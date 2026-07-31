import { memo } from "react";
import MovieCard from "./MovieCard";

/*
  ===== MOVIE GRID =====

  Row me movies side me scroll hoti hain.
  Grid me wo neeche ki taraf lines me lagti hain.

  Ye Movies, Trending, Search, Watchlist aur Favorites - saare pages me use hota hai.
*/

/*
  ===== GRID KI CHAUDAI KA HISAAB (alignment ki asli jad) =====

  Pehle yahan fixed column count tha (2 / 3 / 4 / 5 / 6) aur saath me
  justify-items-center. 1920px screen par 6 column matlab har column ~295px ka,
  aur usme card sirf 185px ka - beech me. Natija: pehla card left se 95px par
  shuru hota tha, jabki heading aur logo 40px (px-10) par the.

  Ab auto-fill + minmax use kar rahe hain:
  - browser khud tay karta hai ki kitne column aayenge
  - har column kam se kam itna chauda hoga, aur bacha hua space aapas me
    baant liya jaayega (1fr)
  - card w-full hai, isliye wo column ko poora bhar deta hai

  Isse pehle card ka left kinara hamesha theek px-4 / md:px-10 par aata hai -
  yani heading aur logo ke saath ekdum seedh me.

  minmax ki value MovieRow ke card (145 / 165 / 185px) ke aas-paas rakhi hai
  taaki Home ki rows aur grid ke cards ek jaise dikhein.
*/
function MovieGrid({ movies, mediaType = "movie" }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-3 gap-y-6 px-4 sm:grid-cols-[repeat(auto-fill,minmax(155px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:px-10">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
      ))}
    </div>
  );
}

export default memo(MovieGrid);
