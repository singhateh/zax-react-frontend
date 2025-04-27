// components/partials/GmcForm.jsx
import React from 'react';
import InputField from '../../../../components/InputField';
import DateField from '../../../../components/DateField';
import { formatDate, formatDisplayDate } from '../../../../utilities/constant';

const GmcForm = ({ professionalInfo }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // submission logic
    };

    const handleDOBChange = (date) => {
        // Handle date of birth change logic here
        console.log("Date of Birth changed:", formatDisplayDate(date));
    }

    const expirationData = professionalInfo?.gmc_expiry_date ? new Date(professionalInfo.gmc_expiry_date) : null;


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <InputField name="gmc_number" label="GMC Number" value={professionalInfo.gmc_number} />
                </div>

                <div>
                    <InputField name="hcpc_number" label="HCPC Number" value={professionalInfo.hcpc_number} />
                </div>

                <div>
                    <InputField type="file" name="gmc_certificate" label="GMC Certificate" />
                </div>
                <div>
                    <DateField
                        label="GMC Expiry"
                        name="gmc_expiry"
                        selected={expirationData}
                        onChange={handleDOBChange}
                        value={expirationData}
                    />
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
    );
};

export default GmcForm;
