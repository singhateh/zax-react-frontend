import React, { useState } from 'react';
import Modal from '../../components/Modal';
import CustomSelect from '../../components/CustomSelect'; // Assuming CustomSelect is a wrapper for react-select
import { PlusSquareIcon, TimerResetIcon } from 'lucide-react';

const ReservationModal = ({ ...props }) => {
    const [agency, setAgency] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [notes, setNotes] = useState('');

    // Handle change for dropdowns and textarea
    const handleAgencyChange = (selectedOption) => setAgency(selectedOption);
    const handleInstructorChange = (selectedOption) => setInstructor(selectedOption);
    const handleNotesChange = (e) => setNotes(e.target.value);

    const agencyOptions = Object.values(props.agencies || {}).map((agency) => ({
        value: agency.id,
        label: agency.company_name,
    }));

    const solicitorOptions = Object.values(props.solicitors || {}).map((solicitor) => ({
        value: solicitor.id,
        label: solicitor.company_name,
    }));

    const handleSubmitData = async () => {
        await props.handleReserve({ agency, instructor, notes });

        setAgency(null);
        setInstructor(null);
        setNotes('');

        // Close the modal
        props.onClose();
    };


    const footerButtons = [
        {
            label: 'Save',
            icon: <PlusSquareIcon size={16} />,
            onClick: handleSubmitData, // Corrected: Directly call the function
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <TimerResetIcon size={16} />,
            onClick: props.onClose,
            color: 'bg-red-500',
        },
    ];

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} footer={footerButtons} size="custom" customWidth="550px">
            {/* Agency Dropdown using react-select */}
            <div className="form-group mb-6 gap-15">
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2">
                    Agency
                </label>
                <CustomSelect
                    id="agency"
                    value={agency}
                    onChange={handleAgencyChange}
                    options={agencyOptions}
                    placeholder="Select an Agency"
                    className="react-select-container"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: '#4A90E2',
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#f0f0f0',
                        }),
                    }}
                />
            </div>

            {/* Instructor Dropdown using react-select */}
            <div className="form-group mb-6 gap-11">
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                    Or Instructor
                </label>
                <CustomSelect
                    id="instructor"
                    value={instructor}
                    onChange={handleInstructorChange}
                    options={solicitorOptions}
                    placeholder="Select a Solicitor"
                    className="react-select-container"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: '#4A90E2',
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#f0f0f0',
                        }),
                    }}
                />
            </div>

            {/* Additional Notes Textarea */}
            <div className="form-group mb-6 gap-17">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={handleNotesChange}
                    className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter additional details"
                ></textarea>
            </div>
        </Modal>
    );
};

export default ReservationModal;
