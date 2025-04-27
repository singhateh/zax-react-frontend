import React from 'react';
import { FiEdit } from 'react-icons/fi';
import Button from '../../../../components/Button';
import { formatAddress } from '../../../../utilities/constant';

export const BillingDisplayView = ({ billing, onEditClick }) => {
    const addressFields = [
        billing?.address_1,
        billing?.address_2,
        billing?.address_3,
        billing?.town,
        billing?.county,
        billing?.postcode,
        billing?.country
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Billing Information</h2>
                <Button
                    onClick={onEditClick}
                    variant="outline"
                    size="sm"
                    icon={<FiEdit className="mr-1" />}
                >
                    Edit Billing
                </Button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Contact Name</p>
                        <p className="font-medium">{billing?.contact_name || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Contact Number</p>
                        <p className="font-medium">{billing?.contact_number || 'Not provided'}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Billing Address</h3>
                    <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">Using registered address:</span>
                        <span className="font-medium">
                            {billing?.can_copy_registration_address ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <p className="font-medium">{formatAddress(addressFields) || 'No address provided'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <p className="text-sm text-gray-500">Invoice Type</p>
                        <p className="font-medium capitalize">{billing?.invoice_type || 'Not specified'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Payment Type</p>
                        <p className="font-medium capitalize">{billing?.payment_type || 'Not specified'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};