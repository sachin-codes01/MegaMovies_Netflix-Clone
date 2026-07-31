import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import Logo from "../common/Logo";
import { NAV_LINKS } from "../../utils/constants";
import { useUi } from "../../context/UiContext";
import { useTheme } from "../../context/ThemeContext";
import { useList } from "../../context/ListContext";
import { useAuth } from "../../context/AuthContext";

/*
  ===== NAVBAR =====

  Ye sabse upar chipka rehne wala menu bar hai (sticky).

  Khaas baat: Home page par shuru me ye transparent hota hai taaki
  hero image poori dikhe. Jaise hi user thoda niche scroll karta hai,
  ye blur + background wala ho jaata hai taaki links saaf padhein.
*/
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // abhi konse page par hain ye batata hai

  const { openDrawer, showToast } = useUi(); // mobile menu + toast
  const { mode, toggleTheme } = useTheme(); // dark / light switch
  const { watchlist, favorites } = useList(); // count badge dikhane ke liye
  const { user, logout } = useAuth(); // logged-in user ki detail

  // Page niche scroll hua hai ya nahi
  const [isScrolled, setIsScrolled] = useState(false);

  // Profile wala dropdown kis element ke niche khule
  const [profileAnchor, setProfileAnchor] = useState(null);

  /*
    In pages ke sabse upar badi image hoti hai:
    Home ka hero banner, aur Details page ka backdrop.

    Waha navbar transparent rehta hai aur text safed hona chahiye.
  */
  const isHomePage = location.pathname === "/";
  const isDetailsPage =
    location.pathname.startsWith("/movie/") || location.pathname.startsWith("/tv/");
  const hasBigImageOnTop = isHomePage || isDetailsPage;

  /*
    Scroll par navbar ka background badalte hain.
    Cleanup me listener hatana zaruri hai warna memory leak hoti hai.
  */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /*
    Navbar transparent hai aur neeche badi image hai -> text safed rakho.
    Baaki har haalat me theme wala normal text color (light theme me kaala,
    dark theme me safed). Isse light mode me links gayab nahi hote.
  */
  const isOverImage = hasBigImageOnTop && !isScrolled;
  const textColorClass = isOverImage ? "text-white" : "text-main";

  /*
    Avatar par dikhne wala pehla letter.

    Pehle yaha "user?.name?.charAt(0) || 'U'" tha. Agar kisi wajah se
    name khaali reh jaata to har user ko ek jaisa "U" dikhta -
    yani apna account bhi anjaan (guest jaisa) lagta tha.

    Ab name na mile to email/number se letter le lete hain. AuthContext
    bhi ab name kabhi khaali nahi rehne deta, isliye ye do-tarfa surakshit hai.
  */
  const accountLabel = user?.name || user?.id || "";
  const accountInitial = accountLabel.charAt(0).toUpperCase();

  /*
    Sign out par:
    1. menu band karo
    2. user hatao (ProtectedRoute apne aap login page par bhej dega)
    3. toast dikhao
  */
  const handleLogout = () => {
    setProfileAnchor(null);
    logout();
    showToast("Signed out successfully", "info");
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-nav border-line border-b shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className={`flex items-center justify-between px-4 py-3 md:px-10 ${textColorClass}`}>
        {/* ===== Left side: hamburger + logo + menu links ===== */}
        <div className="flex items-center gap-2 md:gap-8">
          {/* Hamburger sirf mobile par dikhta hai (md:hidden) */}
          <IconButton
            onClick={openDrawer}
            aria-label="Open menu"
            className="md:!hidden"
            sx={{ color: "inherit" }}
          >
            <MenuRoundedIcon />
          </IconButton>

          {/*
            Logo - click karne par Home par le jaata hai.

            onDark={isOverImage} ka matlab: jab navbar transparent hai aur
            neeche hero ki kaali image hai, tab safed wala logo dikhao -
            chahe theme light hi kyun na ho.
          */}
          {/* Height thodi kam ki hai (pehle h-7 sm:h-9) - logo bada lag raha tha
              aur menu links ke saath uska balance nahi ban raha tha */}
          <Logo height="h-6 sm:h-7" onDark={isOverImage} />

          {/* Menu links - mobile par chhupe hain, drawer me dikhte hain */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                {/*
                  NavLink normal Link jaisa hi hai, bas ye extra batata hai
                  ki abhi hum isi page par hain ya nahi (isActive).
                  Isse current page ka link blue ho jaata hai.
                */}
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-brand-400 text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-brand-400" : "opacity-85"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Right side: search, theme, profile ===== */}
        <div className="flex items-center gap-1">
          {/* Search icon -> search page par le jaata hai */}
          <IconButton
            onClick={() => navigate("/search")}
            aria-label="Search"
            sx={{ color: "inherit", "&:hover": { color: "var(--brand)" } }}
          >
            <SearchRoundedIcon />
          </IconButton>

          {/* Dark / Light toggle */}
          <IconButton
            onClick={toggleTheme}
            aria-label="Toggle theme"
            sx={{ color: "inherit", "&:hover": { color: "var(--brand)" } }}
          >
            {/* Abhi dark hai to suraj dikhao (light me jaane ke liye) */}
            {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>

          {/*
            Profile button.
            User ke naam ka pehla letter dikhate hain (jaise Gmail me hota hai).
          */}
          <Tooltip title={user?.id ? `Signed in as ${user.id}` : "Account"}>
            <IconButton
              onClick={(event) => setProfileAnchor(event.currentTarget)}
              aria-label="Profile menu"
              sx={{ color: "inherit", "&:hover": { color: "var(--brand)" } }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 14,
                  fontWeight: 700,
                  bgcolor: "var(--brand)",
                  color: "#fff",
                }}
              >
                {accountInitial}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            slotProps={{ paper: { sx: { minWidth: 230, mt: 1 } } }}
          >
            {/*
              Upar user ka naam aur wo email/number jisse login kiya hai.

              Ye seedha localStorage se aata hai, isliye website dobara
              kholne par bhi wahi account dikhta hai - koi guest nahi.
            */}
            <div className="px-4 py-2">
              <p className="text-main text-sm font-semibold">{accountLabel}</p>
              <p className="text-sub truncate text-xs">{user?.id}</p>
            </div>

            <Divider />

            {/* Watchlist - saath me kitni movies hain wo number bhi (Badge) */}
            <MenuItem
              onClick={() => {
                navigate("/watchlist");
                setProfileAnchor(null);
              }}
            >
              <ListItemIcon>
                <Badge badgeContent={watchlist.length} color="primary">
                  <BookmarkRoundedIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              My Watchlist
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate("/favorites");
                setProfileAnchor(null);
              }}
            >
              <ListItemIcon>
                <Badge badgeContent={favorites.length} color="primary">
                  <FavoriteRoundedIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              My Favorites
            </MenuItem>

            <Divider />

            {/* Logout - user hat jaata hai, lekin uski list saved rehti hai */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </header>
  );
}
