import React from 'react';
import { FiEdit } from 'react-icons/fi';

export const AccountInfoDisplay = ({ doctor, onEditClick, onChangePasswordClick }) => {
    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <div
                        onClick={onEditClick}
                        role="button"
                        tabIndex={0}
                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FiEdit className="text-gray-600" />
                        Edit Account
                    </div>
                    <div
                        onClick={onChangePasswordClick}
                        role="button"
                        tabIndex={0}
                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FiEdit className="text-gray-600" />
                        Edit Password
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="font-medium">{doctor.company_name}</p>
                        <small className="text-xs text-gray-500">{doctor.number}</small>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium break-words">{doctor.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <p className="font-medium capitalize">{doctor.account_status || 'Active'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium">
                            {doctor.last_login ? new Date(doctor.last_login).toLocaleString() : 'Not available'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
