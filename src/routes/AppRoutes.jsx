import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Loader from "../components/common/Loader";

/*
  ===== APP ROUTES =====

  Yahan poore app ke saare page ke raste (routes) likhe hain.

  ===== LAZY LOADING / CODE SPLITTING =====

  Normal import se saare page ek hi badi JS file me bundle ho jaate hain.
  User ko Home dekhne ke liye bhi poori file download karni padti hai - app slow khulti hai.

  React.lazy se har page ki alag chhoti file banti hai.
  Wo file tabhi download hoti hai jab user us page par jaata hai.

  Home ko lazy nahi kiya kyunki wo to sabse pehle chahiye hi hota hai.
*/
const Login = lazy(() => import("../pages/Login"));
const Movies = lazy(() => import("../pages/Movies"));
const TvShows = lazy(() => import("../pages/TvShows"));
const Trending = lazy(() => import("../pages/Trending"));
const Search = lazy(() => import("../pages/Search"));
const MovieDetails = lazy(() => import("../pages/MovieDetails"));
const Watchlist = lazy(() => import("../pages/Watchlist"));
const Favorites = lazy(() => import("../pages/Favorites"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    /*
      Suspense zaruri hai lazy ke saath.
      Jab tak page ki file download ho rahi hai, fallback dikhta hai.
      Iske bina React error de deta hai.
    */
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/*
          Login page layout ke BAHAR hai.
          Kyun? Kyunki wahan navbar aur footer nahi chahiye -
          wo ek alag full screen page hai.
        */}
        <Route path="/login" element={<Login />} />

        {/*
          Ye "nested routes" hain.
          Bahar wale Route me layout hai (navbar + footer),
          aur andar wale saare page us layout ke <Outlet /> me khulte hain.

          ProtectedRoute layout ko ghere hue hai - iska matlab
          in saare pages me se koi bhi bina login ke nahi khulega.
          Ek hi jagah likhne se saare page apne aap surakshit ho gaye.
        */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* index ka matlab: "/" par yahi page khulega */}
          <Route index element={<Home />} />

          <Route path="movies" element={<Movies />} />
          <Route path="tv-shows" element={<TvShows />} />
          <Route path="trending" element={<Trending />} />
          <Route path="search" element={<Search />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="favorites" element={<Favorites />} />

          {/*
            ":id" ek variable hai. /movie/550 kholne par
            page ke andar useParams() se id = "550" mil jaata hai.

            Movie aur TV ke liye do alag route hain kyunki
            TMDB me dono ke API endpoint alag hote hain.
          */}
          <Route path="movie/:id" element={<MovieDetails mediaType="movie" />} />
          <Route path="tv/:id" element={<MovieDetails mediaType="tv" />} />

          {/*
            "*" ka matlab hai "jo bhi baaki bacha".
            Isliye ise hamesha sabse last me rakhte hain,
            warna ye baaki saare routes ko kha jaata.
          */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
