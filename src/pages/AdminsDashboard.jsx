import { Plus, Users, Settings, ChevronRight, User, FileText, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false
    });

    const [stats] = useState({
        users: 234,
        documents: 1425,
        storage: "82%",
    });

    const recentActivity = [
        { id: 1, user: "John Doe", action: "Uploaded a document", time: "2m ago" },
        { id: 2, user: "Alice Smith", action: "Created a new workspace", time: "10m ago" },
        { id: 3, user: "Mike Brown", action: "Deleted a file", time: "30m ago" },
    ];

    const data = [
        { name: "Jan", files: 10 },
        { name: "Feb", files: 30 },
        { name: "Mar", files: 60 },
        { name: "Apr", files: 90 },
        { name: "May", files: 120 },
    ];

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024
            });
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className={`${screenSize.isMobile ? 'pb-20' : ''} ${screenSize.isTablet ? 'p-4' : 'p-0'}`}>
            {/* Stats Cards - Different layout for each screen size */}
            <div className={`
                ${screenSize.isMobile ? 'grid grid-cols-1 gap-4' : ''}
                ${screenSize.isTablet ? 'grid grid-cols-3 gap-4' : ''}
                ${screenSize.isDesktop ? 'grid grid-cols-3 gap-6' : ''}
            `}>
                <div className="bg-white shadow rounded-lg p-4 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{stats.users}</h2>
                        <p className="text-gray-500">Total Users</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{stats.documents}</h2>
                        <p className="text-gray-500">Documents</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <HardDrive className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{stats.storage}</h2>
                        <p className="text-gray-500">Storage Used</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={`
                ${screenSize.isMobile ? 'grid grid-cols-1 gap-4 mt-4' : ''}
                ${screenSize.isTablet ? 'grid grid-cols-2 gap-4 mt-6' : ''}
                ${screenSize.isDesktop ? 'grid grid-cols-3 gap-6 mt-6' : ''}
            `}>
                {/* Recent Activity - Takes full width on mobile, half on tablet, 2/3 on desktop */}
                <div className={`
                    bg-white shadow rounded-lg p-4
                    ${screenSize.isMobile ? 'col-span-1' : ''}
                    ${screenSize.isTablet ? 'col-span-1' : ''}
                    ${screenSize.isDesktop ? 'col-span-2' : ''}
                `}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Recent Activity</h2>
                        <button className="text-blue-600 text-sm flex items-center">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {recentActivity.map((item) => (
                            <li key={item.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{item.user}</p>
                                    <p className="text-gray-500 text-sm">{item.action}</p>
                                </div>
                                <span className="text-gray-400 text-sm">{item.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chart - Takes full width on mobile, half on tablet, 1/3 on desktop */}
                <div className={`
                    bg-white shadow rounded-lg p-4
                    ${screenSize.isMobile ? 'col-span-1' : ''}
                    ${screenSize.isTablet ? 'col-span-1' : ''}
                    ${screenSize.isDesktop ? 'col-span-1' : ''}
                `}>
                    <h2 className="text-lg font-bold mb-4">Uploads Trend</h2>
                    <ResponsiveContainer width="100%" height={screenSize.isMobile ? 250 : 300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="files" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Actions - Full width on mobile, full width on tablet, full width on desktop */}
                <div className={`
                    bg-white shadow-md rounded-lg p-4
                    ${screenSize.isMobile ? 'col-span-1' : ''}
                    ${screenSize.isTablet ? 'col-span-2' : ''}
                    ${screenSize.isDesktop ? 'col-span-3' : ''}
                    mt-4
                `}>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className={`
                        ${screenSize.isMobile ? 'grid grid-cols-1 gap-3' : ''}
                        ${screenSize.isTablet ? 'grid grid-cols-3 gap-4' : ''}
                        ${screenSize.isDesktop ? 'grid grid-cols-3 gap-6' : ''}
                    `}>
                        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg active:bg-blue-700 transition-colors">
                            <Plus className="w-5 h-5" />
                            <span>Add Document</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg active:bg-gray-200 transition-colors border border-gray-200">
                            <Users className="w-5 h-5 text-gray-600" />
                            <span>Manage Users</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-white text-red-600 px-4 py-3 rounded-lg active:bg-red-50 transition-colors border border-red-200">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;