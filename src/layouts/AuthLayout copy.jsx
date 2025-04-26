import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useStateContext } from "../contex/ContexProvider";
import { useState, useEffect } from "react";

export default function AuthLayout() {
  const { user, setUser, token, setToken, selectedDoctor, setSelectedDoctor } = useStateContext();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-collapse on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        // Desktop - start expanded but respect user toggle
        if (isSidebarCollapsed === false && window.innerWidth >= 768) {
          setSidebarCollapsed(false);
        }
      }
    };


    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    setSelectedDoctor(null);
    localStorage.removeItem("ZAXACCESSTOKEN");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        isMobile={isMobile}
        doctor={selectedDoctor}
        logout={logout}
      />

      <div className={`
        flex-1 flex flex-col 
        transition-all duration-300 ease-in-out
        ${isMobile ?
          (isSidebarCollapsed ? 'ml-16' : 'ml-40') :  // Mobile behavior
          (isSidebarCollapsed ? 'ml-0' : 'ml-0')    // Desktop behavior - same margins
        }
      `}>
        <Header
          user={user}
          logout={logout}
          onMenuClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={isMobile}
        />

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}