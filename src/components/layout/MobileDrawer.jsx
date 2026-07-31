import { NavLink } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import Logo from "../common/Logo";
import { NAV_LINKS } from "../../utils/constants";
import { useUi } from "../../context/UiContext";

/*
  ===== MOBILE DRAWER =====

  Chhoti screen par navbar me saare links nahi aa sakte.
  Isliye hamburger dabane par side se ye menu nikalta hai.

  Khulna/band hona UiContext se control hota hai,
  isliye Navbar aur ye component ek dusre se seedhe jude nahi hain.
*/
export default function MobileDrawer() {
  const { isDrawerOpen, closeDrawer } = useUi();

  return (
    <Drawer
      anchor="left" // left side se aayega
      open={isDrawerOpen}
      onClose={closeDrawer}
      slotProps={{
        paper: { sx: { width: 260, backgroundImage: "none" } },
      }}
    >
      <div className="bg-card flex h-full flex-col p-5">
        {/* Upar logo aur close button */}
        <div className="mb-8 flex items-center justify-between">
          {/* Logo dabane par bhi drawer band ho jaana chahiye */}
          <div onClick={closeDrawer}>
            <Logo height="h-6" />
          </div>

          <IconButton onClick={closeDrawer} aria-label="Close menu" sx={{ color: "inherit" }}>
            <CloseRoundedIcon />
          </IconButton>
        </div>

        {/* Menu links */}
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              // Link dabate hi drawer apne aap band ho jaana chahiye
              onClick={closeDrawer}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "bg-brand-500/15 text-brand-400" : "text-main hover:bg-card-2"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Search ka alag link, saath me icon */}
          <NavLink
            to="/search"
            onClick={closeDrawer}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive ? "bg-brand-500/15 text-brand-400" : "text-main hover:bg-card-2"
              }`
            }
          >
            <SearchRoundedIcon fontSize="small" />
            Search
          </NavLink>
        </nav>

        {/* Sabse niche chhota sa footer text */}
        
      </div>
    </Drawer>
  );
}
