import { PlusSquare } from "lucide-react";
import { EditableTable } from "./EditableTable";
import RadioGroup from "./RadioGroup";
import { ToggleSection } from "./ToggleSection";

export const DiscountsSection = ({
    enabled,
    onToggle,
    discounts,
    formData,
    onAddDiscount,
    onRemoveDiscount,
    discountOptions,
    handleDiscountChange,
    handleInputChange,
    labelText = 'Add More Discount'
}) => {
    const discountColumns = [
        { key: 'number_of_reports', label: 'No of reports', type: 'number' },
        {
            key: 'bulk_discount_type',
            label: 'Type',
            type: 'select',
            options: discountOptions
        },
        { key: 'discount_amount', label: 'Amount', type: 'number' }
    ];

    // Add auto-calculated invoice value to each discount
    const discountData = Object.values(discounts);


    return (
        <ToggleSection
            title="BULK DISCOUNT"
            enabled={enabled}
            onToggle={onToggle}
            toggleLabel="Apply Discounts (Optional)"
        >
            <div className="flex gap-25 items-center mb-4">
                <p className="text-gray-500 text-sm mb-3">(Discounts are applied monthly)</p>
                <RadioGroup
                    label="Payment Terms *"
                    name="bulk_discount"
                    options={[
                        { value: "NumberOfReports", label: "No of reports" },
                        { value: "InvoiceValue", label: "Invoice Value" }
                    ]}
                    value={formData?.bulk_discount}
                    onChange={handleInputChange('bulk_discount')}
                />
            </div>
            <EditableTable
                columns={discountColumns}
                data={discountData}
                onAdd={onAddDiscount}
                onRemove={onRemoveDiscount}
                onCellChange={handleDiscountChange}
                addButtonLabel={<div className='flex gap-2 cursor-pointer'><PlusSquare /> {labelText}</div>}
            />
        </ToggleSection>
    );
};
