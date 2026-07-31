import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MobileDrawer from "../components/layout/MobileDrawer";
import Toaster from "../components/layout/Toaster";
import ScrollToTop from "../components/common/ScrollToTop";
import TrailerModal from "../components/movie/TrailerModal";

/*
  ===== MAIN LAYOUT =====

  Har page par navbar aur footer chahiye. Agar har page me
  alag-alag <Navbar /> likhte to code 9 baar repeat hota.

  Isliye ek layout banaya. React Router isme <Outlet /> ki jagah
  current page daal deta hai.

  Ek aur faayda: navigate karne par navbar dobara render nahi hota,
  sirf beech ka content badalta hai. Isse app fast lagti hai.
*/
export default function MainLayout() {
  const location = useLocation();

  /*
    Home page ki hero image navbar ke peeche tak jaani chahiye,
    isliye wahan upar se padding nahi deni.

    Baaki pages ka content fixed navbar ke neeche chhup jaata,
    isliye unhe upar se jagah (padding) de rahe hain.
  */
  const isHomePage = location.pathname === "/";

  return (
    <div className="bg-surface flex min-h-screen flex-col">
      {/* Page badalte hi scroll upar le aata hai */}
      <ScrollToTop />

      <Navbar />

      {/* Mobile ka side menu - hamesha maujood hai, bas khulta-band hota hai */}
      <MobileDrawer />

      <main className={`flex-1 ${isHomePage ? "" : "pt-20 md:pt-24"}`}>
        {/* Yahan current page render hota hai */}
        <Outlet />
      </main>

      <Footer />

      {/*
        Ye dono poore app me ek hi baar bane hain.
        Koi bhi component Context se inhe chala sakta hai.
      */}
      <TrailerModal />
      <Toaster />
    </div>
  );
}
