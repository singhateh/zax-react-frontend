import Modal from "../../../components/Modal";
import InputFieldWithButton from "../../../components/InputFieldWithButton";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import RadioGroup from "../../../components/RadioGroup";
import FilePicker from "../../../components/FilePicker";
import { useForm, Controller } from "react-hook-form";
import api from "../../../services/api";
import { SaveAllIcon, SaveIcon, X } from "lucide-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function VenueForm({ ...props }) {

    const [availableAddresses, setAvailableAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const venue = props.venue;

    const { control, handleSubmit, formState: { errors }, reset, setError, getValues, setValue } = useForm({
        defaultValues: {
            expert_id: "",
            consulting_venue: "",
            venue_color_code: "",
            booking_contact_name: "",
            booking_contact_work: "",
            booking_contact_mobile: "",
            booking_contact_email: "",
            postcode: "",
            address_1: "",
            address_2: "",
            address_3: "",
            town: "",
            county: "",
            country: "",
            disabled_access: "No",
            status: "Active",
            parking_facilities: "on_site",
            postcode_area: "Urban",
            can_children_attend_the_venue: "No",
            venue_type: "Fixed",
            medco_definition_of_consulting_room: "Best_Practice",
            waiting_facility_venue: "No",
            receptionist_at_the_venue: "No",
            special_instruction: "",
        }
    });


    useEffect(() => {
        if (venue) {
            setValue("expert_id", venue.expert_id || "");
            setValue("consulting_venue", venue.venue_name || "");
            setValue("venue_color_code", venue.venue_color_code || "");
            setValue("booking_contact_name", venue.contact_name || "");
            setValue("booking_contact_work", venue.contact_work || "");
            setValue("booking_contact_mobile", venue.contact_phone || "");
            setValue("booking_contact_email", venue.contact_email || "");
            setValue("postcode", venue.address?.postcode || "");
            setValue("address_1", venue.address?.address_1 || "");
            setValue("address_2", venue.address?.address_2 || "");
            setValue("address_3", venue.address?.address_3 || "");
            setValue("town", venue.address?.town || "");
            setValue("county", venue.address?.county || "");
            setValue("country", venue.address?.country || "");
            setValue("disabled_access", venue.disabled_access || "No");
            setValue("status", venue.status || "Active");
            setValue("parking_facilities", venue.parking || "none");
            setValue("postcode_area", venue.postcode_area || "Urban");
            setValue("can_children_attend_the_venue", venue.can_children_attend || "No");
            setValue("venue_type", venue.venue_type || "Fixed");
            setValue("medco_definition_of_consulting_room", venue.medco_definition || "Acceptable");
            setValue("waiting_facility_venue", venue.waiting_facility || "No");
            setValue("receptionist_at_the_venue", venue.receptionist || "No");
            setValue("special_instruction", venue.special_instruction || "");
        }
    }, [venue, setValue]);



    const onSubmit = async (data) => {
        setIsProcessing(true);

        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                if (key === 'upload_image' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });

            const isUpdating = !!props.venue?.id;
            const url = isUpdating ? `doctor/venues/${props.venue.id}` : 'doctor/venues';
            const method = isUpdating ? 'put' : 'post';

            const response = await api[method](url, formData);

            if ([200, 201].includes(response.status)) {
                const updatedVenue = response.data;
                const formattedVenue = props.formatVenueData(updatedVenue.data);

                props.setVenues((prevVenues) =>
                    isUpdating
                        ? prevVenues.map((venue) => (venue.id === updatedVenue.data.id ? formattedVenue : venue))
                        : [formattedVenue, ...prevVenues]
                );

                closeModal();

                // Success Toast
                Swal.fire({
                    icon: 'success',
                    title: isUpdating ? 'Venue Updated' : 'Venue Created',
                    text: isUpdating
                        ? 'The venue has been successfully updated.'
                        : 'The new venue has been successfully added.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            } else {
                console.error('Unexpected response:', response);

                // Generic Error Toast
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an issue submitting the form.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error submitting the form:', error.response?.data || error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again.',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };


    const closeModal = () => {
        reset();
        props.onClose();
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValue(name, value);
    };

    const handleSelectChange = (field) => (input) => {
        setValue(field, input?.value ?? input?.target?.value ?? null);
    };


    const footerButtons = [
        {
            label: 'Save',
            icon: <SaveIcon size={16} />,
            onClick: handleSubmit(onSubmit),
            color: 'bg-blue-500',
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: closeModal,
            color: 'bg-red-500',
        }
    ];

    const handleAddressSelect = (option) => {
        if (!option || !option.value) return;

        setSelectedAddress(option.value);

        const addressString = option.value;
        const parts = addressString.split(',');

        setValue("address_1", parts[0]?.trim() || "");
        setValue("address_2", parts[1]?.trim() || "");
        setValue("address_3", parts[2]?.trim() || "");
        setValue("town", parts[5]?.trim() || "");
        setValue("county", parts[6]?.trim() || "");
        setValue("country", parts[7]?.trim() || "England");
    };

    const handleAddressLookUp = async () => {
        // Get the postcode value from the form
        const postcode = getValues("postcode");

        // Check if the postcode is empty
        if (!postcode) {
            setError("postcode", { type: "manual", message: "Please enter a postcode" });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/postcode-lookup', { postcode });

            if (response.data.success && response.data.data.addresses?.length > 0) {
                setAvailableAddresses(response.data.data.addresses);

                // If only one address is returned, automatically select it
                if (response.data.data.addresses.length === 1) {
                    handleAddressSelect({ value: response.data.data.addresses[0], label: response.data.data.addresses[0] });
                }
                setError("postcode", {
                    type: "manual",
                    message: "",
                });
            } else {
                setAvailableAddresses([]);
                setError("postcode", { type: "manual", message: response.data.message || "No addresses found." });
            }
        } catch (error) {
            console.error("Lookup error:", error);
            setError("postcode", { type: "manual", message: "Something went wrong during lookup." });
        } finally {
            setIsLoading(false);
        }
    };

    const expertOptions = props.experts.map((expert) => ({
        value: expert.id,
        label: expert.name,
    }));

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={closeModal}
            title={props.title}
            footer={footerButtons}
            isLoading={isLoading}
            isProcessing={isProcessing}
            size="custom"
            customWidth="1200px"
        >
            {/* Main Form Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-2 p-4">
                <div>

                    <Controller
                        name="expert_id"
                        control={control}
                        rules={{ required: "Expert is required" }}
                        render={({ field }) => <SelectField
                            label="Experts"
                            name={'expert_id'}
                            options={expertOptions}
                            onChange={handleSelectChange("expert_id")}
                            {...field}
                            value={venue?.expert_id}
                        />}
                    />
                    {errors.expert_id && <p className="text-red-500 text-sm">{errors.expert_id.message}</p>}
                </div>

                <div>
                    <Controller
                        name="consulting_venue"
                        control={control}
                        rules={{ required: "Consulting Venue is required" }}
                        render={({ field }) => <InputField label="Consulting Venue" {...field} name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur} />}
                    />
                    {errors.consulting_venue && <p className="text-red-500 text-sm">{errors.consulting_venue.message}</p>}
                </div>
                <div>
                    <Controller
                        name="venue_color_code"
                        control={control}
                        rules={{ required: "Venue Color Code is required" }}
                        render={({ field }) => <InputField label="Venue Color Code" type="color" {...field}
                            onChange={handleInputChange} />}
                    />
                    {errors.venue_color_code && <p className="text-red-500 text-sm">{errors.venue_color_code.message}</p>}
                </div>
                <div>
                    <Controller
                        name="booking_contact_name"
                        control={control}
                        rules={{ required: "Booking Contact Name is required" }}
                        render={({ field }) => <InputField label="Booking Contact Name" {...field}
                            onChange={handleInputChange} />}
                    />
                    {errors.booking_contact_name && <p className="text-red-500 text-sm">{errors.booking_contact_name.message}</p>}
                </div>
                <div>
                    <Controller
                        name="booking_contact_work"
                        control={control}
                        rules={{ required: "Booking Contact Work is required", pattern: /^[0-9]+$/ }}
                        render={({ field }) => <InputField label="Booking Contact Work" type="tel" {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                handleInputChange(e);
                            }} />}
                    />
                    {errors.booking_contact_work && <p className="text-red-500 text-sm">{errors.booking_contact_work.message}</p>}
                </div>
                <div>
                    <Controller
                        name="booking_contact_mobile"
                        control={control}
                        rules={{ required: "Booking Contact Mobile is required", pattern: /^[0-9]+$/ }}
                        render={({ field }) => <InputField label="Booking Contact Mobile" type="tel" {...field}
                            onChange={handleInputChange} />}
                    />
                    {errors.booking_contact_mobile && <p className="text-red-500 text-sm">{errors.booking_contact_mobile.message}</p>}
                </div>
                <div>
                    <Controller
                        name="booking_contact_email"
                        control={control}
                        rules={{
                            required: "Booking Contact Email is required",
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        }}
                        render={({ field }) => <InputField label="Booking Contact Email" type="email" {...field}
                            onChange={handleInputChange} />}
                    />
                    {errors.booking_contact_email && <p className="text-red-500 text-sm">{errors.booking_contact_email.message}</p>}
                </div>
                <div>
                    <Controller
                        name="postcode"
                        control={control}
                        rules={{
                            required: "Postcode is required",
                        }}
                        render={({ field }) => (
                            <InputFieldWithButton
                                label="Lookup"
                                buttonLabel={isLoading ? "Looking..." : "Lookup"}
                                onButtonClick={handleAddressLookUp}
                                onChange={handleInputChange}
                                isLoading={isLoading}
                                {...field}
                            />
                        )}
                    />
                    {errors.postcode && <p className="text-red-500 text-sm">{errors.postcode.message}</p>}
                </div>

                {availableAddresses.length > 0 && (
                    <SelectField
                        label="Select Address"
                        name="select_address"
                        options={availableAddresses.map((addr, idx) => ({
                            value: addr,
                            label: addr,
                            key: idx,
                        }))}
                        value={selectedAddress}
                        onChange={(option) => handleAddressSelect(option)}
                    />
                )}
                <div>
                    <Controller
                        name="address_1"
                        control={control}
                        rules={{ required: "Address 1 is required" }}
                        render={({ field }) => <InputField label="Address 1" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                    {errors.address_1 && <p className="text-red-500 text-sm">{errors.address_1.message}</p>}
                </div>
                <div>
                    <Controller
                        name="address_2"
                        control={control}
                        render={({ field }) => <InputField label="Address 2" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                </div>
                <div>
                    <Controller
                        name="address_3"
                        control={control}
                        render={({ field }) => <InputField label="Address 3" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                </div>
                <div>
                    <Controller
                        name="town"
                        control={control}
                        rules={{ required: "Town is required" }}
                        render={({ field }) => <InputField label="Town" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                    {errors.town && <p className="text-red-500 text-sm">{errors.town.message}</p>}
                </div>
                <div>
                    <Controller
                        name="county"
                        control={control}
                        render={({ field }) => <InputField label="County" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                </div>
                <div>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => <InputField label="Country" {...field}
                            onChange={handleInputChange}
                        />}
                    />
                </div>
            </div>
            {/* Radio Button Groups */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 border-t-1 border-t-amber-200 mt-2 p-4">
                <div className="flex flex-col space-y-4">
                    <Controller
                        name="disabled_access"
                        control={control}
                        rules={{ required: "Disabled Access is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Disabled Access" name="disabled_access" options={["Yes", "No"]}  {...field}
                                defaultValue={venue?.disabled_access || "No"} />
                        )}
                    />
                    {errors.disabled_access && <p className="text-red-500 text-sm">{errors.disabled_access.message}</p>}
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Status" name="status" options={["Active", "Inactive"]}  {...field}
                                defaultValue={venue?.status || "Active"}
                            />
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                    <Controller
                        name="parking_facilities"
                        control={control}
                        rules={{ required: "Parking Facilities is required" }}
                        render={({ field }) => (
                            <RadioGroup
                                label="Parking Facilities"
                                name="parking_facilities"
                                options={[
                                    { value: "on_site", label: "On-Site" },
                                    { value: "off_road", label: "Off-Road" },
                                    { value: "none", label: "None" }
                                ]}
                                {...field}
                                defaultValue={venue?.parking || "none"}
                            />

                        )}
                    />
                    {errors.parking_facilities && <p className="text-red-500 text-sm">{errors.parking_facilities.message}</p>}
                </div>
                <div className="flex flex-col space-y-4">
                    <Controller
                        name="postcode_area"
                        control={control}
                        rules={{ required: "Postcode Area is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Postcode Area" name="postcode_area" options={["Urban", "Rural"]} {...field}
                                defaultValue={venue?.postcode_area || "Urban"}
                            />
                        )}
                    />
                    {errors.postcode_area && <p className="text-red-500 text-sm">{errors.postcode_area.message}</p>}
                    <Controller
                        name="can_children_attend_the_venue"
                        control={control}
                        rules={{ required: "Can children attend the venue?" }}
                        render={({ field }) => (
                            <RadioGroup label="Can children attend" name="can_children_attend_the_venue" options={["Yes", "No"]}  {...field}
                                defaultValue={venue?.can_children_attend || "No"} />
                        )}
                    />
                    {errors.can_children_attend_the_venue && <p className="text-red-500 text-sm">{errors.can_children_attend_the_venue.message}</p>}
                    <Controller
                        name="venue_type"
                        control={control}
                        rules={{ required: "Venue Type is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Venue Type" name="venue_type" options={["Fixed", "Mobile"]}
                                defaultValue={venue?.venue_type || "Fixed"}  {...field} />
                        )}
                    />
                    {errors.venue_type && <p className="text-red-500 text-sm">{errors.venue_type.message}</p>}
                </div>
                <div className="flex flex-col space-y-4">
                    <Controller
                        name="medco_definition_of_consulting_room"
                        control={control}
                        rules={{ required: "Medco Definition is required" }}
                        render={({ field }) => (
                            <RadioGroup
                                label="Medco Definition"
                                name="medco_definition_of_consulting_room"
                                options={[
                                    { value: "Best_Practice", label: "Best Practice" },
                                    { value: "Acceptable", label: "Acceptable" },
                                    { value: "Inappropriate", label: "Inappropriate" }
                                ]}
                                defaultValue={venue?.medco_definition || "Acceptable"}
                                {...field}
                            />

                        )}
                    />
                    {errors.medco_definition_of_consulting_room && <p className="text-red-500 text-sm">{errors.medco_definition_of_consulting_room.message}</p>}
                    <Controller
                        name="waiting_facility_venue"
                        control={control}
                        rules={{ required: "Waiting Facility is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Waiting Facility" name="waiting_facility_venue" options={["Yes", "No"]}
                                defaultValue={venue?.waiting_facility || "No"}
                                {...field} />
                        )}
                    />
                    {errors.waiting_facility_venue && <p className="text-red-500 text-sm">{errors.waiting_facility_venue.message}</p>}
                    <Controller
                        name="receptionist_at_the_venue"
                        control={control}
                        rules={{ required: "Receptionist is required" }}
                        render={({ field }) => (
                            <RadioGroup label="Receptionist" name="receptionist_at_the_venue" options={["Yes", "No"]}
                                defaultValue={venue?.receptionist || "No"}
                                {...field} />
                        )}
                    />
                    {errors.receptionist_at_the_venue && <p className="text-red-500 text-sm">{errors.receptionist_at_the_venue.message}</p>}
                </div>
            </div>

            {/* Special Instruction Section */}
            <div className="mb-6 p-4 grid md:grid-cols-2 gap-4">
                <Controller
                    name="special_instruction"
                    control={control}
                    render={({ field }) => (
                        <InputField label="Special Instructions" placeholder="Provide any special instructions" {...field}
                            value={venue?.special_instruction}

                        />
                    )}
                />
                <FilePicker
                    name="upload_image"
                    control={control}
                    errors={errors}  // Pass errors to FilePicker
                    label="Upload Image"
                    placeholder="Choose an image file"
                />
                {errors.upload_image && <p className="text-red-500 text-sm">{errors.upload_image.message}</p>}
            </div>

        </Modal>
    );
}
