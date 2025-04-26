import Modal from '../../components/Modal';
import CustomSelect from '../../components/CustomSelect';
import { STATUS_CLASSES } from '../../utilities/constant';
import { useState } from 'react';
import ResponsiveAppointmentTable from '../../components/MobileAppointmentList';

const AppointmentCalendarModal = ({ ...props }) => {

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isModalExpanded, setIsModalExpanded] = useState(true);


    // Convert STATUS_CLASSES into dropdown options
    const statusOptions = Object.keys(STATUS_CLASSES).map((status) => ({
        value: status,
        label: status,
    }));

    // Handle selection change
    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
    };

    // Filter appointments based on selected status
    const filteredAppointments = selectedStatus
        ? props.appointments.filter((appointment) => appointment.status === selectedStatus.value)
        : props.appointments;

    return (
        <Modal isOpen={props.isOpen}
            onClose={props.onClose} isLoading={props.loading} isProcessing={props.isProcessing}
            title={props.title} footer={props.footerButtons} size="custom"
            setIsModalExpanded={setIsModalExpanded}
            isModalExpanded={isModalExpanded}
            customWidth="1200px">
            {props.appointmentError && (
                <div className="text-red-600 bg-red-100 border border-red-400 rounded-lg p-4 mb-4">
                    {props.appointmentError}
                </div>
            )}

            {props.success && (
                <div className="text-green-600 bg-green-100 border border-green-400 rounded-lg p-4 mb-4">
                    {props.success}
                </div>
            )}

            {/* Status Filter using react-select */}
            <div className="sticky1 top-0 z-10 bg1-white mb-4 p-0">
                <label className="text-sm font-medium text-gray-700 block mb-1">Filter by Status:</label>
                <CustomSelect
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    isClearable
                    className="w-full"
                />
            </div>


            <ResponsiveAppointmentTable
                filteredAppointments={filteredAppointments}
                isModalExpanded={isModalExpanded}
                props={props}
            />
        </Modal>
    );
};

export default AppointmentCalendarModal;
