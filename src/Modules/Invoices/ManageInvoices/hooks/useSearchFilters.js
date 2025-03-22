import { useState } from "react";
import { Edit, Mail, Printer, FileText } from "lucide-react";

const useSearchFilters = () => {
  const [filters, setFilters] = useState({
    appointmentType: "",
    zaxId: "",
    name: "",
    dateOfBirth: "",
    postcode: "",
    invoiceReference: "",
    type: "",
    invoiceDateFrom: "",
    invoiceDateTo: "",
    agency: "",
    agencyReference: "",
    solicitor: "",
    solicitorReference: "",
    showAll: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const ResetFilter = () => {
    setFilters({
      appointmentType: "",
      zaxId: "",
      name: "",
      dateOfBirth: "",
      postcode: "",
      invoiceReference: "",
      type: "",
      invoiceDateFrom: "",
      invoiceDateTo: "",
      agency: "",
      agencyReference: "",
      solicitor: "",
      solicitorReference: "",
      showAll: false,
    });
    setFilteredData([]);
    setSearchPerformed(false);
  };
  return {
    filters,
    filteredData,
    searchPerformed,
    handleFilterChange,
    ResetFilter,
    setFilteredData,
    setSearchPerformed,
  };
};

export default useSearchFilters;
