import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { capitalize } from "../../utilities/utilities";
import { useEffect } from "react";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
      setActiveTab(tab.label); // Ensure sync with routing
    }
  };

  useEffect(() => {
    const currentTitle = document.title;
    document.title = `${
      currentTitle === activeTab ? "" : currentTitle
    } - ${activeTab}`;
    const currentHeader = document.querySelector(".page-header");
    if (currentHeader) {
      currentHeader.textContent = `${activeTab}`;
    }
  }),
    [activeTab];

  return (
    <div
      className="fixed w-[calc(100%-40px)] lg:w-[calc(100%-160px)] 
    left-40 lg:left-40 px-4 flex justify-center items-center gap-4 
    z-20 transition-all duration-300 mt-15 h-10
    bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl 
    backdrop-blur-lg bg-opacity-80 border border-white/20"
    >
      {tabs.map((tab, key) => (
        <TabButton
          key={key}
          tab={tab}
          active={location.pathname === tab.route}
          onClick={() => handleTabClick(tab)}
        />
      ))}
    </div>
  );
};

export default Tabs;

export const TabButton = ({ tab, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-sm rounded-lg transition-all duration-300 cursor-pointer font-semibold 
    flex items-center gap-2
    ${
      active
        ? "bg-white text-indigo-700 shadow-md border-b-4 border-indigo-500 scale-90 border-b-[#ffadff]"
        : "bg-transparent text-gray-200 hover:bg-white/20 hover:text-white"
    }`}
  >
    <span className="text-base">{tab.icon}</span>
    {capitalize(tab.label)}
  </button>
);
