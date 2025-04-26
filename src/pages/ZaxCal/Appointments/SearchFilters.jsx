import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import SelectField from '../../../components/SelectField';
import DateField from '../../../components/DateField';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const SearchFilters = ({ setSearchResults }) => {
    const initialFilters = {
        filter_case_zax_id: '',
        filter_case_medco_reference: '',
        filter_case_case_type: '',
        filter_case_report_type: '',
        filter_case_claimant_name: '',
        filter_case_forename: '',
        filter_case_claimant_lastname: '',
        filter_case_claimant_dob: '',
        filter_solicitor: '',
        filter_case_solicitor_reference: '',
        filter_case_agency: '',
        filter_case_agency_reference: '',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fetchData = async (filters) => {
        setIsLoading(true);
        setProgress(0); // Reset progress at the start

        try {
            // Simulate progress while the request is being made
            let progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 50) {
                        clearInterval(progressInterval);
                        return 50;
                    }
                    return prev + 5;
                });
            }, 300);

            // Perform the API request
            const response = await api.post('/doctor/instructCase', filters);

            // Once the API request is completed, simulate the progress completing
            setProgress(90); // Set to 90% after the response starts coming in

            setSearchResults(response.data.data);
            setProgress(100); // Finalize progress when data is set
        } catch (error) {
            console.error('Error fetching filtered cases:', error);

            // Displaying error message using SweetAlert2 Toast
            if (error.response) {
                // Check if response contains an error message
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error.response.data.error || 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            } else {
                // If there's no response from the server, show a generic error
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Network error or server not reachable',
                    showConfirmButton: false,
                    timer: 3000,
                    toast: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });
            }
        } finally {
            setIsLoading(false);
            setProgress(0); // Reset progress after loading ends
        }
    };


    const handleFilter = () => {
        fetchData(filters);
    };

    const handleReset = async () => {
        setFilters(initialFilters);
        setSearchResults([]);
    };

    return (
        <div className="bg-white p-2 mt-6  text-sm mb-2">
            {/* <h3 className="text-base font-bold text-gray-700 mb-4">🔍 Search Case from Un-Appointed List</h3> */}
            {/* Progress Bar */}
            {isLoading && (
                <div className="relative w-full h-2 mb-4 bg-gray-200 rounded overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-300"
                        style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                    ></div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <InputField
                    placeholder="Zax ID"
                    name="filter_case_zax_id"
                    title="Enter the Zax ID"
                    value={filters.filter_case_zax_id}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Medco Ref."
                    name="filter_case_medco_reference"
                    title="Enter Medco reference number"
                    value={filters.filter_case_medco_reference}
                    onChange={handleChange}
                />
                <SelectField
                    options={[{ value: '', label: '- Case Type -' }]}
                    name="filter_case_case_type"
                    placeholder="- Case Type -"
                    title="Select case type"
                    value={filters.filter_case_case_type}
                    onChange={handleChange}
                />
                <SelectField
                    options={[{ value: '', label: '- Report Type -' }]}
                    name="filter_case_report_type"
                    placeholder="- Report Type -"
                    title="Select report type"
                    value={filters.filter_case_report_type}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Claimant Name"
                    name="filter_case_claimant_name"
                    title="Enter claimant's full name"
                    value={filters.filter_case_claimant_name}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Claimant Forename"
                    name="filter_case_forename"
                    title="Enter claimant's forename"
                    value={filters.filter_case_forename}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Claimant Surname"
                    name="filter_case_claimant_lastname"
                    title="Enter claimant's surname"
                    value={filters.filter_case_claimant_lastname}
                    onChange={handleChange}
                />
                <DateField
                    name="filter_case_claimant_dob"
                    placeholder="DOB"
                    title="Enter claimant's date of birth"
                    value={filters.filter_case_claimant_dob}
                    onChange={handleChange}
                />
                <SelectField
                    options={[{ value: '', label: '- Solicitor -' }]}
                    name="filter_solicitor"
                    placeholder="- Solicitor -"
                    title="Select solicitor"
                    value={filters.filter_solicitor}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Solicitor Ref"
                    name="filter_case_solicitor_reference"
                    title="Enter solicitor reference"
                    value={filters.filter_case_solicitor_reference}
                    onChange={handleChange}
                />
                <SelectField
                    options={[{ value: '', label: '- Agency -' }]}
                    name="filter_case_agency"
                    placeholder="- Agency -"
                    title="Select agency"
                    value={filters.filter_case_agency}
                    onChange={handleChange}
                />
                <InputField
                    placeholder="Agency Ref"
                    name="filter_case_agency_reference"
                    title="Enter agency reference"
                    value={filters.filter_case_agency_reference}
                    onChange={handleChange}
                />

                <div className="hidden lg:block"></div>
                <div className="hidden lg:block"></div>
            </div>
            <div className="lg:col-span-1 flex justify-end items-center gap-2">
                <button
                    onClick={handleFilter}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading} // Disable the button while loading
                >
                    <div className="flex items-center space-x-2">
                        <span>{isLoading ? 'Loading...' : 'Filter'}</span>
                        {isLoading && (
                            <svg
                                className="w-5 h-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    d="M4 12a8 8 0 0 1 8-8"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        )}
                    </div>
                </button>

                <button
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition-all"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SearchFilters;
