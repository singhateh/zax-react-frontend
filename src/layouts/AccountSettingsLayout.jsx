import React, { useState } from "react";
import {
  Wrench,
  BadgePoundSterling,
  ScrollText,
  OctagonAlert,
  ReceiptText,
} from "lucide-react";
import Tabs from "../components/Tabs";
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
    {
      label: "ZaxReportinng",
      icon: <ScrollText />,
      route: "/account-settings/reports",
    },
    {
      label: "ZaxAlerts",
      icon: <OctagonAlert />,
      route: "/account-settings/alerts",
    },
    {
      label: "ZaxBilling",
      icon: <BadgePoundSterling />,
      route: "/account-settings/billing",
    },
    {
      label: "ZaxBilling Summary",
      icon: <ReceiptText />,
      route: "/account-settings/billing-summary",
    },
  ];
  return (
    <div className="bg-red fixed w-full lg:w-[calc(100%-160px)] ">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full max-w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AccountSettingsLayout;
