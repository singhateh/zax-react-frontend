import { useStateContext } from "../contex/ContexProvider";
import AdminDashboard from "./AdminsDashboard";
import DoctorDashboard from "./DoctorsDashboard";

const Dashboard = () => {
    const { selectedDoctor } = useStateContext();

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold py-3 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">Dashboard</h1>

            {selectedDoctor ? (
                <DoctorDashboard />
            ) : (
                <AdminDashboard />
            )}
        </div>
    );
};

export default Dashboard;
