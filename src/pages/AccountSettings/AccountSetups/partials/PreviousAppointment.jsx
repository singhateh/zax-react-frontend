import { useState } from "react";
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import InputField from '../../../../components/InputField';
import DateField from '../../../../components/DateField';

export default function PreviousAppointment({ doctor, onUpdate }) {
    const [formData, setFormData] = useState({
        place_of_work: '',
        position_held: '',
        start_date: '',
        end_date: '',
        duration: ''
    });

    const [previousAppointments, setPreviousAppointments] = useState(
        doctor?.user_jobs?.filter(job => job.end_date) || []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return '';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        return `${years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''}${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    };

    // Calculate pagination
    const totalItems = previousAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = previousAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddAppointment = async () => {
        if (!formData.place_of_work || !formData.position_held || !formData.start_date || !formData.end_date) {
            setError('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const duration = calculateDuration(formData.start_date, formData.end_date);

            const newAppointment = {
                id: Date.now(),
                place_of_work: formData.place_of_work,
                position_held: formData.position_held,
                start_date: formData.start_date,
                end_date: formData.end_date,
                duration: duration,
                created_at: new Date().toISOString()
            };

            const updatedAppointments = [...previousAppointments, newAppointment];
            setPreviousAppointments(updatedAppointments);
            setFormData({
                place_of_work: '',
                position_held: '',
                start_date: '',
                end_date: '',
                duration: ''
            });

            // Reset to first page when adding new item
            setCurrentPage(1);

            if (onUpdate) onUpdate(updatedAppointments);
        } catch (err) {
            console.error('Error adding appointment:', err);
            setError(err.response?.data?.message || 'Failed to add appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveAppointment = (id) => {
        if (!window.confirm('Are you sure you want to remove this appointment?')) return;

        const updatedAppointments = previousAppointments.filter(app => app.id !== id);
        setPreviousAppointments(updatedAppointments);

        // Adjust current page if needed
        if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

        if (onUpdate) onUpdate(updatedAppointments);
    };

    const columns = [
        {
            header: '#',
            accessor: 'index',
            cell: (row, index) => (currentPage - 1) * itemsPerPage + index + 1
        },
        {
            header: 'Place of Work',
            accessor: 'place_of_work',
            cell: (row) => row.place_of_work || '-'
        },
        {
            header: 'Position Held',
            accessor: 'position_held',
            cell: (row) => row.position_held || '-'
        },
        {
            header: 'Start Date',
            accessor: 'start_date',
            cell: (row) => row.start_date ? new Date(row.start_date).toLocaleDateString() : '-'
        },
        {
            header: 'End Date',
            accessor: 'end_date',
            cell: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : '-'
        },
        {
            header: 'Duration',
            accessor: 'duration',
            cell: (row) => row.duration || '-'
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <Button
                    onClick={() => handleRemoveAppointment(row.id)}
                    variant="danger"
                    size="sm"
                    icon={<i className="fa fa-trash" />}
                >
                    Remove
                </Button>
            )
        }
    ];

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InputField
                    label="Place of Work"
                    name="place_of_work"
                    value={formData.place_of_work}
                    onChange={(e) => handleChange('place_of_work', e.target.value)}
                    required
                    placeholder="Enter place of work"
                />

                <InputField
                    label="Position Held"
                    name="position_held"
                    value={formData.position_held}
                    onChange={(e) => handleChange('position_held', e.target.value)}
                    required
                    placeholder="Enter position"
                />

                <DateField
                    label="Start Date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(value) => handleChange('start_date', value)}
                    required
                />

                <DateField
                    label="End Date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(value) => handleChange('end_date', value)}
                    required
                />

                <InputField
                    label="Duration (auto-calculated)"
                    name="duration"
                    value={calculateDuration(formData.start_date, formData.end_date)}
                    readOnly
                    placeholder="Will be calculated automatically"
                />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleAddAppointment}
                    disabled={!formData.place_of_work || !formData.position_held ||
                        !formData.start_date || !formData.end_date || isSubmitting}
                    variant="primary"
                    icon={isSubmitting ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-plus" />}
                >
                    {isSubmitting ? 'Adding...' : 'Add Previous Appointment'}
                </Button>
            </div>

            <Table
                columns={columns}
                data={currentItems}
                emptyMessage="No previous appointments added yet"
            />

            {totalItems > itemsPerPage && (
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}