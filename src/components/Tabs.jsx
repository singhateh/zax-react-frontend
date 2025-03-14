import { useNavigate, useLocation } from "react-router-dom";
import { slugify, capitalize } from "../utilities/utilities";
import { useEffect } from "react";

const Tabs = ({ activeTab, setActiveTab, tabs, activeSidebarItem }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const currentSlug = pathSegments[pathSegments.length - 1] || "doctors";
    setActiveTab(currentSlug);
  }, [location.pathname, setActiveTab]);

  const handleTabClick = (tab) => {
    const slug = slugify(tab);
    const targetPath =
      slug === activeSidebarItem
        ? `/${activeSidebarItem}`
        : `/${activeSidebarItem}/${slug}`;

    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }

    setActiveTab(slug);
  };

  return (
    <div className="p-4 w-full flex justify-center bg-blue-300 shadow-inner gap-4">
      {tabs.map((tab) => {
        const slug = slugify(tab);
        return (
          <TabButton
            key={tab}
            label={tab}
            active={activeTab === slug}
            onClick={() => handleTabClick(tab)}
          />
        );
      })}
    </div>
  );
};

export default Tabs;

// Tab Button Component
export const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-md transition-all duration-200 ${
      active
        ? "bg-transparent-600 text-white border-b-2 border-red-500"
        : "bg-transparent-300 text-gray-700 hover:bg-white"
    } `}
  >
    {capitalize(label)}
  </button>
);
