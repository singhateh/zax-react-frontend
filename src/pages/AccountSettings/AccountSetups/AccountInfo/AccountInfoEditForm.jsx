import React from 'react';
import InputField from '../../../../components/InputField';

export const AccountInfoEditForm = ({
    doctor,
    form,
    onChange,
    errors,
}) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <InputField
                    label="Company Name"
                    name="company_name"
                    value={form.company_name}
                    onChange={onChange}
                    required
                    errors={errors}
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Number</label>
                    <p className="mt-1 text-sm text-gray-600">{doctor.number}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-600">{doctor.email}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <p className="mt-1 text-sm text-gray-600 capitalize">{doctor.account_status || 'Active'}</p>
                </div>
            </div>
        </div>
    );
};