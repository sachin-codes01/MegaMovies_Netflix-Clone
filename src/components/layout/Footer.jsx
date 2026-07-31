import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

import Logo from "../common/Logo";
import { NAV_LINKS, SOCIAL_LINKS } from "../../utils/constants";

/*
  ===== FOOTER =====

  Page ke sabse niche wala hissa.

  3 column me bana hai:
  1. Logo + chhoti si line + social media icons
  2. Browse ke links
  3. My Space (watchlist / favorites) ke links

  Sabse niche ek patli line me copyright.
*/

/*
  constants.js me humne icon ka sirf NAAM rakha tha ("instagram").
  Yaha us naam ko asli icon component se jod rahe hain.

  Faayda: naya social link add karna ho to constants.js me ek line
  add karo aur yaha ek line - baaki JSX chhune ki zarurat nahi.
*/
const ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  email: EmailRoundedIcon,
};

export default function Footer() {
  // Har saal manually badalne ki zarurat na pade isliye JS se le rahe hain
  const currentYear = new Date().getFullYear();

  // Menu ko do hisso me baant rahe hain
  const browseLinks = NAV_LINKS.filter(
    (link) => link.path !== "/watchlist" && link.path !== "/favorites"
  );
  const mySpaceLinks = NAV_LINKS.filter(
    (link) => link.path === "/watchlist" || link.path === "/favorites"
  );

  return (
    <footer className="border-line bg-card mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-10">
        {/*
          Mobile par ek column, tablet par 2, desktop par 3.
          Pehla column thoda chauda hai (md:col-span-2) kyunki
          usme text zyada hai.
        */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* ===== Column 1: Brand + social ===== */}
          <div className="sm:col-span-2">
            <div className="mb-4">
              <Logo height="h-7" />
            </div>

            <p className="text-sub mb-6 max-w-sm text-sm leading-relaxed">
              Discover trending movies and shows, build your own watchlist, and keep your favorites
              in one place.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                // Naam se asli icon component nikal rahe hain
                const Icon = ICONS[social.icon];

                return (
                  <Tooltip key={social.label} title={social.label}>
                    <IconButton
                      component="a"
                      href={social.url}
                      // mailto link ko nayi tab me kholne ka koi matlab nahi
                      target={social.icon === "email" ? undefined : "_blank"}
                      /*
                        rel="noreferrer" security ke liye zaruri hai.
                        Iske bina nayi tab wali site hamare page ko
                        control kar sakti hai (tabnabbing attack).
                      */
                      rel="noreferrer"
                      aria-label={social.label}
                      sx={{
                        color: "inherit",
                        border: "1px solid var(--app-line)",
                        transition: "all 0.25s",
                        "&:hover": {
                          bgcolor: "var(--brand)",
                          color: "#fff",
                          borderColor: "var(--brand)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* ===== Column 2: Browse ===== */}
          <div>
            <h3 className="text-main mb-4 text-sm font-semibold">Browse</h3>
            <ul className="flex flex-col gap-2.5">
              {browseLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sub hover:text-brand-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="text-sub hover:text-brand-400 text-sm transition-colors duration-200"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== Column 3: My Space ===== */}
          <div>
            <h3 className="text-main mb-4 text-sm font-semibold">My Space</h3>
            <ul className="flex flex-col gap-2.5">
              {mySpaceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sub hover:text-brand-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== Sabse niche ki line ===== */}
        <div className="border-line mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-sub text-xs">© {currentYear} MegaMovies. All rights reserved.</p>
          <p className="text-sub text-xs">Built by Sachin Kumar</p>
        </div>
      </div>
    </footer>
  );
}
