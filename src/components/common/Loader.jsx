import CircularProgress from "@mui/material/CircularProgress";

/*
  ===== LOADER =====

  Ghoomne wala blue spinner.

  Ise wahan use karte hain jahan skeleton fit nahi baithta - jaise
  infinite scroll me niche "aur load ho raha hai" dikhane ke liye,
  ya lazy loaded page khulne ka intezaar karte waqt.
*/
export default function Loader({ fullScreen = false }) {
  return (
    <div
      // fullScreen true ho to poori screen ke beech me aayega
      className={`flex items-center justify-center ${fullScreen ? "min-h-[70vh]" : "py-10"}`}
    >
      <CircularProgress sx={{ color: "var(--brand)" }} />
    </div>
  );
}
