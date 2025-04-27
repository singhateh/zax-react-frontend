import { useState } from 'react';
import api from '@/services/api';
import Swal from 'sweetalert2';

const showToast = (type, message) => {
    Swal.fire({
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
};

export const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fetchAppointments = async (filters) => {
        setIsLoading(true);
        setProgress(0);

        try {
            let progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 50) {
                        clearInterval(progressInterval);
                        return 50;
                    }
                    return prev + 5;
                });
            }, 300);

            const response = await api.post('/doctor/appointments', {
                appointment_type: filters.appointmentType,
                filter_report_type: filters.reportType,
                filter_mile: filters.showExpertWithin,
                sortby: filters.sortBy,
                filter_postcode: filters.postCode,
                filter_city_town: filters.town,
                filter_appointment_days: filters.days,
                filter_appt_date_from: filters.fromDate,
                filter_appt_date_to: filters.toDate,
            });

            setProgress(90);

            let clinicList = Array.isArray(response.data.appointments)
                ? response.data.appointments
                : Object.values(response.data.appointments);

            setAppointments(clinicList);
            setTotalPages(response.data.pagination.total_pages);
            setProgress(100);
        } catch (error) {
            const msg = error.response?.data?.error || 'Something went wrong!';
            showToast('error', msg);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const blockSlot = async ({ slotId, formData, appointmentData, updateState }) => {
        try {
            await api.post('/doctor/appointments/block-appointment-slot', {
                slot_id: slotId,
                ...formData,
            });

            updateState(appointmentData, slotId);
            showToast('success', 'Appointment slot blocked successfully!');
        } catch (error) {
            if (error.response?.status === 422) {
                throw error.response.data.errors || {};
            } else {
                showToast('error', error?.response?.data?.error || 'Something went wrong!');
            }
        }
    };

    const unblockSlot = async ({ slotId, expertName, confirmText, appointmentData, updateState }) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: confirmText || `Do you want to unblock this slot for ${expertName}?`,
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
                slot_id: slotId,
            });

            updateState(appointmentData, slotId);
            showToast('success', 'Appointment slot unblocked successfully!');
        } catch (error) {
            showToast('error', error?.response?.data?.error || 'Something went wrong!');
        }
    };

    const confirmBooking = async ({ claimant, slotId, notes, appointmentData, updateState }) => {
        const confirm = await Swal.fire({
            title: 'Confirm Booking',
            text: 'Do you want to save these appointment notes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'Yes, Save',
            cancelButtonText: 'Cancel',
            width: '320px',
            padding: '20px',
            backdrop: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.post('/doctor/appointments/book', {
                case_id: claimant.id,
                slot_id: slotId,
                appointment_note: notes,
                re_book_appointment: null,
                is_rescheduled: false,
            });

            updateState(appointmentData, slotId);
            showToast('success', 'Appointment booked successfully!');
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessage = Object.values(validationErrors).join('<br/>');
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `Validation Errors`,
                    html: errorMessage,
                    showConfirmButton: false,
                    timer: 5000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            } else {
                showToast('error', error?.response?.data?.error || 'Something went wrong!');
            }
        }
    };

    return {
        appointments,
        setAppointments,
        totalPages,
        isLoading,
        progress,
        fetchAppointments,
        blockSlot,
        unblockSlot,
        confirmBooking,
    };
};
