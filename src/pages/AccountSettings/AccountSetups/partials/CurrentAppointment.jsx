import React, { useState } from 'react';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import InputField from '../../../../components/InputField';
import DateField from '../../../../components/DateField';
import api from '../../../../services/api';

export default function CurrentAppointment({ doctor, onUpdate }) {
    const [formData, setFormData] = useState({
        place_of_work: '',
        position_held: '',
        start_date: '',
    });
    const [currentAppointments, setCurrentAppointments] = useState(doctor?.user_jobs?.filter(job => !job.end_date) || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAppointment = async () => {
        if (!formData.place_of_work || !formData.position_held || !formData.start_date) {
            setError('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Actual API call with Axios
            const response = await api.post('/doctor/appointments', {
                ...formData,
                doctor_id: doctor.id,
                end_date: null // Mark as current appointment
            });

            const newAppointment = response.data;

            const updatedAppointments = [...currentAppointments, newAppointment];
            setCurrentAppointments(updatedAppointments);
            setFormData({ place_of_work: '', position_held: '', start_date: '' });

            if (onUpdate) onUpdate(updatedAppointments);
        } catch (err) {
            console.error('Error adding appointment:', err);
            setError(err.response?.data?.message || 'Failed to add appointment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to remove this appointment?')) return;

        try {
            await api.delete(`/doctor/appointments/${id}`);

            const updatedAppointments = currentAppointments.filter(app => app.id !== id);
            setCurrentAppointments(updatedAppointments);
            if (onUpdate) onUpdate(updatedAppointments);
        } catch (err) {
            console.error('Error removing appointment:', err);
            setError(err.response?.data?.message || 'Failed to remove appointment');
        }
    };

    const columns = [
        {
            header: '#',
            accessor: 'index',
            cell: (row, index) => row.id
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
        <div className="space-y-6">
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
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleAddAppointment}
                    disabled={!formData.place_of_work || !formData.position_held || !formData.start_date || isSubmitting}
                    variant="primary"
                    icon={isSubmitting ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-plus" />}
                >
                    {isSubmitting ? 'Adding...' : 'Add Appointment'}
                </Button>
            </div>

            {/* Current Appointments Table */}
            <Table
                columns={columns}
                data={currentAppointments}
                emptyMessage="No current appointments added yet"
            />
        </div>
    );
}