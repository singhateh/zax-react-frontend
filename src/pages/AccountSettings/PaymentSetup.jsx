import React, { useState, useEffect } from "react";
import DefaultPaymentForm from "./PaymentSetups/DefaultPaymentForm";
import InstructorPaymentForm from "./PaymentSetups/InstructorPaymentForm";
import AgencyPaymentForm from "./PaymentSetups/AgencyPaymentForm";
import { Folder } from "lucide-react";
import api from "../../services/api";
import Swal from "sweetalert2";
import Skeleton from "../../components/Skeleton";
import { useMediaQuery } from "../../hooks/useMediaQuery";

// Tabs
const tabs = ["Default Payment", "Instructor Payments", "Agency Payments"];

const initialFormData = {
  paymentOption: "completion",
  days: "",
  comments: "",
  report_type_id: "",
  agency_solicitor_id: "",
  medical_report_without_record_review: "",
  medical_report_with_record_review: "",
  addendum_report: "",
  addendum_letter: "",
  do_not_generate_invoice_for_the_first: "",
  dna: "",
  part_35: "",
  medical_report_for_multiple_accidents_in_one_report: "",
  in_days: "90",
  default_payment_terms: 90,
  payment_terms_type: "On_Completion",
  comment: "",
  canSetVenueBasePrice: false,
  canSetDiscount: false,
  bulk_discount: 'NumberOfReports',
  bulk_discount_type: 'FixedAmount'
};


const initialVeneuData =
{
  venue_id: "",
  report_with_record: "",
  report_without_record: "",
  addendum_report_venue: "",
  dna_venue: "",
  addendum_letter_venue: ""
}


const initialDiscountData =
{
  bulk_discount_type: 'FixedAmount',
  number_of_reports: "",
  discount_amount: "",
  discount_percentage: "",
}

