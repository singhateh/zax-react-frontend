import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, XCircle } from "lucide-react";

const FileUpload = ({
    onFilesSelected,
    acceptedTypes = ['image/*', 'application/pdf'], // default accepted types
    maxFiles = 5, // limit number of files
    multiple = true,
    label
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length + files.length > maxFiles) {
            setErrorMessage(`You can upload a maximum of ${maxFiles} files.`);
            return;
        }
        setErrorMessage("");  // Reset error message
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles); // Update the internal state with new files
        onFilesSelected(newFiles); // Pass the updated files to the parent component
    }, [files, maxFiles, onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedTypes,
        multiple: multiple
    });

    const handleRemove = (file) => {
        const newFiles = files.filter((f) => f !== file);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    };

    return (
        <div className="w-full mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 truncate max-w-full">{label}</label>
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition duration-300
                ${isDragActive ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-gray-300 bg-white hover:bg-gray-50 hover:shadow-xl'}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 text-gray-500 mb-4 transition duration-300 transform hover:scale-110" />
                {isDragActive ? (
                    <p className="text-lg font-semibold text-indigo-600">Drop the files here...</p>
                ) : (
                    <>
                        <p className="text-lg font-medium text-gray-800">Drag & drop your file(s) here</p>
                        <p className="text-sm text-gray-500 mt-2">or click to select files</p>
                    </>
                )}
            </div>

            {/* Display Error Message */}
            {errorMessage && (
                <div className="mt-4 text-red-600 text-sm font-medium">
                    {errorMessage}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Selected file(s):</h4>
                    <ul className="list-inside space-y-2 text-sm text-gray-700">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="font-medium">{file.name}</span>
                                <span className="text-gray-500">{Math.round(file.size / 1024)} KB</span>
                                <button
                                    onClick={() => handleRemove(file)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Remove file"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
