import React, { useState } from 'react';
import ExperienceDetail from './ExperienceDetail';
import Specialty from './Specialty';
import Reports from './Reports';
import CurrentAppointment from './CurrentAppointment';
import PreviousAppointment from './PreviousAppointment';
import Training from './Training';
import QualificationDetail from './QualificationDetail';
import CurriculumVitae from './CurriculumVitae';
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';

const tabs = [
    { id: 'curriculum_vitae', label: 'Curriculum Vitae', icon: <FaChevronRight className="mr-2" />, component: CurriculumVitae },
    { id: 'qualifications', label: 'Qualifications', icon: <FaChevronRight className="mr-2" />, component: QualificationDetail },
    { id: 'experience', label: 'Experience', icon: <FaChevronRight className="mr-2" />, component: ExperienceDetail },
    { id: 'specialty', label: 'Specialty', icon: <FaChevronRight className="mr-2" />, component: Specialty },
    { id: 'reports', label: 'Reports', icon: <FaChevronRight className="mr-2" />, component: Reports },
    { id: 'current', label: 'Current Appointments', icon: <FaChevronRight className="mr-2" />, component: CurrentAppointment },
    { id: 'previous', label: 'Previous Appointments', icon: <FaChevronRight className="mr-2" />, component: PreviousAppointment },
    { id: 'training', label: 'Training', icon: <FaChevronRight className="mr-2" />, component: Training },
];

function QualificationSection({ doctor }) {
    const [activeTab, setActiveTab] = useState('qualifications');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const professionalInfo = doctor?.professionalInfo || {};

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Mobile Menu Button */}
            <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>
                </div>
            </div>

            {/* Sidebar Tabs - Mobile */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-20 bg-white pt-16 overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sidebar Tabs - Desktop */}
            <div className="hidden lg:block w-full lg:w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-0 self-start">
                <div className="p-2 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'curriculum_vitae' ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                        <CurriculumVitae professionalInfo={professionalInfo} />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                        {React.createElement(ActiveComponent, { doctor })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QualificationSection;