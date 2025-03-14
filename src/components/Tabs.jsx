import { useNavigate } from "react-router-dom";
import { capitalize } from "../utilities/utilities";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    if (tab.route) navigate(tab.route);
  };

  return (
    <div className="p-4 w-full flex justify-center bg-blue-300 shadow-inner gap-4">
      {tabs.map((tab, key) => (
        <TabButton
          key={key}
          tab={tab}
          active={activeTab === tab.label}
          onClick={() => handleTabClick(tab)}
        />
      ))}
    </div>
  );
};

export default Tabs;

// Tab Button Component
export const TabButton = ({ tab, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-md transition-all duration-200 ${
      active
        ? "bg-red-500 text-white border-b-2 border-red-700"
        : "bg-transparent text-gray-700 hover:bg-white"
    } flex gap-2`}
  >
    <span className="mt-1">{tab.icon}</span>
    {capitalize(tab.label)}
  </button>
);
