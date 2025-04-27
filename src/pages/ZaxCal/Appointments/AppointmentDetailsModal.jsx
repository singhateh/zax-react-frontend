import { useState } from 'react';
import Modal from '../../../components/Modal';
import { CalendarCheckIcon, X } from 'lucide-react';

export const AppointmentDetailsModal = ({
    isOpen,
    onClose,
    closeModal,
    selectedSlotId,
    selectedClaimant,
    handleConfirmBooking,
}) => {
    const [notes, setNotes] = useState('');

    const handleCloseModal = () => {
        setNotes('');
        onClose(false);
        closeModal();
    };


    const handleSave = () => {
        handleConfirmBooking(selectedClaimant, selectedSlotId, notes);
        handleCloseModal();
    };



    const renderFooterButtons = [
        {
            label: 'Confirm Booking',
            icon: <CalendarCheckIcon size={16} />,
            onClick: handleSave,
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: handleCloseModal,
            color: 'bg-red-500 hover:bg-red-600',
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            size="custom"
            customWidth="800px"
            title="📋 Appointment Details"
            footer={renderFooterButtons}
        >
            <div className="space-y-4">
                <div className="text-sm text-gray-600">
                    <strong>Appointment ID:</strong> {selectedClaimant?.name}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                        placeholder="Write your appointment notes..."
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
                    />
                </div>
            </div>
        </Modal>
    );
};
