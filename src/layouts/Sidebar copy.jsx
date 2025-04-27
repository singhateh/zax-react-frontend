import { Calendar, FileText, FolderOpen, UserRoundCog, Settings, House, LayoutDashboardIcon, ClipboardListIcon, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
    "logout": <FiLogOut size={20} />,
};

const Sidebar = ({ isCollapsed, isMobile, doctor, logout, toggleSidebar }) => {
    const location = useLocation();

    const menuItems = [
        { icon: iconMap.dashboard, text: "Dashboard", route: "/dashboard", slug: "dashboard" },
        { icon: iconMap.doctors, text: "Doctors", route: "/doctors", slug: "doctors" },
        { icon: iconMap["account settings"], text: "Account", route: goToDoctorProfile(null, doctor, true), slug: "account" },
        { icon: iconMap.settings, text: "Settings", route: "/settings", slug: "settings" },
        { icon: iconMap["zax cal"], text: "Zax Cal", route: "/zax-cal", slug: "zax-cal" },
        { icon: iconMap["manage cases"], text: "Cases", route: "/manage-cases", slug: "cases" },
        { icon: iconMap["instruct case"], text: "Instruct Case", route: "/instruct-cases", slug: "instruct" },
        { icon: iconMap["invoices"], text: "Invoices", route: "/invoices", slug: "invoices" },
        { icon: iconMap["logout"], text: "Logout", onClick: logout },
    ];

    const isActive = (slug, route) => {
        const normalize = (path) => path.replace(/^\/|\/$/g, '');
        const currentPath = normalize(location.pathname);
        const targetRoute = normalize(route);

        if (currentPath === targetRoute) return true;
        if (slug === "dashboard" && currentPath === "") return true;

        const firstSegment = currentPath.split('/')[0];
        return firstSegment === slug;
    };

    const handleItemClick = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    return (
        <div className={`
            bg-blue-900 text-white 
            fixed
            h-screen 
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-16' : 'w-40'} 
            ${isMobile ? 'z-50' : 'z-30'}
            left-0 top-0
            shadow-lg
            flex flex-col
            ${isMobile && !isCollapsed ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}
        `}>
            {/* Header with toggle button */}
            <div className={`flex items-center justify-between p-4 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
                {(!isCollapsed || isMobile) && (
                    <div className="w-full">
                        <img
                            src={LoginLogoIcon}
                            alt="Company Logo"
                            className="w-full h-10 object-contain"
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
            <nav className="flex-1 flex flex-col p-2 space-y-1 overflow-y-auto w-0">
                {menuItems.map((item, index) => {
                    const active = item.slug ? isActive(item.slug, item.route) : false;
                    const commonClasses = ` w-0
                        flex items-center 
                        p-3 rounded-lg
                        hover:bg-blue-800 transition-colors
                        ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                        ${active ? 'bg-blue-700 font-medium' : ''}
                    `;

                    return (
                        <div key={index}>
                            {item.route ? (
                                <NavLink
                                    to={item.route}
                                    state={{ doctor: doctor }}
                                    className={commonClasses}
                                    title={isCollapsed ? item.text : ''}
                                    onClick={handleItemClick}
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
                                </NavLink>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (item.onClick) item.onClick();
                                        if (isMobile) toggleSidebar();
                                    }}
                                    className={commonClasses}
                                    title={isCollapsed ? item.text : ''}
                                >
                                    <div className="flex items-center">
                                        <span className="text-blue-200">{item.icon}</span>
                                        {!isCollapsed && (
                                            <span className="ml-3 whitespace-nowrap text-sm">
                                                {item.text}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;