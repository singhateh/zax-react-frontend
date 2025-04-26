import React from 'react'
import InputField from '../../../../components/InputField';
import DateField from '../../../../components/DateField';

function IndemnityForm({ professionalInfo }) {

    const handleSubmit = (e) => {
        e.preventDefault();
        // submission logic
    };

    const handleDOBChange = (date) => {
    }

    const expirationData = professionalInfo?.indemnity_expiry_date ? new Date(professionalInfo.indemnity_expiry_date) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField label="Indemnity Number" name={'indemnity_number'} value={professionalInfo.indemnity_number} />

                <DateField
                    label="Indemnity Expiry"
                    name="indemnity_expiry_date"
                    selected={expirationData}
                    onChange={handleDOBChange}
                    value={expirationData}
                />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Indemnity Certificate</label>
                    <input type="file" className="mt-1 w-full" />
                </div>
            </div>
            <div className="text-right">
                <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                >
                    <i className="fa fa-plus" />
                    Add To List
                </button>
            </div>
        </form>
    )
}

export default IndemnityForm