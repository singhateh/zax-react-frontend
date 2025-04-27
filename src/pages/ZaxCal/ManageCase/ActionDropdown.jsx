import { useState, useRef, useEffect } from 'react';
import { FaBed, FaPause, FaLock, FaLink, FaEdit, FaBriefcase, FaTrashAlt, FaEllipsisH } from 'react-icons/fa'; // Importing React Icons
import { goToEditCase } from '../../../utilities/navigationUtils';

const ActionDropdown = ({ data, navigate }) => {
    const [showMoreActions, setShowMoreActions] = useState(false);
    const popoverRef = useRef(null);
    const parentRef = useRef(null);

    // Toggle dropdown visibility
    const toggleMoreActions = () => {
        setShowMoreActions(!showMoreActions);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) && !parentRef.current.contains(event.target)) {
                setShowMoreActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Prevent body scroll when popover is open
    useEffect(() => {
        if (showMoreActions) {
            document.body.style.overflow = 'hidden'; // Disable body scroll
        } else {
            document.body.style.overflow = 'auto'; // Re-enable body scroll
        }

        return () => {
            document.body.style.overflow = 'auto'; // Ensure it resets on unmount
        };
    }, [showMoreActions]);

    const handleGlobalStatus = (caseId, status, reason, section, confirmation, title) => {
        // Logic for global status update
    };

    const openCaseRelatedModal = (modalData) => {
        // Logic to open modal
    };


    const goToLinkCase = (data) => {
        return `/link-case/${data.id}`;
    };

    const goToReInstructCase = (data) => {
        return `/re-instruct-case/${data.id}`;
    };

    // Function to determine the dropdown position
    const getDropdownPosition = () => {
        if (parentRef.current) {
            const parentRect = parentRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - parentRect.bottom;
            const spaceAbove = parentRect.top;

            return spaceBelow > 200 ? 'bottom' : spaceAbove > 200 ? 'top' : 'bottom';
        }
        return 'bottom';
    };

    const dropdownPosition = getDropdownPosition();

    return (
        <div ref={parentRef} className="relative inline-block">
            <button
                onClick={toggleMoreActions}
                className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-md p-2 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-600 hover:text-blue-500 focus:text-blue-500"
            >
                <FaEllipsisH size={20} />
            </button>

            {showMoreActions && (
                <div
                    ref={popoverRef}
                    className={`absolute ${dropdownPosition === 'bottom' ? 'mt-2' : '-mt-2'} p-3 truncate right-0 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto`}
                    style={{
                        width: '180px',
                        maxHeight: 'calc(100vh - 100px)',
                        top: dropdownPosition === 'bottom' ? `${parentRef.current?.offsetHeight + -10}px` : 'auto',
                        bottom: dropdownPosition === 'top' ? `${parentRef.current?.offsetHeight + -10}px` : 'auto',
                        zIndex: 9999,
                    }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-0">
                        {/* Manage Medical Records */}
                        <div className="flex flex-col items-center justify-center group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Manage Medical Records">
                            <button
                                onClick={() => window.location.href = `/medicalReport/${data.id}`}
                                className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                            >
                                <FaBriefcase size={18} className="text-gray-600 group-hover:text-blue-500" />
                            </button>
                        </div>

                        {/* Edit Case */}
                        <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Edit Case">
                            <button
                                onClick={() => goToEditCase(navigate, data)}
                                className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                            >
                                <FaEdit size={18} className="text-gray-600 group-hover:text-blue-500" />
                            </button>
                        </div>

                        {/* Link Case */}
                        <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Link Case">
                            <button
                                onClick={() => window.location.href = goToLinkCase(data)}
                                className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                            >
                                <FaLink size={18} className="text-gray-600 group-hover:text-blue-500" />
                            </button>
                        </div>

                        {/* Re-Instruct Case (Conditional) */}
                        {data.is_report && (
                            <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Re-Instruct Case">
                                <button
                                    onClick={() => window.location.href = goToReInstructCase(data)}
                                    className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                                >
                                    <FaBed size={18} className="text-gray-600 group-hover:text-blue-500" />
                                </button>
                            </div>
                        )}

                        {/* Link & Instruct Case */}
                        <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Link & Instruct Case">
                            <button
                                onClick={() => openCaseRelatedModal({ id: data.id, modalId: 'linkCaseModal', status: 'link' })}
                                className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                            >
                                <FaLink size={18} className="text-gray-600 group-hover:text-blue-500" />
                            </button>
                        </div>

                        {/* Release Case or Hold Case */}
                        {data.status === 'HOLD' ? (
                            <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Release Case">
                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#confirmationModal"
                                    onClick={() =>
                                        handleGlobalStatus(data.id, 'RELEASED', 'Reason for Release!', 'holdSection', 'Please double-check and confirm the hold.', 'Release Case')
                                    }
                                    className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                                >
                                    <FaLock size={18} className="text-gray-600 group-hover:text-blue-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Hold Case">
                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#confirmationModal"
                                    onClick={() =>
                                        handleGlobalStatus(data.id, 'HOLD', 'Reason for Hold!', 'holdSection')
                                    }
                                    className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                                >
                                    <FaPause size={18} className="text-gray-600 group-hover:text-blue-500" />
                                </button>
                            </div>
                        )}

                        {/* Delete Case */}
                        <div className="flex flex-col items-center justify-center py-2  group bg-gray-100 hover:bg-gray-200 px-4 rounded-sm" title="Delete Case">
                            <button
                                data-bs-toggle="modal"
                                data-bs-target="#confirmationModal"
                                onClick={() =>
                                    handleGlobalStatus(
                                        data.id,
                                        'DELETED',
                                        'Reason for Deletation!',
                                        'deleteSection',
                                        'Please double-check and confirm the deletion.',
                                        'Delete Case'
                                    )
                                }
                                className="flex flex-col items-center justify-center transition transform group-hover:scale-110"
                            >
                                <FaTrashAlt size={18} className="text-gray-600 group-hover:text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionDropdown;
