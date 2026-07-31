import { Link } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import logoDark from "../../assets/logo-dark.png";
import logoLight from "../../assets/logo-light.png";

/*
  ===== LOGO =====

  Poore app ka ek hi logo component - navbar, drawer, footer aur
  login page, sabhi jagah yahi use hota hai.

  Ek jagah rakhne ka faayda: logo badalna ho to sirf ye file
  change karni padegi, 4 files nahi.

  ===== DO LOGO KYUN? =====

  logo-dark  -> "MOVIES" safed hai, isliye DARK background par dikhta hai
  logo-light -> "MOVIES" kaala hai, isliye LIGHT background par dikhta hai

  Agar ek hi logo rakhte to light theme me safed text safed background
  par gayab ho jaata. Isliye theme ke hisaab se image badal dete hain.

  props:
  height  -> logo ki height (Tailwind class), width apne aap adjust ho jaati hai
  onDark  -> true bhejo jab logo hamesha kaali image ke upar ho
             (jaise hero banner ke upar wala navbar) - tab theme chahe
             light ho, safed wala logo hi chahiye
  asLink  -> false bhejo to sirf image banegi, click karne par kuch nahi hoga
*/
export default function Logo({ height = "h-8", onDark = false, asLink = true }) {
  const { mode } = useTheme();

  // Dark theme hai ya logo kisi kaali image ke upar hai -> safed wala logo
  const useDarkVersion = onDark || mode === "dark";
  const src = useDarkVersion ? logoDark : logoLight;

  const image = (
    <img
      src={src}
      alt="MegaMovies"
      // w-auto se image ka shape (ratio) sahi rehta hai, chipki hui nahi lagti
      className={`${height} w-auto object-contain`}
    />
  );

  // asLink false hai to sirf image do (login page par link ki zarurat nahi)
  if (!asLink) return image;

  return (
    <Link to="/" aria-label="MegaMovies home">
      {image}
    </Link>
  );
}
