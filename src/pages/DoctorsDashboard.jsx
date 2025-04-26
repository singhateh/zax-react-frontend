import Appointments from "./ZaxCal/Appointments";

export default function DoctorDashboard() {
    return (
        <div className1="md:p-0 lg:p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                    ['Appointments Booked', 3, 'bg-gradient-to-br from-indigo-50 to-indigo-100', 'text-indigo-600'],
                    ['DNAs', 2, 'bg-gradient-to-br from-red-50 to-red-100', 'text-red-600'],
                    ['Completed Reports', 4, 'bg-gradient-to-br from-green-50 to-green-100', 'text-green-600'],
                    ['Unreported Cases', 3, 'bg-gradient-to-br from-amber-50 to-amber-100', 'text-amber-600'],
                    ['Unprinted Letters', 9, 'bg-gradient-to-br from-blue-50 to-blue-100', 'text-blue-600'],
                    ['Appointments Overdue', 2, 'bg-gradient-to-br from-purple-50 to-purple-100', 'text-purple-600'],
                    ['Appointments Cancelled', 2, 'bg-gradient-to-br from-pink-50 to-pink-100', 'text-pink-600'],
                    ['Incomplete Reports', 4, 'bg-gradient-to-br from-rose-50 to-rose-100', 'text-rose-600'],
                ].map(([label, value, bgClass, textClass], i) => (
                    <div
                        key={i}
                        className={`${bgClass} shadow rounded-xl p-4 hover:shadow-md transition-all cursor-pointer`}
                    >
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
                        <div className={`text-2xl font-bold ${textClass} mt-1`}>{value}</div>
                        <div className="h-1 bg-white rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full ${textClass.replace('text-', 'bg-')}`}
                                style={{ width: `${Math.min(Number(value) * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <Appointments className="mt-3 p1-6 md:p-0" isDashboard={true} isFilter={false} />
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm font-medium">New Report</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Print Letters</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Schedule</span>
                </button>
                <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
}
