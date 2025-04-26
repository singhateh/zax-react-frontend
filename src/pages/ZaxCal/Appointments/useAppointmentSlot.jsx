import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';

const useAppointmentSlot = (appointments, setAppointments, setSelectedAppointments, setModalTitle, setSelectedAppointmentCounts) => {
    const [formErrors, setFormErrors] = useState({});

    const blockSlot = async ({ selectedSlot, blockFormData, selectedAppointment, selectedStatus, closeModal }) => {
        setFormErrors({}); // Reset errors before submitting

        try {
            await api.post('/doctor/appointments/block-appointment-slot', {
                slot_id: selectedSlot,
                medco_reference: blockFormData.medco_reference,
                claimant_name_reference: blockFormData.claimant_name_reference,
                note: blockFormData.note,
            });

            closeModal('Blocked');

            setSelectedAppointments(prev => prev.filter(slot => slot.id !== selectedSlot));

            const updatedAppointments = appointments.map(app => {
                if (app.id === selectedAppointment) {
                    const blockedSlot = {
                        ...(app.appointmentAvailableSlots || []).find(slot => slot.id === selectedSlot),
                        status: 'Blocked',
                    };

                    // Remove from available slots
                    const updatedAvailableSlots = (app.appointmentAvailableSlots || []).filter(slot => slot.id !== selectedSlot);

                    // Add to blocked slots
                    const updatedBlockedSlots = [
                        ...(app.appointmentBlockedSlots || []),
                        blockedSlot,
                    ].sort((a, b) => a.start_time.localeCompare(b.start_time));

                    const updatedCount = updatedAvailableSlots.filter(slot => slot.status === 'Available').length;

                    return {
                        ...app,
                        available: Math.max(app.available - 1, 0),
                        blocked: app.blocked + 1,
                        appointmentAvailableSlots: updatedAvailableSlots,
                        appointmentBlockedSlots: updatedBlockedSlots,
                    };
                }

                return app;
            });

            setSelectedAppointmentCounts(updatedCount);
            setModalTitle(`${selectedStatus} Appointments ${updatedCount}`);

            setAppointments(updatedAppointments);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Appointment slot blocked successfully!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setFormErrors(error.response.data.errors || {});
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error?.response?.data?.error || 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: toast => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                });
            }
        }
    };

    const unblockSlot = async (appointment, selectedAppointment, selectedStatus) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to unblock this slot for ${appointment.expert_name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unblock it!',
            cancelButtonText: 'Cancel',
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.post('/doctor/appointments/unblock-appointment-slot', {
                slot_id: appointment.id,
            });

            setSelectedAppointments(prev => prev.filter(slot => slot.id !== appointment.id));

            const updatedAppointments = appointments.map(app => {
                if (app.id === selectedAppointment) {
                    // Remove from blocked slots
                    const updatedBlockedSlots = (app.appointmentBlockedSlots || []).filter(slot => slot.id !== appointment.id);

                    const unblockedSlot = {
                        ...appointment,
                        status: 'Available',
                    };

                    // Add to available slots
                    const updatedAvailableSlots = [
                        ...(app.appointmentAvailableSlots || []),
                        unblockedSlot,
                    ].sort((a, b) => a.start_time.localeCompare(b.start_time));

                    const updatedCount = updatedBlockedSlots.length;

                    return {
                        ...app,
                        available: app.available + 1,
                        blocked: Math.max(app.blocked - 1, 0),
                        appointmentBlockedSlots: updatedBlockedSlots,
                        appointmentAvailableSlots: updatedAvailableSlots,
                    };
                }

                return app;
            });

            setSelectedAppointmentCounts(updatedCount);
            setModalTitle(`${selectedStatus} Appointments ${updatedCount}`);

            setAppointments(updatedAppointments);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Appointment slot unblocked successfully!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error?.response?.data?.error || 'Something went wrong!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });
        }
    };

    return { blockSlot, unblockSlot, formErrors, setFormErrors };
};

export default useAppointmentSlot;
