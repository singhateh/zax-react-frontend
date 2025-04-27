import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FilterIcon, Search, SearchIcon, X } from 'lucide-react';

const AppointmentBookPage = () => {
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [duration, setDuration] = useState('');
    const [venue, setVenue] = useState(null);
    const [showSearchFilters, setShowSearchFilters] = useState(false);

    const venueOptions = [
        { value: 'birmingham', label: 'Holiday Inn Express Birmingham - Bordesley' },
        { value: 'manchester', label: 'Manchester Venue' },
    ];

    const dummyData = [
        { id: 'INV3724', instructor: 'UK Independent Medical', claimant: 'John Smith', expert: 'Dr. Jane Doe', instructions: 'N/A' },
        { id: 'INV3725', instructor: 'Premex Services Ltd', claimant: 'Alice Parker', expert: 'Dr. Alan Cox', instructions: 'Wheelchair Access' },
    ];

    const searchFields = [
        { name: 'Zax ID', type: 'text' },
        { name: 'Medco Reference', type: 'text' },
        { name: 'Case Type', type: 'select', options: ['~Please Select~', 'Case 1', 'Case 2'] },
        { name: 'Report Type', type: 'select', options: ['~Please Select~', 'Report 1', 'Report 2'] },
        { name: 'Claimant Name', type: 'text' },
        { name: 'Claimant Forename', type: 'text' },
        { name: 'Claimant Surname', type: 'text' },
        { name: 'Claimant DOB', type: 'date' },
        { name: 'Solicitor', type: 'select', options: ['~Please Select~', 'Solicitor 1', 'Solicitor 2'] },
        { name: 'Solicitor Reference', type: 'text' },
        { name: 'Agency', type: 'select', options: ['~Please Select~', 'Agency 1', 'Agency 2'] },
        { name: 'Agency Reference', type: 'text' }
    ];


    const calculateDuration = (start, end) => {
        if (!start || !end) return '';
        const diffMs = end.getTime() - start.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        return diffMinutes > 0 ? diffMinutes : '';
    };

    // useEffect to initialize times and set the duration
    useEffect(() => {
        const today = new Date();
        // Set both start and end time to today's date by default
        const start = today;
        const end = new Date(today);
        end.setMinutes(today.getMinutes() + 30); // Set the end time 30 minutes after the start time

        setStartTime(start);
        setEndTime(end);

        // Calculate duration when the component mounts
        const initialDuration = calculateDuration(start, end);
        setDuration(initialDuration);
    }, []); // Only run once when the component mounts

    return (
        <div className="p-4 space-y-4 mt-10">
            {/* New Appointment Details */}
            <div className="bg-white shadow-md p-4 rounded-xl border">
                <h2 className="text-xl font-bold mb-4">New Appointment Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
                    <div>
                        <label className="block text-gray-500">Appointment Date</label>
                        <div className="font-medium">
                            {appointmentDate.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}{" "}
                            |{" "}
                            {appointmentDate.toLocaleDateString('en-GB', { weekday: 'long' })}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500">Appointment Venue</label>
                        <div className="font-medium">{venueOptions[0]?.label || '-'}</div>
                    </div>
                    <div>
                        <label className="block text-gray-500">Appointment Start Time</label>
                        <div className="font-medium">
                            {startTime ? startTime.toLocaleTimeString() : '-'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500">Appointment End Time</label>
                        <div className="font-medium">
                            {endTime ? endTime.toLocaleTimeString() : '-'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500">Appointment Duration</label>
                        <div className="font-medium">{duration ? `${duration} mins` : '-'}</div>
                    </div>
                </div>
            </div>

            {/* Search Filters - Collapsible */}
            <div className="bg-white shadow-md p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Search Filters</h3>

                    <button
                        onClick={() => setShowSearchFilters(!showSearchFilters)}
                        className="text-sm text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                        {showSearchFilters ? (
                            <>
                                <X size={16} className="inline-block" />
                                Hide Filters
                            </>
                        ) : (
                            <>
                                <FilterIcon size={16} className="inline-block" />
                                Show Filters
                            </>
                        )}
                    </button>

                </div>

                {showSearchFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                        {searchFields.map((field, index) => (
                            <div key={index}>
                                <label className="block text-xs mb-1 font-medium">{field.name}</label>
                                {field.type === 'text' && (
                                    <input
                                        type="text"
                                        placeholder={`Search ${field.name}`}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    />
                                )}
                                {field.type === 'select' && (
                                    <Select
                                        options={field.options?.map(option => ({ value: option, label: option }))}
                                        className="w-full"
                                    />
                                )}
                                {field.type === 'date' && (
                                    <div className="w-full">
                                        <DatePicker
                                            selected={new Date()}
                                            onChange={(date) => console.log(date)}
                                            dateFormat="dd MMM yyyy"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            wrapperClassName="w-full"  // Ensures wrapper is full width
                                            calendarClassName="w-full"  // Ensures the calendar pop-up respects the full width as well
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="col-span-full mt-2">
                            <button className="bg-blue-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                                <Search size={16} className="inline-block" />
                                Search
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
                <table className="min-w-full text-sm table-auto">
                    <thead className="bg-yellow-400 text-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">ZAR ID</th>
                            <th className="px-4 py-2 text-left">Instructor</th>
                            <th className="px-4 py-2 text-left">Claimant Name</th>
                            <th className="px-4 py-2 text-left">Preferred Expert</th>
                            <th className="px-4 py-2 text-left">Special Instructions</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyData.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-4 py-2">{item.id}</td>
                                <td className="px-4 py-2">{item.instructor}</td>
                                <td className="px-4 py-2">{item.claimant}</td>
                                <td className="px-4 py-2">{item.expert}</td>
                                <td className="px-4 py-2">{item.instructions}</td>
                                <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-2 mt-4">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Go Back</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Confirm Booking</button>
            </div>
        </div>
    );
};

export default AppointmentBookPage;
