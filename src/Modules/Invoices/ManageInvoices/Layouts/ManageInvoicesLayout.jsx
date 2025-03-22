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
    <div className="w-full h-full flex flex-col">
      {/* Tabs Section */}
      <div className="w-full z-20 bg-white shadow-sm">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-4 mt-7">
        <Outlet />
      </div>
    </div>
  );
};

//   return (
//     <div className="w-full h-full flex flex-col">
//       <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 overflow-y-auto mt-15">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

export default ManageInvoicesLayout;
