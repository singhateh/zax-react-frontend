import React, { useState } from 'react';
import InputField from '../../../../components/InputField';
import Button from '../../../../components/Button';

const CurriculumVitae = ({ professionalInfo, onSubmit }) => {
    const [formData, setFormData] = useState({
        curriculum_vitae: null,
        hcpc_number: professionalInfo?.hcpc_number || '',
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, curriculum_vitae: file }));

            // Create preview URL
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('curriculum_vitae', formData.curriculum_vitae);
            formDataToSend.append('hcpc_number', formData.hcpc_number);

            // Call the onSubmit prop with form data
            if (onSubmit) {
                await onSubmit(formDataToSend);
            }

            // Reset form after successful submission
            setFormData({
                curriculum_vitae: null,
                hcpc_number: professionalInfo?.hcpc_number || '',
            });
            setPreviewUrl(null);
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputField
                        type="file"
                        name="curriculum_vitae"
                        label="Curriculum Vitae (PDF)"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                    {previewUrl ? (
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                            <i className="fa fa-file-pdf" />
                            View Uploaded File
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm">No file selected</span>
                    )}
                </div>

                <div>
                    <InputField
                        as="textarea"
                        name="hcpc_number"
                        label="HCPC Number"
                        value={formData.hcpc_number}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter HCPC registration number"
                    />
                </div>
            </div>

            <div className="text-right">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !formData.curriculum_vitae}
                    className="flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <i className="fa fa-spinner fa-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className="fa fa-plus" />
                            Add To List
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CurriculumVitae;