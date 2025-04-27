import { FaTrashAlt } from "react-icons/fa";
import InputField from "./InputField";
import SelectField from "./SelectField";

export const EditableTable = ({
    columns,
    data,
    onAdd,
    onRemove,
    onCellChange,
    addButtonLabel
}) => {

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-2 py-2 text-left text-xs sm:text-sm md:text-base whitespace-nowrap ${column.key === 'venue_id' ? 'min-w-[300px]' : ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-2 py-2 text-left text-xs sm:text-sm md:text-base whitespace-nowrap">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column.key} className="py-2 px-2">
                                        {column.type === 'select' ? (
                                            <SelectField
                                                value={row[column.key]}
                                                onChange={onCellChange(rowIndex, column.key)}
                                                className={`rounded px-2 py-1 text-xs sm:text-sm ${column.key === 'venue_id' ? 'w-full' : 'w-full'}`}
                                                options={column.options}
                                            />
                                        ) : (
                                            <InputField
                                                type={column.type || 'text'}
                                                value={row[column.key]}
                                                onChange={onCellChange(rowIndex, column.key)}
                                                className={`w-full px-2 py-1 text-xs sm:text-sm ${column.readOnly ? 'bg-gray-100' : ''}`}
                                                readOnly={column.readOnly}
                                            />
                                        )}
                                    </td>
                                ))}
                                <td className="px-2 py-2">
                                    <button
                                        onClick={() => onRemove(rowIndex)}
                                        className="flex items-center cursor-pointer gap-1 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <FaTrashAlt className="text-xs sm:text-sm" />
                                        <span className="text-xs sm:text-sm">Remove</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={onAdd}
                className="mt-2 text-blue-600 text-xs sm:text-sm hover:underline"
            >
                {addButtonLabel}
            </button>
        </>
    );
};