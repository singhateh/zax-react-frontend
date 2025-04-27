import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import CustomCheckbox from '../../../../components/CustomCheckbox';

export default function Reports({ doctor, onUpdate }) {
    const [selectedReports, setSelectedReports] = useState([]);
    const [existingReports, setExistingReports] = useState(doctor?.user_reports || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const reportTypes = doctor?.reportTypes || [];

    const handleReportChange = (reportId) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const handleAddReports = async () => {
        if (selectedReports.length === 0) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            selectedReports.forEach((reportId, index) => {
                formData.append(`reports[${index}][report_type_id]`, reportId);
            });

            // Add user ID if needed
            if (doctor?.id) {
                formData.append('user_id', doctor.id);
            }

            const response = await axios.post('/api/user/reports', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            const updatedReports = [...existingReports, ...response.data];
            setExistingReports(updatedReports);
            setSelectedReports([]);

            if (onUpdate) onUpdate(updatedReports);

        } catch (err) {
            console.error('Error submitting reports:', err);
            setError(err.response?.data?.message || 'Failed to save reports');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveReport = async (id) => {
        if (!window.confirm('Are you sure you want to remove this report type?')) return;

        try {
            setIsSubmitting(true);
            await axios.delete(`/api/user/reports/${id}`);

            const updatedReports = existingReports.filter(report => report.id !== id);
            setExistingReports(updatedReports);

            if (onUpdate) onUpdate(updatedReports);
        } catch (err) {
            console.error('Error removing report:', err);
            setError(err.response?.data?.message || 'Failed to remove report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            header: '#',
            accessor: 'index',
            cell: (row, index) => index + 1
        },
        {
            header: 'Report Type',
            accessor: 'name',
            cell: (row) => row.report_type?.name || row.name || '-'
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <Button
                    onClick={() => handleRemoveReport(row.id)}
                    variant="danger"
                    size="sm"
                    icon={<i className="fa fa-trash" />}
                    className="float-right"
                    disabled={isSubmitting}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Report Types <span className="text-red-500">*</span>
                    </label>

                    {reportTypes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {reportTypes.map((reportType) => (
                                <CustomCheckbox
                                    key={reportType.id}
                                    id={`report-${reportType.id}`}
                                    name="report_type"
                                    value={reportType.id}
                                    isChecked={selectedReports.includes(reportType.id)}
                                    onChange={() => handleReportChange(reportType.id)}
                                    label={reportType.name}
                                    disabled={isSubmitting}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No report types available</p>
                    )}

                    <div className="mt-4">
                        <Button
                            onClick={handleAddReports}
                            disabled={selectedReports.length === 0 || isSubmitting}
                            variant="primary"
                            icon={isSubmitting ?
                                <i className="fa fa-spinner fa-spin" /> :
                                <i className="fa fa-plus" />
                            }
                        >
                            {isSubmitting ? 'Submitting...' : 'Add To List'}
                        </Button>
                    </div>
                </div>

                <div>
                    {existingReports.length > 0 ? (
                        <Table
                            columns={columns}
                            data={existingReports}
                            emptyMessage="No reports added yet"
                            className="mt-4"
                        />
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No reports have been added yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}