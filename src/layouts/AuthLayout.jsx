import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../Global/components/Sidebar";
import Header from "../Global/components/Header";
import { useStateContext } from "../contex/ContexProvider";
import "../styles/Layout.css";

export default function AuthLayout() {
  const { user, setUser, token, setToken } = useStateContext();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/login" replace />;
  }

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="">
        <Sidebar />
      </div>
      <div className="main">
        <Header user={user} logout={logout} />
        <Outlet />
      </div>
    </div>
  );
}
