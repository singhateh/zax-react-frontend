import { FileText, Settings, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function NativeApp({ children }) {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    });

    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isDesktop: width >= 1024,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        setActiveTab(path || 'dashboard');
    }, [location]);

    return (
        <div className="relative min-h1-screen">
            {/* Page content wrapper with padding at the bottom if mobile */}
            <div className={screenSize.isMobile ? 'pb-20' : ''}>
                {children}
            </div>

            {/* Fixed bottom nav */}
            {screenSize.isMobile && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around p-3 z-20">
                    <TabLink to="/dashboard" icon={<User className="w-6 h-6" />} label="Dashboard" activeTab={activeTab} />
                    <TabLink to="/documents" icon={<FileText className="w-6 h-6" />} label="Documents" activeTab={activeTab} />
                    <TabLink to="/users" icon={<Users className="w-6 h-6" />} label="Users" activeTab={activeTab} />
                    <TabLink to="/settings" icon={<Settings className="w-6 h-6" />} label="Settings" activeTab={activeTab} />
                </div>
            )}
        </div>
    );
}

function TabLink({ to, icon, label, activeTab }) {
    return (
        <NavLink
            to={to}
            className={`flex flex-col items-center text-sm ${activeTab === to.replace('/', '') ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-800`}
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
}

export default NativeApp;
