import React from 'react';
import dayjs from 'dayjs';
import ActionDropdown from './ActionDropdown';
import { FaCalendarAlt, FaEdit, FaFilePdf, FaShapes, FaTrashAlt, FaClock, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Tooltip } from "react-tooltip";
import { CASE_STATUS } from '../../../constants';
import { goToEditCase } from '../../../utilities/navigationUtils';

export const ZaxId = ({ caseData, index }) => {
    if (!caseData) return null;

    const {
        id,
        number,
        medco_reference,
        medco_instruction_received_date,
        goToCaseDetail,
    } = caseData;

    return (
        <div>
            <span
                className={`toggleIcon details-control${index} fa ${id == null ? 'fa-minus-square' : 'fa-plus-square'
                    } pointer text-orange`}
                onClick={() => window.dataTableChildRow && window.dataTableChildRow()}
            ></span>

            <strong>
                <a
                    className="link"
                    data-bs-toggle="tooltip"
                    title="Show Info"
                    href={typeof goToCaseDetail === 'function' ? goToCaseDetail() : '#'}
                >
                    {number}
                </a>
            </strong>

            <br />({medco_reference})

            <br />
            <small
                data-bs-toggle="tooltip"
                className="text-orange"
                title="Medico Instruction Receive Date"
            >
                (MIRD: {medco_instruction_received_date})
            </small>
        </div>
    );
};

export const Claimant = ({ caseData }) => {
    if (!caseData) return null;

    const {
        full_name_title = '',
        full_gender = '',
        dob = '',
        mobile = '',
        is_re_examine,
    } = caseData;

    const reExamineLabel = is_re_examine === 1 ? 'Re-Examine' : '';

    return (
        <div className="text-sm space-y-1 break-words">
            <div className="font-semibold text-gray-800">
                {full_name_title} <span className="text-gray-600">{full_gender}</span>
            </div>
            <div className="text-gray-500">
                ({dob} - {mobile})
            </div>
            {reExamineLabel && (
                <div className="text-red-500 text-xs font-medium">
                    {reExamineLabel}
                </div>
            )}
        </div>
    );
};


export const Instructor = ({ caseData }) => {
    if (!caseData) return null;

    const { level_id, solicitor, agency, instructing_party, instruction_received_date, solicitor_reference, agency_reference, instructing_party_reference } = caseData;

    let instructors = null;

    if (level_id === 1) {
        instructors = (
            <div>
                <strong>{solicitor?.company_name}</strong>
                <br />
                <span className="text-gray-600">({solicitor_reference})</span>
                <br />
                <small className="text-orange-500" data-bs-toggle="tooltip" title="Medico Instruction Receive Date">
                    ( IRD: {instruction_received_date} )
                </small>
            </div>
        );
    } else if (level_id === 2) {
        instructors = (
            <div>
                <strong>{agency?.company_name}</strong>
                <br />
                <span className="text-gray-600">({agency_reference})</span>
            </div>
        );
    } else if (level_id === 3) {
        instructors = (
            <div>
                <strong>{instructing_party}</strong>
                <br />
                <span className="text-gray-600">({instructing_party_reference})</span>
            </div>
        );
    } else {
        instructors = ''; // Default value
    }

    return <div>{instructors}</div>;
};


