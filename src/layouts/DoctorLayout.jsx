import { useLocation, Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";
import { Briefcase, MedalIcon, User2Icon } from "lucide-react";

const DoctorLayout = () => {
  const location = useLocation();

  const tabs = [
    { label: "Doctors", icon: <MedalIcon />, route: "/doctors" },
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
  console.log(activeTab);
  return (
    <div className="fixed gap-4 w-[calc(100%-40px)] lg:w-[calc(100%-160px)]  left-40 lg:left-40 px-0 flex justify-center items-center z-20 transition-all duration-300 h-12 shadow-inner">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={() => {}}
        containerClass="custom-tabs-container"
        buttonClass="custom-tab-button"
        activeButtonClass="custom-tab-active"
      />

      <div className="w-full max-w-full mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
