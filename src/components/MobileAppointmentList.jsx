import { useState } from 'react';
import { ViewIcon, BedSingleIcon, TimerResetIcon } from 'lucide-react';
import CustomCheckbox from './CustomCheckbox';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MobileAppointmentList = ({ filteredAppointments, ...props }) => {
    const [expandedCard, setExpandedCard] = useState(null);

    const isMobile = useMediaQuery('(max-width: 768px)');

    const toggleExpand = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <div className="space-y-3 md1:hidden">
            {filteredAppointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className={`bg-white rounded-lg shadow-sm border ${props.appointmentStatus(appointment)} p-3`}
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                            {appointment.status === 'Available' && (
                                <CustomCheckbox
                                    id={`checkbox-${appointment.id}`}
                                    isChecked={props.selectedAppointments.includes(appointment.id)}
                                    onChange={() => props.handleSelectAppointment(appointment.id)}
                                    className="shrink-0"
                                />
                            )}
                            <div>
                                <p className="font-medium text-sm">
                                    {appointment.start_time} - {appointment.end_time}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {props.slot.appointment_type} • {appointment.duration} Mins
                                </p>
                            </div>
                        </div>

                        <span className={`px-2 py-1 rounded-md text-xs ${appointment.status === 'Active' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {appointment.status}
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className="mt-2">
                        <p className="text-sm">
                            {props.slot.slot_date} • {props.slot.venue_name}
                        </p>

                        {appointment.instruct_case && (
                            <div className="mt-2 text-sm">
                                <p>{appointment.claimant_name} ({appointment.claimant_gender})</p>
                                <p className="text-gray-600">{appointment.agency_company}</p>
                                <p className="text-gray-600">Mobile: {appointment.claimant_mobile}</p>
                            </div>
                        )}
                    </div>

                    {/* Expandable Details */}
                    {expandedCard === appointment.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Type</p>
                                    <p>{appointment.type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Available</p>
                                    <p>{props.slot.slot_day}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-3 flex justify-between items-center">
                        <button
                            onClick={() => toggleExpand(appointment.id)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                        >
                            {expandedCard === appointment.id ? 'Show Less' : 'Show More'}
                        </button>

                        <div className="flex space-x-2">
                            {/* View Button */}
                            <button
                                className={`p-1.5 rounded-md ${appointment.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}
                                onClick={() => props.handleShowSlot(appointment)}
                            >
                                <ViewIcon className="w-4 h-4" />
                            </button>

                            {/* Conditionally show other buttons */}
                            {!appointment.instruct_case && (
                                <>
                                    <button
                                        className={`p-1.5 rounded-md ${appointment.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                            }`}
                                        onClick={() => props.handleInstructAndBookAppointment(appointment.status)}
                                    >
                                        <BedSingleIcon className="w-4 h-4" />
                                    </button>

                                    {appointment.status === 'Inactive' && (
                                        <button
                                            className="p-1.5 rounded-md bg-red-100 text-red-600"
                                            onClick={() => props.handleInstructAndBookAppointment(appointment.status)}
                                        >
                                            <TimerResetIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// For desktop, keep your original table but hide on mobile
const ResponsiveAppointmentTable = ({ filteredAppointments, isModalExpanded, props }) => {

    const isMobile = useMediaQuery('(max-width: 768px)');

    // alert(isModalExpanded)
    return (
        <>
            {/* Mobile View */}
            {/* Always show card list on mobile */}
            {isMobile && <MobileAppointmentList filteredAppointments={filteredAppointments} {...props} />}

            {/* Desktop View */}
            {/* On desktop: show table when expanded, card list when not expanded */}
            {!isMobile && (
                <>
                    {isModalExpanded ? (
                        <div className1="hidden md:block">
                            {filteredAppointments.length > 0 ? (
                                <table className="w-full table-auto mt-4 border-separate1 border-spacing-1.2 text-left">
                                    <thead className="bg-blue-200">
                                        <tr>
                                            <th className="p-2 text-xs text-gray-700">
                                                <CustomCheckbox
                                                    id="select-all"
                                                    isChecked={props.isAllSelected}
                                                    onChange={props.handleSelectAll}
                                                />
                                            </th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Start Time</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">End Time</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Date</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Duration</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Type</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Details</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Venue</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Available</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Status</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Duplicate</th>
                                            <th className="text-xs font-medium text-gray-700 p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appointment) => (
                                            <tr
                                                key={appointment.id}
                                                className={`group ${props.appointmentStatus(appointment)} ${props.appointmentStatusHover(appointment)}`}>
                                                <td className="p-2 text-gray-800 text-xs">
                                                    {appointment.status === 'Available' && (
                                                        <CustomCheckbox
                                                            id={`checkbox-${appointment.id}`}
                                                            isChecked={props.selectedAppointments.includes(appointment.id)}
                                                            onChange={() => props.handleSelectAppointment(appointment.id)}
                                                            label={appointment.name} // Assuming each appointment has a `name`
                                                        />
                                                    )}
                                                </td>
                                                <td className="p-2 text-gray-800 text-xs">{appointment.start_time}</td>
                                                <td className="p-2 text-gray-800 text-xs">{appointment.end_time}</td>
                                                <td className="p-2 text-gray-800 text-xs">{props.slot.slot_date}</td>
                                                <td className="p-2 text-gray-800 text-xs">{appointment.duration} Mins</td>
                                                <td className="p-2 text-gray-800 text-xs">{props.slot.appointment_type}</td>
                                                <td className="p-2 text-gray-800 text-xs">
                                                    {appointment.instruct_case ? (
                                                        <>
                                                            {appointment.claimant_name} &nbsp;
                                                            {appointment.claimant_gender} <br />
                                                            <small className="text-marong">
                                                                {appointment.agency_company} - [{appointment.agency_number}]
                                                            </small>
                                                            <br />
                                                            <small className="text-orange">
                                                                (Mobile: {appointment.claimant_mobile})
                                                            </small>
                                                        </>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="p-2 text-gray-800 text-xs">{props.slot.venue_name}</td>
                                                <td className="p-2 text-gray-800 text-xs">{props.slot.slot_day}</td>
                                                <td className="p-2 text-gray-800 text-xs">
                                                    <span
                                                        className={`p-1 rounded-md text-white ${appointment.status === 'Active' ? 'bg-green-500' : appointment.status === 'Inactive' ? 'bg-red-500' : 'bg-gray-500'} text-center w-full`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-gray-800 text-xs">{appointment.type}</td>
                                                <td className="p-2 text-gray-800 text-xs flex gap-2 justify-center">
                                                    {/* View Appointment Button */}
                                                    {!appointment.instruct_case ? (
                                                        <>
                                                            <button
                                                                className={`p-1 cursor-pointer rounded-md text-white ${appointment.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-600 transition-colors`}
                                                                onClick={() => props.handleShowSlot(appointment)}
                                                            >
                                                                <ViewIcon className="w-4 h-4" /> {/* Smaller icon size */}
                                                            </button>

                                                            {/* Bed Appointment Button */}
                                                            <button
                                                                className={`p-1 cursor-pointer rounded-md text-white ${appointment.status === 'Active' ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600 transition-colors`}
                                                                onClick={() => props.handleInstructAndBookAppointment(appointment.status)}
                                                            >
                                                                <BedSingleIcon className="w-4 h-4" /> {/* Smaller icon size */}
                                                            </button>

                                                            {/* Reset Timer Button */}
                                                            <button
                                                                className={`p-1 cursor-pointer rounded-md text-white ${appointment.status === 'Inactive' ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-600 transition-colors`}
                                                                onClick={() => props.handleInstructAndBookAppointment(appointment.status)}
                                                            >
                                                                <TimerResetIcon className="w-4 h-4" /> {/* Smaller icon size */}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className={`p-1 cursor-pointer rounded-md text-white ${appointment.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-600 transition-colors`}
                                                            onClick={() => props.handleShowSlot(appointment)}
                                                        >
                                                            <ViewIcon className="w-4 h-4" /> {/* Smaller icon size */}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No appointments found.</p>
                            )}
                        </div>
                    ) : (
                        <MobileAppointmentList filteredAppointments={filteredAppointments} {...props} />
                    )}
                </>
            )}

        </>
    );
};

export default ResponsiveAppointmentTable;