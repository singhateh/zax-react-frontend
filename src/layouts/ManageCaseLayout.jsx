import { Outlet } from "react-router-dom";
import Tabs from "../Global/components/Tabs";
import { Briefcase, BriefcaseMedical, Mail } from "lucide-react";
import { useState } from "react";

const DoctorLayout = () => {
  const [activeTab, setActiveTab] = useState("Manage Cases");

  const tabs = [
    {
      label: "Manage Cases",
      icon: <BriefcaseMedical />,
      route: "/cases/manage-cases",
    },
    {
      label: "Manage Medical Records",
      icon: <Briefcase />,
      route: "/cases/medical-records",
    },
    {
      label: "General Letters",
      icon: <Mail />,
      route: "/cases/general-letters",
    },
  ];

  return (
    <div
      class="fixed gap-4 w-[calc(100%-40px)] lg:w-[calc(100%-160px)]  
    left-40 lg:left-40 px-0 flex justify-center items-center z-20 
    transition-all duration-300 top-[40px] h-12 shadow-inner"
    >
      {" "}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full max-w-full mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