export const CaseInfo = ({ caseData = {}, caseKey }) => {
    if (!caseData) return null;

    const {
        consulting_type,
        is_link,
        case_status,
        medicalRecord,
        has_all_medical_records_arrived_count,
        is_sms_sent,
        mobile,
        printed_status,
        appointment_slot,
        daysBeforeAppointments,
    } = caseData;

    const icons = [];

    // Consulting Type Icon
    icons.push(
        <span
            key="consulting"
            className={`w-[25px] mb-1 ${consulting_type === 'Face2Face' ? 'text-blue-500' : 'text-green-500'}`}
            title={consulting_type === 'Face2Face' ? 'Face to Face' : 'Video - Telephone'}
        >
            {consulting_type === 'Face2Face' ? '📞' : '💻'}
        </span>
    );

    // Linked Case Icon
    if (is_link) {
        icons.push(
            <span
                key="linked"
                className="w-[20px] cursor-pointer text-blue-500"
                title="Linked Case"
                onClick={() => window.openDnaRecord(caseKey)}
            >
                🔗
            </span>
        );
    }

    // DNA Details Icon
    if (case_status === CASE_STATUS.DNA) {
        icons.push(
            <span
                key="dna"
                className="w-[20px] cursor-pointer text-orange-500"
                title="View DNA Details"
                onClick={() => window.openDnaRecord(caseKey)}
            >
                🧬
            </span>
        );
    }

    // Medical Records Icon
    if (medicalRecord) {
        icons.push(
            <span
                key="medical"
                className="w-[15px]"
                title={has_all_medical_records_arrived_count > 0 ? 'Pending Medical Records' : 'All Medical Records Received'}
            >
                {has_all_medical_records_arrived_count > 0 ? '⏳' : '✅'}
            </span>
        );
    }

    // SMS Sent Icon
    icons.push(
        <span
            key="sms"
            className="w-[15px]"
            title={`SMS @ Appointment ${is_sms_sent ? 'Sent' : 'Pending'} to Claimant (${mobile})`}
        >
            {is_sms_sent ? '📲' : '📩'}
        </span>
    );

    // Print Status Icon
    icons.push(
        <span
            key="print"
            className="w-[15px]"
            title={printed_status === 'Printed' ? 'Printed Success' : 'Pending'}
        >
            {printed_status === 'Printed' ? '✅' : '⏳'}
        </span>
    );

    // Overdue Icon
    if (!appointment_slot && daysBeforeAppointments > 10) {
        icons.push(
            <span
                key="overdue"
                className="w-[15px] text-red-500"
                title="Appointment Overdue"
            >
                ⏰
            </span>
        );
    }

    return (
        <div className="flex gapx-2 flex-wrap items-center">
            {icons.map((icon, idx) => (
                <span key={idx} className="tooltip">
                    {icon}
                </span>
            ))}
        </div>
    );
};


