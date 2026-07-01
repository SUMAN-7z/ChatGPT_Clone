import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function RefreshHandler() {
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  setIsLoggedIn(!!token);

  if (
    token &&
    (location.pathname === "/login" || location.pathname === "/signup")
  ) {
    navigate("/", { replace: true });
  }
}, [location.pathname, navigate]);
  return null;
}