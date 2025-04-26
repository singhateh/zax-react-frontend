import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getQualifications } from '../../../../utilities/constant';
import CustomCheckbox from '../../../../components/CustomCheckbox';

const ITEMS_PER_PAGE = 3;

function QualificationDetail({ doctor, onSubmit }) {

    const qualifications = doctor?.user_qualifications;

    const [selectedQualifications, setSelectedQuals] = useState([]);
    const [customQualification, setCustomQualification] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract qualification codes from qualifications
    const userQualificationCodes = useMemo(() =>
        qualifications.map(q => q.name),
        [qualifications]
    );

    // Get available qualification codes
    const availableQualificationCodes = getQualifications();

    // Initialize selected qualifications
    useEffect(() => {
        setSelectedQuals(userQualificationCodes);
    }, [userQualificationCodes]);

    const handleQualChange = useCallback((code) => {
        if (code === 'Custom') {
            setShowCustomInput(prev => {
                const newValue = !prev;
                if (newValue) {
                    setCustomQualification(''); // Clear input when showing
                }
                return newValue;
            });
        } else {
            setSelectedQuals(prev =>
                prev.includes(code)
                    ? prev.filter(q => q !== code) // Remove if exists
                    : [code, ...prev] // Add new item to beginning
            );
            if (showCustomInput) setShowCustomInput(false);
        }
    }, [showCustomInput]);

    const handleCustomQualChange = useCallback((e) => {
        setCustomQualification(e.target.value);
    }, []);

    const addCustomQualification = useCallback(() => {
        if (customQualification.trim() && !selectedQualifications.includes(customQualification)) {
            setSelectedQuals(prev => [customQualification, ...prev]);
            setShowCustomInput(false);
            setCustomQualification('');
        }
    }, [customQualification, selectedQualifications]);

    const handleRemove = useCallback((code) => {
        setSelectedQuals(prev => {
            const newSelected = prev.filter(q => q !== code);
            const newTotalPages = Math.ceil(newSelected.length / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages) {
                setCurrentPage(Math.max(1, newTotalPages));
            }
            return newSelected;
        });
    }, [currentPage]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Prepare the data to submit
            const submitData = selectedQualifications.map(code => ({
                name: code,
                ...qualifications.find(q => q.name === code)
            }));

            // Call the onSubmit prop with the formatted data
            if (onSubmit) {
                await onSubmit(submitData);
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedQualifications, qualifications, onSubmit]);

    // Memoized pagination data
    const { currentItems, totalPages, showingFrom, showingTo } = useMemo(() => {
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        const currentItems = selectedQualifications.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(selectedQualifications.length / ITEMS_PER_PAGE);

        return {
            currentItems,
            totalPages,
            showingFrom: indexOfFirstItem + 1,
            showingTo: Math.min(indexOfLastItem, selectedQualifications.length)
        };
    }, [selectedQualifications, currentPage]);

    const paginate = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 bg-gray-50 rounded-lg">
                {/* Checkboxes Section */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] p-2">
                        {availableQualificationCodes.map((code) => (
                            <div key={code} className="flex items-center">
                                <CustomCheckbox
                                    type="checkbox"
                                    id={`qual-${code}`}
                                    isChecked={selectedQualifications.includes(code)}
                                    onChange={() => handleQualChange(code)}
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`qual-${code}`} className="ml-2 text-sm font-medium text-gray-700">
                                    {code}
                                </label>
                            </div>
                        ))}

                        {/* Custom Qualification Checkbox */}
                        <div className="flex items-center">
                            <CustomCheckbox
                                type="checkbox"
                                id="qual-custom"
                                isChecked={showCustomInput}
                                onChange={() => handleQualChange('Custom')}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="qual-custom" className="ml-2 text-sm font-medium text-gray-700">
                                Custom
                            </label>
                        </div>

                        {/* Custom Qualification Input */}
                        {showCustomInput && (
                            <div className="col-span-full space-y-2">
                                <textarea
                                    value={customQualification}
                                    onChange={handleCustomQualChange}
                                    placeholder="Enter custom qualification"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    onClick={addCustomQualification}
                                    disabled={!customQualification.trim()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Custom Qualification
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Qualifications Table */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Selected Qualifications ({selectedQualifications.length})
                        </h3>
                        {selectedQualifications.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedQuals([]);
                                    setCurrentPage(1);
                                }}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.length > 0 ? (
                                        currentItems.map((code) => {
                                            const qual = qualifications.find(q => q.name === code) || { name: code };
                                            return (
                                                <tr key={code} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {code}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {qual.id ? (
                                                            <>
                                                                <div>ID: {qual.id}</div>
                                                                <div>Created: {qual.created_at ? new Date(qual.created_at).toLocaleDateString() : 'N/A'}</div>
                                                            </>
                                                        ) : (
                                                            <div>Custom Qualification</div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(code)}
                                                            className="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-500">
                                                No qualifications selected
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {selectedQualifications.length > ITEMS_PER_PAGE && (
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                <div className="hidden sm:block">
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of{' '}
                                        <span className="font-medium">{selectedQualifications.length}</span> results
                                    </p>
                                </div>
                                <div className="flex-1 flex justify-between sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ml-3"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end px-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save Qualifications'}
                </button>
            </div>
        </form>
    );
}

export default QualificationDetail;