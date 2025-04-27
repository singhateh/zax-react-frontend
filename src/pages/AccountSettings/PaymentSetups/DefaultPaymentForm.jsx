import { BaseValueSection } from "../../../components/BaseValueSection";
import SubmitButtonWithSpinner from "../../../components/SubmitButtonWithSpinner";

const DefaultPaymentForm = ({ formData, handleInputChange, handleSubmit, isSubmitting }) => {

    return (
        <div className="max-w-7xl mx-auto">

            {/* Notice */}
            <div className="bg-indigo-900 text-white text-sm px-4 py-3 mb-6 rounded shadow">
                These payment terms will be viewed by instructors and agencies with whom you do not have a contract or set up a link in the contract set up page.
            </div>

            {/* BASE VALUE */}
            <BaseValueSection
                values={formData}
                onValueChange={handleInputChange}
            />

            {/* PAYMENT TERMS */}
            <Section title="PAYMENT TERMS">
                <FormRow
                    leftLabel="Payment Terms *"
                    leftValue="90"
                    rightLabel="in days"
                    rightValue=""
                    oneSided
                />
            </Section>

            {/* Save Button */}
            <SubmitButtonWithSpinner
                onClick={handleSubmit}
                isSubmitting={isSubmitting}
                label="Save Changes"
            />

        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="mb-6">
        <div className="bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-t">
            {title}
        </div>
        <div className="bg-white border border-yellow-600 border-t-0 p-4">
            {children}
        </div>
    </div>
);

const FormRow = ({
    leftLabel,
    leftValue,
    rightLabel,
    rightValue,
    oneSided = false,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
        <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-gray-700">{leftLabel}</label>
            <input
                type="text"
                defaultValue={leftValue}
                className="w-20 border rounded px-2 py-1 text-sm"
            />
        </div>
        {!oneSided && (
            <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700">{rightLabel}</label>
                <input
                    type="text"
                    defaultValue={rightValue}
                    className="w-20 border rounded px-2 py-1 text-sm"
                />
            </div>
        )}
    </div>
);

export default DefaultPaymentForm;
