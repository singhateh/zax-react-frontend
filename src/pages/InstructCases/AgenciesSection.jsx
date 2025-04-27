import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export const AgenciesSection = ({
    formData,
    handleInputChange,
    handleSelectChange,
    agencyOptions
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        <SelectField
            label="Agencies"
            placeholder="Select Agency"
            value={formData.agency_id}
            onChange={handleSelectChange("agency_id")}
            options={agencyOptions}
        />

        <InputField
            label="Agency Reference"
            className="bg-amber-400 border-amber-500"
            name="agency_reference"
            value={formData.agency_reference}
            onChange={handleInputChange}
            styles={{ backgroundColor: "rgb(250 187 2)" }}
        />

        <SelectField
            label="Agency Case Handle"
            placeholder="Select Agency"
            value={formData.agency_id}
            onChange={handleSelectChange("agency_id")}
            options={agencyOptions}
        />

        <InputField
            label="DNA Email"
            name="agency_dna_email"
            value={formData.agency_dna_email}
            onChange={handleInputChange}
        />

        <InputField
            label="Appointment Email"
            name="agency_appointment_email"
            value={formData.agency_appointment_email}
            onChange={handleInputChange}
        />

        <InputField
            label="Report/Invoice Email"
            name="agency_report_or_invoice_email"
            value={formData.agency_report_or_invoice_email}
            onChange={handleInputChange}
        />
    </div>
);