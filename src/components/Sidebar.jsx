import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";

import {
  Calendar,
  FolderOpen,
  UserRoundCog,
  House,
  BadgePoundSterling,
  ScrollText,
  LayoutDashboard,
  BriefcaseMedical,
  SquareLibrary,
  Mail,
  ReceiptText,
} from "lucide-react";
import "../../src/Icon.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard />, text: "Dashboard", route: "/dashboard" },
    { icon: <House />, text: "Doctors", route: "/doctors" },

    {
      icon: <BriefcaseMedical />,
      text: "Instruct Case",
      route: "/instruct-case",
    },
    {
      icon: <BriefcaseMedical />,
      text: "Manage Cases",
      route: "/cases/manage-cases",
    },
    // {
    //   icon: <SquareLibrary />,
    //   text: "Medical Records",
    //   route: "/cases/medical-records",
    // },
    // { icon: <Mail />, text: "General Letters", route: "/general-letters" },
    { icon: <Calendar />, text: "Zax Cal", route: "/zax-cal/setup-venue" },
    { icon: <ScrollText />, text: "Zax Reports", route: "/zax-reports" },
    {
      icon: <ReceiptText />,
      text: "Invoices",
      route: "/invoices/manage-invoices",
    },
    {
      icon: <BadgePoundSterling />,
      text: "Zax Billing",
      route: "/zax-billing",
    },
    {
      icon: <UserRoundCog />,
      text: "Account",
      route: "/account-settings/setup",
    },
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
