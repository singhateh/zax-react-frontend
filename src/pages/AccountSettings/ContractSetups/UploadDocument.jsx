import React from 'react'
import SelectField from '../../../components/SelectField'
import InputField from '../../../components/InputField'
import FileUpload from '../../../components/FileUpload'

function UploadDocument({ formData, handleFilesSelected, handleSelectChange, handleChange, contractTypes, errors }) {
    return (
        <div className="space-y-4">
            <SelectField
                name="contract_type_id"
                id="documentType"
                label="Document Type"
                value={formData.contract_type_id}
                onChange={handleSelectChange('contract_type_id')}
                options={contractTypes.map(contractType => ({
                    value: contractType.id,
                    label: contractType.name
                }))}
                className="mb-5"
                errors={errors}
            />

            <InputField
                name="reference"
                id="referenceNumber"
                label="Reference Number"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Enter reference"
                className="mb-5"
                errors={errors}
            />

            <FileUpload
                onFilesSelected={handleFilesSelected}
                id="swal2-file"
                label="Select Document"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="swal2-file mb-5"
                multiple={true}
                errors={errors}
            />
        </div>
    )
}

export default UploadDocument