export const DnaLateCancellationActions = ({ caseData, navigate }) => {
    if (!caseData) return null;

    const {
        is_re_instruct,
        status,
        appointment_slot,
        appointment_slot_count,
        case_status,
        is_report,
        id,
    } = caseData;

    const isReinstructed = is_re_instruct === 1 || is_re_instruct === 'Yes';
    const today = dayjs().format('YYYY-MM-DD');
    const slotDate = appointment_slot ? dayjs(appointment_slot.slot_date).format('YYYY-MM-DD') : null;

    return (
        <div className="flex flex-col items-start gap-1 w-full">
            {isReinstructed && <span className="text-gray-600 text-xs">Reinstructed</span>}

            {status === CASE_STATUS.APPOINTED && appointment_slot && appointment_slot_count > 0 && (
                <>
                    {(dayjs(today).isAfter(slotDate) || dayjs(today).isSame(slotDate)) && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 w-full truncate">
                            {case_status !== CASE_STATUS.DNA && is_report === 'No' && (
                                <button
                                    className="inline-flex items-center justify-center px-2 py-1 bg-white border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs"
                                    title="Record DNA / Late Cancellation"
                                    onClick={() =>
                                        window.globalStatus({
                                            case_id: id,
                                            status: CASE_STATUS.DNA,
                                            reason: 'Reason for Did Not Attend!',
                                            section: 'claimantConfirmationSection',
                                            confirmation: 'Please double-check and confirm the confirmation.',
                                            title: 'Record DNA / Late Cancellation',
                                        })
                                    }
                                >
                                    <span className="mr-1 text-xs">📝</span>
                                    Record DNA
                                </button>
                            )}

                            {status !== CASE_STATUS.UNAPPOINTED && is_report === 'No' && (
                                <button
                                    className="inline-flex items-center justify-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                                    onClick={() => goToEditCase(navigate, caseData)}
                                >
                                    Create Report
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {!(status === CASE_STATUS.APPOINTED && appointment_slot && appointment_slot_count > 0) && (
                <span className={`text-xs font-medium ${status === CASE_STATUS.CANCELLED ? 'text-red-500' : 'text-blue-500'
                    } uppercase`}>
                    {status}
                </span>
            )}
        </div>
    );
};

export const DobOrReportType = ({ caseData, buttonAction }) => {

    if (!caseData) return null;


    const reportType = caseData?.report_type?.name || '';
    const reportCode = caseData?.medicalReportCode || '';
    const accidentDate = caseData?.accident_date;

    if (buttonAction === 'View') {
        return (
            <div>
                <strong>
                    {reportType}
                    <br />
                    <a className="underline cursor-pointer">{reportCode}</a>
                </strong>
            </div>
        );
    } else {
        return (
            <div>
                <strong>
                    <a
                        title="Show Accident Details"
                        className="text-blue-600 underline"
                        href={caseData?.goToAccidentDetail()}
                    >
                        {accidentDate ? dayjs(accidentDate).format('DD/MM/YYYY') : ''}
                    </a>
                </strong>
                <br />
                <small className="text-orange pl-4">{caseData?.slaType}</small>
            </div>
        );
    }
};

export const DaysOrVenue = ({ caseData, buttonAction }) => {

    if (!caseData) return null;

    if (buttonAction === 'View') {
        const venue = caseData?.appointment_slot?.venue;
        return (
            <div>
                <strong>
                    {venue?.consulting_venue}
                    <br />
                    <small>{venue?.town}</small>
                    <br />
                    <small>
                        {venue?.town} - {venue?.postcode}
                    </small>
                </strong>
                <br />
            </div>
        );
    } else {
        return (
            <div>
                <small title="Total number of days the case was unappointed">
                    <strong>UNP - {caseData?.daysWhenCaseUnAppointed}</strong>
                </small>
                <br />
                {caseData?.status !== CASE_STATUS.UNAPPOINTED && (
                    <small title="Total number of days the case was appointed">
                        <strong>APP - {caseData?.daysWhenCaseAppointed}</strong>
                    </small>
                )}
                <br />
                <small title="Total number of days the case has been in the system">
                    <strong>TOT - {caseData?.daysOfCaseCreated}</strong>
                </small>
                <br />
                <small title="Number of days it has taken from the Appointment date to receive the Report">
                    <strong>AP-RR - {caseData?.daysBeforeAppointments}</strong>
                </small>
            </div>
        );
    }
};


export const AppointmentSlotDetail = ({ caseData }) => {

    if (!caseData) return null;


    const slot = caseData?.appointment_slot;
    const venue = slot?.venue;

    console.log(caseData?.appointment_slot);

    const tooltip = venue
        ? `${venue.consulting_venue}, ${venue.town} ${venue.postcode}`
        : "";

    const slotDate = slot?.slot_date
        ? new Date(slot.slot_date).toLocaleDateString("en-GB")
        : "-";

    const slotTime = slot?.appointment_start_time || "-";

    const reportType = caseData?.report_type_name || "";

    return (
        <div className="space-y-2 text-sm truncate">
            {slot && (
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <a
                        href={caseData.goToAccidentDetail}
                        // title={tooltip}
                        className="text-blue-600 font-semibold underline decoration-dotted hover:text-blue-700 transition"
                        data-tooltip-id={tooltip ? `slot-tooltip-${caseData.id}` : undefined}
                    >
                        {slotDate} @ {slotTime}
                    </a>
                    {tooltip && (
                        <Tooltip id={`slot-tooltip-${caseData.id}`} place="top">
                            {tooltip}
                        </Tooltip>
                    )}
                </div>
            )}

            {reportType && (
                <div className="text-orange-600 pl-6 italic">
                    ({reportType})
                </div>
            )}

            {/* {slot && venue && (
                <div className="flex items-center gap-2 text-gray-600 pl-6 truncate">
                    <FaMapMarkerAlt />
                    <span className="truncate">
                        {venue.consulting_venue}, {venue.town}, {venue.postcode}
                    </span>
                </div>
            )} */}
        </div>
    );

};


export const AccidentDetailInfo = ({ caseData }) => {

    if (!caseData) return null;


    const accidentDate = caseData?.accident_date
        ? new Date(caseData.accident_date).toLocaleDateString('en-GB')
        : '-';

    const slaType = caseData?.slaType?.() || '';

    return (
        <div className="space-y-1 text-sm truncate">
            <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                <a
                    href={caseData?.goToAccidentDetail}
                    data-tooltip-id={`accident-tooltip-${caseData?.id}`}
                    // title="Show Accident Details"
                    className="text-blue-600 font-semibold underline decoration-dotted hover:text-blue-700 transition"
                >
                    {accidentDate}
                </a>
                <Tooltip id={`accident-tooltip-${caseData?.id}`} place="top">
                    Show Accident Details
                </Tooltip>
            </div>

            {slaType && (
                <div className="text-orange-600 pl-6 italic">
                    ({slaType})
                </div>
            )}
        </div>
    );
};



export const CaseTimingStats = ({ caseData }) => {

    if (!caseData) return null;

    const unappointedDays = caseData?.daysWhenCaseUnAppointed?.() ?? '-';
    const appointedDays = caseData?.status !== CASE_STATUS.UNAPPOINTED
        ? caseData?.daysWhenCaseAppointed?.()
        : null;
    const totalDays = caseData?.daysOfCaseCreated?.() ?? '-';
    const appointmentToReportDays = caseData?.daysBeforeAppointments?.() ?? '-';

    return (
        <div className="space-y-1 text-sm text-gray-700 truncate">
            <div className="flex items-center gap-2">
                <FaClock className="text-gray-500" />
                <span
                    data-tooltip-id={`tooltip-unp-${caseData?.id}`}
                    className="font-semibold"
                >
                    UNP - {unappointedDays}
                </span>
                <Tooltip id={`tooltip-unp-${caseData?.id}`}>
                    Total number of days the case was unappointed
                </Tooltip>
            </div>

            {appointedDays !== null && (
                <div className="flex items-center gap-2 pl-6">
                    <span
                        data-tooltip-id={`tooltip-app-${caseData?.id}`}
                        className="font-semibold"
                    >
                        APP - {appointedDays}
                    </span>
                    <Tooltip id={`tooltip-app-${caseData?.id}`}>
                        Total number of days the case was appointed
                    </Tooltip>
                </div>
            )}

            <div className="flex items-center gap-2 pl-6">
                <span
                    data-tooltip-id={`tooltip-tot-${caseData?.id}`}
                    className="font-semibold"
                >
                    TOT - {totalDays}
                </span>
                <Tooltip id={`tooltip-tot-${caseData?.id}`}>
                    Total number of days the case has been in the system
                </Tooltip>
            </div>

            <div className="flex items-center gap-2 pl-6">
                <span
                    data-tooltip-id={`tooltip-aprr-${caseData?.id}`}
                    className="font-semibold"
                >
                    AP-RR - {appointmentToReportDays}
                </span>
                <Tooltip id={`tooltip-aprr-${caseData?.id}`}>
                    Number of days from the Appointment date to receiving the Report
                </Tooltip>
            </div>
        </div>
    );
};



export const CaseActions = ({ caseData, navigate }) => {

    if (!caseData) return null;


    const goToCaseDetail = () => {
        // Logic for going to the case detail page
        console.log('Navigating to Case Detail...');
        // Example redirect logic
        // history.push(`/case-detail/${caseData.id}`);
    };

    const goToCreateLetter = () => {
        // Logic for creating a letter
        console.log('Creating Letter...');
        // Example redirect logic
        // history.push(`/create-letter/${caseData.id}`);
    };

    const goToBookAppointment = () => {
        // Logic for booking an appointment
        console.log('Booking Appointment...');
        // Example redirect logic
        // history.push(`/book-appointment/${caseData.id}`);
    };

    // Destructuring the caseData object
    const { status } = caseData;

    const title = status === CASE_STATUS.DNA ? 'Re Book an Appointment' : 'Book an Appointment';

    let actions = '';
    if (status === CASE_STATUS.APPOINTED) {
        const view = sessionStorage.getItem('buttonAction');
        const isCSV = sessionStorage.getItem('isCSV');

        actions = (
            <div className="btn-group flex gap-2">
                <button
                    onClick={() => goToEditCase(navigate, caseData)}
                    title="Edit Case"
                    className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-md p-2 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-600 hover:text-blue-500 focus:text-blue-500"
                >
                    <FaEdit size={16} />
                </button>

                <button
                    onClick={goToCaseDetail}
                    title="Show Case Details"
                    className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-md p-2 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-600 hover:text-red-500 focus:text-red-500"
                >
                    <FaTrashAlt size={16} />
                </button>

                {/* Check condition for creating letter and booking appointment */}
                {isCSV ? null : view !== 'View' && status !== CASE_STATUS.APPOINTED && (
                    <>
                        <button
                            onClick={goToCreateLetter}
                            title="Create Letter"
                            className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-md p-2 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-600 hover:text-green-500 focus:text-green-500"
                        >
                            <FaFilePdf size={16} />
                        </button>

                        <button
                            onClick={goToBookAppointment}
                            title="Book Appointment"
                            className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-md p-2 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-600 hover:text-yellow-500 focus:text-yellow-500"
                        >
                            <FaShapes size={16} />
                        </button>
                    </>
                )}

                {/* Render additional component if not CSV */}
                {!isCSV && <ActionDropdown data={caseData} navigate={navigate} />}
            </div>
        );

    } else {
        actions = (
            <div className="btn-group flex gap-2">
                <button
                    onClick={goToBookAppointment}
                    data-toggle="tooltip"
                    title={title}
                    className="bg-gray-100 hover:bg-gray-200 px-4 rounded-sm dropdown-item mr-2 d-flex flex-column align-items-center justify-content-center wd-10 ht-30"
                >
                    <FaCalendarAlt size={16} className="text-gray-600 group-hover:text-blue-500" />
                </button>
                <button
                    onClick={goToEditCase(navigate, caseData)}
                    className="bg-gray-100 hover:bg-gray-200 px-4 rounded-sm dropdown-item d-flex flex-column align-items-center justify-content-center wd-10 ht-30"
                >
                    <FaEdit size={16} className="text-gray-600 group-hover:text-blue-500" />
                </button>
            </div>
        );
    }

    return actions;
};


