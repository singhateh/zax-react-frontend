import React, { useState } from 'react';
import { SaveIcon, X } from 'lucide-react';
import Modal from '../../../components/Modal';
import InputField from '../../../components/InputField';
import useAppointmentSlot from './useAppointmentSlot';

const BlockAppointmentSlotModal = ({
    selectedSlot,
    selectedAppointment,
    selectedStatus,
    appointments,
    setAppointments,
    setSelectedAppointments,
    openModal,
    closeModal,
    setSelectedAppointmentCounts,
    setModalTitle,
    onSuccess,
    onFailure,
}) => {
    const [formData, setFormData] = useState({
        medco_reference: '',
        claimant_name_reference: '',
        note: '',
    });

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const { blockSlot, unblockSlot, formErrors, setFormErrors } = useAppointmentSlot(
        appointments,
        setAppointments,
        setSelectedAppointments,
        setModalTitle,
        setSelectedAppointmentCounts
    );

    const handleBlock = () => {
        blockSlot({
            selectedSlot,
            blockFormData: formData,
            selectedAppointment,
            selectedStatus,
            closeModal: handleModalClose
        });
    };

    const handleUnblock = (appointment) => {
        unblockSlot(appointment, selectedAppointment, selectedStatus);
    };

    const handleModalClose = () => {
        closeModal('Blocked');
        setFormErrors({});
    };

    // const handleBlock = async () => {
    //     setFormErrors({});

    //     if (!selectedSlot) {
    //         setFormErrors({ slot_id: ['Please select a slot to block.'] });
    //         return;
    //     }

    //     try {
    //         await api.post('/doctor/appointments/block-appointment-slot', {
    //             slot_id: selectedSlot,
    //             medco_reference: formData.medco_reference,
    //             claimant_name_reference: formData.claimant_name_reference,
    //             note: formData.note,
    //         });

    //         // Remove from selected list
    //         setSelectedAppointments(prev => prev.filter(slot => slot.id !== selectedSlot));

    //         // Update appointment slots
    //         const updated = appointments.map(app => {
    //             if (app.id !== selectedAppointment) return app;

    //             const blockedSlot = {
    //                 ...(app.appointmentAvailableSlots || []).find(slot => slot.id === selectedSlot),
    //                 status: 'Blocked',
    //             };

    //             const updatedAvailable = (app.appointmentAvailableSlots || []).filter(slot => slot.id !== selectedSlot);
    //             const updatedBlocked = [
    //                 ...(app.appointmentBlockedSlots || []),
    //                 blockedSlot,
    //             ].sort((a, b) => a.start_time.localeCompare(b.start_time));

    //             const availableCount = updatedAvailable.filter(slot => slot.status === 'Available').length;

    //             setSelectedAppointmentCounts(availableCount);
    //             setModalTitle(`${selectedStatus} Appointments ${availableCount}`);

    //             return {
    //                 ...app,
    //                 available: Math.max(app.available - 1, 0),
    //                 blocked: app.blocked + 1,
    //                 appointmentAvailableSlots: updatedAvailable,
    //                 appointmentBlockedSlots: updatedBlocked,
    //             };
    //         });

    //         setAppointments(updated);
    //         closeModal('Blocked');

    //         onSuccess?.();

    //         Swal.fire({
    //             position: 'top-end',
    //             icon: 'success',
    //             title: 'Appointment slot blocked successfully!',
    //             showConfirmButton: false,
    //             timer: 3000,
    //             toast: true,
    //             didOpen: toast => {
    //                 toast.addEventListener('mouseenter', Swal.stopTimer);
    //                 toast.addEventListener('mouseleave', Swal.resumeTimer);
    //             }
    //         });
    //     } catch (error) {
    //         if (error.response?.status === 422) {
    //             setFormErrors(error.response.data.errors || {});
    //         } else {
    //             const message = error?.response?.data?.error || 'Something went wrong!';
    //             Swal.fire({
    //                 position: 'top-end',
    //                 icon: 'error',
    //                 title: message,
    //                 showConfirmButton: false,
    //                 timer: 3000,
    //                 toast: true,
    //                 didOpen: toast => {
    //                     toast.addEventListener('mouseenter', Swal.stopTimer);
    //                     toast.addEventListener('mouseleave', Swal.resumeTimer);
    //                 }
    //             });
    //             onFailure?.(error);
    //         }
    //     }
    // };

    const footerBlockedButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleBlock,
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: handleModalClose,
            color: 'bg-red-500',
        }
    ];

    const renderBlockedModalContent = () => (
        <div>
            <div className="overflow-x-auto mb-6">
                <div className="grid grid-cols-1 gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <InputField
                            label="Claimant Name / Reference"
                            name="claimant_name_reference"
                            value={formData.claimant_name_reference}
                            onChange={handleInputChange}
                            errors={formErrors}
                        />
                        <InputField
                            label="Medco Reference"
                            name="medco_reference"
                            value={formData.medco_reference}
                            onChange={handleInputChange}
                            errors={formErrors}
                        />
                    </div>
                    <InputField
                        label="Note"
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        errors={formErrors}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <Modal isOpen={openModal} onClose={handleModalClose} title={'Block Appointment Slot'} size="custom"
            customWidth='500px' footer={footerBlockedButtons}
        >
            {renderBlockedModalContent()}
        </Modal>
    );
};

export default BlockAppointmentSlotModal;
