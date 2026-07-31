import { useEffect } from "react";

import HeroSlider from "../components/movie/HeroSlider";
import MovieRow from "../components/movie/MovieRow";
import ErrorBox from "../components/common/ErrorBox";
import { HeroSkeleton, MovieRowSkeleton } from "../components/common/Skeletons";

import { useMovies } from "../context/MovieContext";

/*
  ===== HOME PAGE =====

  Netflix jaisa layout:
  Sabse upar ek badi hero image, uske niche movies ki horizontal rows.

  Dhyaan dijiye: is page me koi API call ka code nahi hai.
  Saara kaam MovieContext karta hai. Page ka kaam sirf dikhana hai.
  Isi ko "separation of concerns" kehte hain.
*/
export default function Home() {
  const { homeRows, homeLoading, homeError, loadHomeRows, heroMovies } = useMovies();

  /*
    Page khulte hi data laane ka order dete hain.

    Context ke andar check laga hai ki data pehle se hai to
    dobara API call nahi hogi. Isliye Home -> Details -> Home
    jaane par page turant khulta hai.
  */
  useEffect(() => {
    loadHomeRows();
  }, [loadHomeRows]);

  // Data laane me error aa gaya - retry button ke saath message dikhao
  if (homeError) {
    return <ErrorBox message={homeError} onRetry={() => loadHomeRows(true)} />;
  }

  // Data aa raha hai - grey skeleton dikhao taaki page khaali na lage
  if (homeLoading || homeRows.length === 0) {
    return (
      <div>
        <HeroSkeleton />
        <div className="relative z-10 pt-2">
          <MovieRowSkeleton />
          <MovieRowSkeleton />
          <MovieRowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/*
        Hero slider - 5 trending movies apne aap badalti rehti hain.
        Iske liye alag API call nahi ki, pehli row ki hi movies use kar li hain.
      */}
      <HeroSlider movies={heroMovies} />

      {/*
        Rows hero ke theek baad shuru hoti hain.

        Pehle inhe negative margin (-mt) se upar khincha tha, par usme
        ek badi problem thi: "Trending Now" heading hero ki DARK image
        ke upar aa jaati thi. Dark theme me text safed hota hai to dikh
        jaata tha, lekin light theme me text kaala hota hai - aur kaala
        text kaali image par bilkul gayab ho jaata tha.

        Ab heading hamesha page ke background par rehti hai, isliye
        dono theme me saaf dikhti hai.

        Netflix jaisa "juda hua na lage" wala look phir bhi milta hai,
        kyunki hero ka gradient niche jaakar page ke color me ghul jaata hai
        (dekho .hero-fade-bottom in index.css).
      */}
      <div className="relative z-10 pt-2 md:pt-4">
        {homeRows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </div>
  );
}
