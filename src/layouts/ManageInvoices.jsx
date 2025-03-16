import { Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";
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
      label: "Manage Medical Records",
      icon: <SquareLibrary />,
      route: "/invoices/reports",
    },
  ];

  return (
    <div className="fixed gap-4 w-[calc(100%-40px)] lg:w-[calc(100%-160px)]  left-40 lg:left-40 px-0 flex justify-center items-center z-20 transition-all duration-300 h-12 shadow-inner">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full max-w-full mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageInvoicesLayout;
