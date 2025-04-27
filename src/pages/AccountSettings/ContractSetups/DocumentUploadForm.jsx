import React, { useEffect, useState } from 'react'
import api from '../../../services/api';
import { Eye, UploadCloud, X } from 'lucide-react';
import ViewDocument from './ViewDocument';
import Modal from '../../../components/Modal';
import UploadDocument from './UploadDocument';
import Swal from 'sweetalert2';


const DocumentUploadForm = ({ contractTypes, isUploadModalOpen, closeModal, selectedContract,
    documents = [], setContractDocuments, setIsViewMode, isViewMode, setIsUploadModalOpen, isLoading }) => {


    const API_BASE_URL = "doctor/contracts";


    const [formData, setFormData] = useState({
        contract_type_id: '',
        reference: ''
    });

    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});


    // Reset form when modal opens/closes
    useEffect(() => {
        if (isUploadModalOpen) {
            setFormData({ contract_type_id: '', reference: '' });
            setFiles([]);
            setErrors({});
            setContractDocuments([]);
        }
    }, [isUploadModalOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);
        setFormData(prev => ({ ...prev, [field]: selectedValue }));
    };

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
    };

    const handleDocumentUpload = async () => {
        try {
            // Clear previous errors
            setErrors({});

            // Validate inputs
            const validationErrors = {};
            if (!formData.contract_type_id) validationErrors.contract_type_id = 'Please select a document type';
            if (!formData.reference) validationErrors.reference = 'Please enter a reference number';
            if (files.length === 0) validationErrors.files = 'Please select a file to upload';

            // If validation errors exist, set them and return
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Prepare form data
            const uploadData = new FormData();
            uploadData.append('contract_type_id', formData.contract_type_id);
            uploadData.append('reference', formData.reference);

            files.forEach((file, index) => {
                uploadData.append('files[]', file);
                uploadData.append(`original_filename_${index}`, file.name);
            });

            // Upload documents
            const response = await api.post(`${API_BASE_URL}/${selectedContract}/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Show success toast
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: response.data.message || 'Document uploaded successfully',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#f0fdf4',
                iconColor: '#16a34a',
                color: '#166534'
            });

            closeModal();
        } catch (error) {
            console.error('Upload error:', error);

            // Handle different error types
            if (error.response) {
                // Server responded with error status
                setErrors({
                    server: error.response.data.message || 'Failed to upload document'
                });
            } else if (error.request) {
                // Request was made but no response
                setErrors({
                    network: 'Network error - please check your connection'
                });
            } else {
                // Other errors
                setErrors({
                    general: error.message || 'An unexpected error occurred'
                });
            }

            // Show error toast
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Upload failed',
                text: error.response?.data?.message || error.message || 'Please try again',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#fef2f2',
                iconColor: '#dc2626'
            });
        }
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Document?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                backdrop: `
              rgba(0,0,0,0.4)
              url("/images/trash-icon.png")
              left top
              no-repeat
            `
            });

            if (result.isConfirmed) {
                // Show loading indicator
                Swal.fire({
                    title: 'Deleting...',
                    html: 'Please wait while we delete your document',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await api.delete(`${API_BASE_URL}/${documentId}/delete`);

                // Update UI optimistically
                setContractDocuments(docs => docs.filter(doc => doc.id !== documentId));

                // Success notification
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Document deleted successfully',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#f0fdf4', // Light green background
                    iconColor: '#16a34a', // Green success icon
                    color: '#166534', // Dark green text
                    width: '400px',
                    padding: '1rem',
                    animation: true
                });
            }
        } catch (error) {
            console.error('Delete failed:', error);

            // Error notification
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to delete document',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    const toggleViewMode = () => {
        setIsViewMode(!isViewMode);
    };

    const footerUploadButtons = [
        {
            label: isViewMode ? ' Upload New' : ' View Documents',
            icon: isViewMode ? <UploadCloud size={16} /> : <Eye size={16} />,
            onClick: toggleViewMode,
            color: 'bg-blue-500 gap-2',
        },
        {
            label: ' Upload',
            icon: <UploadCloud size={16} />,
            onClick: handleDocumentUpload,
            color: 'bg-red-500 gap-2',
            hidden: isViewMode
        },
        {
            label: ' Cancel',
            icon: <X size={16} />,
            onClick: closeModal,
            color: 'bg-gray-500',
        }
    ];

    return (
        <Modal
            isOpen={isUploadModalOpen}
            onClose={closeModal}
            title={isViewMode ? "View Documents" : "Upload Document"}
            footer={footerUploadButtons}
            size="custom"
            customWidth="700px"
            overlayClassName="bg-black bg-opacity-50 backdrop-blur-sm"
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">
                        {isViewMode ? "Loading documents..." : "Processing your upload..."}
                    </p>
                </div>
            ) : isViewMode ? (
                <ViewDocument
                    documents={documents}
                    setIsUploadModalOpen={setIsUploadModalOpen}
                    handleDeleteDocument={handleDeleteDocument}
                />
            ) : (
                <UploadDocument
                    errors={errors}
                    formData={formData}
                    contractTypes={contractTypes}
                    handleFilesSelected={handleFilesSelected}
                    handleSelectChange={handleSelectChange}
                    handleChange={handleChange}
                />
            )}
        </Modal>
    );
};
export default DocumentUploadForm