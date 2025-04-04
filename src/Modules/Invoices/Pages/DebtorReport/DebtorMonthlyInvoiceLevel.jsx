import React, { useState, useEffect } from "react";

import allData from "../Cancel/allData";
import useSearchFilters from "../../hooks/useSearchFilters";

import InvoiceSearchCard from "../../../Components/InvoiceSearchCard";
import {
  CheckboxInput,
  IconButton,
} from "../../../../../Global/components/Inputs";
import DataTable from "../../../Components/DataTable";

function DebtorMonthlyInvoiceLevel() {
  const {
    filters,
    filteredData,
    searchPerformed,
    setFilteredData,
    ResetFilter,
    handleFilterChange,
    setSearchPerformed,
  } = useSearchFilters();
  const [loading, setLoading] = useState(true);
  const [loadingFilteredData, setLoadingFilteredData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const SearchCancelledInvoice = () => {
    setLoadingFilteredData(true);
    // Check if at least one filter is filled
    const hasFilters = Object.values(filters).some(
      (value) => value && value.toString().trim() !== ""
    );

    if (!hasFilters) {
      setFilteredData([]); // Return empty result if no filters are applied
      setSearchPerformed(true);
      setLoadingFilteredData(false);

      return;
    }

    const filtered = allData.filter((item) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip empty filters

        const filterValue = filters[key].toString().trim().toLowerCase();
        const itemValue = item[key]
          ? item[key].toString().trim().toLowerCase()
          : "";

        return itemValue.includes(filterValue);
      })
    );

    setFilteredData(filtered);
    setSearchPerformed(true);

    setTimeout(() => {
      setLoadingFilteredData(false);
    }, 1000);
  };

  const columns = [
    { label: "SN", key: "sn" },
    { label: "Zax ID", key: "zaxId" },
    { label: "Invoice Date", key: "invoiceDate" },
    { label: "Invoice No", key: "invoiceNo" },
    { label: "Instructor", key: "instructor" },
    { label: "Name", key: "name" },
    {
      label: "Gross (£)",
      key: "gross",
    },
    {
      label: "Balance (£)",
      key: "balance",
    },
    { label: "Due Date", key: "dueDate" },
    { label: "Status", key: "status" },
    // { label: "Action", key: "action" },
  ];

  const handleCancelAction = (item) => {
    alert(`Invoice with ID ${item.id} has been cancelled.`);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin font-bold rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="">
          <InvoiceSearchCard
            title="Cancelled Invoices"
            filters={filters}
            filteredData={filteredData}
            searchPerformed={searchPerformed}
            onFilterChange={handleFilterChange}
            onSearch={SearchCancelledInvoice}
            onReset={ResetFilter}
          />
          {/* select all button  */}
          <div className="flex flex-row gap-2 mt-2 items-center">
            <h3>Select All: </h3>
            <CheckboxInput />
            <IconButton text="Open" className="rounded-[8px] p-1 bg-gray-500" />
            <IconButton
              text="Paid"
              className="rounded-[8px] p-1 bg-green-500"
            />
            <IconButton
              text="Part Paid"
              className="rounded-[8px] p-1 bg-pink-300"
            />
            <IconButton
              text="Cancelled"
              className="rounded-[8px] p-1 bg-red-400"
            />
          </div>
          {/* Display Results */}

          <DataTable
            filteredData={filteredData}
            loadingFilteredData={false} // Set this based on your loading state
            searchPerformed={searchPerformed}
            columns={columns}
            onActionClick={handleCancelAction}
          />
        </div>
      )}
    </div>
  );
}

export default DebtorMonthlyInvoiceLevel;