const PaymentSetup = ({ paymentTab = 'Default Payment', agencySolicitorId = null }) => {
  const [defaultPayments, setDefaultPayments] = useState([]);
  const [activeTab, setActiveTab] = useState(paymentTab);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAgencySolicitor, setSelectedAgencySolicitor] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');


  const [formData, setFormData] = useState(initialFormData);
  const [venueRates, setVenueRates] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const baseUrl = 'doctor/payment-setups/';


  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await api.get(`${baseUrl}index`);

      if (response.data.data) {

        setDefaultPayments(response.data.data);
        setFormData(prev => ({
          ...initialFormData,
          ...response.data.data
        }));
      }

      // Update state with fetched data
      if (response.data.agencies) {
        setAgencies(response.data.agencies);
      }
      if (response.data.instructors) {
        setInstructors(response.data.instructors);
      }
      if (response.data.venues) {
        setVenues(response.data.venues);
      }
      if (response.data.report_types) {
        setReportTypes(response.data.report_types);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch payment data");
      console.error("Error fetching payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);


  const handleFieldChange = (field) => async (selectedOption) => {
    try {
      // Get the selected value from different input types
      const selectedValue = selectedOption?.value ??
        selectedOption?.target?.value ??
        (selectedOption !== undefined ? selectedOption : '');

      if (field === 'agency_solicitor') {
        setSelectedAgencySolicitor(selectedValue || null);
      } else if (field === 'reportType_id') {
        setSelectedReportType(selectedValue || null);
      }

      // Get current form data values we'll need
      const currentAgency = field === 'agency_solicitor' ? selectedValue : selectedAgencySolicitor;
      const currentReportType = field === 'reportType_id' ? selectedValue : selectedReportType;

      // Only make API call if we have both required values
      if (currentAgency && currentReportType) {
        api.post(`${baseUrl}getPayment`, {
          agency_solicitor: currentAgency,
          report_type_id: currentReportType,
          status: field
        }).then(response => {
          // Update form data only once with the API response
          const currentData = response.data.data;

          setFormData({
            ...initialFormData,
            ...currentData,
            agency_solicitor_id: currentAgency,
            report_type_id: currentReportType,
            canSetVenueBasePrice: Boolean(currentData?.set_value_based_payment_terms),
            canSetDiscount: Boolean(currentData?.set_discount),
          });

          const venueList = Array.isArray(response?.data?.venueLists) ? response.data.venueLists : [];
          const discountList = Array.isArray(response?.data?.discountLists) ? response.data.discountLists : [];

          const normalizedVenueList = venueList.some(Array.isArray) ? venueList.flat() : venueList;

          setVenueRates(normalizedVenueList);

          setDiscounts(
            discountList.map(item => ({
              ...item,
              bulk_discount_type: formData.bulk_discount_type,
            }))
          );

        }).catch(error => {
          setError(error.message || "Failed to update payment data");
        });
      } else {
        // If we don't have both values, just update the changed field in form data
        setFormData(prev => ({
          ...prev,
          [field]: selectedValue || ''
        }));
      }

    } catch (error) {
      setError(error.message || "Failed to update field");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedAgencySolicitor(agencySolicitorId);
    setSelectedReportType(null);

    if (tab === 'Default Payment') {
      setFormData({
        ...initialFormData,
        ...defaultPayments,
        canSetVenueBasePrice: Boolean(defaultPayments?.canSetVenueBasePrice),
        canSetDiscount: Boolean(defaultPayments?.canSetDiscount),
      });
      setVenueRates([]);
      setDiscounts([]);
    } else {
      setFormData({
        ...initialFormData,
        agency_solicitor_id: agencySolicitorId,
        canSetVenueBasePrice: Boolean(defaultPayments?.canSetVenueBasePrice),
        canSetDiscount: Boolean(defaultPayments?.canSetDiscount),
      });

      setVenueRates([]);    // good
      setDiscounts([]);  // fix this line
    }
  };

  const handleInputChange = (field) => (input) => {
    const value = input?.target?.value ?? input;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVenueChange = (index, field) => (input) => {
    const value = input?.target?.value ?? input?.value ?? input;

    const updatedVenueRates = [...venueRates];
    updatedVenueRates[index][field] = value;
    setVenueRates(updatedVenueRates);
  };

  const handleDiscountChange = (index, field) => (input) => {
    const value = input?.target?.value ?? input?.value ?? input;

    const updatedDiscountRates = [...discounts];
    updatedDiscountRates[index][field] = value;
    setDiscounts(updatedDiscountRates);
  };

  const venueOptions = venues.map((venue) => ({
    label: venue.consulting_venue,
    value: venue.id
  }));

  const instructorOptions = Object.values(instructors)?.map((instructor) => ({
    label: instructor.company_name,
    value: instructor.id,
  }));

  const agencyOptions = Object.values(agencies)?.map((agency) => ({
    label: agency.company_name,
    value: agency.id,
  }));

  const reportTypeOptions = reportTypes.map((type) => ({
    label: type.name,
    value: type.id,
  }));


  const renderTabComponent = () => {
    if (loading) {
      return <Skeleton type="rect" count={7} height="50px" />;
    }

    if (error) {
      return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    switch (activeTab) {
      case "Default Payment":
        return <DefaultPaymentForm
          formData={formData} setFormData={setFormData}
          handleInputChange={handleInputChange} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "Instructor Payments":
        return (
          <InstructorPaymentForm
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            selectedAgencySolicitor={selectedAgencySolicitor}
            selectedReportType={selectedReportType}
            formData={formData}
            instructors={instructors}
            reportTypes={reportTypes}
            setFormData={setFormData}
            handleFieldChange={handleFieldChange}
            handleVenueChange={handleVenueChange}
            handleInputChange={handleInputChange}
            handleDiscountChange={handleDiscountChange}
            setVenueRates={setVenueRates}
            venueRates={venueRates}
            initialVeneuData={initialVeneuData}
            initialDiscountData={initialDiscountData}
            venueOptions={venueOptions}
            instructorOptions={instructorOptions}
            reportTypeOptions={reportTypeOptions}
            setDiscounts={setDiscounts}
            discounts={discounts}
          />
        );
      case "Agency Payments":
        return (
          <AgencyPaymentForm
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            selectedAgencySolicitor={selectedAgencySolicitor}
            selectedReportType={selectedReportType}
            formData={formData}
            instructors={instructors}
            reportTypes={reportTypes}
            setFormData={setFormData}
            handleFieldChange={handleFieldChange}
            handleVenueChange={handleVenueChange}
            handleInputChange={handleInputChange}
            handleDiscountChange={handleDiscountChange}
            setVenueRates={setVenueRates}
            venueRates={venueRates}
            initialVeneuData={initialVeneuData}
            initialDiscountData={initialDiscountData}
            venueOptions={venueOptions}
            agencyOptions={agencyOptions}
            reportTypeOptions={reportTypeOptions}
            setDiscounts={setDiscounts}
            discounts={discounts}
          />
        );
      default:
        return null;
    }
  };


  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        venueRates,
        discounts,
      };

      const url = `${baseUrl}store`;

      const response = await api.post(url, payload);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Payment setup has been successfully saved.',
          timer: 2500,
          showConfirmButton: false,
        });
        // fetchPaymentData();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: response.data.message || 'Something might be wrong...',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error?.response?.data?.message || 'Failed to save payment setup.',
      });
      console.error('Submission Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={`max-w-7xl mx-auto ${agencySolicitorId ? 'mt-0' : 'mt-20'}  md:px-0 lg:px-4`}>

      {!agencySolicitorId && (
        <h2 className="text-xl flex gap-3 font-bold text-gray-800 mb-4">
          <Folder /> Payment Setup
        </h2>
      )}

      {/* Responsive Tabs */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-nowrap sm:flex-wrap border-b mb-4 min-w-[300px] sm:min-w-0">
          {tabs
            .filter(tab => !agencySolicitorId || tab === paymentTab)
            .map((tab) => {
              const label = isMobile ? tab.replace(/ ?Payments?/, "") : tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 whitespace-nowrap border-b-2 cursor-pointer font-medium text-sm transition-all ${activeTab === tab
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {label}
                </button>
              );
            })
          }
        </div>
      </div>

      {/* Tab Content */}
      {renderTabComponent()}

      {/* Fixed: Only call handleTabClick if agencySolicitorId changes */}
      {useEffect(() => {
        if (agencySolicitorId) {
          handleTabClick(paymentTab);
        }
      }, [agencySolicitorId])}
    </div>
  );
};

export default PaymentSetup;
