const SidebarItem = ({ icon, text, isOpen, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-2 hover:bg-blue-800 rounded cursor-pointer text-sm"
  >
    {icon}
    {isOpen && <span>{text}</span>}
  </div>
);
export default SidebarItem;
