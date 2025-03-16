import { useLocation, Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";
import { Briefcase, Scale, User2Icon } from "lucide-react";
import { useState } from "react";

const DoctorLayout = () => {
  const [activeTab, setActiveTab] = useState("Doctors");

  const tabs = [
    { label: "Doctors", icon: <User2Icon />, route: "/doctors" },
    { label: "Agencies", icon: <Briefcase />, route: "/doctors/agencies" },
    {
      label: "Solicitors",
      icon: <Scale />,
      route: "/doctors/solicitors-diary",
    },
  ];

  return (
    <div className="fixed gap-4 w-[calc(100%-40px)] lg:w-[calc(100%-160px)]  left-40 lg:left-40 px-0 flex justify-center items-center z-20 transition-all duration-300 h-12 shadow-inner">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full max-w-full mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
