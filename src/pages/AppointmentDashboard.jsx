export default function AppointmentDashboard() {
    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-8">
            {/* Header Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Enter Venue or Medco Ref" className="input" />
                <input type="text" placeholder="Postcode" className="input" />
                <input type="date" className="input" />
                <button className="btn-primary">Search</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                    ['Appointments Booked', 3],
                    ['DNAs', 2],
                    ['Completed Reports', 4],
                    ['Unreported Cases', 3],
                    ['Unprinted Letters', 9],
                    ['Appointments Overdue', 2],
                    ['Appointments Cancelled', 2],
                    ['Incomplete Reports', 4],
                ].map(([label, value], i) => (
                    <div key={i} className="bg-white shadow rounded-xl p-3 text-center">
                        <div className="text-gray-600 font-medium">{label}</div>
                        <div className="text-xl font-bold text-indigo-600">{value}</div>
                    </div>
                ))}
            </div>

            {/* Appointment Table */}
            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-2 text-left">Service</th>
                            <th className="p-2 text-left">Venue</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Available</th>
                            <th className="p-2">Booked</th>
                            <th className="p-2">Blocked</th>
                            <th className="p-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                service: 'ML-Expert',
                                venue: 'Holiday Inn Bristol',
                                date: '23.04.2025',
                                available: 10,
                                booked: 2,
                                blocked: 1,
                                time: '09:00-09:55',
                            },
                            {
                                service: 'ML-Expert',
                                venue: 'Holiday Inn Cardiff',
                                date: '24.04.2025',
                                available: 13,
                                booked: 1,
                                blocked: 0,
                                time: '10:00-10:45',
                            },
                        ].map((row, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50">
                                <td className="p-2">{row.service}</td>
                                <td className="p-2">{row.venue}</td>
                                <td className="p-2 text-center">{row.date}</td>
                                <td className="p-2 text-center text-green-600 font-semibold">{row.available}</td>
                                <td className="p-2 text-center text-orange-500 font-semibold">{row.booked}</td>
                                <td className="p-2 text-center text-red-500 font-semibold">{row.blocked}</td>
                                <td className="p-2 text-center">{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / User Info */}
            <div className="text-sm text-gray-500 text-right">
                Logged in as: <span className="text-indigo-600 font-medium">Ibrahim Ndambe</span>
            </div>
        </div>
    );
}

// Tailwind helper classes (in globals.css or apply className directly)
// .input {
//   @apply border border-gray-300 rounded-lg px-3 py-2 w-full;
// }
// .btn-primary {
//   @apply bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg;
// }
