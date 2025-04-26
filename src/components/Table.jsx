// components/Table.js
import React from 'react';
import Button from './Button';

export default function Table({ columns, data, emptyMessage, className = '', totalItems, itemsPerPage, totalPages, setCurrentPage, currentPage }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.header}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td
                                        key={`${rowIndex}-${column.accessor}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                    >
                                        {column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {totalItems > itemsPerPage && (
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            )}

        </div>
    );
}