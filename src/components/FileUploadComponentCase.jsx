import { useState, useRef } from 'react';
import axios from 'axios';
import { FileText, X, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Swal from 'sweetalert2';

const FileUploadComponent = () => {
    const [isUploading, setIsUploading] = useState(false);
    const cancelSource = useRef(null);
    const fileInputRef = useRef(null);

    const uploadFile = async (formData) => {
        const file = formData.get('file');
        const fileName = file.name;
        const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Size in MB

        // Create a cancel token source
        cancelSource.current = axios.CancelToken.source();
        setIsUploading(true);

        // Progress tracking variables
        let lastLoaded = 0;
        let lastTime = Date.now();
        const speeds = [];
        const speedSamples = 5;

        // Show beautiful upload modal
        const uploadModal = Swal.fire({
            title: `<span class="text-blue-600 font-semibold">Uploading ${fileName}</span>`,
            html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="text-red-500">
              <FileText size={32} />
            </div>
            <div>
              <h4 class="font-medium text-gray-800 truncate max-w-[300px]">${fileName}</h4>
              <p class="text-sm text-gray-500">${fileSize} MB</p>
            </div>
          </div>
          
          <div class="mb-1 flex justify-between text-sm text-gray-600">
            <span>Upload Progress</span>
            <span id="uploadSpeed" class="font-medium">0 MB/s</span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div id="uploadProgressBar" class="bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
          </div>
          
          <div class="flex justify-between mt-1">
            <span id="uploadProgressText" class="text-sm font-medium text-gray-700">0%</span>
            <div id="timeRemaining" class="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>Estimating time...</span>
            </div>
          </div>
        </div>
      `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: `
        <div class="flex items-center gap-2">
          <X size={18} />
          <span>Cancel</span>
        </div>
      `,
            cancelButtonColor: '#ef4444',
            allowOutsideClick: false,
            backdrop: 'rgba(0,0,0,0.8)',
            width: '480px',
            padding: '1.5rem',
            customClass: {
                cancelButton: 'px-4 py-2 rounded-full',
                popup: 'rounded-xl'
            },
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                cancelSource.current?.cancel('Upload cancelled by user');
            }
        });

        try {
            const response = await axios.post('/instruct-cases/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                cancelToken: cancelSource.current.token,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const currentTime = Date.now();
                        const timeDiff = (currentTime - lastTime) / 1000; // in seconds
                        const loadedDiff = progressEvent.loaded - lastLoaded;

                        // Calculate current speed (bytes/sec)
                        const currentSpeed = timeDiff > 0 ? loadedDiff / timeDiff : 0;
                        speeds.push(currentSpeed);
                        if (speeds.length > speedSamples) speeds.shift();

                        // Calculate average speed
                        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

                        // Update speed display
                        const speedMBps = (avgSpeed / (1024 * 1024)).toFixed(2);
                        const speedElement = document.getElementById('uploadSpeed');
                        if (speedElement) speedElement.textContent = `${speedMBps} MB/s`;

                        // Calculate time remaining
                        const remainingBytes = progressEvent.total - progressEvent.loaded;
                        const secondsRemaining = avgSpeed > 0 ? remainingBytes / avgSpeed : 0;

                        // Format time remaining
                        const timeElement = document.getElementById('timeRemaining');
                        if (timeElement) {
                            timeElement.innerHTML = `
                <Clock size={14} />
                <span>${secondsRemaining > 0 ?
                                    `${Math.ceil(secondsRemaining)} second${Math.ceil(secondsRemaining) !== 1 ? 's' : ''} remaining` :
                                    'Finishing up...'
                                }</span>
              `;
                        }

                        // Update progress
                        const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        const progressBar = document.getElementById('uploadProgressBar');
                        const progressText = document.getElementById('uploadProgressText');

                        if (progressBar && progressText) {
                            progressBar.style.width = `${percentComplete}%`;
                            progressText.textContent = `${percentComplete}%`;

                            // Change color based on progress
                            if (percentComplete < 30) {
                                progressBar.className = 'bg-red-500 h-2.5 rounded-full';
                            } else if (percentComplete < 70) {
                                progressBar.className = 'bg-yellow-500 h-2.5 rounded-full';
                            } else {
                                progressBar.className = 'bg-green-500 h-2.5 rounded-full';
                            }
                        }

                        // Update tracking variables
                        lastLoaded = progressEvent.loaded;
                        lastTime = currentTime;
                    }
                }
            });

            // Clear file input
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Show success modal
            await Swal.fire({
                title: `<span class="text-green-600 font-semibold">Upload Complete!</span>`,
                html: `
          <div class="flex flex-col items-center text-center py-4">
            <div class="text-green-500 mb-3">
              <CheckCircle2 size={48} />
            </div>
            <h4 class="font-medium text-gray-800 mb-1">${fileName}</h4>
            <p class="text-gray-600">was successfully processed</p>
          </div>
        `,
                showConfirmButton: true,
                confirmButtonText: 'Continue',
                confirmButtonColor: '#10b981',
                width: '420px',
                customClass: {
                    confirmButton: 'px-4 py-2 rounded-full'
                }
            });

            // Process the response
            console.log('Upload response:', response.data);
            return response.data;

        } catch (error) {
            // Clear file input
            if (fileInputRef.current) fileInputRef.current.value = '';

            if (axios.isCancel(error)) {
                // Handle cancellation
                await Swal.fire({
                    title: `<span class="text-blue-600 font-semibold">Upload Cancelled</span>`,
                    html: `
            <div class="flex flex-col items-center text-center py-4">
              <div class="text-blue-500 mb-3">
                <Info size={48} />
              </div>
              <p class="text-gray-600">The upload was cancelled</p>
            </div>
          `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b82f6',
                    width: '380px',
                    customClass: {
                        confirmButton: 'px-4 py-2 rounded-full'
                    }
                });
            } else {
                // Handle errors
                let errorMessage = 'An error occurred during upload.';

                if (error.response) {
                    errorMessage = error.response.data.message ||
                        `Server responded with ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = 'The server did not respond. Please check your connection.';
                }

                await Swal.fire({
                    title: `<span class="text-red-600 font-semibold">Upload Failed</span>`,
                    html: `
            <div class="text-left">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-red-500">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h4 class="font-medium text-gray-800 truncate max-w-[300px]">${fileName}</h4>
                  <p class="text-sm text-gray-500">${fileSize} MB</p>
                </div>
              </div>
              <p class="text-gray-600">${errorMessage}</p>
            </div>
          `,
                    showConfirmButton: true,
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#ef4444',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    width: '420px',
                    customClass: {
                        confirmButton: 'px-4 py-2 rounded-full',
                        cancelButton: 'px-4 py-2 rounded-full'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        uploadFile(formData); // Retry the upload
                    }
                });
            }
            throw error;
        } finally {
            setIsUploading(false);
            cancelSource.current = null;
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            await uploadFile(formData);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Upload PDF File</h2>
                <p className="text-gray-600 mt-1">Select a file to begin the upload process</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <div className="flex justify-center mb-3">
                    <FileText className="text-gray-400" size={48} />
                </div>
                <input
                    type="file"
                    id="pdfFileInput"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    disabled={isUploading}
                />
                <label
                    htmlFor="pdfFileInput"
                    className={`inline-block px-4 py-2 rounded-full ${isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white font-medium transition-colors`}
                >
                    {isUploading ? 'Uploading...' : 'Select File'}
                </label>
                <p className="text-sm text-gray-500 mt-3">PDF files only (max. 25MB)</p>
            </div>
        </div>
    );
};

export default FileUploadComponent;