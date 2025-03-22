import React, { useState } from "react";
import {
  SelectInput,
  TextInput,
  SearchInput,
  DateInput,
  CheckboxInput,
  IconButton,
} from "../../../../Global/components/Inputs";
import { SearchIcon, ArrowDownAZ } from "lucide-react";

const InvoiceSearchCard = ({
  title,
  filters,
  onFilterChange,
  onSearch,
  onReset,
}) => {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-[8px] p-6">
      <h2 className="text-2xl text-gray-800 mb-1 mt-[-20px]">{title}</h2>

      {/* Search Fields */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-2">
        <label className="text-gray-700 text-sm mb-1">Appt. Type</label>
        <SelectInput options={[{ value: "All", label: "All" }]} />

        <label className="text-gray-700 text-sm mb-1">Zax ID</label>
        <TextInput
          value={filters.zaxId}
          onChange={(e) => onFilterChange("zaxId", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Name</label>
        <SearchInput
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Date of Birth</label>
        <DateInput
          className="flex flex-row justify-between"
          value={filters.dateOfBirth}
          onChange={(e) => onFilterChange("dateOfBirth", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Postcode</label>
        <TextInput
          value={filters.postcode}
          onChange={(e) => onFilterChange("postcode", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Inv. / Cre. Ref.</label>
        <TextInput
          className="flex flex-row justify-between"
          value={filters.invoiceReference}
          onChange={(e) => onFilterChange("invoiceReference", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Type</label>
        <SelectInput
          options={[
            { value: "", label: "~Please Select~" },
            { value: "Invoice", label: "Invoice" },
            { value: "Credit", label: "Credit" },
          ]}
        />

        <label className="text-gray-700 text-sm mb-1">Inv. Date from</label>
        <DateInput
          value={filters.invoiceDateFrom}
          onChange={(e) => onFilterChange("invoiceDateFrom", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Inv. Date to</label>
        <DateInput
          value={filters.invoiceDateTo}
          onChange={(e) => onFilterChange("invoiceDateTo", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Agency</label>
        <SearchInput
          value={filters.agency}
          onChange={(e) => onFilterChange("agency", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Agency Ref.</label>
        <TextInput
          value={filters.agencyReference}
          onChange={(e) => onFilterChange("agencyReference", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Solicitor</label>
        <SearchInput
          value={filters.solicitor}
          onChange={(e) => onFilterChange("solicitor", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Solicitor Ref.</label>
        <TextInput
          className="flex flex-row justify-between"
          value={filters.solicitorReference}
          onChange={(e) => onFilterChange("solicitorReference", e.target.value)}
        />

        <label className="text-gray-700 text-sm mb-1">Show All</label>
        <CheckboxInput
          value={filters.showAll}
          onChange={(e) => onFilterChange("showAll", e.target.checked)}
        />
      </div>

      {/* Search and Reset Buttons */}
      <div className="flex justify-end mt-2 gap-2">
        <IconButton
          text="Search"
          icon={SearchIcon}
          className="rounded-[8px] p-1"
          onClick={onSearch}
        />
        <IconButton
          text="Reset Filter"
          className="rounded-[8px] p-1"
          icon={ArrowDownAZ}
          onClick={onReset}
        />
      </div>
    </div>
  );
};

export default InvoiceSearchCard;
