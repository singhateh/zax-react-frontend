import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { capitalize } from "../utilities/utilities";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, isMobile } = useOutletContext();


  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route, {
        state: { doctor: tab.state },
      });
      setActiveTab(tab.route);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-gray-600 mt-16 shadow-md h-12 border-b border-gray-700 z-40 transition-all duration-300"
      style={{ marginLeft: `${isMobile ? 0 : (isCollapsed ? 0 : 8)}%` }}
    >
      <div className="overflow-x-auto">
        <div className="flex justify-center sm:justify-center gap-2 py-1 w-max mx-auto min-w-full">
          {tabs.map((tab, key) => (
            <TabButton
              key={key}
              tab={tab}
              active={location.pathname === tab.route}
              onClick={() => handleTabClick(tab)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


export default Tabs;

export const TabButton = ({ tab, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 flex-shrink-0 px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer
      ${active
        ? "bg-white text-blue-600 border-b-2 border-blue-800 font-semibold"
        : "bg-transparent hover:bg-blue-100 hover:text-blue-700 text-white"
      }`}
  >
    <span className="text-base" title={capitalize(tab.label)}>
      {tab.icon}
    </span>
    <span className="hidden sm:inline">{capitalize(tab.label)}</span>
  </button>
);

