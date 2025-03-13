import { useState } from "react";
import { FiBell, FiHome, FiSettings, FiLogOut, FiTool } from "react-icons/fi";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white fixed lg:relative h-full transition-all duration-300 w-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>Zax Tech</span>
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <SidebarItem icon={<FiHome />} text="Dashboard" isOpen={isOpen} onClick={() => setActiveTab("dashboard")} />
          <SidebarItem icon={<FiSettings />} text="Settings" isOpen={isOpen} onClick={() => setActiveTab("settings")} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="bg-white fixed w-full lg:w-[calc(100%-156px)] top-0 left-0 lg:left-40 p-4 shadow-md flex justify-between items-center z-10 transition-all duration-300">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-6 relative">
            {/* Notifications */}
            <div className="relative">
              <FiBell
                className="text-xl cursor-pointer hover:text-gray-600"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              />
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
                  <p className="text-gray-800 font-semibold">Notifications</p>
                  <ul className="mt-2 text-gray-600">
                    <li className="py-1 border-b">New message from admin</li>
                    <li className="py-1 border-b">System update available</li>
                    <li className="py-1">Server maintenance scheduled</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
                <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full border" />
              </div>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
                  <DropdownItem icon={<FiSettings />} text="Settings" />
                  <DropdownItem icon={<FiTool />} text="Configuration" />
                  <DropdownItem icon={<FiLogOut />} text="Logout" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 p-4 w-full max-w-screen flex space-x-4 bg-gray-200 shadow-inner">
          <TabButton label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <TabButton label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </div>


        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "settings" && <SettingsContent />}
        </div>
      </div>
    </div>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, text, isOpen, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
    {icon}
    {isOpen && <span>{text}</span>}
  </div>
);

// Tab Button Component
const TabButton = ({ label, active, onClick }) => (
  <button
    className={`py-2 px-4 rounded-md transition-all duration-200 ${active ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
      }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Profile Dropdown Item
const DropdownItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
    {icon}
    <span>{text}</span>
  </div>
);

// Tab Content Components
const DashboardContent = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
    <p className="text-gray-600">Welcome to the Zax Technologies dashboard.</p>
  </div>
);

const SettingsContent = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
    <p className="text-gray-600">Customize your app settings here.</p>
  </div>
);
