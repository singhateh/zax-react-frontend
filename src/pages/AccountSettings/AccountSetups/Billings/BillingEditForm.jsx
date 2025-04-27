import React from 'react';
import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import CustomCheckbox from '../../../../components/CustomCheckbox';

export const BillingEditForm = ({
    formData,
    errors,
    onCopyAddressToggle,
    onChange,
    onSelectChange,
}) => {
    return (
        <div>
            <div className="grid md:grid-cols-2 gap-4">
                <InputField
                    label="Contact Name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={onChange}
                    error={errors.contact_name}
                    required
                />
                <InputField
                    label="Contact Number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={onChange}
                    error={errors.contact_number}
                    required
                />
            </div>

            <h3 className="font-medium">Billing Address</h3>

            <div className="flex items-center space-x-2">
                <CustomCheckbox
                    name="can_copy_registration_address"
                    isChecked={formData.can_copy_registration_address}
                    onChange={onCopyAddressToggle}
                    id="can_copy_registration_address"
                />
                <label htmlFor="can_copy_registration_address">Copy the registered address details</label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <InputField
                    label="Post Code"
                    name="postcode"
                    value={formData.postcode}
                    onChange={onChange}
                    error={errors.postcode}
                    required
                />
                <InputField
                    label="Address 1"
                    name="address_1"
                    value={formData.address_1}
                    onChange={onChange}
                    error={errors.address_1}
                    required
                />
                <InputField
                    label="Address 2"
                    name="address_2"
                    value={formData.address_2}
                    onChange={onChange}
                    error={errors.address_2}
                />
                <InputField
                    label="Address 3"
                    name="address_3"
                    value={formData.address_3}
                    onChange={onChange}
                    error={errors.address_3}
                />
                <InputField
                    label="County"
                    name="county"
                    value={formData.county}
                    onChange={onChange}
                    error={errors.county}
                />
                <InputField
                    label="Town / City"
                    name="town"
                    value={formData.town}
                    onChange={onChange}
                    error={errors.town}
                    required
                />
                <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={onChange}
                    error={errors.country}
                />
                <SelectField
                    label="Invoice Type"
                    name="invoice_type"
                    value={formData.invoice_type}
                    onChange={onSelectChange('invoice_type')}
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
                    onChange={onSelectChange('payment_type')}
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