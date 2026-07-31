import Button from "@mui/material/Button";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";

/*
  ===== ERROR BOX =====

  API fail hone par ye friendly message dikhata hai.

  "Error: Failed to fetch" likhne se normal user dar jaata hai.
  Isliye seedhi-saadi baat likhi hai aur ek Retry button de diya hai
  taaki page refresh kiye bina dobara try ho sake.
*/
export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="fade-in flex flex-col items-center justify-center px-4 py-20 text-center">
      <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 64, color: "var(--brand)", mb: 2 }} />

      <h2 className="text-display text-main mb-2 text-2xl font-bold">Something went wrong</h2>

      <p className="text-sub mb-6 max-w-md text-sm">
        {message || "We could not load this right now. Check your connection and try again."}
      </p>

      {/* Retry ka function mila hai tabhi button dikhao */}
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{ bgcolor: "var(--brand)", color: "#fff", "&:hover": { bgcolor: "var(--brand-dark)", color: "#fff" } }}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
