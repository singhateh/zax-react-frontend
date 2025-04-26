import React, { useState } from 'react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import CustomCheckbox from '../../../../components/CustomCheckbox';
import Swal from 'sweetalert2';
import api from '../../../../services/api';
import { SaveIcon, X } from 'lucide-react';
import InputField from '../../../../components/InputField';

const EmailForm = ({ doctor, onUpdate, isOpen, onClose }) => {
    const registeredEmail = doctor?.email || '';
    const emailDetail = doctor?.emailDetail || {};


    const [formData, setFormData] = useState({
        useRegisteredEmail: emailDetail.can_copy_registration_email || false,
        appointmentsEmail: emailDetail.appointment_email || registeredEmail,
        dnaEmail: emailDetail.dna_email || registeredEmail,
        reportsEmail: emailDetail.report_email || registeredEmail,
    });

    const [disclaimerText, setDisclaimerText] = useState(
        emailDetail.disclaimer || `This email and any files transmitted with it are confidential and contain privileged or copyright information.
You must not present this message to another party without gaining permission from the sender.
If you are not the intended recipient you must not copy or distribute it.

If you have received this message in error, please notify the sender immediately,
and delete this email from your system.`
    );

    const [loading, setLoading] = useState(false);

    const handleUseRegisteredEmailToggle = (e) => {
        const checked = e.target.checked;
        setFormData({
            ...formData,
            useRegisteredEmail: checked,
            appointmentsEmail: checked ? registeredEmail : emailDetail.appointment_email,
            dnaEmail: checked ? registeredEmail : emailDetail.dna_email,
            reportsEmail: checked ? registeredEmail : emailDetail.report_email,
        });
    };

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            useRegisteredEmail: value === registeredEmail ? formData.useRegisteredEmail : false,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const payload = {
                can_copy_registration_email: formData.useRegisteredEmail,
                appointment_email: formData.appointmentsEmail,
                dna_email: formData.dnaEmail,
                report_email: formData.reportsEmail,
                disclaimer: disclaimerText
            };

            const response = await api.post('/doctor/account/email/store', payload);
            const updatedEmail = response.data.data;

            if (onUpdate) {
                onUpdate({ ...doctor, emailDetail: updatedEmail });
            }

            await Swal.fire({
                title: 'Success!',
                text: 'Email preferences updated successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            onClose(false);
        } catch (error) {
            console.error('Update failed:', error);
            await Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update email preferences',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };


    const footerButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleSubmit,
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: onClose,
            color: 'bg-red-500',
        }
    ];

    return (
        <>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Edit Email Settings"
                size="custom"
                customWidth='600px'
                footer={footerButtons}
            >
                <div >
                    <div className="flex items-center mb-4">
                        <CustomCheckbox
                            id="useRegisteredEmail"
                            name="useRegisteredEmail"
                            isChecked={formData.useRegisteredEmail}
                            onChange={handleUseRegisteredEmailToggle}
                            className="mr-2"
                        />
                        <label htmlFor="useRegisteredEmail" className="font-medium">
                            Use my registered email for all notifications
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputField
                                    label={"Appointments"}
                                    type="email"
                                    name="appointmentsEmail"
                                    value={formData.appointmentsEmail}
                                    onChange={handleEmailChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                            <div>
                                <InputField
                                    label={"DNA Notifications"}
                                    type="email"
                                    name="dnaEmail"
                                    value={formData.dnaEmail}
                                    onChange={handleEmailChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                            <div>
                                <InputField
                                    label={"Reports"}
                                    type="email"
                                    name="reportsEmail"
                                    value={formData.reportsEmail}
                                    onChange={handleEmailChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disclaimer</label>
                        <textarea
                            value={disclaimerText}
                            onChange={(e) => setDisclaimerText(e.target.value)}
                            className="w-full border rounded p-3 text-gray-600 min-h-[150px]"
                            placeholder="Enter your disclaimer text here..."
                        />
                    </div>
                </div>
            </Modal>
        </>
    );

};


export default EmailForm;