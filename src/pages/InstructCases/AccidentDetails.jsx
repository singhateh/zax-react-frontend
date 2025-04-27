import React from "react";
import CollapsibleSection from "../../components/CollapsibleSection";
import Skeleton from "../../components/Skeleton";
import SelectField from "../../components/SelectField";
import DateField from "../../components/DateField";
import InputField from "../../components/InputField";
import { Ambulance } from "lucide-react";

const AccidentDetails = ({
    formData,
    handleDateChange,
    loading,
    accidentTypesOptions,
}) => {
    return (
        <CollapsibleSection title="Accident Details" icon={<Ambulance />}>
            {loading ? (
                <Skeleton type="rect" count={1} height="30px" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                    <SelectField
                        label="Type of Accident"
                        value={formData.accident_type_id}
                        options={accidentTypesOptions}
                    />
                    <DateField
                        label="Accident Date"
                        name="accident_date"
                        selected={formData.accident_date}
                        onChange={(date) => handleDateChange("accident_date", date)}
                    />
                    <InputField
                        label="Time Since Accident"
                        name="time_since_the_accident"
                        value={formData.time_since_the_accident}
                        readOnly
                    />
                    <InputField
                        label="Age at Accident"
                        name="age_at_the_time_of_accident"
                        value={formData.age_at_the_time_of_accident}
                        readOnly
                    />
                </div>
            )}
        </CollapsibleSection>
    );
};

export default AccidentDetails;
