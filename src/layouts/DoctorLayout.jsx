import React, { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { FaListAlt, FaProductHunt, FaTypo3 } from 'react-icons/fa'; // New icons
import Tabs from '../components/Tabs';

const DoctorLayout = () => {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('doctors');

    // Tabs with updated icons and routes
    const tabs = [
        { label: 'Doctors', icon: <FaProductHunt />, route: '/doctors' },
        { label: 'Agencies', icon: <FaTypo3 />, route: '/doctors/agencies' },
        { label: 'Solicitors', icon: <FaListAlt />, route: '/doctors/solicitors-diary' },
    ];

    useEffect(() => {
        const currentTab = tabs.find(tab => location.pathname.includes(tab.route))?.route;
        setActiveTab(currentTab);
        console.log(currentTab);

    }, []);


    return (
        <div className="bg-white fixed w-full lg:w-[calc(100%-160px)] ">
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                // onTabChange={handleTabChange}
                containerClass="custom-tabs-container"
                buttonClass="custom-tab-button"
                activeButtonClass="custom-tab-active"
            />

            <div className="w-full max-w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorLayout;
