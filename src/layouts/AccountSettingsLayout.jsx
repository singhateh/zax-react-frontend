import React, { useState } from "react";
import {
  Wrench,
  BadgePoundSterling,
  ScrollText,
  OctagonAlert,
  ReceiptText,
  UserCog2,
} from "lucide-react";
import Tabs from "../components/Tabs";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../contex/ContexProvider";
import { goToDoctorProfile } from "../utilities/navigationUtils";

function AccountSettingsLayout() {
  const [activeTab, setActiveTab] = useState("AccountSetup");
  const { selectedDoctor } = useStateContext();

  const tabs = [
    {
      label: "Account Setup",
      icon: <UserCog2 />,
      route: goToDoctorProfile(null, selectedDoctor, true),
      state: selectedDoctor,
    },
    {
      label: "Payment Setup",
      icon: <BadgePoundSterling />,
      route: "/account-settings/payment",
    },
    {
      label: "Contract Setups",
      icon: <ScrollText />,
      route: "/account-settings/contracts",
    },
    {
      label: "Zax Alerts",
      icon: <OctagonAlert />,
      route: "/account-settings/alerts",
    },
    {
      label: "Zax Billing",
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
    <div className="max-w-full px-0 sm:px-0 lg:px-8 py-6">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="inventory-content mt-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AccountSettingsLayout;
