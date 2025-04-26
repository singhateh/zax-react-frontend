import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import InputFieldWithButton from '../../../../components/InputFieldWithButton';
import RadioGroup from '../../../../components/RadioGroup';
import { genders, getTitle } from '../../../../utilities/constant';
import { handleAddressLookup, handleAddressSelect } from '../../../../utilities/navigationUtils';

export const PersonalDetailsEditForm = ({
    doctor,
}) => {
    const [postcodeAddress, setPostcodeAddress] = useState([]);
    const [loadingPostcode, setLoadingPostcode] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(doctor?.signature_url);

    const {
        register,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ...doctor,
            gender: doctor?.gender?.toString(),
        }
    });

    const handleAddressSelection = (option) => {
        setSelectedAddress(option);
        handleAddressSelect(option, setValue);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('signature', file);
            setSignaturePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <SelectField
                label="Title"
                {...register('title', { required: true })}
                options={getTitle}
                errors={errors}
            />

            <InputFieldWithButton
                label="Postcode"
                name="postcode"
                {...register('postcode', { required: true })}
                buttonLabel={loadingPostcode ? "Looking..." : "Lookup"}
                onButtonClick={() => handleAddressLookup(
                    watch('postcode'),
                    setPostcodeAddress,
                    setLoadingPostcode
                )}
                error={errors.postcode}
                disabled={loadingPostcode}
            />

            {postcodeAddress.length > 0 && (
                <SelectField
                    label="Select Address"
                    name="select_address"
                    options={postcodeAddress.map((addr) => ({
                        value: addr,
                        label: addr,
                    }))}
                    value={selectedAddress}
                    onChange={handleAddressSelection}
                    errors={errors}
                />
            )}

            <InputField
                label="First Name"
                {...register('first_name', { required: true })}
                errors={errors}
            />
            <InputField
                label="Middle Name"
                {...register('middle_name')}
            />
            <InputField
                label="Last Name"
                {...register('last_name', { required: true })}
                errors={errors}
            />
            <InputField
                label="Email"
                type="email"
                {...register('email', {
                    required: true,
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })}
                errors={errors}
            />
            <InputField
                label="Address 1"
                {...register('address_1', { required: true })}
                errors={errors}
            />
            <InputField
                label="Address 2"
                {...register('address_2')}
            />
            <InputField
                label="Address 3"
                {...register('address_3')}
            />
            <InputField
                label="Town / City"
                {...register('town', { required: true })}
                errors={errors}
            />
            <InputField
                label="Country"
                {...register('country', { required: true })}
                errors={errors}
            />
            <InputField
                label="County"
                {...register('county')}
            />
            <InputField
                label="Mobile Phone"
                {...register('mobile', {
                    required: true,
                    pattern: {
                        value: /^[0-9+\- ]+$/,
                        message: "Invalid phone number"
                    }
                })}
                errors={errors}
            />
            <InputField
                label="Office Phone"
                {...register('office_phone', {
                    pattern: {
                        value: /^[0-9+\- ]+$/,
                        message: "Invalid phone number"
                    }
                })}
                errors={errors}
            />
            <InputField
                label="Language Known"
                {...register('language_known')}
            />

            <div className="col-span-3">
                <label className="block font-semibold mb-2">Gender</label>
                <RadioGroup
                    options={genders}
                    {...register('gender', { required: "Gender is required" })}
                    className="flex space-x-4"
                />
                {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
            </div>

            <div className="col-span-3">
                <label className="block font-semibold mb-2">
                    Signature Upload <span className="text-red-500 text-sm">(PNG/JPG only)</span>
                </label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                    onChange={handleFileChange}
                />
                {signaturePreview && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Signature Preview:</p>
                        <div className="flex items-center space-x-4">
                            <img
                                src={signaturePreview}
                                alt="signature preview"
                                className="w-20 h-20 object-contain border border-gray-200 rounded"
                            />
                            <a
                                href={signaturePreview}
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