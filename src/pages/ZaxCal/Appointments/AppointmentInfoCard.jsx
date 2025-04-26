import React from "react";

const AppointmentInfoCard = ({ appointment }) => {
    if (!appointment) return null;

    return (
        <div className="bg-white p-4 mb-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Appointment Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-xs text-gray-600">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-500">Date</span>
                    <span className="font-semibold text-gray-800">{appointment.slot_date}</span>
                </div>
                <div className="flex flex-col lg:col-span-2">
                    <span className="font-medium text-gray-500">Venue</span>
                    <span className="font-semibold text-gray-800">{appointment.venue_name}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-500">Start</span>
                    <span className="font-semibold text-gray-800">{appointment.start_time}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-500">End</span>
                    <span className="font-semibold text-gray-800">{appointment.end_time}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-800">{appointment.duration} mins</span>
                </div>
            </div>
        </div>
    );
};

export default AppointmentInfoCard;
