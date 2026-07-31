import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import { useUi } from "../../context/UiContext";

/*
  ===== TOASTER =====

  Screen ke upar-right kone me aane wale chhote notification.
  Example: "Added to Watchlist"

  Ise MainLayout me ek hi baar rakha hai. Koi bhi component
  UiContext ka showToast() bulakar ise dikha sakta hai -
  chahe wo kitna hi andar ka component ho.

  Pehle yaha MUI ka Snackbar tha, lekin usme ek waqt par sirf
  EK message dikh sakta tha. Ab array hai, isliye kai toast
  ek ke neeche ek dikhte hain.
*/
export default function Toaster() {
  const { toasts, removeToast } = useUi();

  // Koi toast nahi hai to kuch mat banao
  if (toasts.length === 0) return null;

  return (
    /*
      fixed = page scroll hone par bhi apni jagah par rahega
      z-[100] = navbar (z-50) se bhi upar rahe
      pointer-events-none parent par, taaki iske khaali hisse se
      niche wale buttons click ho sakein
    */
    <div className="pointer-events-none fixed top-20 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        // Slide se toast right side se andar aata hai
        <Slide key={toast.id} direction="left" in mountOnEnter unmountOnExit>
          <Alert
            severity={toast.type} // success / info / error
            variant="filled"
            onClose={() => removeToast(toast.id)}
            // Alert par pointer-events wapas on, taaki close button dab sake
            className="pointer-events-auto"
            sx={{
              minWidth: 260,
              maxWidth: 360,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)",
              alignItems: "center",
              color: "#fff",
              /*
                MUI ka default success GREEN hota hai, jo hamari blue theme
                se match nahi karta. Isliye success aur info dono ko
                apne brand blue me badal diya hai.

                Error ko laal hi rehne diya - kyunki laal rang se hi
                user ko samajh aata hai ki kuch galat hua hai.
              */
              ...(toast.type !== "error" && {
                bgcolor: "var(--brand)",
                "& .MuiAlert-icon": { color: "#fff" },
              }),
            }}
          >
            {toast.message}
          </Alert>
        </Slide>
      ))}
    </div>
  );
}
