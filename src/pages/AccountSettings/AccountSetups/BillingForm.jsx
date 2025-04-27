import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../../../components/InputField';
import CustomCheckbox from '../../../components/CustomCheckbox';
import SelectField from '../../../components/SelectField';
import Button from '../../../components/Button';
import Swal from 'sweetalert2';
import { SaveIcon, X } from 'lucide-react';

export const BillingForm = ({ doctor }) => {
    const billing = doctor.billing;
    const [formData, setFormData] = useState({
        contact_name: billing?.contact_name || '',
        contact_number: billing?.contact_number || '',
        can_copy_registration_address: billing?.can_copy_registration_address || false,
        postcode: billing?.postcode || '',
        address_1: billing?.address_1 || '',
        address_2: billing?.address_2 || '',
        address_3: billing?.address_3 || '',
        county: billing?.county || '',
        town: billing?.town || '',
        country: billing?.country || 'England',
        invoice_type: billing?.invoice_type || 'monthly',
        payment_type: billing?.payment_type || 'manual'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle copy address functionality
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

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`/api/doctors/${doctor.id}/billing`, {
                billing_info: {
                    ...formData,
                    town: formData.town // Map to backend expected field name
                }
            });

            Swal.fire('Billing information updated successfully');
            console.log('Update successful:', response.data);
        } catch (error) {
            console.error('Update failed:', error);
            Swal.fire(error.response?.data?.message || 'Failed to update billing information');

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };




    return (
        <div>
            <div className="grid md:grid-cols-2 gap-4">
                <InputField
                    label="Contact Name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    error={errors.contact_name}
                    required
                />
                <InputField
                    label="Contact Number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    error={errors.contact_number}
                    required
                />
            </div>

            <h3 className="font-medium">Billing Address</h3>

            <div className="flex items-center space-x-2">
                <CustomCheckbox
                    name="can_copy_registration_address"
                    isChecked={formData.can_copy_registration_address}
                    onChange={handleCopyAddressToggle}
                    id="can_copy_registration_address"
                />
                <label htmlFor="can_copy_registration_address">Copy the registered address details</label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <InputField
                    label="Post Code"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    error={errors.postcode}
                    required
                />
                <InputField
                    label="Address 1"
                    name="address_1"
                    value={formData.address_1}
                    onChange={handleChange}
                    error={errors.address_1}
                    required
                />
                <InputField
                    label="Address 2"
                    name="address_2"
                    value={formData.address_2}
                    onChange={handleChange}
                    error={errors.address_2}
                />
                <InputField
                    label="Address 3"
                    name="address_3"
                    value={formData.address_3}
                    onChange={handleChange}
                    error={errors.address_3}
                />
                <InputField
                    label="County"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    error={errors.county}
                />
                <InputField
                    label="Town / City"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    error={errors.town}
                    required
                />
                <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                />
                <SelectField
                    label="Invoice Type"
                    name="invoice_type"
                    value={formData.invoice_type}
                    onChange={(value) => handleSelectChange('invoice_type', value)}
                    options={[
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Quarterly', value: 'quarterly' },
                        { label: 'Annual', value: 'annual' }
                    ]}
                    error={errors.invoice_type}
                    required
                />
                <SelectField
                    label="Payment Type"
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={(value) => handleSelectChange('payment_type', value)}
                    options={[
                        { label: 'Manual', value: 'manual' },
                        { label: 'Automatic', value: 'automatic' }
                    ]}
                    error={errors.payment_type}
                    required
                />
            </div>
        </div>
    );
};