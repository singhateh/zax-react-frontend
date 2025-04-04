import React from "react";
import { useState } from "react";
import Tabs from "../../../../../Global/components/Tabs";
import { Outlet } from "react-router-dom";

function AccountReceivableLayout() {
  const [activeTab, setActiveTab] = useState("Generate");

  const tabs = [
    {
      label: "Open",
      route: "/invoices/manage-invoices/account_receivable/unpaid_invoice",
    },
    {
      label: "Over Due",
      route: "/invoices/manage-invoices/account_receivable/overdue_invoice",
    },
    {
      label: "Paid",
      route: "/invoices/manage-invoices/account_receivable/paid_invoice",
    },
    {
      label: "Part Paid",
      route:
        "/invoices/manage-invoices/account_receivable/partially_paid_invoice",
    },
    {
      label: "Cancelled",
      route: "/invoices/manage-invoices/account_receivable/cancelled_invoice",
    },
    {
      label: "Find",
      route: "/invoices/manage-invoices/account_receivable/find_invoice",
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

export default AccountReceivableLayout;
