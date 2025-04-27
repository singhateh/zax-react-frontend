import { useLocation, Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";
import { Briefcase, MedalIcon, User2Icon } from "lucide-react";
import { FaBookMedical } from "react-icons/fa";

const DoctorLayout = () => {
  const location = useLocation();

  const tabs = [
    { label: "Doctors", icon: <FaBookMedical />, route: "/doctors" },
    { label: "Agencies", icon: <Briefcase />, route: "/doctors/agencies" },
    {
      label: "Solicitors",
      icon: <User2Icon />,
      route: "/doctors/solicitors-diary",
    },
  ];

  const activeTab =
    tabs.find((tab) => location.pathname.includes(tab.route))?.route ||
    "/doctors";

  return (
    <div className1="flex">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={() => { }}
        containerClass="custom-tabs-container"
        buttonClass="custom-tab-button"
        activeButtonClass="custom-tab-active"
      />

      <div className=" inventory-content mt-15">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
