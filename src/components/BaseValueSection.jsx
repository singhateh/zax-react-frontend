import { FormRow } from "./FormRow";
import { FormSection } from "./FormSection";

export const BaseValueSection = ({ values, onValueChange }) => {
    return (
        <FormSection title="BASE VALUE" note="(ADD values excluding VAT)">
            <FormRow
                leftLabel="Medical report without records review *"
                leftValue={values.medical_report_without_record_review}
                leftOnChange={onValueChange('medical_report_without_record_review')}
                rightLabel="Medical report with records review *"
                rightValue={values.medical_report_with_record_review}
                rightOnChange={onValueChange('medical_report_with_record_review')}
            />
            <FormRow
                leftLabel="Addendum Report *"
                leftValue={values.addendum_report}
                leftOnChange={onValueChange('addendum_report')}
                rightLabel="Addendum Letter *"
                rightValue={values.addendum_letter}
                rightOnChange={onValueChange('addendum_letter')}
            />
            <FormRow
                leftLabel="Do not generate invoice for the first"
                leftValue={values.do_not_generate_invoice_for_the_first}
                leftOnChange={onValueChange('do_not_generate_invoice_for_the_first')}
                rightLabel="DNA"
                rightValue={values.dna}
                rightOnChange={onValueChange('dna')}
            />
            <FormRow
                leftLabel="Part 35"
                leftValue={values.part_35}
                leftOnChange={onValueChange('part_35')}
                rightLabel="Medical report for multiple accidents"
                rightValue={values.medical_report_for_multiple_accidents_in_one_report}
                rightOnChange={onValueChange('medical_report_for_multiple_accidents_in_one_report')}
            />
        </FormSection>
    );
};