import SidebarItem from "./SidebarItem";
// import { useNavigate } from "react-router-dom";

import {
  Calendar,
  FileText,
  FolderOpen,
  UserRoundCog,
  Settings,
  House,
} from "lucide-react";
import "../../src/Icon.css";
import { NavLink } from "react-router-dom";

const iconMap = {
  doctors: <House />,
  "account settings": <UserRoundCog />,
  settings: <Settings />,
  "zax cal": <Calendar />,
  invoices: <FileText />,
  "manage cases": <FolderOpen />,
};

const Sidebar = () => {

  const menuItems = [
    { icon: iconMap.doctors, text: "Doctors", route: "/doctors" },
    { icon: iconMap["account settings"], text: "Account Settings", route: "/account-settings" },
    { icon: iconMap.settings, text: "Settings", route: "/settings" },
    { icon: iconMap["zax cal"], text: "Zax Cal", route: "/zax-cal" },
    { icon: iconMap["manage cases"], text: "Manage cases", route: "/manage-cases" },
    { icon: iconMap["invoices"], text: "Invoices", route: "/Invoices" },
  ];

  return (
    <div className="bg-blue-900 text-white fixed lg:relative h-full transition-all duration-300 w-40">
      <div className="bg-cyan-950 flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">Zax Tech</span>
      </div>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <NavLink to={item.route} >
            <SidebarItem
              key={item.route}
              icon={item.icon}
              text={item.text}
            />
          </NavLink>


        ))}
      </nav>
    </div>
  );
};




export default Sidebar;


