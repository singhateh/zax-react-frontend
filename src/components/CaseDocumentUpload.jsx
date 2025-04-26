import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import axios from 'axios';

const CaseDocumentUpload = ({ setFormData, solicitorOptions, agencyOptions, initialFormValues }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);

    // Dynamically load the external scripts
    useEffect(() => {
        // Load PDF.js
        const pdfjsScript = document.createElement('script');
        pdfjsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
        pdfjsScript.async = true;
        document.body.appendChild(pdfjsScript);

        // Load Moment.js
        const momentScript = document.createElement('script');
        momentScript.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
        momentScript.async = true;
        document.body.appendChild(momentScript);

        // Load SweetAlert2
        const sweetalertScript = document.createElement('script');
        sweetalertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@10";
        sweetalertScript.async = true;
        document.body.appendChild(sweetalertScript);

        // Load Mammoth.js
        const mammothScript = document.createElement('script');
        mammothScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js";
        mammothScript.async = true;
        document.body.appendChild(mammothScript);

        // Set up the worker source for PDF.js after it's loaded
        pdfjsScript.onload = () => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
        };

        console.log(solicitorOptions);
        console.log(agencyOptions);

        return () => {
            document.body.removeChild(pdfjsScript);
            document.body.removeChild(momentScript);
            document.body.removeChild(sweetalertScript);
            document.body.removeChild(mammothScript);
        };



    }, []);


    // Handle file drop with react-dropzone
    const onDrop = (acceptedFiles) => {
        handleFiles(acceptedFiles);
    };

    const dropzoneClasses = `dropzone ${isHovered ? "bg-gray-200" : "bg-gray-100"
        } border-dashed border-4 border-gray-400 p-8 rounded-md`;


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        noClick: true,       // Disable root click handling
        noKeyboard: true,    // Disable keyboard triggers
        onDragEnter: () => setIsHovered(true),
        onDragLeave: () => setIsHovered(false),
        accept: '.pdf, .docx',
    });


    const handleFiles = (files) => {
        clearFields();
        extractFields(files);
    };

    const extractFields = (files) => {
        const file = files[0];
        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'No file selected',
                text: 'Please select a file to upload.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);  // Add the actual file

        const reader = new FileReader();

        reader.onload = () => {
            const binaryContent = reader.result;  // Binary data of the file
            formData.append('file_binary', binaryContent);  // Append binary data

            // Check if it's a PDF or DOCX and extract text
            if (file.type === 'application/pdf') {
                extractPdfText(file)
                    .then((pdfText) => {
                        formData.append('pdf_text', pdfText);
                        uploadFile(formData);
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'PDF Extraction Error',
                            text: error,
                        });
                    });
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                extractDocxText(file)
                    .then((docxText) => {
                        formData.append('docx_text', docxText);
                        uploadFile(formData);
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'DOCX Extraction Error',
                            text: 'There was an error extracting text from the DOCX file.',
                        });
                    });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unsupported File Type',
                    text: 'The selected file type is not supported.',
                });
            }
        };

        // Read the file as binary
        reader.readAsArrayBuffer(file);
    };



    const extractPdfText = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                const typedArray = new Uint8Array(this.result);
                pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
                    let text = '';
                    let numPages = pdf.numPages;
                    let pagePromises = [];

                    for (let i = 1; i <= numPages; i++) {
                        pagePromises.push(
                            pdf.getPage(i).then((page) => {
                                return page.getTextContent().then((textContent) => {
                                    text += textContent.items.map((item) => item.str).join(' ') + '\n';
                                });
                            })
                        );
                    }

                    Promise.all(pagePromises).then(() => resolve(text)).catch(reject);
                }).catch(reject);
            };
            reader.readAsArrayBuffer(file);
        });
    }, []);

    const extractDocxText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                const arrayBuffer = this.result;
                mammoth.convertToHtml({ arrayBuffer }).then((result) => {
                    resolve(result.value);
                }).catch(reject);
            };
            reader.readAsArrayBuffer(file);
        });
    };


    const uploadFile = (formData) => {
        const fileInput = document.getElementById('pdfFileInput');
        const fileName = formData.get('file').name;
        const fileType = fileName.split('.').pop().toUpperCase();
        clearFields();
        // Create a cancel token source for axios
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        let progressInterval;
        let uploadCompleted = false;

        // Upload Progress Modal with Cancel Button
        const uploadModal = Swal.fire({
            title: `<span class="text-gradient">Uploading ${fileType} File</span>`,
            html: `
                <div class="upload-container">
                    <div class="file-preview">
                       <div class="file-icon ${fileType.toLowerCase()} animate-float">
                        <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-file" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="36" height="36">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span class="extension">${fileType}</span>
                    </div>
                        <div class="file-name">${fileName}</div>
                    </div>
                    
                    <div class="upload-progress">
                        <div class="progress-track">
                            <div class="progress-bar animate-progress"></div>
                        </div>
                        <div class="progress-details">
                            <span class="percentage">0%</span>
                            <span class="status">Initializing upload...</span>
                        </div>
                    </div>
                    
                    <div class="upload-stats">
                        <div class="stat">
                            <svg class="stat-icon" viewBox="0 0 24 24"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>
                            <span class="stat-value">0 KB/s</span>
                        </div>
                        <div class="stat">
                            <svg class="stat-icon" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></svg>
                            <span class="stat-value">--:--</span>
                        </div>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancel Upload',
            allowOutsideClick: false,
            background: 'rgba(255, 255, 255, 0.98)',
            backdrop: `
                linear-gradient(
                    135deg,
                    rgba(40, 60, 80, 0.6) 0%,  
                    rgba(60, 80, 110, 0.6) 100% 
                )
            `,
            customClass: {
                popup: 'upload-modal',
                title: 'upload-title',
                htmlContainer: 'upload-content',
                cancelButton: 'cancel-upload-btn'
            },
            didOpen: () => {
                // Simulate upload progress
                let progress = 0;
                const progressBar = document.querySelector('.progress-bar');
                const percentage = document.querySelector('.percentage');
                const status = document.querySelector('.status');
                const speed = document.querySelector('.upload-stats .stat:nth-child(1) .stat-value');
                const time = document.querySelector('.upload-stats .stat:nth-child(2) .stat-value');

                progressInterval = setInterval(() => {
                    if (uploadCompleted) return;

                    progress += Math.random() * 8;
                    if (progress > 100) {
                        progress = 100;
                        clearInterval(progressInterval);
                    }

                    progressBar.style.width = `${progress}%`;
                    percentage.textContent = `${Math.floor(progress)}%`;

                    // Update status messages
                    if (progress < 30) {
                        status.textContent = 'Preparing file...';
                    } else if (progress < 70) {
                        status.textContent = 'Uploading to server...';
                    } else {
                        status.textContent = 'Finalizing...';
                    }

                    // Simulate speed
                    speed.textContent = `${Math.floor(Math.random() * 1500) + 500} KB/s`;

                    // Simulate time remaining
                    const remaining = Math.floor((100 - progress) / 5);
                    time.textContent = remaining <= 0 ? 'Almost done' : `${remaining}s remaining`;

                }, 300);
            }
        });

        // Handle cancel button click
        uploadModal.then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                // Cancel the upload request
                source.cancel('Upload cancelled by user');
                clearInterval(progressInterval);

                // Show cancellation confirmation
                Swal.fire({
                    title: '<span class="text-gradient">Upload Cancelled</span>',
                    html: `
                        <div class="result-container warning">
                            <div class="result-icon">
                                <div class="icon-bg"></div>
                                <div style={{ display: 'inline-block', width: '52px', height: '52px' }}>
                                    <svg viewBox="0 0 52 52">
                                        <circle cx="26" cy="26" r="25" fill="#FFF3E0" stroke="#FFA000" strokeWidth="2"/>
                                        <path 
                                        d="M26 12v18M26 34v2" 
                                        stroke="#E65100" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="result-content">
                                <h3>${fileName}</h3>
                                <p>Upload was cancelled before completion</p>
                                <div class="file-meta">
                                    <span>0 KB uploaded</span>
                                    <span>•</span>
                                    <span>${fileType} File</span>
                                </div>
                            </div>
                            <div class="result-actions">
                                <button class="btn btn-primary" onclick="Swal.clickConfirm()">
                                    Upload New File
                                </button>
                                <button class="btn btn-secondary" onclick="Swal.clickCancel()">
                                    Close
                                </button>
                            </div>
                        </div>
                    `,
                    showConfirmButton: false,
                    showCancelButton: false,
                    background: 'rgba(240, 250, 255, 0.98)',
                    backdrop: `
                        linear-gradient(
                            135deg,
                            rgba(40, 60, 80, 0.6) 0%,  
                            rgba(60, 80, 110, 0.6) 100% 
                        )
                    `,
                    customClass: {
                        popup: 'result-modal',
                        title: 'result-title',
                        htmlContainer: 'result-content-container'
                    }
                });

                // Reset file input
                fileInput.value = '';
            }
        });

        // Make API call with cancel token
        api.post('/instruct-cases/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            cancelToken: source.token,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.lengthComputable) {
                    // Update real progress if available
                    const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const progressBar = document.querySelector('.progress-bar');
                    const percentage = document.querySelector('.percentage');

                    if (progressBar && percentage) {
                        progressBar.style.width = `${percentComplete}%`;
                        percentage.textContent = `${percentComplete}%`;
                    }
                }
            }
        })
            .then((response) => {
                uploadCompleted = true;
                clearInterval(progressInterval);
                fileInput.value = '';
                Swal.close();

                populateForm(response.data, fileName);
                // Success Modal
                Swal.fire({
                    title: '<span class="text-gradient">Upload Complete!</span>',
                    html: `
                    <div class="result-container success">
                        <div class="result-icon">
                            <div class="icon-bg"></div>
                            <svg class="checkmark" viewBox="0 0 52 52">
                                <circle class="checkmark-circle" cx="26" cy="26" r="25"/>
                                <path class="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <div class="result-content">
                            <h3>${fileName}</h3>
                            <p>Your file was successfully uploaded and processed</p>
                            <div class="file-meta">
                                <span>${(response.data.size || 0).toLocaleString()} KB</span>
                                <span>•</span>
                                <span>${fileType} File</span>
                                <span>•</span>
                                <span>Ready for review</span>
                            </div>
                        </div>
                        <div class="result-actions">
                            <button class="btn btn-primary" onclick="Swal.clickConfirm()">
                                Continue
                            </button>
                            <button class="btn btn-secondary" onclick="Swal.clickCancel()">
                                View Details
                            </button>
                        </div>
                    </div>
                `,
                    showConfirmButton: false,
                    showCancelButton: false,
                    background: 'rgba(240, 250, 255, 0.98)',
                    backdrop: `
                        linear-gradient(
                            135deg,
                            rgba(40, 60, 80, 0.6) 0%,  
                            rgba(60, 80, 110, 0.6) 100% 
                        )
                    `,
                    customClass: {
                        popup: 'result-modal',
                        title: 'result-title',
                        htmlContainer: 'result-content-container'
                    }
                });
            })
            .catch((error) => {
                uploadCompleted = true;
                clearInterval(progressInterval);
                fileInput.value = '';

                if (axios.isCancel(error)) {
                    // Already handled in the cancel flow
                    return;
                }

                // Error Modal
                Swal.fire({
                    title: '<span class="text-gradient">Upload Failed</span>',
                    html: `
                    <div class="result-container error">
                        <div class="result-icon">
                            <div class="icon-bg"></div>
                            <svg class="crossmark" viewBox="0 0 52 52">
                                <circle class="crossmark-circle" cx="26" cy="26" r="25"/>
                                <path class="crossmark-cross" d="M16 16 36 36 M36 16 16 36"/>
                            </svg>
                        </div>
                        <div class="result-content">
                            <h3>${fileName}</h3>
                            <p>We encountered an issue uploading your file</p>
                            <div class="error-details">
                                ${error.response?.data?.message || error.message || 'Network error occurred'}
                            </div>
                        </div>
                        <div class="result-actions">
                            <button class="btn btn-primary" onclick="Swal.clickConfirm()">
                                Try Again
                            </button>
                            <button class="btn btn-secondary" onclick="Swal.clickCancel()">
                                Cancel
                            </button>
                        </div>
                    </div>
                `,
                    showConfirmButton: false,
                    showCancelButton: false,
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdrop: `
                    linear-gradient(
                        135deg,
                        rgba(245, 247, 250, 0.8) 0%,
                        rgba(240, 242, 245, 0.9) 100%
                    )
                `,
                    customClass: {
                        popup: 'result-modal',
                        title: 'result-title',
                        htmlContainer: 'result-content-container'
                    }
                });
            });
    };

    const removeFileExtension = (filename) => {
        if (typeof filename === 'string' && filename.includes('.')) {
            return filename.substring(0, filename.lastIndexOf('.'));
        }
        console.warn('Invalid filename or no extension found:', filename);
        return filename || '';
    };

    const levenshtein = (a, b) => {
        let i, j;
        const alen = a.length;
        const blen = b.length;
        const d = Array.from({ length: blen + 1 }, (_, i) => [i]);

        for (j = 0; j <= alen; j++) d[0][j] = j;

        for (i = 1; i <= blen; i++) {
            for (j = 1; j <= alen; j++) {
                const cost = a[j - 1] === b[i - 1] ? 0 : 1;
                d[i][j] = Math.min(
                    d[i - 1][j] + 1,
                    d[i][j - 1] + 1,
                    d[i - 1][j - 1] + cost
                );
            }
        }
        return d[blen][alen];
    };

    const selectSolicitorByName = (name) => {
        if (!Array.isArray(solicitorOptions)) return;

        const cleanedName = name.trim().toLowerCase();

        const match = solicitorOptions.find(opt =>
            (opt.company_name || '').trim().toLowerCase() === cleanedName
        );

        const selectedValue = match ? match.id : null;
        const solicitor_dna_email = match?.dna_email || match?.general_email;
        const solicitor_appointment_email = match?.appointment_email || '';
        const solicitor_report_or_invoice_email = match?.report_email || '';

        // Update form data
        setFormData(prev => ({
            ...prev,
            solicitor_id: selectedValue,
            solicitor_dna_email,  // Update the new email fields in form data
            solicitor_appointment_email,
            solicitor_report_or_invoice_email,
        }));
    };

    const selectAgencyByName = (name) => {
        if (!Array.isArray(agencyOptions)) return;

        const normalizedName = name.trim().toLowerCase();

        const bestMatch = agencyOptions.reduce((best, opt) => {
            const optionText = (opt.company_name || '').trim().toLowerCase();
            const distance = levenshtein(normalizedName, optionText);
            return distance < best.distance ? { option: opt, distance } : best;
        }, { option: null, distance: Infinity }).option;

        const selectedValue = bestMatch ? bestMatch.id : null;
        const agency_dna_email = bestMatch?.dna_email || bestMatch?.general_email;
        const agency_appointment_email = bestMatch?.appointment_email || '';
        const agency_report_or_invoice_email = bestMatch?.report_email || '';

        // Update form data
        setFormData(prev => ({
            ...prev,
            agency_id: selectedValue,
            agency_dna_email,  // Update the new email fields in form data
            agency_appointment_email,
            agency_report_or_invoice_email,
        }));

    };

    const parseDate = (date) => {
        return isNaN(new Date(date)) ? '' : new Date(date);
    };

    const populateForm = (data, fileName) => {
        // Check if data is a string and attempt to parse it
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

        // Identify gender based on title if gender is null
        let gender = parsedData.gender || '';
        let ClaimantTitle = parsedData.claimant_title || parsedData.title || '';

        if (!gender && ClaimantTitle) {
            let title = ClaimantTitle?.trim()?.toLowerCase();

            // Remove periods (.) from the title for better matching
            title = title.replace('.', '');

            // Match title to gender (0 = male, 1 = female)
            if (title === 'mr' || title === 'sir' || title === 'master') {
                gender = '0';  // Male
            } else if (title === 'ms' || title === 'mrs' || title === 'miss' || title === 'madam' || title === 'lady') {
                gender = '1';  // Female
            }
        }

        const fieldDataValues = {
            // Personal Info
            title: parsedData.claimant_title || parsedData.title || '',
            first_name: parsedData.first_name || '',
            last_name: parsedData.last_name || '',
            dob: parseDate(parsedData.dob),
            gender: gender,
            email: parsedData.client_email || '',
            postcode: parsedData.postcode || '',
            address_1: parsedData.address_1 || '',
            address_2: parsedData.address_2 || '',
            address_3: parsedData.address_3 || '',
            town: parsedData.town_city || '',
            country: parsedData.county || '',

            // Contact
            mobile: parsedData.mobile || parsedData.tel_home || '',

            // Accident Info
            accident_date: parseDate(parsedData.accident_date),
            accident_type_id: 1,
            medical_record: parsedData.injuries || '',

            // Appointment Info
            appointment_date: parseDate(parsedData.appointment_date),
            startTime: parsedData.appointment_time || '',
            consulting_type: parsedData.appointment_type?.includes('F2F') ? 'F2F' : 'Remote',

            // References
            agency_reference: parsedData.agency_reference || '',
            solicitor_reference: parsedData.solicitor_reference || '',

            // IDs will be filled separately
            agency_id: null,
            solicitor_id: null,

            medco_reference: parsedData.medco_id || '',
            is_report: 'No',
            medical_records: 'No',
            is_link: false,
            is_re_instruct: false,
        };

        // Log before setting form data to check the values being set
        console.log("Setting form data with the following values:", fieldDataValues);

        setAppointmentDate(parseDate(parsedData.appointment_date));
        setAppointmentTime(parsedData.appointment_time);

        // Update the form data state
        setFormData(prev => ({
            ...prev,
            ...fieldDataValues,
        }));

        // Log after setting form data
        console.log("Form data updated:", fieldDataValues);

        // Resolve agency_id and solicitor_id based on matching text
        selectSolicitorByName(parsedData.solicitor);
        selectAgencyByName(parsedData.agency || removeFileExtension(fileName));
    };


    const clearFields = () => {
        setAppointmentDate(null);
        setAppointmentTime(null);
        setFormData(prev => ({
            ...prev,
            ...initialFormValues,
        }));
    };

    const renderFileUploadSection = () => (
        <div {...getRootProps()} className={dropzoneClasses}>
            <input {...getInputProps()} id="pdfFileInput" className="hidden" />
            <div
                className="text-center cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("pdfFileInput")?.click();
                }}
            >
                <p className="text-xl font-semibold">Drag & Drop or Click to Upload</p>
                <p className="text-gray-500 mt-2">Supported formats: PDF, DOCX</p>
            </div>
        </div>
    );

    const renderAppointmentInfo = () => (
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl font-semibold text-gray-800">Appointment Details</p>
            </div>
            <div className="space-y-3">
                <div className="flex items-start">
                    <span className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm font-medium mr-3">Date</span>
                    <p className="text-gray-700 mt-1">{appointmentDate?.toLocaleDateString()}</p>
                </div>
                <div className="flex items-start">
                    <span className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm font-medium mr-3">Time</span>
                    <p className="text-gray-700 mt-1">{appointmentTime}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {appointmentDate && appointmentTime ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFileUploadSection()}
                    {renderAppointmentInfo()}
                </div>
            ) : (
                renderFileUploadSection()
            )}
        </>
    );

};

export default CaseDocumentUpload;


