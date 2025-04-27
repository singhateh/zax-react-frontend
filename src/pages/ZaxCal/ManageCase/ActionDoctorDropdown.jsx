import { useState, useRef, useEffect } from 'react';
import { FaBriefcase, FaEdit, FaLink, FaBed, FaLock, FaPause, FaTrashAlt, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { removeApiPrefix } from '../../../utilities/constant';
import api from '../../../services/api';

const ActionDoctorDropdown = ({ doctor, actionItems }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const confirmAction = async (title, text, confirmText = 'Confirm') => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });
        return result.isConfirmed;
    };

    const handleAction = async (action, endpoint, successMessage) => {
        const confirmed = await confirmAction(
            `Confirm ${action}`,
            `Are you sure you want to ${action.toLowerCase()} this doctor?`
        );

        if (!confirmed) return;

        try {
            await api.put(removeApiPrefix(endpoint));
            Swal.fire('Success!', successMessage, 'success');
            // You might want to add a callback to refresh data here
        } catch (error) {
            Swal.fire('Error!', error.response?.data?.message || 'Action failed', 'error');
        }
    };

    // const actionItems = [
    //     {
    //         icon: <FaBriefcase size={18} />,
    //         title: "Medical Records",
    //         action: () => navigate(`/medical-records/${doctor.id}`)
    //     },
    //     {
    //         icon: <FaEdit size={18} />,
    //         title: "Edit Doctor",
    //         action: () => navigate(`/doctors/edit/${doctor.id}`)
    //     },
    //     {
    //         icon: <FaLink size={18} />,
    //         title: "Link Case",
    //         action: () => navigate(`/link-case/${doctor.id}`),
    //         show: doctor.can_link_case
    //     },
    //     {
    //         icon: <FaBed size={18} />,
    //         title: "Re-Instruct",
    //         action: () => navigate(`/re-instruct/${doctor.id}`),
    //         show: doctor.is_report
    //     },
    //     {
    //         icon: doctor.status === 'HOLD' ? <FaLock size={18} /> : <FaPause size={18} />,
    //         title: doctor.status === 'HOLD' ? "Release Case" : "Hold Case",
    //         action: () => handleAction(
    //             doctor.status === 'HOLD' ? 'Release' : 'Hold',
    //             doctor.status === 'HOLD' ? doctor.release_link : doctor.hold_link,
    //             `Case ${doctor.status === 'HOLD' ? 'released' : 'held'} successfully`
    //         )
    //     },
    //     {
    //         icon: <FaTrashAlt size={18} />,
    //         title: "Delete",
    //         action: () => handleAction(
    //             'Delete',
    //             doctor.delete_link,
    //             'Doctor deleted successfully'
    //         ),
    //         className: "hover:text-red-500"
    //     }
    // ];

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="More actions"
            >
                <FaEllipsisH size={20} className="text-gray-600" />
            </button>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                >
                    <div className="py-1">
                        {actionItems.filter(item => item.show !== false).map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setShowDropdown(false);
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${item.className || ''}`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionDoctorDropdown;