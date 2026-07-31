import { memo, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import MovieCard from "./MovieCard";

/*
  ===== MOVIE ROW =====

  Ye ek horizontal slider hai - jaise Netflix par hota hai.
  "Trending Now", "Popular", "Action" - har row isi component se banti hai.

  Scroll karne ke 2 tarike hain:
  - Mobile / tablet -> ungli se swipe (buttons chhupe rehte hain)
  - Desktop         -> heading ke bagal wale arrow buttons

  Dhyaan dein: pehle ye arrows cards ke UPAR rakhe the (absolute position),
  isse wo poster ko dhak lete the aur bura dikhta tha.
  Ab inhe heading ki line me daal diya hai - ab ye kabhi kisi card ko nahi dhakte.

  title      -> row ka naam
  movies     -> movies ka array
  mediaType  -> "movie" ya "tv"
*/
function MovieRow({ title, movies, mediaType = "movie" }) {
  /*
    useRef se hum us div ko pakadte hain jisme scroll karna hai.
    useRef isliye kyunki hume DOM element ko seedha control karna hai,
    aur ise badalne par component dobara render nahi hota.
  */
  const scrollRef = useRef(null);

  /*
    Arrow button dabane par row ko left ya right slide karta hai.
    direction: -1 = left (peeche), 1 = right (aage)
  */
  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild;
    if (!firstCard) return;

    /*
      Ek card ki poori jagah = card ki chaudai + do card ke beech ka gap.
      Ise "step" kehte hain.
    */
    const gap = parseFloat(getComputedStyle(container).columnGap) || 12;
    const step = firstCard.getBoundingClientRect().width + gap;

    /*
      Ek click me kitne card khisakne chahiye?
      Screen ki 80% jagah me jitne poore card aa sakein utne.

      Poore card hi khisakte hain (2.7 card nahi) - isliye Math.floor.

      Ye zaruri kyun hai?
      Agar hum sirf "80% chaudai" khisakte to card beech me se kat kar rukte
      aur left side ka 40px gap bigad jaata. Poore card ke hisaab se
      khisakne par card hamesha apni sahi jagah par rukta hai aur
      logo/heading ke saath line me rehta hai.
    */
    const cardsPerJump = Math.max(1, Math.floor((container.clientWidth * 0.8) / step));

    // behavior: "smooth" se jhatka nahi lagta, slide hota hua jaata hai
    container.scrollBy({ left: direction * cardsPerJump * step, behavior: "smooth" });
  };

  // Movies hi nahi hain to poori row hi mat dikhao
  if (!movies || movies.length === 0) return null;

  return (
    <section className="fade-in mb-8">
      {/*
        Heading ki line: naam left me, arrow buttons right me.
        justify-between dono ko dono kinaron par bhej deta hai.
      */}
      <div className="mb-3 flex items-center justify-between px-4 md:px-10">
        <h2 className="text-display text-main text-lg font-bold sm:text-xl">{title}</h2>

        {/*
          Arrow buttons.
          hidden md:flex -> mobile par nahi dikhte, kyunki wahan swipe se kaam ho jaata hai
        */}
        <div className="hidden items-center gap-1 md:flex">
          <IconButton
            onClick={() => handleScroll(-1)}
            aria-label={`Scroll ${title} left`}
            size="small"
            sx={{
              color: "inherit",
              border: "1px solid var(--app-line)",
              "&:hover": { bgcolor: "var(--brand)", color: "#fff", borderColor: "var(--brand)" },
            }}
          >
            <ChevronLeftRoundedIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => handleScroll(1)}
            aria-label={`Scroll ${title} right`}
            size="small"
            sx={{
              color: "inherit",
              border: "1px solid var(--app-line)",
              "&:hover": { bgcolor: "var(--brand)", color: "#fff", borderColor: "var(--brand)" },
            }}
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/*
        Ye hai asli scroll wala area.
        overflow-x-auto -> side me scroll ho sakta hai
        no-scrollbar    -> scrollbar dikhti nahi (saaf look ke liye)
        py-4            -> hover par card thoda upar uthta hai, uske liye jagah

        scroll-pl-4 md:scroll-pl-10 ZARURI hai:
        px-4/md:px-10 sirf shuruaat me jagah chhodta hai. Jaise hi user
        row ko scroll karta hai, wo padding side me nikal jaati hai aur
        cards ekdum screen ki deewar se chipak jaate hain - jo logo aur
        heading ke 40px gap se match nahi karta.

        scroll-padding browser ko batata hai ki card ko rokna kahan hai.
        Isse scroll karne ke baad bhi card wahi 40px chhod kar rukta hai.
      */}
      {/* relative isliye taaki dono kinaron wali fade layer isi ke andar set ho */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar row-scroll flex scroll-pl-4 gap-3 overflow-x-auto px-4 py-4 md:scroll-pl-10 md:px-10"
        >
          {movies.map((movie) => (
            // inRow -> card ki chaudai fixed rahegi (flex use squeeze na kare)
            <MovieCard key={movie.id} movie={movie} mediaType={mediaType} inRow />
          ))}
        </div>

        {/*
          ===== KINARON KI FADE LAYER =====

          Problem: row scroll karne par pichhle card ka thoda sa hissa
          (करीब 28px) left side me jhaankta reh jaata tha. Isse lagta tha
          ki card deewar se chipka hua kat gaya hai, aur wo logo ke
          40px gap se match nahi karta tha.

          Ye slice hatana geometry se possible nahi hai (do card ke beech
          ka gap 12px hai, jabki kinare ka gap 40px).

          Isliye OTT apps wala tareeka use kiya: kinare par page ke rang
          ki halki si parat daal di. Kata hua card usme ghul jaata hai
          aur pehla poora card theek logo ke niche line me dikhta hai.

          pointer-events-none zaruri hai - warna ye parat card ke
          click ko rok deti.
        */}
        <div className="row-fade-left pointer-events-none absolute inset-y-0 left-0 w-4 md:w-10" />
        <div className="row-fade-right pointer-events-none absolute inset-y-0 right-0 w-4 md:w-10" />
      </div>
    </section>
  );
}

// Row me bahut saare card hote hain, isliye memo lagana yaha bahut faydemand hai
export default memo(MovieRow);
