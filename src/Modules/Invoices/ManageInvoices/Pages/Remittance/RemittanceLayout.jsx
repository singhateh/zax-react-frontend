import React from "react";
import { useState } from "react";
import Tabs from "../../../../../Global/components/Tabs";
import { Outlet } from "react-router-dom";

function RemittanceLayout() {
  const [activeTab, setActiveTab] = useState("Generate");

  const tabs = [
    {
      label: "Open invoice",
      route: "/invoices/manage-invoices/remittance/open",
    },
    {
      label: "Summary Level Statements",
      route: "/invoices/manage-invoices/remittance/summary_level_statement",
    },
    {
      label: "Invoice Level Statetment",
      route: "/invoices/manage-invoices/remittance/invoice_level_statement",
    },
  ];
  return (
    <div className="flex flex-col w-full h-full">
      {/* Tabs Section */}
      <div className="w-full z-20 bg-white shadow-sm mt-[-63px]">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-4 mt-23">
        <Outlet />
      </div>
    </div>
  );
}

export default RemittanceLayout;
