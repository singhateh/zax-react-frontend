import React from "react";
import { useLocation } from "react-router-dom";

const SidebarItem = ({ icon, text, isActive, onClick }) => {
  const { pathname } = useLocation();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      className={`flex items-center gap-3 p-2 rounded cursor-pointer text-[18px] 
        ${
          isActive || pathname.includes(text.toLowerCase())
            ? "bg-blue-800"
            : "hover:bg-blue-800"
        }`}
    >
      {React.cloneElement(icon, {
        className: "w-5 h-5 text-white",
      })}
      <span className="text-white">{text}</span>
    </div>
  );
};

export default SidebarItem;
