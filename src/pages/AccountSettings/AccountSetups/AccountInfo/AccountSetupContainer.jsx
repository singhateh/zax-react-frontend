import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '../../../../components/Modal';
import { AccountInfoDisplay } from './AccountInfoDisplay';
import { AccountInfoEditForm } from './AccountInfoEditForm';
import { PasswordEditForm } from './PasswordEditForm'; // ← create this component
import { SaveIcon, X } from 'lucide-react';
import api from '../../../../services/api';
import { MdUpdate } from 'react-icons/md';

export const AccountSetupContainer = ({ doctor, onUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
        selected_doctor_id: doctor?.id || null,
        company_name: doctor.company_name || null,
    });


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAccountSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/doctor/account`, {
                company_name: form.company_name
            });

            Swal.fire({
                title: 'Success!',
                text: 'Account information updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            if (onUpdate) {
                onUpdate({
                    ...doctor,
                    company_name: form.company_name
                });
            }

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Update failed:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update account information',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordSubmit = async () => {
        setLoading(true);
        setErrors({}); // Clear previous errors

        try {
            const response = await api.post('/doctor/account/update-password', form);

            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                }
            });

            handlePasswordModalClose();
        } catch (error) {
            if (error.response?.status === 422) {
                // Laravel validation error
                setErrors(error.response.data.errors || {});
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Failed to change password',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordModalClose = () => {
        setIsPasswordModalOpen(false);
        setForm({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
        setErrors({});
    }

    const accountFooterButtons = [
        {
            label: 'Update',
            icon: <MdUpdate size={16} />,
            onClick: handleAccountSubmit,
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: () => setIsEditModalOpen(false),
            color: 'bg-red-500',
        }
    ];

    const passwordFooterButtons = [
        {
            label: 'Update',
            icon: <SaveIcon size={16} />,
            onClick: handlePasswordSubmit,
            color: 'bg-green-600',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: handlePasswordModalClose,
            color: 'bg-red-500',
        }
    ];

    return (
        <>
            <AccountInfoDisplay
                doctor={doctor}
                onEditClick={() => setIsEditModalOpen(true)}
                onChangePasswordClick={() => setIsPasswordModalOpen(true)}
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Account Information"
                size="custom"
                customWidth='700px'
                footer={accountFooterButtons}
            >
                <AccountInfoEditForm
                    doctor={doctor}
                    loading={loading}
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                />
            </Modal>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={handlePasswordModalClose}
                title="Change Password"
                size="custom"
                customWidth="500px"
                footer={passwordFooterButtons}
            >
                <PasswordEditForm
                    loading={loading}
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                />
            </Modal>
        </>
    );
};
