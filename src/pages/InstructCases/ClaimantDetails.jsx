import React from "react";
import CollapsibleSection from "../../components/CollapsibleSection";
import SelectField from "../../components/SelectField";
import DateField from "../../components/DateField";
import InputFieldWithButton from "../../components/InputFieldWithButton";
import InputField from "../../components/InputField";
import Skeleton from "../../components/Skeleton";
import { Users } from "lucide-react";

const ClaimantDetails = ({
    formData,
    handleSelectChange,
    handleInputChange,
    handleDOBChange,
    handleAddressLookUp,
    handleAddressSelect,
    isLoading,
    availableAddresses,
    selectedAddress,
    errors,
    loading,
    titlesOptions,
    genders,
}) => {
    return (
        <CollapsibleSection title="Claimant Details" icon={<Users />}>
            {loading ? (
                <Skeleton type="rect" count={4} height="30px" />
            ) : (
                <div className="grid grid-cols1-1 md:grid1-cols-2 gap-6">
                    {/* LEFT SECTION CARD */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <SelectField
                            label="Title"
                            name="title"
                            value={formData.title}
                            options={titlesOptions}
                            onChange={handleSelectChange("title")}
                        />
                        <SelectField
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            options={genders}
                            onChange={handleSelectChange("gender")}
                        />
                        <InputField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Middle Name"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                        />
                        <DateField
                            label="Date of Birth"
                            name="dob"
                            selected={formData.dob}
                            onChange={handleDOBChange}
                            value={formData.dob}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Telephone Work"
                            name="telephone_work"
                            value={formData.telephone_work}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* RIGHT SECTION CARD */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <InputFieldWithButton
                            label="Postcode"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                            buttonLabel={isLoading ? "Looking..." : "Lookup"}
                            onButtonClick={handleAddressLookUp}
                            isLoading={isLoading}
                            error={errors.postcode}
                        />

                        {availableAddresses.length > 0 && (
                            <SelectField
                                label="Select Address"
                                name="select_address"
                                options={availableAddresses.map((addr) => ({
                                    value: addr,
                                    label: addr,
                                }))}
                                value={selectedAddress}
                                onChange={(option) => handleAddressSelect(option)}
                            />
                        )}

                        <InputField
                            label="Address 1"
                            name="address_1"
                            value={formData.address_1}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Address 2"
                            name="address_2"
                            value={formData.address_2}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Address 3"
                            name="address_3"
                            value={formData.address_3}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Town/City"
                            name="town"
                            value={formData.town}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            )
            }
        </CollapsibleSection >
    );
};

export default ClaimantDetails;
