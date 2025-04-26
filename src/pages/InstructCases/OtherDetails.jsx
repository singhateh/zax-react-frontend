import React from "react";
import CollapsibleSection from "../../components/CollapsibleSection";
import SelectField from "../../components/SelectField";
import DateField from "../../components/DateField";
import InputField from "../../components/InputField";
import Skeleton from "../../components/Skeleton";
import CustomCheckbox from "../../components/CustomCheckbox";

const OtherDetails = ({
    formData,
    loading,
    appointmentTypesOptions,
    venuesOptions,
    expertsOptions,
    appointmentTobeModeDates,
    appointmentTobeModeDays,
    handleSelectChange,
    handleSelectAppointmentChange,
    handleDateChange,
    setFormData,
}) => {
    return (
        <CollapsibleSection title="Other Details">
            {loading ? (
                <Skeleton type="rect" count={2} height="30px" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SelectField
                        label="Expert Type"
                        name="preferable_expert_id"
                        options={expertsOptions}
                        value={formData.preferable_expert_id}
                        onChange={handleSelectChange("preferable_expert_id")}
                    />

                    <DateField
                        label="Report to be completed within"
                        name="report_to_be_completed_within_date"
                        selected={formData.report_to_be_completed_within_date}
                        onChange={(date) => handleDateChange("report_to_be_completed_within_date", date)}
                    />

                    <SelectField
                        label="Type of required appointment"
                        name="appointment_type_id"
                        options={appointmentTypesOptions}
                        value={formData.appointment_type_id}
                        onChange={(val) => setFormData({ ...formData, appointment_type_id: val })}
                    />

                    <SelectField
                        label="Preferred Venue"
                        name="venue_id"
                        options={venuesOptions}
                        value={formData.venue_id}
                        onChange={handleSelectChange("venue_id")}
                    />

                    <div className="flex items-center mt-2">
                        <CustomCheckbox
                            label="Liability Accepted"
                            id="liability_accepted"
                            name="liability_accepted"
                            value="agree"
                            isChecked={formData.liability_accepted}
                            onChange={(e) => setFormData({ ...formData, liability_accepted: e.target.checked })}
                        />
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Appointment to be made after by
                        </label>
                        <div
                            className={`grid grid-cols-1 ${formData.appointment_to_be_made_after_by === "fixed_date"
                                ? "md:grid-cols-1"
                                : "md:grid-cols-3"
                                } gap-2`}
                        >
                            <SelectField
                                name="appointment_to_be_made_after_by"
                                options={appointmentTobeModeDates}
                                value={formData.appointment_to_be_made_after_by}
                                onChange={handleSelectAppointmentChange("appointment_to_be_made_after_by")}
                            />

                            {/* Show "week" and "days" only if not fixed_date */}
                            {formData.appointment_to_be_made_after_by !== "fixed_date" && (
                                <>
                                    <SelectField
                                        name="by_week"
                                        options={appointmentTobeModeDays}
                                        value={formData.by_week}
                                        onChange={handleSelectChange("by_week")}
                                    />
                                    <InputField
                                        type="number"
                                        name="days"
                                        value={formData.days}
                                        onChange={handleSelectChange("days")}
                                        min="1"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Date picker is always visible */}
                    <DateField
                        label="Appointment to be made after"
                        name="appointment_to_be_made_after"
                        selected={formData.appointment_to_be_made_after} // Use value prop for the selected date
                        onChange={(date) => handleDateChange("appointment_to_be_made_after", date)} // Handle date change
                    />
                </div>
            )}
        </CollapsibleSection>
    );
};

export default OtherDetails;
