import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import CollapsibleSection from "../../components/CollapsibleSection";
import Skeleton from "../../components/Skeleton";
import DateField from "../../components/DateField";
import { Pill } from "lucide-react";
import MedicalRecordTable from "./MedicalRecordTable";

const MedicalRecordsDetails = ({
    loading,
    formData,
    setFormData,
    handleDateChange,
    inputClass,
    handleSelectChange
}) => {
    return (
        <CollapsibleSection title="Medical Records Details" icon={<Pill />}>
            {loading ? (
                <Skeleton type="rect" count={3} height="30px" />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            {/* Consulting Type */}
                            <div className="space-y-2 mb-3">
                                <label className="font-medium text-xs block mb-2">Consulting Type</label>
                                <div className="flex gap-4">
                                    {["F2F", "Remote"].map((label, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="consult"
                                                value={label}
                                                defaultChecked={label === "F2F"}
                                                className="peer hidden"
                                            />
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition-all duration-200">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                            </div>
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* SLA Type */}
                            <div className="space-y-2 mb-3">
                                <label className="font-medium text-xs block mb-2">SLA Type</label>
                                <div className="flex flex-wrap gap-4">
                                    {[1, 2, 3].map((value, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sla_types"
                                                value={value}
                                                checked={formData.sla_types === value}
                                                onChange={handleSelectChange('sla_types')}
                                                className="peer hidden"
                                            />
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition-all duration-200">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                            </div>
                                            <span>{`SLA${idx + 1}`}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Medical Records */}
                            <div className="space-y-2">
                                <label className="font-medium text-xs block mb-2">Medical Records</label>
                                <div className="flex gap-4">
                                    {["Yes", "No"].map((label, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="medical_records"
                                                value={label}
                                                checked={formData.medical_records === label}
                                                // defaultChecked={label === 'No'}
                                                onChange={(e) => setFormData({ ...formData, medical_records: e.target.value })}
                                                className="peer hidden"
                                            />
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition-all duration-200">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                            </div>
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Date Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-medium block mb-1">Instruction Received Date</label>
                                <DateField
                                    placeholderText="Instruction Received Date"
                                    selected={formData.instruction_received_date}
                                    onChange={(date) => handleDateChange("instruction_received_date", date)}
                                    className={inputClass}
                                    wrapperClassName="w-full"
                                    dateFormat="dd/mm/yyyy"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Medco Instruction Received Date</label>
                                <DateField
                                    placeholderText="Medco Instruction Received Date"
                                    selected={formData.medco_instruction_received_date}
                                    onChange={(date) => handleDateChange("medco_instruction_received_date", date)}
                                    className={inputClass}
                                    wrapperClassName="w-full"
                                    dateFormat="dd/mm/yyyy"
                                />
                            </div>
                        </div>
                    </div>
                    <MedicalRecordTable formData={formData}
                        setFormData={setFormData}
                        handleDateChange={handleDateChange}
                        handleSelectChange={handleSelectChange} />
                </>
            )}
        </CollapsibleSection>
    );
};

export default MedicalRecordsDetails;
