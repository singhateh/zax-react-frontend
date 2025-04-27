import React, { useState } from "react";
import FileUpload from "./FileUpload"; // Import the FileUpload component
import api from "../services/api";

const FileUploadComponent = () => {
    const [selectedFiles, setSelectedFiles] = useState(null); // Store a single file
    const [errorMessage, setErrorMessage] = useState("");  // Error message for file upload
    const [isUploading, setIsUploading] = useState(false);  // Track uploading state

    // Handle file selection and update the selected file
    const handleFilesSelected = (files) => {
        // Reset any previous error messages
        setErrorMessage("");

        // If there is a new file, update the selected file (only one file allowed)
        if (files.length > 1) {
            setErrorMessage("You can only upload a single file.");
            return;
        }

        setSelectedFiles(files[0]); // Only keep the first selected file
    };

    // Remove the selected file from the list
    const handleRemoveFile = () => {
        setSelectedFiles(null);  // Reset the selected file
    };

    // Simulate file upload to an API
    const handleUploadFiles = async () => {
        if (!selectedFiles) {
            setErrorMessage("Please select a file to upload.");
            return;
        }

        setIsUploading(true);  // Indicate uploading process has started

        // Create a FormData object to send the file to an API
        const formData = new FormData();
        formData.append("file", selectedFiles);  // Only append one file

        try {
            // Make an API request to upload the file
            const response = await api.post('/instruct-cases/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Handle success
            console.log("File uploaded successfully", response.data);
            setIsUploading(false);
            setSelectedFiles(null);  // Clear selected file after upload
        } catch (error) {
            // Handle error
            console.error("File upload failed:", error);
            setErrorMessage("Failed to upload file. Please try again.");
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>

            <FileUpload
                onFilesSelected={handleFilesSelected}  // Pass the selected file to the handler
                acceptedTypes={['image/*', 'application/pdf']}  // Allow image and PDF files
                maxFiles={1}  // Limit to only 1 file
                multiple={false}  // Allow only single file selection
            />

            {/* Show error message if there are any */}
            {errorMessage && (
                <div className="mt-4 text-red-600 text-sm font-medium">
                    {errorMessage}
                </div>
            )}

            {/* Display the selected file */}
            {selectedFiles && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Selected File:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex justify-between items-center">
                            <span className="font-medium">{selectedFiles.name}</span>
                            <span className="text-gray-500">{Math.round(selectedFiles.size / 1024)} KB</span>
                            <button
                                onClick={handleRemoveFile}
                                className="text-red-600 hover:text-red-800"
                                title="Remove file"
                            >
                                Remove
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Show upload button */}
            <div className="mt-6">
                <button
                    onClick={handleUploadFiles}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload File"}
                </button>
            </div>
        </div>
    );
};

export default FileUploadComponent;
