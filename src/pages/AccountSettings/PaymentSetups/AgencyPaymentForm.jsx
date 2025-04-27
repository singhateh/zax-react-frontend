import React, { useState } from "react";
import { BaseValueSection } from "../../../components/BaseValueSection";
import { PaymentTermsSection } from "../../../components/PaymentTermsSection";
import { VenueBasedPricing } from "../../../components/VenueBasePricing";
import { DiscountsSection } from "../../../components/DiscountsSection";
import SelectField from "../../../components/SelectField";
import SubmitButtonWithSpinner from "../../../components/SubmitButtonWithSpinner";

const AgencyPaymentForm = ({ formData, setFormData, venueOptions, agencyOptions, reportTypeOptions,
    handleInputChange, venueRates, setVenueRates, initialVeneuData, discounts, setDiscounts, initialDiscountData, handleVenueChange,
    handleDiscountChange, handleFieldChange, selectedAgencySolicitor, selectedReportType, handleSubmit, isSubmitting }) => {


    const [enableVenuePricing, setEnableVenuePricing] = useState(formData.canSetVenueBasePrice);


    const [enableDiscounts, setEnableDiscounts] = useState(formData.canSetDiscount);


    const handleAddDiscount = () => {
        setDiscounts(prev => [...prev, { ...initialDiscountData }]);
    };


    const handleRemoveDiscount = (index) => {
        setDiscounts(discounts.filter((_, i) => i !== index));
    };

    const discountOptions = [
        { value: "FixedAmount", label: "Fixed Amount" },
        { value: "Percentage", label: "Percentage" },
    ];

    const handleAddVenue = () => {
        setVenueRates(prev => [...prev, { ...initialVeneuData }]);
    };

    const handleRemoveVenue = (index) => {
        setVenueRates(venueRates.filter((_, i) => i !== index));
    };

    const handleEnabledVenue = (value) => {
        const newValue = Boolean(value);
        setEnableVenuePricing(newValue);
        setFormData((prev) => ({
            ...prev,
            canSetVenueBasePrice: newValue,
        }));
    };

    const handleEnabledDiscount = (value) => {
        const newValue = Boolean(value);
        setEnableDiscounts(newValue);
        setFormData((prev) => ({
            ...prev,
            canSetDiscount: newValue,
        }));
    };


    return (
        <div className="max-w-7xl mx-auto px1-4">
            {/* Header Note */}
            <div className="bg-indigo-900 text-white text-sm px-4 py-3 mb-6 rounded shadow">
                Please Select the Agency and select the Type of the Report required to set the payment terms.
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <SelectField
                    name="agency"
                    label={"Agency Name"}
                    value={selectedAgencySolicitor}
                    options={agencyOptions}
                    onChange={handleFieldChange('agency_solicitor')}
                />

                <SelectField
                    name="reportType_id"
                    label={"Type of Report"}
                    value={selectedReportType}
                    options={reportTypeOptions}
                    onChange={handleFieldChange('reportType_id')}
                />
            </div>

            {selectedAgencySolicitor && selectedReportType && (
                <>
                    <BaseValueSection
                        values={formData}
                        onValueChange={handleInputChange}
                    />

                    <PaymentTermsSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />

                    <VenueBasedPricing
                        enabled={formData.canSetVenueBasePrice}
                        onToggle={() => handleEnabledVenue(!formData.canSetVenueBasePrice)}
                        venueRates={venueRates}
                        handleVenueChange={handleVenueChange}
                        setFormData={setFormData}
                        onAddVenueRate={handleAddVenue}
                        onRemoveVenueRate={handleRemoveVenue}
                        venueOptions={venueOptions}
                    />

                    <DiscountsSection
                        enabled={formData.canSetDiscount}
                        onToggle={() => handleEnabledDiscount(!formData.canSetDiscount)}
                        discounts={discounts}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleDiscountChange={handleDiscountChange}
                        onAddDiscount={handleAddDiscount}
                        onRemoveDiscount={handleRemoveDiscount}
                        discountOptions={discountOptions}
                    />

                    {/* Save Button */}
                    <div className="flex justify-end mt-6">
                        <SubmitButtonWithSpinner
                            onClick={handleSubmit}
                            isSubmitting={isSubmitting}
                            label="Save Changes"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AgencyPaymentForm;

