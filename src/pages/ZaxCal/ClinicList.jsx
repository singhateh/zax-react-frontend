import React, { useState, useEffect } from 'react';
import SelectField from '../../components/SelectField';
import DateField from '../../components/DateField';
import CustomCheckbox from '../../components/CustomCheckbox';
import api from '../../services/api';
import { LucideFileSpreadsheet } from 'lucide-react';

const ClinicList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [filters, setFilters] = useState({
        appointmentType: null,
        consultingVenue: null,
        agency: null,
        solicitor: null,
        appointmentDate: null,
        printWithInstructorName: false,
        printWithSpecialInstructions: false,
    });

    const [dropdownOptions, setDropdownOptions] = useState({
        appointmentTypes: [],
        venues: [],
        agencies: [],
        solicitors: [],
    });

    const [clinics, setClinics] = useState([]);

    useEffect(() => {
        fetchDropdownOptions();
    }, []);

    const normalizeToArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object') return Object.values(data);
        return [];
    };

    const fetchDropdownOptions = async () => {
        try {
            const response = await api.get('/doctor/clinic-lists');
            const { appointmentTypes, venues, agencies, solicitors } = response.data;

            setDropdownOptions({
                appointmentTypes: normalizeToArray(appointmentTypes).map(item => ({
                    label: item?.name ?? 'Unknown',
                    value: item?.id ?? item
                })),
                venues: normalizeToArray(venues).map(item => ({
                    label: item?.consulting_venue ?? 'Unknown',
                    value: item?.id ?? item
                })),
                agencies: normalizeToArray(agencies).map(item => ({
                    label: item?.company_name ?? 'Unknown',
                    value: item?.id ?? item
                })),
                solicitors: normalizeToArray(solicitors).map(item => ({
                    label: item?.company_name ?? 'Unknown',
                    value: item?.id ?? item
                })),
            });
        } catch (error) {
            console.error('Failed to load dropdown options:', error);
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilters(prev => ({ ...prev, [name]: checked }));
    };

    const handleFilter = async () => {
        setIsLoading(true);
        setProgress(0); // Reset progress at the start

        try {
            // Simulate progress while the request is being made
            let progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 50) {
                        clearInterval(progressInterval); // Stop progress after reaching 50%
                        return 50;
                    }
                    return prev + 5; // Increment progress
                });
            }, 300); // Simulated progress interval speed

            // Perform the API request
            const response = await api.post('/doctor/clinic-lists', {
                appointment_type: filters.appointmentType?.value,
                consulting_venue: filters.consultingVenue?.value,
                agency: filters.agency?.value,
                solicitor: filters.solicitor?.value,
                appointment_date: filters.appointmentDate,
                print_with_agency_name: filters.printWithInstructorName,
                print_with_instruction: filters.printWithSpecialInstructions,
            });

            // Once the API request is completed, simulate the progress completing
            setProgress(90); // Set to 90% after the response starts coming in

            let clinicList = [];
            if (Array.isArray(response.data.clinics)) {
                clinicList = response.data.clinics;
            } else if (typeof response.data.clinics === 'object') {
                clinicList = Object.values(response.data.clinics);
            }

            setClinics(clinicList);
            setProgress(100); // Finalize progress when clinic data is set
        } catch (error) {
            console.error('Error fetching filtered clinics:', error);
        } finally {
            setIsLoading(false);
            setProgress(0); // Reset progress after loading ends
        }
    };

    const handleReset = () => {
        setFilters({
            appointmentType: null,
            consultingVenue: null,
            agency: null,
            solicitor: null,
            appointmentDate: null,
            printWithInstructorName: false,
            printWithSpecialInstructions: false,
        });
    };

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);
        setFilters((prevState) => ({
            ...prevState,
            [field]: selectedValue,
        }));
    };

    const handleDateChange = (date) => {
        // Normalize the date to UTC to avoid timezone issues
        const normalizedDate = new Date(date);
        normalizedDate.setMinutes(normalizedDate.getMinutes() + normalizedDate.getTimezoneOffset()); // Adjust to correct timezone

        // Save the normalized date as a Date object or in ISO format (as per your requirements)
        setFilters(prev => ({
            ...prev,
            appointmentDate: normalizedDate, // Save as a Date object
        }));
    };


    return (
        <div className="container1 mx-auto p-4 mt-20">
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md font-semibold">Filter Clinics</h2>
                </div>

                {/* Progress Bar */}
                {isLoading && (
                    <div className="relative w-full h-2 mb-4 bg-gray-200 rounded overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-300"
                            style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                        ></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectField
                        label="Appointment Type"
                        name="appointmentType"
                        value={filters.appointmentType}
                        onChange={handleSelectChange('appointmentType')}
                        options={dropdownOptions.appointmentTypes}
                    />
                    <SelectField
                        label="Consulting Venue"
                        name="consultingVenue"
                        value={filters.consultingVenue}
                        onChange={handleSelectChange('consultingVenue')}
                        options={dropdownOptions.venues}
                    />
                    <SelectField
                        label="Agency"
                        name="agency"
                        value={filters.agency}
                        onChange={handleSelectChange('agency')}
                        options={dropdownOptions.agencies}
                    />
                    <SelectField
                        label="Solicitor"
                        name="solicitor"
                        value={filters.solicitor}
                        onChange={handleSelectChange('solicitor')}
                        options={dropdownOptions.solicitors}
                    />
                    <DateField
                        label="Appointment Date"
                        name="appointmentDate"
                        selected={filters.appointmentDate}
                        onChange={handleDateChange}
                    />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <label className="flex items-center space-x-2 text-sm">
                        <CustomCheckbox
                            name="printWithInstructorName"
                            id="printWithInstructorName"
                            isChecked={filters.printWithInstructorName}
                            onChange={handleCheckboxChange}
                        />
                        <span>Print with Instructor Name</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                        <CustomCheckbox
                            name="printWithSpecialInstructions"
                            id="printWithSpecialInstructions"
                            isChecked={filters.printWithSpecialInstructions}
                            onChange={handleCheckboxChange}
                        />
                        <span>Print with Special Instructions</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* Clinic List Section */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Clinic List</h2>

                {clinics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-sm">No clinics found. Adjust filters or try again later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {clinics.map((clinic, index) => (
                            <div
                                key={index}
                                className="p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                <div className="mb-3">
                                    <span className="font-semibold text-xl text-gray-900">{clinic.clinic_name}</span>
                                    <p className="text-gray-500">{clinic.clinic_postcode} - {clinic.slot_date}</p>
                                </div>
                                <div className="mt-4">
                                    <a
                                        href={clinic.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                                    >
                                        <LucideFileSpreadsheet className="w-5 h-5 mr-2" />
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicList;
