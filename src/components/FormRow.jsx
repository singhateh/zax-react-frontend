export const FormRow = ({
    leftLabel,
    leftValue,
    leftOnChange,
    rightLabel,
    rightValue,
    rightOnChange,
    leftReadOnly = false,
    rightReadOnly = false
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">{leftLabel}</label>
                <input
                    type="text"
                    value={leftValue}
                    onChange={leftOnChange}
                    readOnly={leftReadOnly}
                    className="w-20 border rounded px-2 py-1 text-sm"
                />
            </div>
            {rightLabel && (
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-700">{rightLabel}</label>
                    <input
                        type="text"
                        value={rightValue}
                        onChange={rightOnChange}
                        readOnly={rightReadOnly}
                        className="w-20 border rounded px-2 py-1 text-sm"
                    />
                </div>
            )}
        </div>
    );
};