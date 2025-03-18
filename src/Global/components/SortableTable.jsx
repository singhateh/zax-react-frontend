import React, { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react"; // Import Lucid icons
import "../../styles/SortableTable.css";

// Custom Table Component
const SortableTable = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: columns[0].key,
    direction: "asc",
  });

  // Memoize sorted data to prevent unnecessary recalculations
  const sortedData = useMemo(() => {
    if (!sortConfig) return data; // No sorting applied, return original data

    const { key, direction } = sortConfig;
    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]); // Recalculate only if data or sortConfig changes

  // Handle column click for sorting
  const handleSort = (field) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === field &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key: field, direction });
  };

  const getSortIcon = (column) => {
    if (!sortConfig || sortConfig.key !== column) return null;

    // Use Lucid icons for sorting with styles applied
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="text-sm text-gray-500" />
    ) : (
      <ChevronDown className="text-sm text-gray-500" />
    );
  };

  useEffect(() => {
    // Set default sort when page loads, in case you want to set it for a specific column
    // Default is already handled by useState({ key: columns[0].key, direction: 'asc' })
  }, [columns]);

  return (
    <div className="overflow-x-auto shadow-lg border-t border-gray-200">
      <div className="overflow-y-auto max-h-150 w-full table-scroll-container">
        <table className="min-w-full table-auto border-collapse bg-white">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left cursor-pointer hover:bg-indigo-400 transition-all text-sm sm:text-base"
                  onClick={() => handleSort(column.key)} // Call handleSort when column header is clicked
                >
                  <div className="flex items-center justify-between">
                    {column.label}
                    <span className="ml-2">{getSortIcon(column.key)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-b-1 border-b-blue-200 hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-gray-900 text-sm sm:text-base"
                  >
                    {column.key === "image" ? (
                      <img
                        src={row[column.key]}
                        alt={column.label}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SortableTable;
