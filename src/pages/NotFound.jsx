import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/*
  ===== 404 PAGE =====

  Jab user aisa URL kholta hai jo hai hi nahi, tab ye page dikhta hai.

  Routes me iska path "*" hai - matlab "jo bhi baaki bacha".
  Isliye ise routes ki list me sabse last me rakhna zaruri hai.
*/
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fade-in flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Bada 404 - display font (Sofia Pro) me */}
      <h1 className="text-display text-brand-400 text-7xl leading-none font-bold sm:text-9xl">
        404
      </h1>

      <h2 className="text-display text-main mt-4 text-2xl font-bold sm:text-3xl">
        This page went missing
      </h2>

      <p className="text-sub mt-3 mb-8 max-w-md text-sm">
        The page you are looking for does not exist. The address may have been mistyped.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {/* Home par le jaane wala button */}
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeRoundedIcon />}
          sx={{
            bgcolor: "var(--brand)",
            color: "#fff",
            "&:hover": { bgcolor: "var(--brand-dark)", color: "#fff" },
          }}
        >
          Go Home
        </Button>

        {/* Pichhle page par wapas - navigate(-1) browser ke back button jaisa hai */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(-1)}
          sx={{ borderColor: "var(--app-line)", color: "inherit" }}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
