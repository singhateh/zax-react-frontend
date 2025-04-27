import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/CustomCalendar.css";
import api from "../../services/api";
import { CopyCheckIcon, GitPullRequestDraftIcon, PlusSquareIcon, RocketIcon, TicketCheckIcon, Trash2Icon } from "lucide-react";
import CustomAlert from "../../components/CustomAlert";
import ReservationModal from "../Modals/ReservationModal";
import AppointmentCalendarModal from "../Modals/AppointmentCalendarModal";
import { STATUS_CLASSES } from "../../utilities/constant";
import Swal from "sweetalert2";
import './Diaries/ShowSlot.css';
import { useNavigate } from "react-router-dom";
import MobileCalendar from "../../components/MobileCalendar";

// Localization Setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales
});

const baseUrl = 'doctor/dairy';

const Diary = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appointmentLoading, setAppointmentLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [slot, setSlot] = useState(null);
    const [error, setError] = useState(null);
    const [view, setView] = useState("month");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [solicitors, setSolicitors] = useState([]);
    const [appointmentError, setAppointmentError] = useState('');
    const [success, setSuccess] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const navigate = useNavigate();


    const handleSelectAppointment = (id) => {
        setSelectedAppointments((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((appointmentId) => appointmentId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = useCallback(() => {
        if (selectedAppointments.length === appointments.length) {
            setSelectedAppointments([]); // Deselect all
        } else {
            setSelectedAppointments(appointments.map((appointment) => appointment.id)); // Select all
        }
    }, [appointments, selectedAppointments.length]);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get(`${baseUrl}/calendar`);
                const eventData = response.data.calendars.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.start), // Convert date string to Date object
                    end: new Date(event.end),
                    doctor: event.doctor,
                }));

                setEvents(eventData);

                // Assuming `agencies` and `solicitors` are separate arrays in the response
                // If they are located elsewhere in the response data, adjust accordingly
                setAgencies(response.data.agencies || []);
                setSolicitors(response.data.solicitors || []);
            } catch (err) {
                setError("Failed to fetch events.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    const fetchAppointments = async (slotId) => {

        if (!slotId) return;

        setAppointmentLoading(true);
        setModalOpen(true);
        setAppointmentError(null)
        setSuccess(null)
        try {
            const response = await api.get(`${baseUrl}/appointments?slotId=${slotId}`);
            setSlot(response.data);
            setAppointments(response.data.appointment_slots);

        } catch (error) {
            console.error("Error fetching appointments:", error);
            setModalOpen(false);
        } finally {
            setAppointmentLoading(false);
        }
    };

    const handleShowSlot = (appointment) => {
        if (!appointment) return;

        const modalTitle = `${appointment.start_time} - ${appointment.end_time}`;

        Swal.fire({
            title: modalTitle,
            html: `
            <div class="appointment-modal">
              <div class="appointment-info">
                <div class="info-row">
                    <span class="label">Doctor:</span>
                    <span class="value">${appointment.expert_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Patient:</span>
                    <span class="value">${appointment.claimant_name || 'N/A'}</span>
                </div>
                <div class="info-row status">
                    <span class="label">Status:</span>
                    <span class="value ${STATUS_CLASSES[appointment.status] || STATUS_CLASSES.default}">
                        ${appointment.status || 'Unknown'}
                    </span>
                </div>
                <div class="info-row">
                    <span class="label">Slot Date:</span>
                    <span class="value">${appointment.slot_date || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Time:</span>
                    <span class="value">${appointment.start_time} - ${appointment.end_time}</span>
                </div>
                <div class="info-row">
                    <span class="label">Venue:</span>
                    <span class="value">${slot.venue_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Appointment Type:</span>
                    <span class="value">${slot.appointment_type || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Claimant Contact:</span>
                    <span class="value">${appointment.claimant_mobile || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Agency Company:</span>
                    <span class="value">${appointment.agency_company || 'N/A'}</span>
                </div>
              </div>
            </div>
          `,
            showCancelButton: false,
            confirmButtonText: 'Close',
            confirmButtonColor: '#007bff', // Blue color for the button
            customClass: {
                popup: 'custom-modal-class',
                confirmButton: 'custom-confirm-btn',
            },
            didOpen: () => {
                document.querySelector('.swal2-popup').style.borderRadius = '8px'; // Rounded corners
                document.querySelector('.swal2-html-container').style.textAlign = 'left';
                document.querySelector('.swal2-popup').style.padding = '20px';
                document.querySelector('.swal2-popup').style.maxWidth = '500px'; // Limiting the width
                document.querySelector('.swal2-popup').style.width = '100%';
            }
        });
    };



    const handleInstructAndBookAppointment = () => {
        navigate('/instruct-cases/appointment-book-page');
        navigate('/instruct-cases');

    };


    const appointmentStatus = ({ status }) => STATUS_CLASSES[status] || 'bg-white';



    const appointmentStatusHover = (appointment) => {
        switch (appointment.status) {
            case 'Available':
                return 'group-hover:bg-green-200'; // Use group-hover for hover effect
            case 'Booked':
                return 'group-hover:bg-red-200'; // Use group-hover for hover effect
            case 'Pending':
                return 'group-hover:bg-yellow-200'; // Use group-hover for hover effect
            case 'Cancelled':
                return 'group-hover:bg-gray-300'; // Use group-hover for hover effect
            case 'Completed':
                return 'group-hover:bg-blue-200'; // Use group-hover for hover effect
            default:
                return 'group-hover:bg-white'; // Default hover effect
        }
    };


    const handleAction = async (action) => {
        if (isProcessing) return;

        if (action === 'reserve') {
            setIsReserveModalOpen(true);
            setModalOpen(false);
            return;
        }
        // Handling bulkDelete separately, where confirmation is required before making the request
        if (action === 'bulkDelete') {
            CustomAlert.show({
                type: "delete",
                onConfirm: async () => {
                    // Only send the request when confirmed
                    await handleBulkDelete();
                },
            });
            return; // Exit early since the request is now handled in the confirmation callback
        }

        setIsProcessing(true);

        try {
            const { data } = await api.post(`${baseUrl}/appointments/handle-action`, {
                slot_id: slot?.id,
                action,
                checked: selectedAppointments,
            });

            if (data.success) {
                setSuccess(data.success);
                setAppointmentError('');

                if (data.updatedSlots) {
                    setSlot(data.updatedSlots);
                    setAppointments(data.updatedSlots.appointment_slots || []);
                    setSelectedAppointments([]);
                }

                if (data.download) {
                    // Handle download logic if necessary
                    handleDownload(data.download);
                }
            } else {
                setAppointmentError(data.error || 'An error occurred');
                setSuccess('');
            }
        } catch (error) {
            console.error('API Error:', error);
            setAppointmentError(error.response?.data?.error || 'An error occurred');
            setSuccess('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBulkDelete = async () => {
        setIsProcessing(true);

        try {
            const { data } = await api.post(`${baseUrl}/appointments/handle-action`, {
                slot_id: slot?.id,
                action: 'bulkDelete',
                checked: selectedAppointments,
            });

            if (data.success) {
                setSuccess(data.success);
                setAppointmentError('');

                if (data.updatedSlots) {
                    setSlot(data.updatedSlots);
                    setAppointments(data.updatedSlots.appointment_slots || []);
                }
            } else {
                setAppointmentError(data.error || 'An error occurred');
                setSuccess('');
            }
        } catch (error) {
            console.error('API Error:', error);
            setAppointmentError(error.response?.data?.error || 'An error occurred');
            setSuccess('');
        } finally {
            setIsProcessing(false); // Reset processing state after request completes
        }
    };

    const handleDownload = (download) => {
        if (typeof download === 'string' && download.startsWith('http')) {
            // Handle URL download
            const link = document.createElement('a');
            link.href = download;
            link.download = download.split('/').pop();
            link.click();
        } else {
            // Handle base64 or file content download
            const blob = new Blob([download], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'downloaded-file'; // Default filename
            link.click();
            URL.revokeObjectURL(url); // Clean up URL object
        }
    };

    const handleReserve = async ({ agency, instructor, notes }) => {
        setIsProcessing(true);

        try {
            const { data } = await api.post(`${baseUrl}/appointments/handle-action`, {
                slot_id: slot?.id,
                reserve_agency: agency?.value || null,
                reserve_solicitor: instructor?.value || null,
                reserve_note: notes,
                action: 'reserve',
                checked: selectedAppointments,
            });

            if (data.success) {
                setSuccess(data.success);
                setAppointmentError('');

                if (data.updatedSlots) {
                    setSlot(data.updatedSlots);
                    setAppointments(data.updatedSlots.appointment_slots || []);

                    setSelectedAppointments([]);

                }
            } else {
                setAppointmentError(data.error || 'An error occurred');
                setSuccess('');
            }
        } catch (error) {
            console.error('API Error:', error);
            setAppointmentError(error.response?.data?.error || 'An error occurred');
            setSuccess('');
        } finally {
            setIsProcessing(false);
        }
    };


    const footerButtons = [
        {
            label: 'Duplicate',
            icon: <CopyCheckIcon size={16} />,
            onClick: () => handleAction('duplicate'),
            color: 'bg-blue-500',
        },
        {
            label: 'Delete',
            icon: <Trash2Icon size={16} />,
            onClick: () => handleAction('bulkDelete'),
            color: 'bg-red-500',
        },
        {
            label: 'Reserve',
            icon: <TicketCheckIcon size={16} />,
            onClick: () => handleAction('reserve'),
            color: 'bg-green-500',
        },
        {
            label: 'Release Reserved Slots',
            icon: <RocketIcon size={16} />,
            onClick: () => handleAction('unReserve'),
            color: 'bg-yellow-500',
        },
        {
            label: 'Print Reserved Slots',
            icon: <GitPullRequestDraftIcon size={16} />,
            onClick: () => handleAction('printReserved'),
            color: 'bg-gray-500',
        },
        {
            label: 'Create Slots',
            icon: <PlusSquareIcon size={16} />,
            link: '/slots/create',
            color: 'bg-teal-500',
        },
    ];

    const closeModal = () => {
        setIsReserveModalOpen(false);
        setModalOpen(true);
    }

    const isAllSelected = selectedAppointments.length === appointments.length;

    return (
        <div>
            <MobileCalendar
                events={events}
                loading={loading}
                error={error}
                fetchAppointments={fetchAppointments}
                setModalTitle={setModalTitle}
            />

            <AppointmentCalendarModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                loading={appointmentLoading}
                isProcessing={isProcessing}
                appointmentError={appointmentError}
                success={success}
                appointments={appointments}
                isAllSelected={isAllSelected}
                handleSelectAll={handleSelectAll}
                handleSelectAppointment={handleSelectAppointment}
                selectedAppointments={selectedAppointments}
                slot={slot}
                appointmentStatus={appointmentStatus}
                appointmentStatusHover={appointmentStatusHover}
                handleInstructAndBookAppointment={handleInstructAndBookAppointment}
                handleShowSlot={handleShowSlot}
                footerButtons={footerButtons}
            />
            <ReservationModal
                baseUrl={baseUrl}
                isOpen={isReserveModalOpen}
                onClose={closeModal}
                agencies={agencies}
                solicitors={solicitors}
                loading={loading}
                setIsProcessing={setIsProcessing}
                isProcessing={isProcessing}
                setAppointmentError={setAppointmentError}
                appointmentError={appointmentError}
                setSuccess={setSuccess}
                success={success}
                appointments={appointments}
                isAllSelected={isAllSelected}
                handleSelectAll={handleSelectAll}
                handleSelectAppointment={handleSelectAppointment}
                selectedAppointments={selectedAppointments}
                slot={slot}
                appointmentStatus={appointmentStatus}
                appointmentStatusHover={appointmentStatusHover}
                handleInstructAndBookAppointment={handleInstructAndBookAppointment}
                handleShowSlot={handleShowSlot}
                footerButtons={footerButtons}
                handleReserve={handleReserve}
            />

        </div>
    );
};

export default Diary;
