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
    <div className="bg-blue-300 fixed gap-4 w-[calc(100%-40px)] lg:w-[calc(100%-160px)]  left-40 lg:left-40 px-0 flex justify-center items-center z-20 transition-all duration-300 h-12 shadow-inner">
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
    className={`py-1 px-3 text-sm rounded-md transition-all duration-200 cursor-pointer
      ${active ? "bg-white text-black border-b-2 border-red-700" : "bg-transparent text-gray-700 hover:bg-white"}
      flex gap-1 items-center`}
  >
    <span className="text-xs">{tab.icon}</span> {/* Smaller icon */}
    {capitalize(tab.label)}
  </button>
);

