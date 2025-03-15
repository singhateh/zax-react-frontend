import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useStateContext } from "../contex/ContexProvider";

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
    <div className="flex h-screen">
      <div className="  w-48">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col pt-16 overflow-auto lg:pl-40">
        <Header user={user} logout={logout} />
        <div className="p-0 w-full bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
