import { Outlet } from "react-router-dom";
import Tabs from "../../../../Global/components/Tabs";
import { SquareLibrary, ReceiptText } from "lucide-react";
import { useState } from "react";

const ManageInvoicesLayout = () => {
  const [activeTab, setActiveTab] = useState("Manage Invoices");

  const tabs = [
    {
      label: "Manage Invoices",
      icon: <ReceiptText />,
      route: "/invoices/manage-invoices",
    },
    {
      label: "Manage Reports",
      icon: <SquareLibrary />,
      route: "/invoices/reports",
    },
  ];

  return (
    <div className="inventory-layout">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full max-w-full mt-15">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageInvoicesLayout;
