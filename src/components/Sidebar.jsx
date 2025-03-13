import { FiHome, FiSettings } from "react-icons/fi";
import SidebarItem from "./SidebarItem";
import { MdManageAccounts } from "react-icons/md";

const iconMap = {
  doctors: <FiHome />,
  "account settings": <MdManageAccounts />,
  settings: <FiSettings />,
};

const Sidebar = ({ isOpen, setActiveSection, tabConfig }) => {
  const menuItems = Object.keys(tabConfig).map((menuItem) => ({
    icon: iconMap[menuItem],
    text: menuItem,
    section: menuItem,
  }));

  return (
    <div className="bg-blue-900 text-white fixed lg:relative h-full transition-all duration-300 w-40">
      <div className="bg-cyan-950 flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>
          Zax Tech
        </span>
      </div>
      <nav className="flex flex-col gap-4 p-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            isOpen={isOpen}
            onClick={() => {
              setActiveSection(item.section);
            }}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
