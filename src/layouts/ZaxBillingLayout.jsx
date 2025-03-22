import React, { useState } from "react";
import { BadgePoundSterling, OctagonAlert } from "lucide-react";
import Tabs from "../Global/components/Tabs";
import { Outlet } from "react-router-dom";

function AccountSettingsLayout() {
  const [activeTab, setActiveTab] = useState("Zax Billing");
  const tabs = [
    {
      label: "Zax Billing",
      icon: <BadgePoundSterling />,
      route: "/zax/billing",
    },
    {
      label: "Zax Billing Summary",
      icon: <BadgePoundSterling />,
      route: "/zax/billing-summary",
    },
    {
      label: "Zax Alerts",
      icon: <OctagonAlert />,
      route: "/zax/alerts",
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
}

export default AccountSettingsLayout;
