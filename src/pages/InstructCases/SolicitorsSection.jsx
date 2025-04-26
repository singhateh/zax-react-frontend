import InputField from "../../components/InputField";
import SelectFieldWithSearch from "../../components/SelectFieldWithSearch";

export const SolicitorsSection = ({
    formData,
    handleInputChange,
    handleSelectChange,
    solicitorsOptions,
    fetchSolicitorSearch,
    filterData
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="w-full">
            <SelectFieldWithSearch
                label="Solicitors"
                name="solicitor_id"
                value={formData.solicitor_id}
                optionData={solicitorsOptions}
                formData={formData}
                onChange={handleSelectChange("solicitor_id")}
                fetchData={fetchSolicitorSearch}
                filterData={filterData}
                valueKey="id"
                labelKey="company_name"
            />
        </div>

        <div className="w-full">
            <InputField
                label="Solicitor Reference"
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
                name="solicitor_dna_email"
                value={formData.solicitor_dna_email}
                onChange={handleInputChange}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Appointment Email"
                name="solicitor_appointment_email"
                value={formData.solicitor_appointment_email}
                onChange={handleInputChange}
            />
        </div>

        <div className="w-full">
            <InputField
                label="Report/Invoice Email"
                name="solicitor_report_or_invoice_email"
                value={formData.solicitor_report_or_invoice_email}
                onChange={handleInputChange}
            />
        </div>
    </div>
);