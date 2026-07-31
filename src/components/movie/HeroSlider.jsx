import { useState, useEffect, useCallback } from "react";

import HeroBanner from "./HeroBanner";

/*
  ===== HERO SLIDER =====

  Home page ke sabse upar chalne wala slider.

  Ye poori tarah automatic hai - har 10 second me apne aap agli movie aa jaati hai.
  Koi arrow ya dot nahi hai, taaki hero saaf aur simple dikhe.

  Slide badalne ka tarika: saare slides ek dusre ke upar rakhe hain
  (absolute inset-0) aur sirf opacity badalte hain.
  Isse ek image dhire se gayab hoti hai aur dusri dhire se aati hai (crossfade).
*/

/*
  Kitni der baad agli movie aaye (milliseconds me).
  10000 = 10 second. Number badhaoge to slider aur dheere chalega.
*/
const SLIDE_DELAY = 10000;

export default function HeroSlider({ movies }) {
  // Abhi konsa slide dikh raha hai (0, 1, 2...)
  const [activeIndex, setActiveIndex] = useState(0);

  /*
    Mouse hero ke upar hone par slider ruk jaata hai.

    Ye zaruri hai - warna user overview padh raha hota ya button
    dabane ja raha hota, aur beech me movie badal jaati.
  */
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = movies?.length || 0;

  /*
    Agla slide.
    "% totalSlides" ka kamaal: last slide ke baad wapas 0 par pahunch jaata hai,
    isliye slider kabhi rukta nahi - loop me chalta rehta hai.
  */
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  /*
    Ye timer automatic slide change karta hai.

    return wala function cleanup hai - ye purana timer band karta hai.
    Iske bina har render par naya timer banta jaata aur slider pagal ho jaata.
  */
  useEffect(() => {
    // Ek hi movie hai ya mouse upar hai to timer chalane ka koi matlab nahi
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(goToNext, SLIDE_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, goToNext]);

  // Movies aayi hi nahi to kuch mat dikhao
  if (totalSlides === 0) return null;

  return (
    <div
      /*
        Hero ki height. Pehle 75vh / 85vh thi, par utni badi hone se
        "Trending Now" wali row bahut niche chali jaati thi aur user ko
        cards dekhne ke liye scroll karna padta tha.

        Ab thodi chhoti hai - hero bhi bada dikhta hai aur pehli row
        bhi screen par halki si jhalak jaati hai.
      */
      className="relative h-[68vh] min-h-[420px] w-full overflow-hidden md:h-[76vh]"
      // Mouse aane par slider rok do, hatne par phir chalu
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Saare slides ek dusre ke upar rakhe hain */}
      {movies.map((movie, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={movie.id}
            // duration-1000 = ek image se dusri me badalne me 1 second lagta hai (smooth)
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              // Sirf active slide dikhta hai
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            // Chhupe slide ko screen reader bhi na pade
            aria-hidden={!isActive}
          >
            <HeroBanner movie={movie} isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
}
