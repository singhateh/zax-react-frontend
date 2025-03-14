import { useState } from "react";
import { FiBell, FiSettings, FiLogOut, FiTool } from "react-icons/fi";

const Header = ({ user, logout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="bg-white fixed w-full lg:w-[calc(100%-160px)] top-0 left-0 lg:left-40 p-4 shadow-md flex justify-between items-center z-10 transition-all duration-300">
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
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
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
  );
};

// Profile Dropdown Item
const DropdownItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
    {icon}
    <span>{text}</span>
  </div>
);

export default Header;
