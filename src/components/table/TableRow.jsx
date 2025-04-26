// components/table/TableRow.jsx
export const TableRow = ({
    children,
    isSelected = false,
    onSelect,
    selectable = true,
    className = ''
}) => {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''} ${className}`}
        >
            {selectable && (
                <div className="md:hidden mr-3 mt-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                </div>
            )}
            {children}
        </div>
    );
};