import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { PersonalDetailsDisplay } from './PersonalDetailsDisplay';
import { PersonalDetailsEditForm } from './PersonalDetailsEditForm';
import Modal from '../../../../components/Modal';
import { SaveIcon, X } from 'lucide-react';
import api from '../../../../services/api';

export const PersonalDetailsContainer = ({ doctor, onUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Append all fields to formData
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'signature' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            const response = await api.put(`/doctors/account/personal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                title: 'Success!',
                text: 'Personal details updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            if (onUpdate) {
                onUpdate(response.data);
            }

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Update failed:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update personal details',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    const footerButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleSubmit,
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: () => setIsEditModalOpen(false),
            color: 'bg-red-500',
        }
    ];

    return (
        <>
            <PersonalDetailsDisplay
                doctor={doctor}
                onEditClick={() => setIsEditModalOpen(true)}
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Personal Details"
                size="custom"
                customWidth='700px'
                footer={footerButtons}
            >
                <PersonalDetailsEditForm
                    doctor={doctor}
                />
            </Modal>
        </>
    );
};