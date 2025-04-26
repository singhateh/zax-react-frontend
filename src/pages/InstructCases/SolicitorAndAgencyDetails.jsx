import React from "react";
import CollapsibleSection from "../../components/CollapsibleSection";
import SelectField from "../../components/SelectField";
import InputField from "../../components/InputField";
import Skeleton from "../../components/Skeleton";
import SelectFieldWithSearch from "../../components/SelectFieldWithSearch";
import { Landmark } from "lucide-react";
import { LitigantInPersonSection } from "./LitigantInPersonSection";
import { SolicitorsSection } from "./SolicitorsSection";
import { AgenciesSection } from "./AgenciesSection";
import CustomCheckbox from "../../components/CustomCheckbox";

const SolicitorAndAgencyDetails = ({
    setFormData,
    formData,
    loading,
    agencyOptions,
    solicitorsOptions,
    handleSelectChange,
    handleInputChange,
    fetchSolicitorSearch,
    filterData,
}) => {

    const sectionTitle = formData.level_id === 1 ? 'Solicitor Details' : (formData.level_id === 2 ? 'Litigant in Person Details' : 'Litigant in Person Details');


    const toggleLitigantInPerson = (e) => {
        handleInputChange(e);
        if (e.target.checked) {
            setFormData(prev => ({
                ...prev,
                solicitor_id: '',
                solicitor_reference: '',
                medco_reference: '',
                solicitor_dna_email: '',
                solicitor_appointment_email: '',
                solicitor_report_or_invoice_email: '',
            }));
        }
    };

    return (
        <CollapsibleSection title={sectionTitle} icon={<Landmark className="w-5 h-5" />}>
            {loading ? (
                <Skeleton type="rect" count={2} height="30px" />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Litigant In Person Checkbox */}
                    <CustomCheckbox
                        label="Litigant In Person (LIP) Detail"
                        id="is_litigant"
                        name="is_litigant"
                        value="agree"
                        isChecked={formData.is_litigant}
                        onChange={toggleLitigantInPerson}
                    />

                    {formData.is_litigant ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-full">
                            <LitigantInPersonSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                            <AgenciesSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                                agencyOptions={agencyOptions}
                            />
                        </div>

                    ) : formData.level_id !== 3 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-full">
                            <SolicitorsSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                                solicitorsOptions={solicitorsOptions}
                                fetchSolicitorSearch={fetchSolicitorSearch}
                                filterData={filterData}
                            />
                            <AgenciesSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                                agencyOptions={agencyOptions}
                            />
                        </div>
                    ) : (
                        <LitigantInPersonSection
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </div>

            )}
        </CollapsibleSection>
    );
};

export default SolicitorAndAgencyDetails;
