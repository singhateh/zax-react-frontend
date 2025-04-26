import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '../../../../components/Modal';
import { BillingDisplayView } from './BillingDisplayView';
import { BillingEditForm } from './BillingEditForm';
import { SaveIcon, X } from 'lucide-react';
import api from '../../../../services/api';

export const BillingContainer = ({ doctor, onUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const billing = doctor.billing || {};
    const [formData, setFormData] = useState({
        contact_name: billing.contact_name || '',
        contact_number: billing.contact_number || '',
        can_copy_registration_address: billing.can_copy_registration_address || false,
        postcode: billing.postcode || '',
        address_1: billing.address_1 || '',
        address_2: billing.address_2 || '',
        address_3: billing.address_3 || '',
        county: billing.county || '',
        town: billing.town || '',
        country: billing.country || 'England',
        invoice_type: billing.invoice_type || 'monthly',
        payment_type: billing.payment_type || 'manual'
    });

    const handleCopyAddressToggle = (e) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            can_copy_registration_address: checked,
            postcode: checked ? doctor?.postcode || '' : billing.postcode,
            address_1: checked ? doctor?.address_1 || '' : billing.address_1,
            address_2: checked ? doctor?.address_2 || '' : billing.address_2,
            address_3: checked ? doctor?.address_3 || '' : billing.address_3,
            county: checked ? doctor?.county || '' : billing.county,
            town: checked ? doctor?.town || '' : billing.town,
            country: checked ? doctor?.country || 'England' : billing.country
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);

        const newFormData = {
            ...formData,
            [field]: selectedValue,
        };

        setFormData(newFormData);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const response = await api.post(`/doctor/account/billing`, formData);

            Swal.fire({
                title: 'Success!',
                text: 'Billing information updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            if (onUpdate) {
                onUpdate({
                    ...doctor,
                    billing: response.data.data
                });
            }

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Update failed:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update billing information',
                icon: 'error',
                confirmButtonText: 'OK',
            });

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
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
            <BillingDisplayView
                billing={billing}
                doctor={doctor}
                onEditClick={() => setIsEditModalOpen(true)}
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Billing Information"
                size="custom"
                customWidth='700px'
                footer={footerButtons}
            >
                <BillingEditForm
                    formData={formData}
                    errors={errors}
                    loading={loading}
                    doctor={doctor}
                    onCopyAddressToggle={handleCopyAddressToggle}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    );
};