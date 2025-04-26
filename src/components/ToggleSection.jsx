import CustomCheckbox from "./CustomCheckbox";

export const ToggleSection = ({
    title,
    enabled,
    onToggle,
    children,
    toggleLabel
}) => {
    return (
        <div className="mb-6 m-auto border border-gray-200 rounded shadow-sm ">
            <div className="flex items-center mb-3 p-2">
                <CustomCheckbox
                    id={`${title}-toggle`}
                    type="checkbox"
                    isChecked={enabled}
                    onChange={onToggle}
                    className="mr-2"
                />
                <label className="text-sm font-medium">{toggleLabel}</label>
            </div>
            {enabled && (
                <div className="border border-gray-200 rounded">
                    <div className="bg-yellow-600 text-white font-medium px-4 py-2 rounded-t">
                        {title}
                    </div>
                    <div className="bg-white p-2">
                        {children} {/* Force no padding with inline style */}
                    </div>
                </div>
            )}
        </div>

    );
};