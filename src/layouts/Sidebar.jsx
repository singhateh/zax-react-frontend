import {
    Calendar,
    FileText,
    FolderOpen,
    UserRoundCog,
    Settings,
    House,
    LayoutDashboardIcon,
    ClipboardListIcon,
    Menu,
    X,
    ScrollText,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { goToDoctorProfile } from "../utilities/navigationUtils";
import { FiLogOut } from "react-icons/fi";
import LoginLogoIcon from '../assets/logo_light.png';

const iconMap = {
    dashboard: <LayoutDashboardIcon size={20} />,
    doctors: <House size={20} />,
    "account settings": <UserRoundCog size={20} />,
    settings: <Settings size={20} />,
    "zax cal": <Calendar size={20} />,
    invoices: <FileText size={20} />,
    "manage cases": <FolderOpen size={20} />,
    "instruct case": <ClipboardListIcon size={20} />,
    "reporting": <ScrollText size={20} />,
    logout: <FiLogOut size={20} />,
};

const Sidebar = ({ isCollapsed, isOpen, isMobile, doctor, logout, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Handle navigation and close sidebar on mobile
    const handleNavigation = (route, onClick) => {
        if (route) {
            navigate(route, { state: { doctor: doctor } });
        }
        if (onClick) {
            onClick();
        }
        // Close sidebar if on mobile
        if (isMobile) {
            toggleSidebar();
        }
    };

    const menuItems = [
        { icon: iconMap.dashboard, text: "Dashboard", route: "/dashboard", slug: "dashboard" },
        { icon: iconMap.doctors, text: "Doctors", route: "/doctors", slug: "doctors" },
        { icon: iconMap["account settings"], text: "Account", route: goToDoctorProfile(null, doctor, true), slug: "account-settings" },
        { icon: iconMap.settings, text: "Settings", route: "/settings", slug: "settings" },
        { icon: iconMap["zax cal"], text: "Zax Cal", route: "/zax-cal/venues", slug: "zax-cal" },
        { icon: iconMap["manage cases"], text: "Cases", route: "/manage-cases", slug: "manage-cases" },
        { icon: iconMap["instruct case"], text: "Instruct Case", route: "/instruct-cases", slug: "instruct-cases" },
        { icon: iconMap.invoices, text: "Invoices", route: "/invoices", slug: "invoices" },
        { icon: iconMap["reporting"], text: "Zax Reporting", route: "/account-settings/reports", slug: "reportings" },
        { icon: iconMap.logout, text: "Logout", onClick: logout },
    ];

    const isActive = (slug, route) => {
        const normalize = (path) => path?.replace(/^\/|\/$/g, '');
        const currentPath = normalize(location.pathname);
        const targetRoute = normalize(route);
        if (currentPath === targetRoute) return true;
        if (slug === "dashboard" && currentPath === "") return true;
        const firstSegment = currentPath.split('/')[0];
        return firstSegment === slug;
    };

    return (
        <>
            {(!isMobile || isOpen) && (
                <div className={`
                    bg-blue-900 text-white 
                    h-screen 
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-16' : 'w-40'} 
                    ${isMobile ? 'z-60 fixed top-0 left-0' : 'relative z-60'}
                    shadow-lg
                    flex flex-col
                `}>
                    {/* Header with toggle button */}
                    <div className={`flex items-center justify-between p-4 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
                        {(!isCollapsed || isMobile) && (
                            <div className="w-full">
                                <img
                                    onClick={() => handleNavigation('/dashboard')}
                                    src={LoginLogoIcon}
                                    alt="Company Logo"
                                    className="w-full h-10 object-contain cursor-pointer"
                                />
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Toggle sidebar"
                        >
                            {isMobile ? (
                                <X size={20} />
                            ) : isCollapsed ? (
                                <Menu size={20} />
                            ) : (
                                <X size={20} />
                            )}
                        </button>
                    </div>

                    {/* Navigation items */}
                    <nav className="flex-1 flex flex-col justify-between p-2 overflow-y-auto">
                        <div className="space-y-1">
                            {menuItems.slice(0, -1).map((item, index) => {
                                const active = item.slug ? isActive(item.slug, item.route) : false;
                                const commonClasses = `
                                    flex items-center 
                                    p-3 rounded-lg
                                    hover:bg-blue-800 transition-colors
                                    ${isCollapsed ? 'justify-center px-0' : 'px-3'}`;

                                return (
                                    <div key={index}>
                                        <button
                                            onClick={() => handleNavigation(item.route)}
                                            className={`
                                                ${commonClasses}
                                                ${active ? 'bg-blue-700 font-medium' : ''}
                                                w-full text-left
                                            `}
                                            title={isCollapsed ? item.text : ''}
                                        >
                                            <div className="flex items-center">
                                                <span className={active ? 'text-white' : 'text-blue-200'}>
                                                    {item.icon}
                                                </span>
                                                {!isCollapsed && (
                                                    <span className="ml-3 whitespace-nowrap text-sm">
                                                        {item.text}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Logout button */}
                        <div className="mt-4 border-t border-blue-800 pt-2">
                            <button
                                onClick={() => {
                                    logout();
                                    if (isMobile) toggleSidebar();
                                }}
                                className={`
                                    flex items-center 
                                    p-3 rounded-lg
                                    hover:bg-blue-800 transition-colors
                                    ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                                    w-full text-left
                                `}
                                title={isCollapsed ? "Logout" : ''}
                            >
                                <div className="flex items-center">
                                    <span className="text-blue-200">{iconMap.logout}</span>
                                    {!isCollapsed && (
                                        <span className="ml-3 whitespace-nowrap text-sm">Logout</span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Sidebar;
