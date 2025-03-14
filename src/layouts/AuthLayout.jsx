import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useStateContext } from "../contex/ContexProvider";
import Header from "../components/Header";

export default function AuthLayout() {
  const { user, setUser, token, setToken } = useStateContext();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 overflow-auto">
        <Header user={user} logout={logout} />
        <div className="flex-1 p-0 w-full bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
