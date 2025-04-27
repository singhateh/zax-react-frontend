import InputField from "../../components/InputField";

export const LitigantInPersonSection = ({ formData, handleInputChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="w-full">
            <InputField
                label="Instructing Party"
                name="instructing_party_reference"
                value={formData.instructing_party_reference}
                onChange={handleInputChange}
                styles={{ backgroundColor: "rgb(250 187 2)" }}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Instructing Party Reference"
                name="solicitor_reference"
                className="bg-amber-400 border-amber-500"
                value={formData.solicitor_reference}
                onChange={handleInputChange}
                styles={{ backgroundColor: "rgb(250 187 2)" }}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Medco ID"
                name="medco_reference"
                className="bg-amber-400 border-amber-500"
                value={formData.medco_reference}
                onChange={handleInputChange}
                styles={{ backgroundColor: "rgb(250 187 2)" }}
            />
        </div>

        <div className="w-full">
            <InputField
                label="DNA Email"
                name="instructing_party_dna_email"
                value={formData.instructing_party_dna_email}
                onChange={handleInputChange}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Appointment Email"
                name="instructing_party_appointment_email"
                value={formData.instructing_party_appointment_email}
                onChange={handleInputChange}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Report/Invoice Email"
                name="instructing_party_report_or_invoice_email"
                value={formData.instructing_party_report_or_invoice_email}
                onChange={handleInputChange}
            />
        </div>
    </div>
);