import { useNavigate, useLocation } from "react-router-dom";
import { capitalize } from "../utilities/utilities";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
      setActiveTab(tab.route); // Ensure sync with routing
    }
  };

  return (
    <div className="bg-[#B5A8D5] fixed gap-4 w-[calc(100%-45px)] lg:w-[calc(100%-160px)]  left-45 lg:left-45 px-0 flex justify-center items-center z-20 transition-all duration-300 h-12 shadow-inner">
      {tabs.map((tab, key) => (
        <TabButton
          key={key}
          tab={tab}
          active={location.pathname === tab.route} // Matches current route
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
    className={`py-1 px-3 text-sm rounded-md transition-all duration-200 cursor-pointer font-bold
      ${
        active
          ? "bg-white text-black border-b-2 "
          : "bg-transparent text-gray-700 hover:bg-[#4D55CC] hover:text-white"
      }
      flex gap-1 items-center`}
  >
    <span className="text-xs">{tab.icon}</span>
    {capitalize(tab.label)}
  </button>
);
