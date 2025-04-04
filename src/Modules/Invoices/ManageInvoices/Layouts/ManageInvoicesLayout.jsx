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
      route: "/invoices/manage-invoices/generate",
    },
    {
      label: "Manage Reports",
      icon: <SquareLibrary />,
      route: "/invoices/reports",
    },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-4 mt-[-10px]">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageInvoicesLayout;
