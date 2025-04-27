import { useNavigate } from "react-router-dom";
import SortableTable from "../../../components/SortableTable";
import { AccidentDetailInfo, AppointmentSlotDetail, CaseActions, CaseInfo, Claimant, DnaLateCancellationActions, Instructor, ZaxId } from "../ManageCase/CaseIcons";
import { venueDetailsInline } from "../Venues/venueHelpers";

export default function BookedAppointmentModal({
    selectedAppointments,
}) {

    const navigate = useNavigate();  // useNavigate hook inside the component

    // Column definitions
    const columns = [
        { key: 'number', label: 'Zax ID' },
        { key: 'Instructor', label: 'Instructor', align: 'center' },
        { key: 'name', label: 'Claimant Name', align: 'center' },
        { key: 'ReportDoc', label: 'Report / Doc', sortable: true },
        { key: 'Appointment', label: 'Appointment', align: 'center' },
        { key: 'Venue', label: 'Venue', align: 'center' },
        { key: 'Info', label: 'Info', align: 'center' },
        { key: 'DnaLc', label: 'DNA / LC', align: 'center' },
        { key: 'Action', label: 'Action', align: 'center' },
    ];

    const data = selectedAppointments.map(appointment => ({
        id: appointment.id,
        number: <ZaxId caseData={appointment.instruct_case} />,
        Instructor: <Instructor caseData={appointment.instruct_case} />,
        name: <Claimant caseData={appointment.instruct_case} />,
        ReportDoc: <AccidentDetailInfo caseData={appointment.instruct_case} />,
        Appointment: <AppointmentSlotDetail caseData={appointment.instruct_case} />,
        Venue: venueDetailsInline(appointment?.venue, '', 'center'),
        Info: <CaseInfo caseData={appointment.instruct_case} />,
        DnaLc: <DnaLateCancellationActions caseData={appointment.instruct_case} navigate={navigate} />,
        Action: <CaseActions caseData={appointment.instruct_case} navigate={navigate} />,

        // childData: appointment.appointmentAvailableSlots.map(child => ({
        //     id: child.id,
        //     name: child.name,
        //     age: child.age,
        //     email: child.email,
        // })),
    }));

    return (

        <SortableTable columns={columns} data={data}
        // loading={loading}
        // currentPage={currentPage}
        // totalPages={totalPages}
        // itemsPerPage={itemsPerPage}
        // handlePageChange={handlePageChange} 
        />

    );
}
