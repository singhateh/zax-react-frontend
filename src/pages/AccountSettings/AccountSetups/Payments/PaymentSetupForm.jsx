import React, { useState } from 'react';
import CustomCheckbox from '../../../../components/CustomCheckbox';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';
import InputFieldWithButton from '../../../../components/InputFieldWithButton';
import DateField from '../../../../components/DateField';
import api from '../../../../services/api';
import Swal from 'sweetalert2';
import Modal from '../../../../components/Modal';
import { SaveIcon, X } from 'lucide-react';

const PaymentSetupForm = ({ doctor, onUpdate, isOpen, onClose }) => {
    const [availableAddresses, setAvailableAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const paymentMethod = doctor.payment_method;
    const VatRegistrationDate = paymentMethod?.vat_registration_date ? new Date(paymentMethod.vat_registration_date) : null;

    const [formData, setFormData] = useState({
        is_vat: paymentMethod?.is_vat ?? false,
        vat_number: paymentMethod?.vat_number ?? '',
        vat_registration_date: VatRegistrationDate ?? '',
        holder_name: paymentMethod?.holder_name ?? '',
        bank_sort_code: paymentMethod?.bank_sort_code ?? '',
        account_number: paymentMethod?.account_number ?? '',
        is_include_cheque: paymentMethod?.is_include_cheque ?? true,
        send_cheques_to: paymentMethod?.send_cheques_to ?? '',
        address_1: paymentMethod?.address_1 ?? '',
        address_2: paymentMethod?.address_2 ?? '',
        address_3: paymentMethod?.address_3 ?? '',
        town: paymentMethod?.town ?? '',
        postcode: paymentMethod?.postcode ?? '',
        county: paymentMethod?.county ?? '',
        country: paymentMethod?.country ?? '',
        payment_method: paymentMethod?.method_type ?? ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            vat_registration_date: date
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const response = await api.post('/doctor/account/payment', formData);
            const updatedPayment = response.data.data;

            if (onUpdate) {
                onUpdate({ ...doctor, payment_method: updatedPayment });
            }

            await Swal.fire({
                title: 'Success!',
                text: 'Payment updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
            await Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update payment',
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
            onClick: onClose,
            color: 'bg-red-500',
        }
    ];


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Payment Settings"
            size="custom"
            customWidth='800px'
            footer={footerButtons}
        >
            <div>
                {/* VAT Section */}
                <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">VAT Information</h3>
                    <div className="space-y-4">
                        <CustomCheckbox
                            id="includeVAT"
                            label="Include VAT"
                            name="is_vat"
                            isChecked={formData.is_vat}
                            onChange={handleChange}
                        />

                        {formData.is_vat && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="VAT Number"
                                    name="vat_number"
                                    value={formData.vat_number}
                                    onChange={handleChange}
                                    required={formData.is_vat}
                                />
                                <DateField
                                    label="VAT Registration Date"
                                    name="vat_registration_date"
                                    selected={formData.vat_registration_date}
                                    onChange={handleDateChange}
                                    required={formData.is_vat}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bank Details */}
                <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Account Holder Name"
                            name="holder_name"
                            required
                            value={formData.holder_name}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Sort Code"
                            name="bank_sort_code"
                            maxLength={6}
                            required
                            value={formData.bank_sort_code}
                            onChange={handleChange}
                            placeholder="00-00-00"
                        />
                        <InputField
                            label="Account Number"
                            name="account_number"
                            maxLength={8}
                            required
                            value={formData.account_number}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Cheque Section */}
                <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cheque Payment</h3>
                    <div className="space-y-4">
                        <CustomCheckbox
                            id="sendCheque"
                            label="Include Cheque Payment"
                            name="is_include_cheque"
                            isChecked={formData.is_include_cheque}
                            onChange={handleChange}
                        />

                        {formData.is_include_cheque && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                    <InputField
                                        label="Send Cheques To"
                                        name="send_cheques_to"
                                        value={formData.send_cheques_to}
                                        onChange={handleChange}
                                        required={formData.is_include_cheque}
                                    />
                                    <InputFieldWithButton
                                        label="Postcode"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleChange}
                                        buttonLabel="Lookup"
                                        onButtonClick={() => console.log('Lookup clicked')}
                                        required={formData.is_include_cheque}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                    <InputField
                                        label="Address Line 1"
                                        name="address_1"
                                        value={formData.address_1}
                                        onChange={handleChange}
                                        required={formData.is_include_cheque}
                                    />
                                    <InputField
                                        label="Address Line 2"
                                        name="address_2"
                                        value={formData.address_2}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Address Line 3"
                                        name="address_3"
                                        value={formData.address_3}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                    <InputField
                                        label="Town/City"
                                        name="town"
                                        value={formData.town}
                                        onChange={handleChange}
                                        required={formData.is_include_cheque}
                                    />
                                    <InputField
                                        label="County"
                                        name="county"
                                        value={formData.county}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required={formData.is_include_cheque}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentSetupForm;