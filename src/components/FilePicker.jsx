import { useState } from "react";

const FilePicker = ({ label, onChange, placeholder }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validate file type before setting
        if (selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg' || selectedFile.type === 'image/jpeg')) {
            setFile(selectedFile);
            onChange(selectedFile);  // Update react-hook-form with selected file
        } else {
            alert('Only PNG and JPG files are allowed!');
        }
    };

    const clearFile = () => {
        setFile(null);
        onChange(null);  // Clear file in react-hook-form
    };

    return (
        <div className="relative">
            <label className="block font-medium">{label}</label>
            <div className="relative">
                <input
                    type="file"
                    className="w-full h-[36px] rounded-0 border border-gray-300 bg-white px-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                    onChange={handleFileChange}
                />
                {/* Custom placeholder */}
                {/* {!file && placeholder && (
                    <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-sm text-gray-500">
                        {placeholder}
                    </span>
                )} */}
            </div>
            {file && (
                <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button onClick={clearFile} className="text-red-500 text-sm">Clear</button>
                </div>
            )}
        </div>
    );
};


export default FilePicker;