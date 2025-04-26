import React, { useState } from 'react';
import PaymentSetupForm from './PaymentSetupForm';
import Button from '../../../../components/Button';
import { FiEdit } from 'react-icons/fi';

const PaymentDetailsView = ({ doctor, onUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const paymentMethod = doctor.payment_method || {};

    return (
        <div className="bg-white rounded-lg1 shadow1 p1-6">
            {/* Header with edit button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
                <Button
                    className='cusror-pointer'
                    variant='outline'
                    onClick={() => setIsEditModalOpen(true)}
                    size="sm"
                    icon={<FiEdit className="mr-1" />}
                >
                    Edit Payment
                </Button>
            </div>

            {/* Display content */}
            <div className="space-y-4">
                {/* Bank Details */}
                <div className="border-b pb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Bank Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Account Holder</p>
                            <p className="font-medium">{paymentMethod.holder_name || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sort Code</p>
                            <p className="font-medium">{paymentMethod.bank_sort_code || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="font-medium">
                                {paymentMethod.account_number ? '••••••••' + paymentMethod.account_number.slice(-4) : 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* VAT Details */}
                {paymentMethod.is_vat && (
                    <div className="border-b pb-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">VAT Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">VAT Number</p>
                                <p className="font-medium">{paymentMethod.vat_number}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Registration Date</p>
                                <p className="font-medium">
                                    {new Date(paymentMethod.vat_registration_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cheque Details */}
                {paymentMethod.is_include_cheque && (
                    <div>
                        <h3 className="text-md font-medium text-gray-700 mb-2">Cheque Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Send Cheques To</p>
                                <p className="font-medium">{paymentMethod.send_cheques_to}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">
                                    {[paymentMethod.address_1, paymentMethod.address_2, paymentMethod.town, paymentMethod.postcode]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <PaymentSetupForm
                doctor={doctor}
                onUpdate={onUpdate}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default PaymentDetailsView;