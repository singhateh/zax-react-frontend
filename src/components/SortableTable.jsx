import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, PlusIcon, MinusIcon, BoxIcon } from 'lucide-react';
import "../../styles/SortableTable.css";
import { useMediaQuery } from '../hooks/useMediaQuery';

const SortableTable = ({
    columns,
    data,
    loading,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    checkboxColumn = false,
    handleDeleteMultiple,
    handleDeleteSingle,
    handleExport,
    serverSidePagination
}) => {
    const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key || '', direction: 'asc' });
    const [isPaginationLoading, setIsPaginationLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const hasPagination = typeof currentPage === 'number' && typeof totalPages === 'number' && typeof itemsPerPage === 'number';


    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;
        const { key, direction } = sortConfig;

        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
        return serverSidePagination || !hasPagination
            ? sortedData
            : sortedData.slice(
                (currentPage - 1) * itemsPerPage,
                (currentPage - 1) * itemsPerPage + itemsPerPage
            );
    }, [sortedData, currentPage, itemsPerPage, hasPagination, serverSidePagination]);


    const handleSort = (field) => {
        let direction = 'asc';
        if (sortConfig.key === field && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: field, direction });
    };

    const getSortIcon = (column) => {
        if (!sortConfig || sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="text-sm text-gray-500" />
        ) : (
            <ChevronDown className="text-sm text-gray-500" />
        );
    };

    const handlePaginationChange = (newPage) => {
        setIsPaginationLoading(true);
        handlePageChange(newPage);
        setIsPaginationLoading(false);
    };

    const handleRowSelection = (e, rowId) => {
        if (e.target.checked) {
            setSelectedRows((prev) => [...prev, rowId]);
        } else {
            setSelectedRows((prev) => prev.filter((id) => id !== rowId));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allRowIds = paginatedData.map((row) => row.id);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    const toggleRowExpansion = (rowId) => {
        setExpandedRow(prev => prev === rowId ? null : rowId);
    };

    const renderMobileCards = () => {
        if (loading || isPaginationLoading) {
            return (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 overflow-hidden">
                            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                            <div className="grid grid-cols-2 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="truncate">
                                        <div className="h-3 bg-gray-100 rounded mb-1 w-2/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (paginatedData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                    <BoxIcon className="text-4xl text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">No data found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {checkboxColumn && (
                    <div className="px-3 py-3 text-left align-middle flex flex-wrap items-center gap-2 relative justify-between">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedRows.length === paginatedData.length}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-0"
                            />
                            <span className="text-sm text-gray-700">Select All</span>
                        </label>

                        {selectedRows.length > 0 && (
                            <div className="flex gap-2 mt-2 sm:mt-0 sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-4">
                                <button
                                    onClick={() => handleDeleteMultiple(selectedRows)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium"
                                >
                                    Export
                                </button>
                            </div>
                        )}
                    </div>


                )}
                {paginatedData.map((row) => {
                    const imageColumn = columns.find(col => col.key === 'image');
                    const imageUrl = imageColumn ? row[imageColumn.key] : null;
                    const displayColumns = columns.filter(col => col.key !== 'image' && col.key !== 'action' && col.key !== 'status');
                    const actionColumn = columns.find(col => col.key === 'action');
                    const displayChild = columns.find(col => col.key === 'childData');

                    return (
                        <div key={row.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {imageUrl && (
                                <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt="Item"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'path/to/default-image.jpg';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {checkboxColumn && (
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={(e) => handleRowSelection(e, row.id)}
                                                className="h-4 w-4 mt-0 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {displayColumns[0] ? row[displayColumns[0].key] || 'N/A' : 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {displayColumns[1] ? row[displayColumns[1].key] || 'N/A' : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    {row.status && (
                                        <span className={`px-2 py-1 rounded-md text-xs whitespace-nowrap flex-shrink-0 ${row.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            row.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {row.status}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    {displayColumns.slice(2).map((column) => (
                                        <div key={column.key} className="min-w-0">
                                            <p className="text-gray-500 text-xs truncate">{column.label}</p>
                                            <p className="text-gray-900 truncate">{row[column.key] || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>

                                {expandedRow === row.id && row.childData && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 overflow-x-auto">
                                        <ChildDataTable data={row.childData} />
                                    </div>
                                )}

                                {/* Footer & Action Buttons */}
                                <div className="mt-3 flex justify-between items-center">
                                    {displayChild && (
                                        <button
                                            onClick={() => toggleRowExpansion(row.id)}
                                            className="text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap"
                                        >
                                            {expandedRow === row.id ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}

                                    {handleDeleteSingle && (
                                        <button
                                            onClick={() => handleDeleteSingle(row.id)}
                                            className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {actionColumn && row[actionColumn.key] && (row[actionColumn.key])}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };


    const renderDesktopTable = () => (
        <div className={`overflow-x-auto border-t border-gray-200 ${isPaginationLoading ? 'opacity-60' : ''}`}>
            <div className="overflow-y-auto max-h-150 w-full table-scroll-container">
                <table className="min-w-full table-auto border-collapse bg-white">
                    <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white z-10">
                        <tr>
                            {checkboxColumn && (
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedRows.length === paginatedData.length}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-0"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 truncate py-3 text-center cursor-pointer hover:bg-indigo-400 transition-all text-sm sm:text-base ${column.align ? `text-${column.align}` : ''}`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className={`${column.align && !column.sortable ? `text-${column.align}` : 'flex items-center justify-between'}`}>
                                        {column.label}
                                        {column.sortable && <span className="ml-2">{getSortIcon(column.key)}</span>}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading || isPaginationLoading ? (
                            new Array(itemsPerPage ?? columns.length).fill("").map((_, rowIndex) => (
                                <tr key={rowIndex} className="animate-pulse">
                                    {checkboxColumn && (
                                        <td className="px-4 py-3">
                                            <div className="h-10 bg-gray-300 rounded-md"></div>
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-4 py-3">
                                            <div className="h-10 bg-gray-300 rounded-md"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (checkboxColumn ? 1 : 0)} className="px-4 py-3 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <BoxIcon className="mx-auto text-5xl text-gray-300 mb-3" />
                                        <p className="text-xl font-semibold text-gray-600">Oops, no data found!</p>
                                        <p className="text-sm text-gray-500">
                                            It seems we couldn't find any matching records.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row) => (
                                <React.Fragment key={row.id}>
                                    <tr className="border-b-1 border-b-blue-200 hover:bg-gray-50">
                                        {checkboxColumn && (
                                            <td className="px-4 py-3 text-gray-900 text-sm sm:text-base">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row.id)}
                                                    onChange={(e) => handleRowSelection(e, row.id)}
                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-0"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column, index) => (
                                            <td
                                                key={column.key}
                                                className={`px-4 py-2 text-gray-900 text-sm sm:text-base ${column.align ? `text-${column.align}` : ''}`}
                                            >
                                                {index === 0 && row.childData && row.childData.length > 0 && (
                                                    <span
                                                        onClick={() => toggleRowExpansion(row.id)}
                                                        className="cursor-pointer text-blue-500 inline-flex items-center space-x-2"
                                                    >
                                                        {expandedRow === row.id ? (
                                                            <MinusIcon className="text-sm text-gray-500" />
                                                        ) : (
                                                            <PlusIcon className="text-sm text-gray-500" />
                                                        )}
                                                    </span>
                                                )}
                                                {column.key === 'image' ? (
                                                    <img
                                                        src={row[column.key]}
                                                        alt={column.label}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-700">{row[column.key] || 'N/A'}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    {expandedRow === row.id && row.childData && (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="px-4 py-3">
                                                <div className="ml-2">
                                                    <ChildDataTable data={row.childData} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
        <div className="relative w-full">
            {!isMobile && selectedRows.length > 0 && (
                <div className="absolute top-15 right-4 z-10 flex space-x-2">
                    <button
                        onClick={() => handleDeleteMultiple(selectedRows)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-sm text-sm font-medium"
                    >
                        Delete Selected
                    </button>
                    <button
                        onClick={handleExport}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm text-sm font-medium"
                    >
                        Export
                    </button>
                </div>
            )}

            {isMobile ? renderMobileCards() : renderDesktopTable()}

            {hasPagination && (
                <div className={`flex justify-between items-center px-4 py-3 bg-white ${isPaginationLoading ? 'opacity-70 pointer-events-none' : ''} mt-4`}>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePaginationChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg disabled:opacity-50 cursor-pointer"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => handlePaginationChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg disabled:opacity-50 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChildDataTable = ({ data }) => {
    if (!data || data.length === 0) return <p className="text-center text-gray-500">No data available</p>;

    return (
        <div className="overflow-x-auto bg-white">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {Object.keys(data[0]).map((key, index) => (
                            <th key={index} className="px-4 py-2 text-left font-medium text-sm">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            {Object.keys(row).map((key, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                                    {key === 'image' && row[key] ? (
                                        <img
                                            src={row[key]}
                                            alt="Item"
                                            className="w-12 h-12 object-cover rounded-full border-2 border-gray-300"
                                        />
                                    ) : (
                                        <span className="truncate">{row[key] || 'N/A'}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SortableTable;