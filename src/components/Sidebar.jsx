import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";

import {
  Calendar,
  UserRoundCog,
  House,
  BadgePoundSterling,
  ScrollText,
  LayoutDashboard,
  BriefcaseMedical,
  ReceiptText,
} from "lucide-react";
import "../../src/Icon.css";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

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
      route: "/zax/billing",
    },
    {
      icon: <UserRoundCog />,
      text: "Account",
      route: "/account-settings/setup",
    },
  ];

  const pathFirstSegment = location.pathname.split("/")[1];
  const activeSidebarItem =
    menuItems.find((item) => item.route.split("/")[1] === pathFirstSegment)
      ?.text || "Dashboard";

  useEffect(() => {
    document.title = activeSidebarItem;
    const pageHeader = document.querySelector(".page-header");
    if (pageHeader) {
      pageHeader.innerHTML = `<h2 class="text-3xl font-bold">${activeSidebarItem}</h2>`;
    }
  }, [activeSidebarItem]);

  return (
    <div className="bg-[#4D55CC] text-white fixed lg:relative h-full transition-all duration-300 w-45 left-0">
      <div className="bg-cyan-950 flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">Zax Tech</span>
      </div>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <NavLink to={item.route} key={item.route}>
            <SidebarItem
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
