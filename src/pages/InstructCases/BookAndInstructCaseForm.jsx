import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Calendar, FileUp, Layers, Save } from "lucide-react";
import api from "../../services/api";
import CollapsibleSection from "../../components/CollapsibleSection";
import InstructLevelSection from "./InstructLevelSection";
import Skeleton from "../../components/Skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentInfoCard from "../ZaxCal/Appointments/AppointmentInfoCard";
import ClaimantDetails from "./ClaimantDetails";
import AccidentDetails from "./AccidentDetails";
import OtherDetails from "./OtherDetails";
import SolicitorAndAgencyDetails from "./SolicitorAndAgencyDetails";
import MedicalRecordsDetails from "./MedicalRecordsDetails";
import SpecialInstructionDetails from "./SpecialInstructionDetails";
import ReportsDetails from "./ReportsDetails";
import CaseDocumentUpload from "../../components/CaseDocumentUpload";
import { appointmentTobeModeDates, appointmentTobeModeDays, genders, recommendedReportingTool } from "../../utilities/constant";

export default function BookAndInstructCaseForm() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const appointment = state?.appointment;
    const editCaseData = state?.case;

    const goBack = () => {
        navigate(-1);
    };

    const [pageTitle, setPageTitle] = useState(null);
    const [availableAddresses, setAvailableAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [levels, setLevels] = useState([]);
    const [experts, setExperts] = useState([]);
    const [solicitors, setSolicitors] = useState([]);
    const [solicitorDiaries, setSolicitorDiaries] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [titles, setTitles] = useState([]);

    const [accidentTypes, setAccidentTypes] = useState([]);
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [venues, setVenues] = useState([]);

    const [reportTypes, setReportTypes] = useState([]);

    const [specialInstructions, setSpecialInstructions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSolicitorLoading, setIsSolicitorLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);



    const getPageTitle = (data) => {
        setPageTitle(appointment ? "Book and Instruct" : (editCaseData ? 'Edit Case' : data));
    };


    const initialFormValues = {
        medco_reference: '',
        is_report: "No",
        medical_records: "No",
        is_link: false,
        is_re_instruct: false,
        is_appointment_overdue: false,
        appointment_type_id: 1,
        accident_type_id: 1,
        report_type_id: 1,
        sla_types: 2,
        consulting_type: 'F2F',

        level_id: 2,
        agency_id: '',
        agency_reference: '',
        agency_case_handle: '',
        agency_dna_email: '',
        agency_appointment_email: '',
        agency_report_or_invoice_email: '',

        solicitor_id: '',
        solicitor_reference: '',
        solicitor_case_handle: '',
        solicitor_dna_email: '',
        solicitor_appointment_email: '',
        solicitor_report_or_invoice_email: '',

        is_litigant: false,
        instructing_party: '',
        instructing_party_reference: '',
        instructing_party_dna_email: '',
        instructing_party_appointment_email: '',
        instructing_party_report_or_invoice_email: '',

        title: '',
        first_name: "",
        last_name: "",
        gender: '',
        dob: '',
        email: '',
        postcode: '',
        address_1: '',
        address_2: '',
        address_3: '',
        country: '',
        town: '',

        accident_date: '',
        time_since_the_accident: "",
        age_at_the_time_of_accident: "",

        medical_record: "",

        is_exceptional_injuries: 'No',
        exceptional_injuries: "",
        is_exceptional_circumstances: "No",
        exceptional_circumstances: "",
        is_defendants_version_of_events: "No",
        defendants_version_of_events: "",

        claimantRelation: '',
        claimantContactNumber: "",
        accidentDate: '',
        isRoadTrafficAccident: "",
        isRepresented: "",
        caseReference: "",
        appointmentDate: '',
        venue_id: "",

        notes: [],
        injuries: [],
        medicalRecords: [],

        appointment_to_be_made_after_by: "",
        by_week: "",
        days: "",
        appointment_to_be_made_after: "",

        startTime: '',
        endTime: '',
        duration: "",
        recommended_reporting_tool: "",
        instruction_received_date: "",
        add_special_instruction: "",
        special_instructions: "",
        description: "",
        reason: "",
    };

    // Usage in your component
    const [formData, setFormData] = useState({ ...initialFormValues });


    // Pre-fill the form with existing data if in edit mode
    useEffect(() => {
        if (editCaseData) {
            setFormData((prevData) => {
                const formattedData = {
                    ...editCaseData,
                    appointment_date: editCaseData.appointment_date ? new Date(editCaseData.appointment_date) : null,
                    dob: editCaseData.dob ? new Date(editCaseData.dob) : null,
                    accident_date: editCaseData.accident_date ? new Date(editCaseData.accident_date) : null,
                    appointment_to_be_made_after: editCaseData.appointment_to_be_made_after ? new Date(editCaseData.appointment_to_be_made_after) : null,
                    instruction_received_date: editCaseData.instruction_received_date ? new Date(editCaseData.instruction_received_date) : null,
                    medco_instruction_received_date: editCaseData.medco_instruction_received_date ? new Date(editCaseData.medco_instruction_received_date) : null,
                    appointed_date: editCaseData.appointed_date ? new Date(editCaseData.appointed_date) : null,
                    report_to_be_completed_within_date: editCaseData.report_to_be_completed_within_date ? new Date(editCaseData.report_to_be_completed_within_date) : null,
                };

                return {
                    ...prevData,
                    ...formattedData,
                };
            });
        }
    }, [editCaseData, pageTitle]);


    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                // Assuming this API endpoint returns all necessary data for the form
                const response = await api.get("/instruct-cases/case");

                const data = response.data;

                getPageTitle(data.pageTitle);
                setLevels(data.levels || []);
                setExperts(data.experts || []);
                setSolicitors(data.solicitors || []);
                setSolicitorDiaries(data.solicitor_dairies || []);
                setAgencies(data.agencies || []);
                setTitles(data.titles || []);
                setAccidentTypes(data.accidentTypes || []);
                setAppointmentTypes(data.appointmentTypes || []);
                setVenues(data.venues || []);

                setReportTypes(data.reportTypes || []);
                setSpecialInstructions(data.specialInstructions || []);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch form data", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'level_id' ? parseInt(value) : value;

        // Update solicitors when level_id changes
        if (name === 'level_id') {
            setFormData({ ...formData, solicitor_id: '' });
        }

        // Update form data
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    // Function to calculate year/month difference
    const calculateDateDifference = (fromDate, toDate = new Date()) => {
        if (!fromDate || !toDate) return '';

        const from = new Date(fromDate);
        const to = new Date(toDate);

        let years = to.getFullYear() - from.getFullYear();
        let months = to.getMonth() - from.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    };

    const calculateDate = (appointmentToField) => {
        let resultDate = null;

        const appointmentToBeMadeAfterBy = appointmentToField;
        const accidentDate = formData.accident_date;
        const byWeek = formData.by_week;
        const byDays = formData.days;

        // Helper function to format the date
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString("en-US"); // Format date to MM/DD/YYYY
        };

        // Validate if the date is valid
        const isValidDate = (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime()); // Check if the date is valid
        };

        // Handle accident_date with byWeek (weeks) and byDays (days)
        if (appointmentToBeMadeAfterBy === 'accident_date' && isValidDate(accidentDate)) {
            const accidentDateObj = new Date(accidentDate);

            // Handle byWeek logic
            if (byWeek) {
                resultDate = new Date(accidentDateObj); // Create a new date object to avoid mutating the original
                resultDate.setDate(resultDate.getDate() + (byWeek * 7)); // Adding the weeks (byWeek * 7)
            }

            // Handle byDays logic
            if (byDays) {
                if (resultDate) {
                    resultDate.setDate(resultDate.getDate() + byDays); // Add the days if resultDate is already set
                } else {
                    resultDate = new Date(accidentDateObj);
                    resultDate.setDate(resultDate.getDate() + byDays); // Adding the days if resultDate was not set
                }
            }
        }

        // Handle current_date with byWeek (weeks) and byDays (days)
        if (appointmentToBeMadeAfterBy === 'current_date') {
            const currentDate = new Date();

            // Handle byWeek logic
            if (byWeek) {
                resultDate = new Date(currentDate);
                resultDate.setDate(resultDate.getDate() + (byWeek * 7)); // Adding the weeks (byWeek * 7)
            }

            // Handle byDays logic
            if (byDays) {
                if (resultDate) {
                    resultDate.setDate(resultDate.getDate() + byDays); // Add the days if resultDate is already set
                } else {
                    resultDate = new Date(currentDate);
                    resultDate.setDate(resultDate.getDate() + byDays); // Adding the days if resultDate was not set
                }
            }
        }

        // Handle fixed_date (current date) directly
        if (appointmentToBeMadeAfterBy === 'fixed_date') {
            resultDate = new Date(); // Use current date
        }

        // Update formData with the formatted date if it has been calculated
        if (resultDate !== null) {
            const formattedDate = formatDate(resultDate); // Format the date
            setFormData({ ...formData, appointment_to_be_made_after: formattedDate }); // Set the formatted date
        }

        return resultDate;
    };

    const handleSelectAppointmentChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);

        console.log(selectedValue);

        const newFormData = {
            ...formData,
            [field]: selectedValue,
        };

        const calculatedDate = calculateDate(selectedValue);

        setFormData({
            ...newFormData,
            appointment_to_be_made_after: calculatedDate !== null ? calculatedDate : null, //
        });

        console.log(calculatedDate);
    };


    // Handle select change (supports React Select and native <select>)
    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);

        const newFormData = {
            ...formData,
            [field]: selectedValue,
        };

        // Handle agency auto-fill fields
        if (field === 'agency_id' && selectedValue) {
            const selectedAgency = Object.values(agencies).find(agency => agency.id === +selectedValue);
            if (selectedAgency) {
                newFormData.agency_dna_email = selectedAgency.dna_email || '';
                newFormData.agency_appointment_email = selectedAgency.appointment_email || '';
                newFormData.agency_report_or_invoice_email = selectedAgency.report_email || '';
            }
        }

        // Handle solicitor auto-fill fields
        if (field === 'solicitor_id' && selectedValue) {
            const combined = [...Object.values(solicitors), ...solicitorDiaries];
            const selectedSolicitor = combined.find(solicitor => solicitor.id === +selectedValue);
            if (selectedSolicitor) {
                newFormData.solicitor_dna_email = selectedSolicitor.dna_email || '';
                newFormData.solicitor_appointment_email = selectedSolicitor.appointment_email || '';
                newFormData.solicitor_report_or_invoice_email = selectedSolicitor.report_email || '';
            }
        }

        setFormData(newFormData);
    };


    // Handle DOB change
    const handleDOBChange = (dob) => {
        const newFormData = {
            ...formData,
            dob,
        };

        if (formData.accident_date) {
            newFormData.age_at_the_time_of_accident = calculateDateDifference(dob, formData.accident_date);
        }

        setFormData(newFormData);
    };

    // Handle DatePicker change
    const handleDateChange = (name, date) => {
        const newFormData = {
            ...formData,
            [name]: date,
        };

        if (name === 'accident_date') {
            newFormData.time_since_the_accident = calculateDateDifference(date, new Date());
            if (formData.dob) {
                newFormData.age_at_the_time_of_accident = calculateDateDifference(formData.dob, date);
            }
        }

        setFormData(newFormData);
    };


    const handleAddressSelect = (option) => {
        if (!option || !option.value) return;

        setSelectedAddress(option);

        const addressString = option.value;
        const parts = addressString.split(',');

        setFormData((prev) => ({
            ...prev,
            address_1: parts[0]?.trim() || "",
            address_2: parts[1]?.trim() || "",
            address_3: parts[2]?.trim() || "",
            address_4: parts[3]?.trim() || "",
            county: parts[4]?.trim() || "",
            country: parts[5]?.trim() || "United Kingdom",
            town: parts[6]?.trim() || "",
            postcode: formData.postcode
        }));
    };


    const handleAddressLookUp = async () => {
        let errorMsg = "";

        if (!formData.postcode) {
            errorMsg = "Please enter a postcode";
            setErrors((prev) => ({ ...prev, postcode: errorMsg }));
            return;
        }

        setErrors((prev) => ({ ...prev, postcode: "" })); // Clear previous errors
        setIsLoading(true);

        try {
            const response = await api.post('/postcode-lookup', {
                postcode: formData.postcode
            });

            if (response.data.success && response.data.data.addresses?.length > 0) {
                setAvailableAddresses(response.data.data.addresses);

                if (response.data.data.addresses.length === 1) {
                    handleAddressSelect({ value: response.data.data.addresses[0], label: response.data.data.addresses[0] });
                }
            } else {
                setAvailableAddresses([]);
                errorMsg = response.data.message || "No addresses found.";
                setErrors((prev) => ({ ...prev, postcode: errorMsg }));
            }
        } catch (error) {
            console.error("Lookup error:", error);
            errorMsg = "Something went wrong during lookup.";
            setErrors((prev) => ({ ...prev, postcode: errorMsg }));
        } finally {
            setIsLoading(false);
        }
    };


    const handleLoadSolicitorDiary = () => {
        setIsLoaded(true);
        setIsSolicitorLoading(true);

        setTimeout(() => {
            setIsSolicitorLoading(false);
        }, 5000);
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process the form data (you can send it to the backend or log it here)
        console.log(formData);
    };

    const expertsOptions = Object.values(experts || {}).map((expert) => ({
        value: expert.id,
        label: expert.name,
    }));

    const agencyOptions = Object.values(agencies || {}).map((agency) => ({
        value: agency.id,
        label: agency.company_name,
    }));

    const solicitorsOptions = Object.values(solicitors || {}).map((solicitor) => ({
        value: solicitor.id,
        label: solicitor.company_name,
    }));
    const solicitorDiariesOptions = Object.values(solicitorDiaries || {}).map((solicitor) => ({
        value: solicitor.id,
        label: solicitor.company_name,
    }));


    const fetchSolicitorDiaries = async () => {
        const data = Object.values(solicitorDiaries || {});
        return Promise.resolve(data);
    };

    const fetchSolicitorSearch = async (inputValue) => {
        if (!inputValue) {
            // return contracted solicitors only (default list)
            return solicitorsOptions;
        }

        // Search all solicitors including non-contracted ones via API
        const response = await fetchSolicitorDiaries(inputValue);
        return response;
    };


    const filterData = (data, inputValue = "", formData = {}, valueKey = "id", labelKey = "company_name") => {
        const search = inputValue.toLowerCase();

        return (data || [])
            .filter(item => {
                if (!item) return false;

                const excludeMatch = formData?.[valueKey] && item[valueKey] === formData[valueKey];
                if (excludeMatch) return false;

                const label = item[labelKey];
                return label && label.toLowerCase().includes(search);
            })
            .map(item => ({
                value: item[valueKey],
                label: item[labelKey]
            }));
    };


    const titlesOptions = Object.values(titles || {}).map((title) => ({
        value: title,
        label: title,
    }));

    const accidentTypesOptions = accidentTypes.map((accidentType) => ({
        value: accidentType.id,
        label: accidentType.name,
    }));

    const reportTypesOptions = reportTypes.map((reportType) => ({
        value: reportType.id,
        label: reportType.name,
    }));

    const appointmentTypesOptions = appointmentTypes.map((appointmentType) => ({
        value: appointmentType.id,
        label: appointmentType.name,
    }));

    const venuesOptions = venues.map((venue) => ({
        value: venue.id,
        label: venue.consulting_venue,
    }));


    return (

        <div className="pt-4 md:p-6 lg:p-8 space-y-6 text-sm min-h-screen flex flex-col mt-5 mb-10">

            <AppointmentInfoCard appointment={appointment} />

            {/* <PrettyPrintJSON data={editCaseData} /> */}

            <form onSubmit={handleSubmit} className="space-y-8">

                {pageTitle === 'Add Case' && (
                    loading ? (
                        <Skeleton type="rect" count={1} height="70px" />
                    ) : (
                        <CollapsibleSection defaultOpen={false} title={'Upload Document'} icon={<FileUp className="w-5 h-5" />}>
                            <CaseDocumentUpload
                                setFormData={setFormData}
                                agencyOptions={Object.values(agencies)}
                                solicitorOptions={[...Object.values(solicitors), ...solicitorDiaries]}
                                initialFormValues={initialFormValues} />
                        </CollapsibleSection>
                    )
                )}


                {/*Levels Radio Section */}
                <CollapsibleSection title={'Instruct Level'} icon={<Layers className="w-5 h-5" />}>
                    <InstructLevelSection loading={loading} levels={levels} formData={formData} handleInputChange={handleInputChange} />
                </CollapsibleSection>


                {/* Solicitor & Agency */}
                <SolicitorAndAgencyDetails
                    setFormData={setFormData}
                    formData={formData}
                    loading={loading}
                    isLoaded={isLoaded}
                    isSolicitorLoading={isSolicitorLoading}
                    solicitorsOptions={solicitorDiariesOptions}
                    agencyOptions={agencyOptions}
                    fetchSolicitorSearch={fetchSolicitorSearch}
                    filterData={filterData}
                    handleSelectChange={handleSelectChange}
                    handleInputChange={handleInputChange}
                    handleLoadSolicitorDiary={handleLoadSolicitorDiary}
                />

                {/* Claimant Section */}
                <ClaimantDetails
                    formData={formData}
                    handleSelectChange={handleSelectChange}
                    handleInputChange={handleInputChange}
                    handleDOBChange={handleDOBChange}
                    handleAddressLookUp={handleAddressLookUp}
                    handleAddressSelect={handleAddressSelect}
                    isLoading={isLoading}
                    availableAddresses={availableAddresses}
                    selectedAddress={selectedAddress}
                    errors={errors}
                    loading={loading}
                    titlesOptions={titlesOptions}
                    genders={genders}
                />

                {/* Accident Section */}
                <AccidentDetails
                    formData={formData}
                    handleDateChange={handleDateChange}
                    loading={loading}
                    accidentTypesOptions={accidentTypesOptions}
                />

                {/* Other Details Section */}
                <OtherDetails
                    formData={formData}
                    loading={loading}
                    appointmentTypesOptions={appointmentTypesOptions}
                    venuesOptions={venuesOptions}
                    expertsOptions={expertsOptions}
                    appointmentTobeModeDates={appointmentTobeModeDates}
                    appointmentTobeModeDays={appointmentTobeModeDays}
                    handleSelectChange={handleSelectChange}
                    handleSelectAppointmentChange={handleSelectAppointmentChange}
                    handleDateChange={handleDateChange}
                    setFormData={setFormData}
                />

                {/* Additional Options */}
                <ReportsDetails
                    loading={loading}
                    formData={formData}
                    setFormData={setFormData}
                    handleSelectChange={handleSelectChange}
                    reportTypesOptions={reportTypesOptions}
                    recommendedReportingTool={recommendedReportingTool}
                />
                {/* Consulting, SLA, Medical Records */}
                <MedicalRecordsDetails
                    loading={loading}
                    formData={formData}
                    setFormData={setFormData}
                    handleDateChange={handleDateChange}
                    handleSelectChange={handleSelectChange}
                    inputClass="border p-2 rounded"
                />
                {/* Special Instructions */}
                <SpecialInstructionDetails loading={loading} />

                {/* Buttons */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 px-4 py-3 flex flex-wrap gap-3 justify-end">
                    {appointment && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                            <Calendar size={20} />
                            Book Appointment
                        </button>
                    )}

                    <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <Save size={20} />
                        Save Changes
                    </button>
                    <button onClick={goBack} className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </form >
        </div >
    );
}
