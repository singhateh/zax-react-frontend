import React, { useState } from "react";
import {
  Wrench,
  BadgePoundSterling,
  ScrollText,
  OctagonAlert,
  ReceiptText,
} from "lucide-react";
import Tabs from "../Global/components/Tabs";
import { Outlet } from "react-router-dom";

function AccountSettingsLayout() {
  const [activeTab, setActiveTab] = useState("AccountSetup");
  const tabs = [
    {
      label: "AccountSetup",
      icon: <Wrench />,
      route: "/account-settings/setup",
    },
    {
      label: "AccountPayment",
      icon: <BadgePoundSterling />,
      route: "/account-settings/payment",
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
