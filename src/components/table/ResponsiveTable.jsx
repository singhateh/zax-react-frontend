import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';

export const ResponsiveTable = ({
    columns,
    data,
    selectedItems = [],
    onSelect,
    selectable = true,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${className}`}>
            <TableHeader columns={columns} />

            {data.map((item, index) => (
                <TableRow
                    key={index}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={() => onSelect && onSelect(item.id)}
                    selectable={selectable}
                >
                    {columns.map((column, colIndex) => {
                        const cellContent = column.render
                            ? column.render(item)
                            : item[column.key];

                        return (
                            <TableCell
                                key={colIndex}
                                className={`md:col-span-${column.span} ${colIndex === 0 ? 'mb-3 md:mb-0' : 'mt-2 md:mt-0'}`}
                                mobileLabel={column.label}
                                align={column.align}
                                isAction={column.key === 'action'}
                            >
                                {column.key === 'status' ? (
                                    <StatusBadge status={cellContent} />
                                ) : column.key === 'action' ? (
                                    <ActionButton
                                        isSelected={selectedItems.includes(item.id)}
                                        onClick={() => onSelect && onSelect(item.id)}
                                        mobileLabel="Select"
                                        desktopLabel="Select"
                                        selectedMobileLabel="Selected"
                                        selectedDesktopLabel="Selected"
                                    />
                                ) : (
                                    cellContent
                                )}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </div>
    );
};