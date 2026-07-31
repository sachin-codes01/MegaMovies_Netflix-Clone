import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  ===== PROTECTED ROUTE =====

  Ye ek "guard" (chowkidar) hai.

  Iska kaam bilkul simple hai:
  - User logged in hai  -> andar jaane do
  - Logged in nahi hai  -> login page par bhej do

  Navigate component React Router ka hai. Ise render karte hi
  user apne aap dusre page par chala jaata hai.

  replace={true} kyun? Taaki browser ki history me login page
  add na ho. Warna user back button dabata aur ghoom-ghoom kar
  wapas wahi aa jaata.
*/
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
