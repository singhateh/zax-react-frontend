import React, { useEffect, useState } from 'react';
import SortableTable from '../../components/SortableTable';
import SlotForm from './Slots/SlotForm';
import { PlusSquareIcon, SaveIcon, X } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Slots = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [experts, setExperts] = useState([]);
    const [venues, setVenues] = useState([]);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [reportTypes, setReportTypes] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);

    const columns = [
        { key: 'venueName', label: 'Venue Name' },
        { key: 'appointmentType', label: 'Appointment Type' },
        { key: 'service', label: 'Service' },
        { key: 'date', label: 'Date' },
        { key: 'availableAppointments', label: 'Available' },
        { key: 'bookedAppointments', label: 'Booked' },
        { key: 'blockedAppointments', label: 'Blocked' },
        { key: 'time', label: 'Time' },
        { key: 'action', label: 'Actions' },
    ];


    const formatSlotData = (slot) => {
        const badgeStyle = (color) =>
            `inline-block px-2 py-1 text-xs font-semibold text-white rounded-full bg-${color}-500`;

        return {
            id: slot.id,
            venueName: slot.venue_name,
            appointmentType: slot.appointment_type,
            service: slot.report_type_name,

            // Display date and day nicely
            date: (
                <div className="text-sm">
                    <div className="font-medium">{slot.slot_date}</div>
                    <div className="text-gray-500 text-xs">{slot.slot_day}</div>
                </div>
            ),

            // Show badge-style availability values
            availableAppointments: (
                <span className={badgeStyle("green")}>
                    {slot.available ?? 0}
                </span>
            ),
            bookedAppointments: (
                <span className={badgeStyle("blue")}>
                    {slot.booked ?? 0}
                </span>
            ),
            blockedAppointments: (
                <span className={badgeStyle("red")}>
                    {slot.blocked ?? 0}
                </span>
            ),

            // Times
            time: (
                <div className="text-sm text-gray-700">{slot.formatted_time}</div>
            ),

            // Action buttons
            action: (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEditSlot(slot)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ),
        };
    };


    const fetchSlots = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get('doctor/slots', {
                params: { page, limit: itemsPerPage },
            });
            const slotData = response.data.slots.map(formatSlotData);

            if (!experts.length) {
                setExperts(response.data.experts);
            }
            if (!venues.length) {
                setVenues(response.data.venues);
            }

            if (!appointmentTypes.length) {
                setAppointmentTypes(response.data.appointmentTypes);
            }

            if (!reportTypes.length) {
                setReportTypes(response.data.reportTypes);
            }

            setSlots((prevSlots) => [...prevSlots, ...slotData]);
            setTotalPages(response.data.pagination.total_pages);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSlots(currentPage); // Fetch venues for the current page
    }, [currentPage]);


    const handleAddSlot = () => {
        setModalOpen(true);
        setSelectedSlot(null);
    };


    const handleEditSlot = (slot) => {
        setSelectedSlot(null);

        setTimeout(() => {
            setSelectedSlot(slot);
            setModalOpen(true);
        }, 0);
    };


    const handleDeleteSlot = (slotId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Make API call to delete the venue
                    await api.delete(`doctor/slots/${slotId}`);

                    setSlots((prevSlots) => {
                        const updatedSlots = prevSlots.filter((slot) => slot.id !== slotId);
                        console.log(updatedSlots);
                        return updatedSlots;
                    });

                    // Swal.fire('Deleted!', 'Your slot has been deleted.', 'success');
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Slot deleted successfully!',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                } catch (error) {
                    console.error('Error deleting slot:', error);
                    Swal.fire('Failed!', 'There was an issue deleting the slot.', 'error');
                }
            }
        });
    };


    const handleDeleteMultiple = (selectedIds) => {
        // Show confirmation dialog using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Optionally, make an API call to delete rows from the backend
                    // const response = await api.delete('/delete-items', { data: { ids: selectedIds } });

                    // For the sake of this example, I'm deleting rows from local state
                    const updatedData = slots.filter(item => !selectedIds.includes(item.id));

                    // Update the state with the new filtered data
                    setSlots(updatedData);

                    // Show success notification using SweetAlert
                    Swal.fire(
                        'Deleted!',
                        'Your selected items have been deleted.',
                        'success'
                    );
                } catch (error) {
                    // Show error notification using SweetAlert
                    console.error('Error deleting items:', error);
                    Swal.fire(
                        'Failed!',
                        'There was an issue deleting the items.',
                        'error'
                    );
                }
            }
        });
    };



    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const footerButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: () => "",
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: () => setModalOpen(false),
            color: 'bg-red-500',
        }
    ];

    return (
        <div className="container1 mx-auto p-6 mt-20 w-full">
            <button
                onClick={handleAddSlot}
                className="mb-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Create New Slot
            </button>
            <SortableTable
                columns={columns}
                data={slots}
                checkboxColumn={true}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                handlePageChange={handlePageChange}
                handleDeleteMultiple={handleDeleteMultiple}
            />
            <SlotForm isOpen={isModalOpen} onClose={() => setModalOpen(false)}
                experts={experts}
                venues={venues}
                formatSlotData={formatSlotData}
                appointmentTypes={appointmentTypes}
                reportTypes={reportTypes}
                title={'Create new slot'} footerButtons={footerButtons}
                setSlots={setSlots}
                slot={selectedSlot} />
        </div>
    );
};

export default Slots;
