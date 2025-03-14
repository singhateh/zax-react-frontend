import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuthorized, setisAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => isAuthorized(false));
  });

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refreshToken: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setisAuthorized(true);
      } else {
        setisAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setisAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setisAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setisAuthorized(true);
    }
  };

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
