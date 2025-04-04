import { Outlet } from "react-router-dom";
import Tabs from "../../../../Global/components/Tabs";
import { LayoutList, ReceiptText } from "lucide-react";
import { useState } from "react";

const DebtorReportPage = () => {
  const [activeTab, setActiveTab] = useState("Debtor Report");

  const tabs = [
    {
      label: "Debtor Report",
      icon: <ReceiptText />,
      route: "/reports/invoices/debtor_report",
    },
    {
      label: "Invoice List Report",
      icon: <LayoutList />,
      route: "/reports/invoices/invoice_list_report",
    },
  ];
  return (
    <div className="flex flex-col w-full h-full mt-[-60px]">
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
};

export default DebtorReportPage;
