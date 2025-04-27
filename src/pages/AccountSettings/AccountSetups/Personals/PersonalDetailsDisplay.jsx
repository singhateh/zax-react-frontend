import React from 'react';
import { FiEdit } from 'react-icons/fi';
import Button from '../../../../components/Button';
import { formatAddress } from '../../../../utilities/constant';

export const PersonalDetailsDisplay = ({ doctor, onEditClick }) => {
    const addressFields = [
        doctor?.address_1,
        doctor?.address_2,
        doctor?.address_3,
        doctor?.town,
        doctor?.county,
        doctor?.postcode,
        doctor?.country
    ];


    return (
        <div >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
                <Button
                    onClick={onEditClick}
                    className='cursor-pointer'
                    variant="outline"
                    size="sm"
                    icon={<FiEdit className="mr-1" />}
                >
                    Edit Personal
                </Button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{doctor?.title || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">First Name</p>
                        <p className="font-medium">{doctor?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Name</p>
                        <p className="font-medium">{doctor?.last_name || 'Not provided'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{doctor?.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium capitalize">
                            {doctor?.gender === '0' ? 'Male' : doctor?.gender === '1' ? 'Female' : 'Other'}
                        </p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Mobile Phone</p>
                            <p className="font-medium">{doctor?.mobile || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Office Phone</p>
                            <p className="font-medium">{doctor?.office_phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Address</h3>
                    <p className="font-medium">{formatAddress(addressFields) || 'No address provided'}</p>
                </div>

                {doctor?.signature_url && (
                    <div className="border-t pt-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Signature</h3>
                        <div className="flex items-center space-x-4">
                            <img
                                src={doctor.signature_url}
                                alt="signature"
                                className="w-20 h-20 object-contain border border-gray-200 rounded"
                            />
                            <a
                                href={doctor.signature_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View Full Size
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};