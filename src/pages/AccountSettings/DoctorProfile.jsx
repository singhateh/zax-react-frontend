import { useState } from 'react';
import {
    FiUser, FiBriefcase, FiCreditCard, FiDollarSign, FiMail, FiUsers, FiSettings, FiMenu, FiX
} from 'react-icons/fi';
import { PersonalSetupTab } from './AccountSetups/PersonalSetupTab';
import { ProfessionalSetupTab } from './AccountSetups/ProfessionalSetupTab';
import { PaymentSetupTab } from './AccountSetups/PaymentSetupTab';
import { BillingSetupTab } from './AccountSetups/BillingSetupTab';
import { EmailSetupTab } from './AccountSetups/EmailSetupTab';
import { EmployeesSetupTab } from './AccountSetups/EmployeesSetupTab';
import { AccountSetupTab } from './AccountSetups/AccountSetupTab';


const DoctorProfile = ({ doctor, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!doctor) {
        return <div className="text-center text-gray-500 p-4">Loading doctor profile...</div>;
    }

    const tabs = [
        { id: 'account', name: 'Account', icon: <FiUser className="md:mr-2" /> },
        { id: 'personal', name: 'Personal', icon: <FiUser className="md:mr-2" /> },
        { id: 'professional', name: 'Professional', icon: <FiBriefcase className="md:mr-2" /> },
        { id: 'payment', name: 'Payment', icon: <FiCreditCard className="md:mr-2" /> },
        { id: 'billing', name: 'Billing', icon: <FiDollarSign className="md:mr-2" /> },
        { id: 'email', name: 'Email', icon: <FiMail className="md:mr-2" /> },
        { id: 'employees', name: 'Employees', icon: <FiUsers className="md:mr-2" /> }
    ];


    // Handler for doctor updates
    const handleDoctorUpdate = (update) => {
        if (onUpdate) {
            onUpdate(update);
        }
    };


    return (
        <div className="max-w-7xl mx-auto mt-20 md:px-0 lg:px-4">
            {/* Main Content Area with controlled scrolling */}
            <div className="flex-1">
                <div className1="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-10">
                    {/* Profile Header - Responsive */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex justify-center sm:justify-start sm:flex-shrink-0 p-4 sm:p-6">
                                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                                    {doctor.name?.charAt(0)}
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 text-center sm:text-left">
                                <div className="text-sm sm:text-base uppercase tracking-wide text-blue-600 font-semibold">
                                    {doctor.specialization || 'General Practitioner'}
                                </div>
                                <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mt-1">
                                    {doctor.name}
                                </h1>
                                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                                    {doctor.bio || 'No biography available'}
                                </p>
                                <div className="mt-3 flex justify-center sm:justify-start flex-wrap gap-2">
                                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                                        {doctor.status || 'Active'}
                                    </span>
                                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                                        {doctor.registration_number}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <span className="font-medium text-gray-700">
                                {tabs.find(tab => tab.id === activeTab)?.name}
                            </span>
                            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Tabs Navigation - Desktop */}
                        <div className="hidden lg:block w-full lg:w-56">
                            <nav className="space-y-1 bg-white rounded-lg shadow-sm p-2 border border-gray-200 sticky top-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center ${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span className="ml-2">{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tabs Navigation - Mobile */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden bg-white rounded-lg shadow-sm p-2 border border-gray-200">
                                <nav className="grid grid-cols-1 gap-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center ${activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab.icon}
                                            <span className="ml-2">{tab.name}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Tab Content */}
                        <div className="flex-1 flex flex-col bg-white p-4 rounded-lg"> {/* Add min-h-0 to allow child to shrink */}
                            {activeTab === 'account' && <AccountSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'personal' && <PersonalSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'professional' && <ProfessionalSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'payment' && <PaymentSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'billing' && <BillingSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'email' && <EmailSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                            {activeTab === 'employees' && <EmployeesSetupTab doctor={doctor} onUpdate={handleDoctorUpdate} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;