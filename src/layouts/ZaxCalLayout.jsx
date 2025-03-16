import React, { useState } from "react";
import {
  Building2,
  CalendarPlus,
  CalendarCheck2,
  NotebookText,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import Tabs from "../components/Tabs";
import { Outlet } from "react-router-dom";

function ZaxCalLayout() {
  const [activeTab, setActiveTab] = useState("AccountSetup");

  const tabs = [
    {
      label: "Setup Venue",
      icon: <Building2 />,
      route: "/zax-cal/setup-venue",
    },
    {
      label: "Create Slots",
      icon: <CalendarPlus />,
      route: "/zax-cal/create-slots",
    },
    {
      label: "Book Appointments",
      icon: <CalendarCheck2 />,
      route: "/zax-cal/book-appointments",
    },
    { label: "Diary", icon: <NotebookText />, route: "/zax-cal/diary" },
    {
      label: "Print Clinic List",
      icon: <Printer />,
      route: "/zax-cal/print-clinic-list",
    },
    {
      label: "Print DNA List",
      icon: <FileText />,
      route: "/zax-cal/print-dna-list",
    },
    {
      label: "Manage CSV",
      icon: <FileSpreadsheet />,
      route: "/zax-cal/manage-csv",
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
}

export default ZaxCalLayout;
