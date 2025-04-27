

import React, { useEffect, useState } from 'react';
import SortableTable from '../../components/SortableTable';
import Modal from '../../components/Modal';
import api from '../../services/api';
import SelectField from '../../components/SelectField';

import DateField from '../../components/DateField';
import CollapsibleSection from '../../components/CollapsibleSection';
import InputField from '../../components/InputField';
import SelectFieldDays from '../../components/SelectFieldDays';
import Skeleton from '../../components/Skeleton';
import { venueDetailsInline } from './Venues/venueHelpers';
import Swal from 'sweetalert2';
import { Info, LogIn, SaveIcon, X } from 'lucide-react';
import BookedAppointmentModal from './Appointments/BookedAppointmentModal';
import TableData from './Appointments/TableData';
import AppointmentInterface from './Appointments/AppointmentInterface';
import { CASE_STATUS } from '../../constants';
import { showConfirmModal } from '../../components/showConfirmModal';


import { Tooltip } from 'react-tooltip';

const Appointments = ({ className = 'mx-auto p-6 mt-20 w-full', isDashboard = false, isFilter = true }) => {

    const [appointments, setAppointments] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [selectedAppointmentCounts, setSelectedAppointmentCounts] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState('');
    const [getSelectedAppointment, setGetSelectedAppointment] = useState('');
    const [formErrors, setFormErrors] = useState({});


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [modalBlockTitle, setModalBlockTitle] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);


    const defaultValues = {
        appointmentType: 1,
        reportType: 1,
        postCode: null,
        town: null,
        fromDate: null,
        toDate: null,
        showExpertWithin: 15,
        days: [],
        sortBy: "early",
        printWithSpecialInstructions: false,
    };

    const defaultBlockValues = {
        medco_reference: null,
        claimant_name_reference: null,
        note: null,
    };

    const [filters, setFilters] = useState(defaultValues);
    const [blockFormData, setBlockFormData] = useState(defaultBlockValues);

    const [dropdownOptions, setDropdownOptions] = useState({
        experts: [],
        appointmentTypes: [],
        reportTypes: [],
        showExpertWithin: [],
        sortBy: [],
    });

    useEffect(() => {
        fetchDropdownOptions();

        if (isDashboard) {
            handleFilter();
        }
    }, []);

    const normalizeToArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object') return Object.values(data);
        return [];
    };

    const fetchDropdownOptions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/doctor/appointments');
            const { appointmentTypes, reportTypes, experts } = response.data;

            setDropdownOptions({
                appointmentTypes: normalizeToArray(appointmentTypes).map(item => ({
                    label: item?.name ?? 'Unknown',
                    value: item?.id ?? item
                })),
                reportTypes: normalizeToArray(reportTypes).map(item => ({
                    label: item?.name ?? 'Unknown',
                    value: item?.id ?? item
                })),
                experts: normalizeToArray(experts).map(item => ({
                    label: item?.name ?? 'Unknown',
                    value: item?.id ?? item
                })),
                showExpertWithin: Array.from({ length: 20 }, (_, i) => i * 5 + 5).map(item => ({
                    label: item.toString(),
                    value: item
                })),
                sortBy: [
                    { label: "Early", value: "early" },
                    { label: "Late", value: "late" },
                    { label: "Soon", value: "soon" },
                    { label: "Recent", value: "recent" },
                    { label: "Upcoming", value: "upcoming" },
                    { label: "Oldest", value: "oldest" },
                ],
            });
        } catch (error) {
            console.error('Failed to load dropdown options:', error);
        } finally {
            setLoading(false); // Ensures loading state is reset no matter what
        }
    };


    const handleFilter = async () => {
        setIsLoading(true);
        setProgress(0); // Reset progress at the start

        try {
            // Simulate progress while the request is being made
            let progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 50) {
                        clearInterval(progressInterval);
                        return 50;
                    }
                    return prev + 5;
                });
            }, 300);

            // Perform the API request
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

            // Once the API request is completed, simulate the progress completing
            setProgress(90); // Set to 90% after the response starts coming in

            let clinicList = [];
            if (Array.isArray(response.data.appointments)) {
                clinicList = response.data.appointments;
            } else if (typeof response.data.appointments === 'object') {
                clinicList = Object.values(response.data.appointments);
            }

            setAppointments(clinicList);
            setTotalPages(response.data.pagination.total_pages);
            setProgress(100); // Finalize progress when clinic data is set
        } catch (error) {
            console.error('Error fetching filtered clinics:', error);

            // Displaying error message using SweetAlert2 Toast
            if (error.response) {
                // Check if response contains an error message
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error.response.data.error || 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            } else {
                // If there's no response from the server, show a generic error
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network error or server not reachable',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            }
        } finally {
            setIsLoading(false);
            setProgress(0); // Reset progress after loading ends
        }
    };

    const handleBlockAppointmentSlot = async () => {
        setFormErrors({});

        try {
            await api.post('/doctor/appointments/block-appointment-slot', {
                slot_id: selectedSlot,
                medco_reference: blockFormData.medco_reference,
                claimant_name_reference: blockFormData.claimant_name_reference,
                note: blockFormData.note,
            });

            closeModal('Blocked');

            setSelectedAppointments(prev =>
                prev.filter(slot => slot.id !== selectedSlot)
            );

            setAppointments(prevAppointments => {
                let updatedCount = 0;

                const updatedAppointments = prevAppointments.map(app => {
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


                        updatedCount = updatedAvailableSlots.filter(slot => slot.status === 'Available').length;

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

                return updatedAppointments;
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Appointment slot blocked successfully!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

        } catch (error) {
            if (error.response?.status === 422) {
                setFormErrors(error.response.data.errors || {});
            } else {
                // General error
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error?.response?.data?.error || 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            }
        }
    };

    const handleUnBlockAppointmentSlot = async (appointment) => {
        // alert(selectedStatus);
        // return;
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to unblock this slot for ${appointment.expert_name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, unblock it!',
            cancelButtonText: 'Cancel'
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.post('/doctor/appointments/unblock-appointment-slot', {
                slot_id: appointment.id,
            });

            setSelectedAppointments(prev =>
                prev.filter(slot => slot.id !== appointment.id)
            );

            setAppointments(prevAppointments => {
                let updatedCount = 0;

                const updatedAppointments = prevAppointments.map(app => {
                    if (app.id === selectedAppointment) {

                        // Remove from blocked slots
                        const updatedBlockedSlots = (app.appointmentBlockedSlots || []).filter(slot => slot.id !== appointment.id);

                        const unblockedSlot = {
                            ...appointment,
                            status: 'Available',
                        };

                        // Add to blocked slots
                        const updatedAvailableSlots = [
                            ...(app.appointmentAvailableSlots || []),
                            unblockedSlot,
                        ].sort((a, b) => a.start_time.localeCompare(b.start_time));


                        updatedCount = updatedBlockedSlots.length;

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
                setModalTitle(`Blocked Appointments ${updatedCount}`);

                return updatedAppointments;
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Appointment slot unblocked successfully!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: error?.response?.data?.error || 'Something went wrong!',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        }
    };

    const handleConfirmBooking = async (selectedClaimant, selectedSlotId, notes) => {
        const dynamicTitle = 'Confirm Appointment';
        const dynamicText = `Do you want to proceed with confirming this appointment for ${selectedClaimant?.name} on ${getSelectedAppointment?.slot_date}?`;

        // Create an AbortController for canceling the request
        const controller = new AbortController();
        const { signal } = controller;

        // Await confirmation modal result
        const result = await showConfirmModal({
            title: dynamicTitle,
            text: dynamicText,
            onConfirm: async () => {
                try {
                    // Make sure only one API request is made after confirmation
                    const response = await api.post('/doctor/appointments/book', {
                        case_id: selectedClaimant.id,
                        slot_id: selectedSlotId,
                        appointment_note: notes,
                        re_book_appointment: null,
                        is_rescheduled: false,
                    }, { signal }); // Pass the signal to the request

                    if (response.status === 200) {
                        const responseData = response.data.slot;

                        // Update selected appointments
                        setSelectedAppointments(prev => {
                            const updated = prev.filter(slot => slot.id !== selectedSlotId);
                            return updated;
                        });

                        // Update appointments list
                        setAppointments(prevAppointments => {
                            let updatedCount = 0;

                            const updatedAppointments = prevAppointments.map(app => {
                                if (app.id === selectedAppointment) {
                                    const bookedSlot = {
                                        ...(app.appointmentAvailableSlots || []).find(slot => slot.id === selectedSlotId),
                                        status: 'Booked',
                                    };

                                    const updatedAvailableSlots = (app.appointmentAvailableSlots || []).filter(
                                        slot => slot.id !== selectedSlotId
                                    );

                                    const updatedBookedSlots = [
                                        ...(app.appointmentBookedSlots || []),
                                        responseData,
                                    ].sort((a, b) => a.start_time.localeCompare(b.start_time));

                                    updatedCount = updatedAvailableSlots.length;

                                    return {
                                        ...app,
                                        available: Math.max(app.available - 1, 0),
                                        booked: app.booked + 1,
                                        appointmentAvailableSlots: updatedAvailableSlots,
                                        appointmentBookedSlots: updatedBookedSlots,
                                    };
                                }
                                return app;
                            });

                            setSelectedAppointmentCounts(updatedCount);
                            setModalTitle(`Available Appointments ${updatedCount}`);

                            return updatedAppointments;
                        });

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Appointment booked successfully!',
                            showConfirmButton: false,
                            timer: 3000,
                            toast: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer);
                                toast.addEventListener('mouseleave', Swal.resumeTimer);
                            }
                        });
                    }
                } catch (error) {
                    // Handle aborted request
                    if (error.name === 'AbortError') {
                        console.log('[Booking] Request was cancelled');
                        return;
                    }

                    // Handle other errors (e.g., validation, network issues)
                    console.error('[Booking] Booking failed:', error);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: error?.response?.data?.error || 'Something went wrong!',
                        showConfirmButton: false,
                        timer: 3000,
                        toast: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                }
            },
            onCancel: () => {
                // Abort the API request when user cancels
                controller.abort(); // Cancel the API request
                console.log('[Booking] Appointment cancelled by user.');
            },
            controller, // Pass the controller to the modal
        });

        if (!result.isConfirmed) {
            console.log('[Booking] Booking cancelled by user.');
        }
    };

    const handleReset = () => {
        setFilters(defaultValues);
    };

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);
        setFilters((prevState) => ({
            ...prevState,
            [field]: selectedValue,
        }));
    };

    const handleInputChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);
        setBlockFormData((prevState) => ({
            ...prevState,
            [field]: selectedValue,
        }));
    };

    const handleDateChange = (name, date) => {
        const newFormData = {
            ...filters,
            [name]: date,
        };

        setFilters(newFormData);
    };


    const renderAppointmentExpert = (appointment) => {
        return (
            <>
                <strong>{`${appointment.expert_name}`}</strong><br />
                <label>
                    <small className="text-orange-500">
                        {`${appointment.report_type_name} First Report`}

                    </small>
                </label>
            </>
        );
    };

    const renderAppointmentDetails = (appointment) => {
        return (
            <>
                <strong>{`${appointment.appointment_type} - Expert`}</strong><br />
                <span>
                    <small className="text-orange-500">
                        {`${appointment.report_type_name}`}
                    </small>
                </span>
            </>
        );
    };

    const renderAppointmentDays = (appointment) => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const isToday = appointment.slot_day === today;
        const dayClass = isToday ? 'text-red-600' : 'text-black';

        return (
            <>
                <strong>{appointment.slot_date}</strong><br />
                <label className='text-center flex gap-4'>
                    <small className={dayClass}>
                        {appointment.slot_day}
                    </small>

                    <small>
                        {appointment.available < 5 &&
                            appointment.available !== 0 ? (
                            <>
                                <Info
                                    className="w-5 h-5 text-yellow-500 animate-pulse mr-1 cursor-help"
                                    data-tooltip-id="slot-tooltip"
                                    data-tooltip-content="Alert: Few Slots Available"
                                    data-tooltip-place="left"
                                    aria-label="Few slots available"
                                />
                            </>
                        ) : appointment.available === 0 ? (
                            <>
                                <Info
                                    className="w-5 h-5 text-red-500 animate-pulse mr-1 cursor-help"
                                    data-tooltip-id="slot-tooltip"
                                    data-tooltip-content="No Available Slots"
                                    data-tooltip-place="left"
                                    aria-label="No slots available"
                                />
                            </>
                        ) : null}

                        {/* Single tooltip instance */}
                        <Tooltip
                            id="slot-tooltip"
                            className="z-[100] !bg-gray-800 !text-xs"
                            noArrow={false}
                        />
                    </small>
                </label>
            </>
        );
    };


    // Column definitions
    const columns = [
        { key: 'Service', label: 'Service' },
        { key: 'Expert', label: 'Expert', align: 'center' },
        { key: 'Venue', label: 'Venue', align: 'center' },
        { key: 'slot_date', label: 'Available Date', sortable: true },
        { key: 'Available', label: 'Available', align: 'center' },
        { key: 'Booked', label: 'Booked', align: 'center' },
        { key: 'Blocked', label: 'Blocked', align: 'center' },
    ];

    const data = appointments.map(appointment => ({
        id: appointment.id,
        Service: renderAppointmentDetails(appointment),
        Expert: renderAppointmentExpert(appointment),
        Venue: venueDetailsInline(appointment.venue, '', 'center'),
        slot_date: renderAppointmentDays(appointment),
        Available: (
            <span
                onClick={() => openModal('Available', appointment.appointmentAvailableSlots, appointment)}
                className="cursor-pointer text-green-500 hover:underline"
            >
                {appointment.available || 0}
            </span>
        ),
        Booked: (
            <span
                onClick={() => openModal('Booked', appointment.appointmentBookedSlots, appointment)}
                className="cursor-pointer text-yellow-500 hover:underline"
            >
                {appointment.booked || 0}
            </span>
        ),
        Blocked: (
            <span
                onClick={() => openModal('UnBlocked', appointment.appointmentBlockedSlots, appointment)}
                className="cursor-pointer text-red-500 hover:underline"
            >
                {appointment.blocked || 0}
            </span>
        ),
    }));


    const openModal = (status, appointmentSlots, dataObj) => {
        if (!status || appointmentSlots.length === 0) return;

        const currentStatus = status === 'UnBlocked' ? 'Blocked' : status;

        if (status === 'Blocked') {
            setIsBlockModalOpen(true);
            setModalBlockTitle(`${dataObj.formatted_time}`);
            setSelectedSlot(dataObj.id);
        } else {


            if (status === CASE_STATUS.UNAPPOINTED) {
                setGetSelectedAppointment(dataObj);
                setSelectedSlot(dataObj.id);
                setModalTitle(`BOOK UN-APPOINTED CLAIAMANTS`);
            } else {

                const availableData = appointmentSlots.filter(slot => slot.status === currentStatus);
                setSelectedAppointments(
                    availableData
                );

                // Instead of relying on state, compute count from the array directly
                const count = availableData.length;
                setSelectedAppointmentCounts(count);
                setSelectedAppointment(dataObj.id);
                setModalTitle(`${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Appointments ${count}`);
            }
        }

        setSelectedStatus(status);

        setIsModalOpen(true);
    };

    const closeModal = (status = 'Available') => {
        console.log('Close modal status:', status);

        const currentStatus = status === 'UnBlocked' ? 'Blocked' : status;

        if (currentStatus === 'Blocked') {
            setIsModalOpen(true);
            setIsBlockModalOpen(false);
            setSelectedStatus('Available');
            setBlockFormData(defaultBlockValues);
        } else {
            if (selectedStatus === CASE_STATUS.UNAPPOINTED) {
                setSelectedStatus('Available');
                console.log(currentStatus);

                const availableData = selectedAppointments.filter(slot => slot.status === currentStatus);
                setSelectedAppointments(availableData);

                const count = selectedAppointments.length;
                setSelectedAppointmentCounts(count);
                setModalTitle(`${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Appointments ${count}`);
                return; // Do not close the modal if still unappointed
            }

            setSelectedStatus(currentStatus);

            setIsBlockModalOpen(false);
            setIsModalOpen(false);
        }

        setFormErrors({});
    };


    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const footerButtons = [
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: closeModal,
            color: 'bg-red-500',
        }
    ];

    const footerBlockedButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleBlockAppointmentSlot,
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: () => closeModal('Blocked'),
            color: 'bg-red-500',
        }
    ];

    const renderModalContent = () => {
        if (selectedStatus === 'Booked') {
            return (
                <BookedAppointmentModal
                    selectedAppointments={selectedAppointments}
                    selectedStatus={selectedStatus}
                    openModal={openModal}
                    handleUnBlockAppointmentSlot={handleUnBlockAppointmentSlot}
                />
            );
        }

        if (selectedStatus === CASE_STATUS.UNAPPOINTED) {
            return (
                <AppointmentInterface
                    appointment={getSelectedAppointment}
                    closeModal={closeModal}
                    handleConfirmBooking={handleConfirmBooking}
                />
            );
        }

        return (
            <TableData
                selectedAppointments={selectedAppointments}
                selectedStatus={selectedStatus}
                openModal={openModal}
                handleUnBlockAppointmentSlot={handleUnBlockAppointmentSlot}
            />
        );
    };


    const renderBlockedModalContent = () => (
        <div>
            <div className="overflow-x-auto mb-6">
                <div className="grid grid-cols-1 gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <InputField
                            label="Claimant Name / Reference"
                            name="claimant_name_reference"
                            value={blockFormData.claimant_name_reference}
                            onChange={handleInputChange('claimant_name_reference')}
                            errors={formErrors}
                        />
                        <InputField
                            label="Medco Reference"
                            name="medco_reference"
                            value={blockFormData.medco_reference}
                            onChange={handleInputChange('medco_reference')}
                            errors={formErrors}
                        />
                    </div>
                    <InputField
                        label="Note"
                        name="note"
                        value={blockFormData.note}
                        onChange={handleInputChange('note')}
                        errors={formErrors}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className={`${className}`}>

            <CollapsibleSection title="Filter Appointments" defaultOpen={isFilter}>
                <div className="container mx-auto p-2">

                    {/* Progress Bar */}
                    {isLoading && (
                        <div className="relative w-full h-2 mb-4 bg-gray-200 rounded overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-300"
                                style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                            ></div>
                        </div>
                    )}

                    {loading || isLoading ? (
                        <Skeleton count={3} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SelectField
                                    label="Experts"
                                    name="expert"
                                    value={filters.expert}
                                    onChange={handleSelectChange('expert')}
                                    options={dropdownOptions.experts}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <SelectField
                                        label="Appointment Type"
                                        name="appointmentType"
                                        value={filters.appointmentType}
                                        onChange={handleSelectChange('appointmentType')}
                                        options={dropdownOptions.appointmentTypes}
                                    />
                                    <SelectField
                                        label="Report Type"
                                        name="reportType"
                                        value={filters.reportType}
                                        onChange={handleSelectChange('reportType')}
                                        options={dropdownOptions.reportTypes}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <InputField
                                        label="PostCode"
                                        name="postCode"
                                        value={filters.postCode}
                                        onChange={handleSelectChange('postCode')}
                                    />
                                    <InputField
                                        label="City/Town"
                                        name="town"
                                        value={filters.town}
                                        onChange={handleSelectChange('town')}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <DateField
                                        label="Appointment From Date"
                                        name="fromDate"
                                        selected={filters.fromDate}
                                        onChange={(date) => handleDateChange("fromDate", date)}
                                    />
                                    <DateField
                                        label="Appointment To Date"
                                        name="toDate"
                                        selected={filters.toDate}
                                        onChange={(date) => handleDateChange("toDate", date)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <SelectField
                                        label="Show expert within"
                                        name="showExpertWithin"
                                        value={filters.showExpertWithin}
                                        onChange={handleSelectChange('showExpertWithin')}
                                        options={dropdownOptions.showExpertWithin}
                                    />
                                    <SelectField
                                        label="Sort By"
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleSelectChange('sortBy')}
                                        options={dropdownOptions.sortBy}
                                    />
                                </div>

                                <SelectFieldDays
                                    name="days"
                                    value={filters.days || []}
                                    onChange={(vals) => setFilters(prev => ({ ...prev, days: vals }))}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                                >
                                    Filter
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </CollapsibleSection>

            {/* Table Component */}
            <SortableTable columns={columns} data={data}
                loading={loading || isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                handlePageChange={handlePageChange} />

            <Modal isOpen={isModalOpen} onClose={() => closeModal()} title={modalTitle} size="custom"
                customWidth={selectedStatus !== 'Booked' ? '1100px' : '1500px'} footer={footerButtons}
            >
                {renderModalContent()}
            </Modal>

            <Modal isOpen={isBlockModalOpen} onClose={() => closeModal('Blocked')} title={modalBlockTitle} size="custom"
                customWidth='500px' footer={footerBlockedButtons}
            >
                {renderBlockedModalContent()}
            </Modal>

        </div>
    );


};


export default Appointments;
