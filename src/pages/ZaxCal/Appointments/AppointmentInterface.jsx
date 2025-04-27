import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import SearchFilters from './SearchFilters';
import SortableTable from '../../../components/SortableTable';
import Modal from '../../../components/Modal';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import AppointmentInfoCard from './AppointmentInfoCard';

const AppointmentInterface = ({ appointment, closeModal, handleConfirmBooking }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [selectedClaimant, setSelectedClaimant] = useState(null);


    const handleViewDetails = (id) => {
        setSelectedSlotId(id);
        setShowDetailsModal(true);
    };

    const handleSelectClaimant = (result) => {
        setSelectedSlotId(appointment.id);
        setSelectedClaimant(result);
        setShowAppointmentDetailsModal(true);
    };


    const columns = [
        { key: 'number', label: 'ZAX ID' },
        { key: 'instructor', label: 'Instructor' },
        { key: 'full_name_title', label: 'Claimant Name' },
        { key: 'Preferred_Expert', label: 'Preferred Expert' },
        { key: 'Special_Instructions', label: 'Special Instructions' },
        { key: 'actions', label: 'Actions' }
    ];

    const data = searchResults.map(result => ({
        id: result.id,
        number: (
            <div className="flex items-center space-x-3">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="appointment"
                        value={result.id}
                        checked={selectedClaimant?.id === result.id}
                        onChange={() => handleSelectClaimant(result)} // Set selected ID when radio button is clicked
                        className="hidden peer"
                    />
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 flex items-center justify-center">
                        <span className="w-3 h-3 bg-white rounded-full opacity-0 peer-checked:opacity-100"></span>
                    </span>
                </label>
                <span className="text-sm font-medium text-gray-700">{result.number}</span>
            </div>

        ),
        instructor: result.instructor,
        full_name_title: result.full_name_title,
        Preferred_Expert: result.preferredExpert,
        Special_Instructions: result.specialInstructions,
        actions: (
            <button
                className="text-primary hover:text-blue-700"
                onClick={() => handleViewDetails(result.id)}
            >
                <FaEye />
            </button>
        )
    }));



    return (
        <>
            <div className="p-4 text-sm text-gray-800">
                {/* Appointment Info */}
                <AppointmentInfoCard appointment={appointment} />

                {/* Search Filters */}
                <SearchFilters setSearchResults={setSearchResults} />

                <SortableTable columns={columns} data={data} />
            </div>

            <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}
                size='small' title={'Appointment Details'}>
                <p>Appointment ID: {selectedSlotId}</p>
            </Modal>

            <AppointmentDetailsModal
                isOpen={showAppointmentDetailsModal}
                onClose={setShowAppointmentDetailsModal}
                closeModal={closeModal}
                selectedClaimant={selectedClaimant}
                handleConfirmBooking={handleConfirmBooking}
                selectedSlotId={selectedSlotId}
            />
        </>

    );
};

export default AppointmentInterface;
