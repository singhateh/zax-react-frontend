import React from "react";
import { useState } from "react";
import Tabs from "../../Global/components/Tabs";
import { Outlet } from "react-router-dom";

function ManageInvoices() {
  const [activeTab, setActiveTab] = useState("Generate");

  const tabs = [
    { label: "Generate", route: "/invoices/manage-invoices/generate" },
    { label: "Cancelled Invoices", route: "/invoices/manage-invoices/cancel" },
    { label: "Account Receivable", route: "/invoices/manage-invoices/unpaid" },
    { label: "Remittance", route: "/invoices/manage-invoices/remittance" },
  ];
  return (
    <div className="flex flex-col w-full h-full">
      {/* Tabs Section */}
      <div className="w-full z-20 bg-white shadow-sm">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-4 mt-23">
        <Outlet />
      </div>
    </div>
  );
}
//   return (
//     <div className="flex flex-col w-full h-full">
//       <div className="w-full z-20 bg-white shadow-sm">
//         <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

export default ManageInvoices;
