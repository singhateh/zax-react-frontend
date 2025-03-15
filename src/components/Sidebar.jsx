import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";

import {
  Calendar,
  FolderOpen,
  UserRoundCog,
  Settings,
  House,
  BadgePoundSterling,
  ScrollText,
  OctagonAlert,
  ReceiptText,
} from "lucide-react";
import "../../src/Icon.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <House />, text: "Doctors", route: "/doctors" },
    {
      icon: <UserRoundCog />,
      text: "Account",
      route: "/account-settings/setup",
    },
    { icon: <Settings />, text: "Settings", route: "/settings" },
    { icon: <Calendar />, text: "Zax Cal", route: "/zax-cal" },
    { icon: <BadgePoundSterling />, text: "Invoices", route: "/invoices" },
    {
      icon: <FolderOpen />,
      text: "Cases",
      route: "/manage-cases",
    },
    { icon: <ScrollText />, text: "Zax Reports", route: "/zax-reports" },
    {
      icon: <BadgePoundSterling />,
      text: "Zax Billing",
      route: "/zax-billing",
    },
    { icon: <OctagonAlert />, text: "Zax Alerts", route: "/zax-alerts" },
  ];

  const activeSidebarItem = menuItems.find(
    (item) =>
      location.pathname === item.route ||
      location.pathname.startsWith(`${item.route}/`)
  );

  return (
    <div className="bg-blue-900 text-white fixed lg:relative h-full transition-all duration-300 w-40 left-0">
      <div className="bg-cyan-950 flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">Zax Tech</span>
      </div>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <NavLink to={item.route}>
            <SidebarItem
              key={item.route}
              icon={item.icon}
              text={item.text}
              activeSidebarItem={activeSidebarItem}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
