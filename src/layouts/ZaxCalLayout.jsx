import {
    Building,
    CalendarClock,
    ScrollText,
    BookOpenCheck,
    FileSpreadsheet,
    FileText,
} from "lucide-react";
import Tabs from "../components/Tabs";
import { Outlet, useLocation } from "react-router-dom";

function ZaxCalLayout() {
    const location = useLocation();
    const tabs = [
        { label: "Venues", icon: <Building />, route: "/zax-cal/venues" },
        { label: "Slots", icon: <CalendarClock />, route: "/zax-cal/slots" },
        { label: "Appointments", icon: <ScrollText />, route: "/zax-cal/appointments" },
        { label: "Diary", icon: <BookOpenCheck />, route: "/zax-cal/diary" },
        { label: "Clinic List", icon: <Building />, route: "/zax-cal/clinic-list" },
        { label: "DNA List", icon: <FileText />, route: "/zax-cal/dna-list" },
        { label: "Manage CSV", icon: <FileSpreadsheet />, route: "/zax-cal/manage-csv" },
    ];

    // Determine active tab based on route
    const activeTab =
        tabs.find((tab) => location.pathname.includes(tab.route))?.route || "/zax-cal/venues";

    return (
        <div className="inventory-layout">
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={() => { }}
                containerClass="custom-tabs-container"
                buttonClass="custom-tab-button"
                activeButtonClass="custom-tab-active"
            />

            <div className=" inventory-content mt-15">
                <Outlet />
            </div>


        </div>
    );
}

export default ZaxCalLayout;
