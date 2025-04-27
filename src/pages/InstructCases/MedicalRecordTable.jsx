import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CollapsibleSection from "../../components/CollapsibleSection";
import Skeleton from "../../components/Skeleton";
import DateField from "../../components/DateField";
import { Pill, Upload, FilePlus, Edit, Trash2, Plus, X, List, Save } from "lucide-react";
import SelectField from "../../components/SelectField";
import Modal from "../../components/Modal";

const MedicalRecordTable = ({
    loading,
    formData,
    setFormData,
    inputClass,
}) => {
    const medicalRecords = formData?.medicalRecords || [];
    const [showRecordForm, setShowRecordForm] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [recordForm, setRecordForm] = useState({
        type: "",
        requestedDate: null,
        status: "Pending",
        files: []
    });
    const [errors, setErrors] = useState({
        type: "",
        requestedDate: "",
        files: ""
    });

    const recordTypeOptions = [
        { value: "gp", label: "GP Records" },
        { value: "hospital", label: "Hospital Records" },
        { value: "specialist", label: "Specialist Reports" },
        { value: "imaging", label: "Imaging Results" },
        { value: "other", label: "Other Medical Documents" }
    ];

    const validateForm = () => {
        const newErrors = {
            type: !recordForm.type ? "Record type is required" : "",
            requestedDate: !recordForm.requestedDate ? "Requested date is required" : "",
            files: recordForm.files.length === 0 ? "At least one file is required" : ""
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    const handleRecordSelectChange = (field) => (value) => {
        setRecordForm(prev => ({
            ...prev,
            [field]: value?.value || value
        }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleRecordDateChange = (date) => {
        setRecordForm(prev => ({
            ...prev,
            requestedDate: date
        }));
        setErrors(prev => ({ ...prev, requestedDate: "" }));
    };

    const handleRecordInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRecordForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setRecordForm(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
        setErrors(prev => ({ ...prev, files: "" }));
    };

    const removeFile = (index) => {
        const updatedFiles = [...recordForm.files];
        updatedFiles.splice(index, 1);
        setRecordForm(prev => ({
            ...prev,
            files: updatedFiles
        }));
        setErrors(prev => ({
            ...prev,
            files: updatedFiles.length === 0 ? "At least one file is required" : ""
        }));
    };

    const handleAddRecord = () => {
        setCurrentRecord(null);
        setRecordForm({
            type: "",
            requestedDate: null,
            status: "Pending",
            files: []
        });
        setErrors({
            type: "",
            requestedDate: "",
            files: ""
        });
        setShowRecordForm(true);
    };

    const handleEditRecord = (record) => {
        setCurrentRecord(record);
        setRecordForm({
            type: record.type,
            requestedDate: record.requestedDate,
            status: record.status,
            files: record.files || []
        });
        setErrors({
            type: "",
            requestedDate: "",
            files: ""
        });
        setShowRecordForm(true);
    };

    const handleDeleteRecord = (id) => {
        const updatedRecords = medicalRecords.filter(record => record.id !== id);
        setFormData({
            ...formData,
            medicalRecords: updatedRecords
        });
    };

    const handleSubmitRecord = () => {
        // e.preventDefault();
        if (!validateForm()) return;

        const newRecord = {
            id: currentRecord?.id || Date.now(),
            type: recordForm.type,
            requestedDate: recordForm.requestedDate,
            status: recordForm.status,
            files: recordForm.files,
            receivedDate: recordForm.status === "Arrived" ? new Date() : null
        };

        const updatedRecords = currentRecord
            ? medicalRecords.map(record =>
                record.id === currentRecord.id ? newRecord : record
            )
            : [...medicalRecords, newRecord];

        setFormData({
            ...formData,
            medicalRecords: updatedRecords
        });

        setShowRecordForm(false);
    };

    const footerMedicalRecordButtons = [
        {
            label: 'Save',
            icon: <Save size={16} />,
            onClick: handleSubmitRecord,
            className: 'bg-blue-600 hover:bg-blue-700 text-white'
        },
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: setShowRecordForm,
            className: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }
    ];

    return (

        <>
            {formData?.medical_records === "Yes" && (
                <CollapsibleSection title="Medical Records Table" icon={<List />}>
                    {loading ? (
                        <Skeleton type="rect" count={3} height="30px" />
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Medical Records</h3>
                                    <button
                                        onClick={handleAddRecord}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Record</span>
                                    </button>
                                </div>

                                {medicalRecords?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Files</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {medicalRecords.map((record) => (
                                                    <tr key={record.id}>
                                                        <td className="px-4 py-3 text-sm">
                                                            {recordTypeOptions.find(opt => opt.value === record.type)?.label || record.type}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {record.requestedDate?.toLocaleDateString() || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === "Arrived"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                                }`}>
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {record.files?.length || 0} file(s)
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditRecord(record)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteRecord(record.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
                                        No medical records added yet
                                    </div>
                                )}
                            </div>

                            <Modal
                                isOpen={showRecordForm}
                                onClose={() => setShowRecordForm(false)}
                                title={currentRecord ? "Edit Medical Record" : "Add New Medical Record"}
                                size="custom"
                                customWidth='700px'
                                footer={footerMedicalRecordButtons}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">
                                            Record Type*
                                            {errors.type && (
                                                <span className="text-red-500 text-xs ml-2">{errors.type}</span>
                                            )}
                                        </label>
                                        <SelectField
                                            name="type"
                                            value={recordForm.type}
                                            onChange={handleRecordSelectChange('type')}
                                            options={recordTypeOptions}
                                            className={`w-full ${errors.type ? 'border-red-500' : ''}`}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">
                                            Requested Date*
                                            {errors.requestedDate && (
                                                <span className="text-red-500 text-xs ml-2">{errors.requestedDate}</span>
                                            )}
                                        </label>
                                        <DateField
                                            selected={recordForm.requestedDate}
                                            onChange={handleRecordDateChange}
                                            className={`${inputClass} ${errors.requestedDate ? 'border-red-500' : ''}`}
                                            wrapperClassName="w-full"
                                            dateFormat="dd/mm/yyyy"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Status</label>
                                        <div className="flex gap-4">
                                            {["Pending", "Arrived"].map((status) => (
                                                <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        checked={recordForm.status === status}
                                                        onChange={handleRecordInputChange}
                                                        className="peer hidden"
                                                    />
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition-all duration-200">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                                    </div>
                                                    <span>{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="block text-sm font-medium">
                                            Upload Files*
                                            {errors.files && (
                                                <span className="text-red-500 text-xs ml-2">{errors.files}</span>
                                            )}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-sm text-sm font-medium cursor-pointer ${errors.files
                                                ? 'border border-red-500 text-red-500 bg-red-50'
                                                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                }`}>
                                                <Upload className="w-4 h-4" />
                                                <span>Select Files</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                />
                                            </label>
                                            <span className="text-xs text-gray-500">PDF, DOC, JPG, PNG</span>
                                        </div>

                                        {recordForm.files?.length > 0 && (
                                            <div className="mt-2 space-y-2">
                                                {recordForm.files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                                                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    )}
                </CollapsibleSection>
            )}
        </>
    );
};

export default MedicalRecordTable;