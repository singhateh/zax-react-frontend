import { useState, useEffect } from "react";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import RadioGroup from "../../../components/RadioGroup";
import Modal from "../../../components/Modal";
import CustomCheckbox from "../../../components/CustomCheckbox";
import DateField from "../../../components/DateField";
import { SaveIcon, X } from "lucide-react";
import api from "../../../services/api";
import Swal from "sweetalert2";

export default function SlotForm({ ...props }) {
    const { slot, experts, venues, appointmentTypes, reportTypes, isOpen, title } = props;
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const defaultFormData = {
        expert_id: "",
        report_type_id: 1,
        appointment_type_id: 1,
        venue_id: "",
        slot_date: new Date().toISOString().split('T')[0],
        appointment_length_in_minute: "15",
        number_of_slots: "",
        start_time_hour: "",
        start_time_minute: "",
        end_time_hour: "",
        end_time_minute: "",
        session_type: "F2F",
        allow_claimant_to_book_online: false,
        selected_repeated_months: []
    }

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (slot) {
            setFormData({
                expert_id: slot.expert_id || "",
                report_type_id: slot.report_type_id || "",
                appointment_type_id: slot.appointment_type_id || "",
                venue_id: slot.venue_id || "",
                slot_date: slot.slot_date || "",
                appointment_length_in_minute: slot.appointment_length_in_minute || "",
                number_of_slots: slot.number_of_slots || "",
                start_time_hour: slot.start_time_hour || "",
                start_time_minute: slot.start_time_minute || "",
                end_time_hour: slot.end_time_hour || "",
                end_time_minute: slot.end_time_minute || "",
                session_type: slot.session_type || "F2F",
                allow_claimant_to_book_online: slot.allow_claimant_to_book_online || false,
                selected_repeated_months: []
            });
        }
    }, [slot]);

    // Options for dropdowns
    const expertOptions = experts?.map((expert) => ({
        value: expert.id,
        label: expert.name,
    }));

    const venueOptions = Object.values(venues || {}).map((venue) => ({
        value: venue.id,
        label: venue.consulting_venue,
    }));

    const appointmentTypesOptions = appointmentTypes?.map((appointment) => ({
        value: appointment.id,
        label: appointment.name,
    }));

    const reportTypesOptions = reportTypes?.map((report) => ({
        value: report.id,
        label: report.name,
    }));

    const timeHourOptions = Array.from({ length: 24 }, (_, i) => ({
        value: i.toString().padStart(2, '0'),
        label: i.toString().padStart(2, '0'),
    }));

    const timeMinuteOptions = Array.from({ length: 12 }, (_, i) => ({
        value: (i * 5).toString().padStart(2, '0'),
        label: (i * 5).toString().padStart(2, '0'),
    }));

    const lengthInMinutesOptions = Array.from({ length: 12 }, (_, i) => ({
        value: ((i + 1) * 5).toString().padStart(2, '0'),
        label: ((i + 1) * 5).toString().padStart(2, '0'),
    }));

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);
        setFormData((prevState) => ({
            ...prevState,
            [field]: selectedValue,
        }));
    };

    const handleInputChange = (field) => (eventOrValue) => {
        const value =
            typeof eventOrValue === 'string' // direct value (e.g., from radio group custom component)
                ? eventOrValue
                : eventOrValue?.target?.type === 'checkbox'
                    ? eventOrValue.target.checked
                    : eventOrValue?.target?.value ?? null;

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleDateChange = (name, date) => {
        // Ensure the date is a valid Date object before updating the state
        const validDate = date instanceof Date && !isNaN(date) ? date : new Date(date);

        setFormData({
            ...formData,
            [name]: validDate,
        });
    };

    // Time Slot Calculation function
    const timeSlotCalculator = () => {
        const { start_time_hour, start_time_minute, end_time_hour, end_time_minute, appointment_length_in_minute } = formData;

        if (
            start_time_hour && start_time_minute && end_time_hour && end_time_minute &&
            !isNaN(appointment_length_in_minute) && appointment_length_in_minute > 0
        ) {
            const startTime = new Date();
            startTime.setHours(parseInt(start_time_hour), parseInt(start_time_minute), 0, 0);

            const endTime = new Date();
            endTime.setHours(parseInt(end_time_hour), parseInt(end_time_minute), 0, 0);

            const slots = [];
            let currentTime = new Date(startTime);

            while (currentTime < endTime) {
                const slotTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                slots.push(slotTime);

                // Add the appointment length to the current time
                currentTime.setMinutes(currentTime.getMinutes() + parseInt(appointment_length_in_minute));
            }

            // Update number of slots
            setFormData(prevState => ({
                ...prevState,
                number_of_slots: slots.length,
            }));

            return slots; // return the list of time slots
        }

        return [];
    };

    // Calculate time slots whenever start time, end time, or appointment length changes
    useEffect(() => {
        const slots = timeSlotCalculator();
        console.log("Calculated slots:", slots);
    }, [formData.start_time_hour, formData.start_time_minute, formData.end_time_hour, formData.end_time_minute, formData.appointment_length_in_minute]);



    const handleSubmit = async () => {
        setIsProcessing(true);
        setErrors({});

        const isUpdating = !!props.slot?.id;
        const url = isUpdating ? `doctor/slots/${props.slot.id}` : 'doctor/slots';
        const method = isUpdating ? 'put' : 'post';

        try {
            const response = await api[method](url, formData);

            if ([200, 201].includes(response.status)) {
                const updatedSlot = response.data?.data;
                const formattedSlot = props.formatSlotData(updatedSlot);

                props.setSlots((prevSlots) =>
                    isUpdating
                        ? prevSlots.map((slot) =>
                            slot.id === updatedSlot.id ? formattedSlot : slot
                        )
                        : [formattedSlot, ...prevSlots]
                );

                closeModal();

                Swal.fire({
                    icon: 'success',
                    title: isUpdating ? 'Slot Updated' : 'Slot Created',
                    text: isUpdating
                        ? 'The slot has been successfully updated.'
                        : 'The new slot has been successfully added.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            } else {
                console.error('Unexpected response:', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Unexpected server response.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            const status = error.response?.status;

            if (status === 422) {
                // Laravel validation errors — don't show Swal, just update errors
                const validationErrors = error.response.data.errors || {};
                setErrors(validationErrors);
            } else {
                console.error('Form submission error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong. Please try again later.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        } finally {
            setIsProcessing(false);
        }
    };



    const closeModal = () => {
        setFormData(defaultFormData);
        setErrors({});
        props.onClose();
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
            onClick: closeModal,
            color: 'bg-red-500',
        }
    ];


    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={title}
            footer={footerButtons}
            isProcessing={isProcessing}
            size="custom"
            customWidth="800px"
        >
            {/* Main Form Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-2 p-4">
                <div>
                    <SelectField
                        label="Expert"
                        name={"expert_id"}
                        options={expertOptions}
                        value={formData.expert_id}
                        onChange={handleSelectChange("expert_id")}
                        errors={errors}
                    />
                </div>

                <div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <SelectField
                            label="Service"
                            name={"report_type_id"}
                            options={reportTypesOptions}
                            value={formData.report_type_id}
                            onChange={handleSelectChange("report_type_id")}
                            errors={errors}
                        />
                        <SelectField
                            label="Appointment Type"
                            name={"appointment_type_id"}
                            options={appointmentTypesOptions}
                            value={formData.appointment_type_id}
                            onChange={handleSelectChange("appointment_type_id")}
                            errors={errors}
                        />
                    </div>
                </div>

                <div>
                    <DateField
                        label="Slot Date"
                        selected={formData.slot_date ? new Date(formData.slot_date) : null}
                        onChange={(date) => handleDateChange("slot_date", date)}
                        errors={errors.slot_date}
                    />
                </div>

                <div>
                    <SelectField
                        label="Consulting Venue"
                        name={"venue_id"}
                        options={venueOptions}
                        value={formData.venue_id}
                        onChange={handleSelectChange("venue_id")}
                        errors={errors}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                    <div className="grid md:grid-cols-2 gap-3">
                        <SelectField
                            name={"start_time_hour"}
                            options={timeHourOptions}
                            value={formData.start_time_hour}
                            onChange={handleSelectChange("start_time_hour")}
                            errors={errors}
                        />
                        <SelectField
                            name={"start_time_minute"}
                            options={timeMinuteOptions}
                            value={formData.start_time_minute}
                            onChange={handleSelectChange("start_time_minute")}
                            errors={errors}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">End Time</label>
                    <div className="grid md:grid-cols-2 gap-3">
                        <SelectField
                            options={timeHourOptions}
                            name={'end_time_hour'}
                            value={formData.end_time_hour}
                            onChange={handleSelectChange("end_time_hour")}
                            errors={errors}
                        />
                        <SelectField
                            options={timeMinuteOptions}
                            name={'end_time_minute'}
                            value={formData.end_time_minute}
                            onChange={handleSelectChange("end_time_minute")}
                            errors={errors}
                        />
                    </div>
                </div>

                <div>
                    <SelectField
                        label="Appointment length in minutes"
                        name={'appointment_length_in_minute'}
                        options={lengthInMinutesOptions}
                        value={formData.appointment_length_in_minute}
                        onChange={handleSelectChange("appointment_length_in_minute")}
                        errors={errors}
                    />
                </div>

                <div>
                    <InputField
                        label="Number of slots"
                        value={formData.number_of_slots}
                        onChange={handleInputChange}
                        name="number_of_slots"
                        errors={errors}
                    />
                </div>
            </div>

            {/* Radio Button Groups */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-1 border-t-amber-200 mt-2 p-4">
                <div>
                    <label className="mb-3 block">Allow claimant to book online</label>
                    <CustomCheckbox
                        id="allow_claimant_to_book_online"
                        name="allow_claimant_to_book_online"
                        // options={["Yes", "No"]}
                        value={formData.allow_claimant_to_book_online}
                        isChecked={formData.allow_claimant_to_book_online}
                        onChange={handleInputChange("allow_claimant_to_book_online")}
                        error={errors.allow_claimant_to_book_online}
                    />
                </div>
                <div>
                    <RadioGroup
                        label="Session Type"
                        value={formData.session_type}
                        options={[
                            { value: "F2F", label: "F2F" },
                            { value: "video_telephone", label: "Remote" },
                        ]}
                        onChange={handleInputChange("session_type")}
                        error={errors.session_type}
                    />
                </div>
            </div>

            {/* File Picker and Special Instruction */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-4">
                <SelectField
                    label="Repeat"
                    name={"repeat"}
                    value={formData.repeat}
                    onChange={handleSelectChange("repeat")}
                    error={errors}
                />
            </div>
        </Modal>


    );


}
