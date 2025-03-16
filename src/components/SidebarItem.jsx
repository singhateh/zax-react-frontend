import React from "react";

const SidebarItem = ({ icon, text, onClick, activeSidebarItem }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      // onClick={() => setPageHeaderTitle(activeSidebarItem)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      className={`flex items-center gap-3 p-2 cursor-pointer text-[18px] 
        ${
          activeSidebarItem === text
            ? "bg-[radial-gradient(circle,#211c84,#4e3d98,#725fad,#9483c1,#b5a8d5)] "
            : "hover:bg-[#B5A8D5]"
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
