import SidebarItem from "./SidebarItem";
import { capitalize, slugify } from "../utilities/utilities";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  FileText,
  FolderOpen,
  UserRoundCog,
  Settings,
  House,
} from "lucide-react";
import "../../src/Icon.css";

const iconMap = {
  doctors: <House />,
  "account settings": <UserRoundCog />,
  settings: <Settings />,
  "zax cal": <Calendar />,
  invoices: <FileText />,
  cases: <FolderOpen />,
};

const Sidebar = ({ menuConfig }) => {
  const navigate = useNavigate();
  const menuItems = Object.keys(menuConfig).map((menuItem) => ({
    icon: iconMap[menuItem.toLowerCase()],
    text: capitalize(menuItem),
    item: menuItem,
    slug: `/${slugify(menuItem)}`,
  }));

  return (
    <div className="bg-blue-900 text-white fixed lg:relative h-full transition-all duration-300 w-40">
      <div className="bg-cyan-950 flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">Zax Tech</span>
      </div>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.slug}
            icon={item.icon}
            text={item.text}
            // isActive={activeTab === item.slug}
            onClick={() => {
              console.log(`Navigating to ${item.slug}`);
              navigate(item.slug);
            }}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
