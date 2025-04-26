import React, { useState } from 'react';
import MedcoForm from './partials/MedcoForm';
import IndemnityForm from './partials/IndemnityForm';
import IcoForm from './partials/IcoForm';
import QualificationSection from './partials/QualificationSection';
import GmcForm from './partials/GmcForm';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const ProfessionalSetupTab = ({ doctor }) => {
    const [openItem, setOpenItem] = useState('gmc');
    const professionalInfo = doctor?.professionalInfo || {};

    const toggleItem = (item) => {
        setOpenItem(openItem === item ? null : item);
    };

    const sections = [
        {
            id: 'gmc',
            title: 'GMC Details',
            component: <GmcForm professionalInfo={professionalInfo} />
        },
        {
            id: 'medco',
            title: 'MedCo Details',
            component: <MedcoForm professionalInfo={professionalInfo} />
        },
        {
            id: 'indemnity',
            title: 'Indemnity Details',
            component: <IndemnityForm professionalInfo={professionalInfo} />
        },
        {
            id: 'ico',
            title: 'ICO Details',
            component: <IcoForm professionalInfo={professionalInfo} />
        },
        {
            id: 'qualification',
            title: 'Qualification Details',
            component: <QualificationSection doctor={doctor} professionalInfo={professionalInfo} />
        }
    ];

    return (
        <div className="flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <button
                            onClick={() => toggleItem(section.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 font-medium text-left bg-white hover:bg-gray-50 transition-colors ${openItem === section.id ? 'border-b border-gray-200' : ''}`}
                        >
                            <span className="text-gray-800">{section.title}</span>
                            {openItem === section.id ? (
                                <FiChevronUp className="text-gray-500" />
                            ) : (
                                <FiChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {openItem === section.id && (
                            <div className="p-4 bg-gray-50">
                                {section.component}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};