import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useStateContext } from '../contex/ContexProvider';
import api from '../services/api';
import NativeApp from '../components/NativeApp';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTouchDevice } from '../hooks/useTouchDevice';

const AuthLayout = () => {
  const {
    user, setUser,
    token, setToken,
    selectedDoctor, setSelectedDoctor,
    doctors
  } = useStateContext();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTouchDevice = useTouchDevice();

  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Responsive sidebar state
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const logout = async () => {
    try {
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ZAXACCESSTOKEN")}`,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      setSelectedDoctor(null);
      localStorage.removeItem("ZAXACCESSTOKEN");
      navigate("/login");
    }
  };

  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        logout={logout}
        doctor={selectedDoctor}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300
        ${isMobile ? 'ml-0' : isCollapsed ? 'ml-0' : 'ml-0'}`}
      >
        <Header
          user={user}
          logout={logout}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          doctors={doctors}
          setSelectedDoctor={setSelectedDoctor}
        />

        <main className={`flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50
                 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
                 ${isTouchDevice ? 'overscroll-contain touch-pan-y' : ''}`}>
          <div className="max-w-full mx-auto h-full">
            <Outlet context={{ isCollapsed, isMobile }} />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        {isMobile && <NativeApp />}
      </div>

      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 1bg-black bg-opacity-50 backdrop-blur-sm z-20"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default AuthLayout;
