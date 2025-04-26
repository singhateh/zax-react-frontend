import { useState, useEffect } from "react";
import { SaveIcon, X } from "lucide-react";
import Swal from "sweetalert2";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Modal from "../../components/Modal";
import api from "../../services/api";
import { getTitle } from "../../utilities/constant";
import InputFieldWithButton from "../../components/InputFieldWithButton";
import { handleAddressLookup, handleAddressSelect } from "../../utilities/navigationUtils";

export default function AgencyForm({ agencySolicitor, type, isOpen, title, setModalOpen, setSolicitors, formatSlotData }) {
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [availableAddresses, setAvailableAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const defaultFormData = {
        type: type,
        company_name: "",
        title: "",
        first_name: "",
        last_name: "",
        postcode: "",
        address_1: "",
        address_2: "",
        address_3: "",
        city: "",
        country: "United Kingdom", // Default country
        general_email: "",
        appointment_email: "",
        report_email: "",
        dna_email: "",
        work_phone: "",
        fax: "",
        mobile_phone: "",
    };

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (agencySolicitor) {
            setFormData({
                type: agencySolicitor.type || "",
                company_name: agencySolicitor.company_name || "",
                title: agencySolicitor.title || "",
                first_name: agencySolicitor.first_name || "",
                last_name: agencySolicitor.last_name || "",
                postcode: agencySolicitor.postcode || "",
                address_1: agencySolicitor.address_1 || "",
                address_2: agencySolicitor.address_2 || "",
                address_3: agencySolicitor.address_3 || "",
                city: agencySolicitor.city || "",
                country: agencySolicitor.country || "United Kingdom",
                general_email: agencySolicitor.general_email || "",
                appointment_email: agencySolicitor.appointment_email || "",
                report_email: agencySolicitor.report_email || "",
                dna_email: agencySolicitor.dna_email || "",
                work_phone: agencySolicitor.work_phone || "",
                fax: agencySolicitor.fax || "",
                mobile_phone: agencySolicitor.mobile_phone || "",
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [agencySolicitor]);

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || "");
        setFormData(prev => ({ ...prev, [field]: selectedValue }));
    };

    const handleInputChange = (field) => (eventOrValue) => {
        const value = typeof eventOrValue === 'object' ? eventOrValue.target.value : eventOrValue;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        setErrors({});

        const isUpdating = !!agencySolicitor?.id;
        const url = isUpdating ? `solicitors/${agencySolicitor.id}` : 'solicitors';
        const method = isUpdating ? 'put' : 'post';

        try {
            const response = await api[method](url, formData);

            if ([200, 201].includes(response.status)) {
                const updatedData = response.data?.data;
                const formattedData = formatSlotData(updatedData);

                setSolicitors(prev => isUpdating
                    ? prev.map(item => item.id === updatedData.id ? formattedData : item)
                    : [formattedData, ...prev]
                );

                closeModal();
                showSuccessAlert(isUpdating ? 'Updated' : 'Created',
                    `Agency ${isUpdating ? 'updated' : 'created'} successfully`);
            }
        } catch (error) {
            handleSubmissionError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const showSuccessAlert = (title, text) => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    const handleSubmissionError = (error) => {
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors || {});
        } else {
            console.error('Submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Something went wrong',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    };

    const closeModal = () => {
        setFormData(defaultFormData);
        setErrors({});
        setAvailableAddresses([]);
        setSelectedAddress(null);
        setModalOpen(false);
    };

    const footerButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleSubmit,
            color: 'bg-blue-500 hover:bg-blue-600',
            disabled: isProcessing,
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: closeModal,
            color: 'bg-gray-500 hover:bg-gray-600',
            disabled: isProcessing,
        }
    ];

    const getModalTitle = () => {
        return agencySolicitor ? `Edit ${type}` : `Create New ${type}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={getModalTitle()}
            footer={footerButtons}
            isProcessing={isProcessing}
            size="custom"
            customWidth="800px"
        >
            <div className="space-y-6 p-4">
                {/* Personal Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                        label="Title"
                        name="title"
                        options={getTitle}
                        value={formData.title}
                        onChange={handleSelectChange("title")}
                        errors={errors}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange('first_name')}
                            error={errors.first_name}
                        />
                        <InputField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange('last_name')}
                            errors={errors}
                        />
                    </div>

                    <InputField
                        label="Company Name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange('company_name')}
                        errors={errors}
                    />

                    <InputFieldWithButton
                        label="Postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange('postcode')}
                        buttonLabel={isLoading ? "Looking..." : "Lookup"}
                        onButtonClick={() => handleAddressLookup({
                            formData,
                            setErrors,
                            setIsLoading,
                            setAvailableAddresses,
                            setSelectedAddress,
                            setFormData,
                            api
                        })}
                        isLoading={isLoading}
                        error={errors.postcode}
                    />
                </div>

                {/* Address Section */}
                {availableAddresses.length > 0 && (
                    <SelectField
                        label="Select Address"
                        name="select_address"
                        options={availableAddresses.map(addr => ({ value: addr, label: addr }))}
                        value={selectedAddress}
                        onChange={(option) => handleAddressSelect(
                            option,
                            setSelectedAddress,
                            setFormData,
                            formData
                        )}
                        isClearable
                        placeholder="Select an address..."
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['address_1', 'address_2', 'address_3', 'city', 'country'].map(field => (
                        <InputField
                            key={field}
                            label={field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange(field)}
                            errors={errors}
                        />
                    ))}
                </div>

                {/* Contact Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        'general_email', 'appointment_email',
                        'report_email', 'dna_email', 'work_phone', 'fax', 'mobile_phone'
                    ].map(field => (
                        <InputField
                            key={field}
                            label={field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange(field)}
                            errors={errors}
                            type={field.includes('email') ? 'email' : field.includes('phone') ? 'tel' : 'text'}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
}