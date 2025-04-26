import React, { useEffect, useRef, useState } from 'react';
import { FiMenu, FiBell, FiChevronDown, FiX, FiSearch, FiChevronRight } from 'react-icons/fi';
import { UserAvatar } from '../utilities/navigationUtils';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, isMobile, user, logout, doctors, setSelectedDoctor }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showDoctorSwitch, setShowDoctorSwitch] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(JSON.parse(localStorage.getItem('ZAXDOCTOR')));

    const navigate = useNavigate();


    const switchDoctor = (doctor) => {

        setShowDoctorSwitch(!showDoctorSwitch);

        if (doctor === null) {
            setSelectedDoctor(null);
            setCurrentDoctor(null);
            return navigate('/dashboard');
        }
        Swal.fire({
            title: `Switch to ${doctor.name}?`,
            text: "Are you sure you want to switch to this doctor?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, switch',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                api.post(`/admin/doctors/switch/${doctor.id}`)
                    .then(response => {
                        setSelectedDoctor(doctor);
                        setCurrentDoctor(doctor);
                        Swal.fire({
                            icon: 'success',
                            title: 'Switched!',
                            text: `Doctor switched to ${doctor.name}`,
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {

                            navigate('/dashboard');
                        });
                    })
                    .catch(error => {
                        console.error("Error switching doctor:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed!',
                            text: 'Failed to switch doctor.',
                        });
                    });
            }
        });
    };


    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfile(false);
        setShowDoctorSwitch(false);
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
        setShowNotifications(false);
        setShowDoctorSwitch(false);
    };

    const toggleDoctorSwitch = () => {
        setShowDoctorSwitch(!showDoctorSwitch);
        setShowNotifications(false);
        setShowProfile(false);
    };

    return (
        <header className="bg-white shadow-sm z-50 fixed top-0 right-0 left-0 supports-[position:fixed]:fixed w-full h-16">
            <div className="flex items-center justify-between p-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-100 md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <FiMenu size={20} />
                </button>

                <div className="flex items-center gap-4 ml-auto">
                    <NotificationDropdown
                        showNotifications={showNotifications}
                        toggleNotifications={toggleNotifications}
                        isMobile={isMobile}
                    />

                    <DoctorSwitchDropdown
                        doctors={doctors}
                        currentDoctor={currentDoctor}
                        switchDoctor={switchDoctor}
                        toggleDoctorSwitch={toggleDoctorSwitch}
                        showDoctorSwitch={showDoctorSwitch}
                    />

                    <ProfileDropdown
                        logout={logout}
                        user={user}
                        showProfile={showProfile}
                        toggleProfile={toggleProfile}
                    />
                </div>
            </div>
        </header>
    );
};



const NotificationDropdown = ({ showNotifications, toggleNotifications, isMobile }) => {
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                toggleNotifications();
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifications, toggleNotifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label={showNotifications ? 'Hide notifications' : 'Show notifications'}
            >
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <FiBell size={22} className="text-gray-700" />
            </button>

            {/* This should show below the bell on center but it's showing on right corner */}
            {showNotifications && (
                <div className="absolute left-1/2 transform -translate-x-1/2 w-72 overflow-hidden mt-3 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 transition-all duration-200 ease-out">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                        <button
                            onClick={toggleNotifications}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                            aria-label="Close notifications"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
                        <a href="#" className="block px-5 py-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <span className="text-indigo-600 text-base font-medium">NM</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-medium text-gray-900 truncate group-hover:text-indigo-600">
                                        New message from Sarah Williams
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">"About tomorrow's meeting at 2PM..."</p>
                                    <p className="text-xs text-gray-400 mt-2">2 minutes ago</p>
                                </div>
                                <FiChevronRight className="text-gray-400 group-hover:text-indigo-600 mt-1 flex-shrink-0" size={18} />
                            </div>
                        </a>

                        <a href="#" className="block px-5 py-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <span className="text-amber-600 text-base font-medium">SU</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-medium text-gray-900 truncate group-hover:text-indigo-600">
                                        System maintenance tonight
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Planned downtime from 2AM-3AM</p>
                                    <p className="text-xs text-gray-400 mt-2">1 hour ago</p>
                                </div>
                                <FiChevronRight className="text-gray-400 group-hover:text-indigo-600 mt-1 flex-shrink-0" size={18} />
                            </div>
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <a href="#" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            View all 12 notifications
                            <FiChevronRight className="ml-1.5" size={16} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};


const ProfileDropdown = ({ showProfile, toggleProfile, user, logout }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (showProfile) toggleProfile();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfile]);

    return (
        <div ref={dropdownRef} className="relative dropdown-container">
            <button
                onClick={toggleProfile}
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
            >
                <UserAvatar name={user.name} />
                <span className="hidden md:flex items-center text-sm font-medium text-gray-700">
                    {user.name}
                    <FiChevronDown className={`ml-1 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                </span>
            </button>

            {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-800">Signed in as</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Your Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Settings
                    </a>
                    <div className="border-t border-gray-200"></div>
                    <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Sign out
                    </a>
                </div>
            )}
        </div>
    );
};



const DoctorSwitchDropdown = ({
    doctors,
    currentDoctor,
    switchDoctor,
    showDoctorSwitch,
    toggleDoctorSwitch,
}) => {
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (showDoctorSwitch) {
                    toggleDoctorSwitch();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDoctorSwitch, toggleDoctorSwitch]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDoctors(filtered);
        }
    }, [searchTerm, doctors]);

    const handleClear = () => {
        setSearchTerm('');
        setFilteredDoctors(doctors);
    };

    const handleClearCurrent = () => {
        switchDoctor(null);
        toggleDoctorSwitch();
    };

    return (
        <div className="relative dropdown-container" ref={dropdownRef}>
            <button
                onClick={toggleDoctorSwitch}
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                <span className="text-sm sm:text-base font-medium text-gray-700 truncate max-w-[130px] sm:max-w-[200px]">
                    {currentDoctor ? currentDoctor.name : "Switch Doctor"}
                </span>

                {currentDoctor && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearCurrent();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={16} className="sm:size-5" />
                    </span>
                )}

                <FiChevronDown
                    className={`transition-transform ${showDoctorSwitch ? 'transform rotate-180' : ''} text-gray-600`}
                    size={16}
                />
            </button>


            {showDoctorSwitch && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 max-h-96 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Select Doctor</p>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                className="block w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={handleClear}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-64">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => {
                                        switchDoctor(doctor);
                                        setSearchTerm('');
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors ${currentDoctor?.id === doctor.id
                                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                                        : ''
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span>{doctor.name}</span>
                                        {currentDoctor?.id === doctor.id && (
                                            <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-center text-sm text-gray-500">
                                No doctors found
                            </div>
                        )}
                    </div>
                    {currentDoctor && (
                        <div className="border-t border-gray-200  hover:bg-red-50">
                            <button
                                onClick={handleClearCurrent}
                                className="w-full sm:w-auto cursor-pointer text-left px-4 py-1 text-sm text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            >
                                Clear selection
                            </button>
                        </div>


                    )}
                </div>
            )}
        </div>
    );
};



export default Header;
