import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Tabs from "../components/Tabs";

const menuConfig = {
  doctors: ["doctors", "agencies", "agencies note", "solicitors diary"],
  "account settings": [
    "account setup",
    "payment setup",
    "zax reporting",
    "zax billing",
    "zax alerts new",
    "zax billing summary",
  ],
  "Zax Cal": [
    "Setup Venue",
    "Create Slots",
    "Book Appointments",
    "Diary",
    "Print Clinic List",
    "Print DNA List",
    "Manage CSV",
  ],
  cases: ["Manage Cases", "Manage Medical Reports", "General Letters"],
  invoices: ["Manage Invoices", "Invoice Reports"],
  settings: [],
};

const Layout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("doctors");
  const [activeSidebarItem, setActiveSidebarItem] = useState("doctors");

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    if (menuConfig[path]) {
      setActiveSidebarItem(path);
      setActiveTab(menuConfig[path][0]);
    }
  }, [location.pathname]);

  const tabItems = menuConfig[activeSidebarItem] || [];
  console.log("active side bar", activeSidebarItem);
  console.log("tab items", tabItems);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white fixed lg:relative h-full transition-all duration-300 w-40">
        <Sidebar activeTab={activeTab} menuConfig={menuConfig} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-16 overflow-auto">
        <Header />
        <Tabs
          activeSidebarItem={activeSidebarItem}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabItems}
        />
        <div className="flex-1 p-6 w-full bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
