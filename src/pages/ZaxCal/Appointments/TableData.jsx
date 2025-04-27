import { Navigate, useNavigate } from "react-router-dom";
import SortableTable from "../../../components/SortableTable";
import { CASE_STATUS } from "../../../constants";
import { venueDetailsInline } from "../Venues/venueHelpers";
import { goToBookAppointment } from "../../../utilities/navigationUtils";

export default function TableData({
    selectedAppointments,
    selectedStatus,
    handleUnBlockAppointmentSlot,
    openModal,
}) {

    const navigate = useNavigate();

    const handleBooking = (appointment) => {
        goToBookAppointment(navigate, appointment);
    };

    const renderActionButtons = (appointment) => {
        return (
            <>
                <div className="inline-flex flex-col md:flex-row md:items-center text-center gap-2">

                    <label
                        onClick={() => openModal(CASE_STATUS.UNAPPOINTED, selectedAppointments, appointment)}
                        className="text-green-600 border truncate border-green-600 px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-green-600 hover:text-white transition-all"
                    >
                        Book Appointment
                    </label>

                    <label
                        onClick={() => handleBooking(appointment)}
                        className="text-blue-600 border truncate border-blue-600 px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
                    >
                        Book Appointment - New Case
                    </label>

                    {selectedStatus === 'UnBlocked' ? (
                        <label title={appointment.expert_name}
                            onClick={() => handleUnBlockAppointmentSlot(appointment)}
                            className="text-red-600 border truncate border-red-600 px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-red-600 hover:text-white transition-all"
                        >
                            (Unblock) Appointment
                        </label>
                    ) : (
                        <label
                            onClick={() => openModal('Blocked', selectedAppointments, appointment)}
                            className="text-red-600 border truncate  border-red-600 px-3 py-1.5 rounded-md text-xs cursor-pointer hover:bg-red-600 hover:text-white transition-all"
                        >
                            Block Appointment
                        </label>
                    )}

                </div>
            </>
        );
    };

    // Column definitions
    const columns = [
        // { key: 'number', label: '#' },
        { key: 'Time', label: 'Time', align: 'center' },
        { key: 'Duration', label: 'Duration', align: 'center' },
        { key: 'Venue', label: 'Venue Details', align: 'center' },
        { key: 'Action', label: 'Action', align: 'center' },
    ];

    const data = selectedAppointments.map(appointment => ({
        id: appointment.id,
        Time: appointment.formatted_time,
        Duration: `{${appointment.duration} Mins}`,
        Venue: venueDetailsInline(appointment?.venue, '', 'center'),
        Action: renderActionButtons(appointment),
    }));


    return (

        <SortableTable columns={columns} data={data} />

    );
}
