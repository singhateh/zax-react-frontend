import { FormSection } from "./FormSection";
import { FormTextArea } from "./FormTextArea";
import RadioGroup from "./RadioGroup";

export const PaymentTermsSection = ({
    formData,
    handleInputChange,
}) => {
    return (
        <FormSection title="PAYMENT TERMS">
            <div className="flex gap-4">
                <RadioGroup
                    label="Payment Terms *"
                    name="payment_terms_type"
                    options={[
                        { value: "On_Completion", label: "on Completion" },
                        { value: "In_Days", label: "in Days" }
                    ]}
                    value={formData.payment_terms_type}
                    onChange={handleInputChange('payment_terms_type')}
                />

                {formData.payment_terms_type === "In_Days" && (
                    <div className="flex items-center gap-4 mt-5">
                        <input
                            type="number"
                            value={formData.in_days}
                            min="1"
                            onChange={handleInputChange('in_days')}
                            className="w-20 border rounded px-2 py-1 text-sm"
                        />
                    </div>
                )}
            </div>
            <FormTextArea
                className="mt-2"
                label="Comments"
                value={formData.comments}
                onChange={handleInputChange('comments')}
                placeholder="Optional comments..."
            />
        </FormSection>
    );
};