export const TableHeader = ({ columns }) => {
    return (
        <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
            {columns.map((column, index) => (
                <div
                    key={index}
                    className={`col-span-${column.span} font-medium text-gray-700 text-sm uppercase tracking-wider ${column.align === 'right' ? 'text-right' : ''}`}
                >
                    {column.label}
                </div>
            ))}
        </div>
    );
};