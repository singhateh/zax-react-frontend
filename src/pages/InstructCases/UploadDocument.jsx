import Swal from "sweetalert2";
import api from "../../services/api";

export function uploadDocumentFile({ formData, populateForm }) {
    const fileInput = document.getElementById('pdfFileInput');
    const fileName = formData.get('file').name;
    const fileType = fileName.split('.').pop().toUpperCase();

    // Show Upload Modal
    Swal.fire({
        title: `<span class="text-gradient">Uploading ${fileType} File</span>`,
        html: `...`, // Keep your existing HTML content here
        showConfirmButton: false,
        allowOutsideClick: false,
        background: 'rgba(255, 255, 255, 0.98)',
        backdrop: `...`, // Keep existing
        customClass: {
            popup: 'upload-modal',
            title: 'upload-title',
            htmlContainer: 'upload-content'
        },
        didOpen: () => {
            let progress = 0;
            const progressBar = document.querySelector('.progress-bar');
            const percentage = document.querySelector('.percentage');
            const status = document.querySelector('.status');
            const speed = document.querySelector('.upload-stats .stat:nth-child(1) .stat-value');
            const time = document.querySelector('.upload-stats .stat:nth-child(2) .stat-value');

            const interval = setInterval(() => {
                progress += Math.random() * 8;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(interval);
                }

                progressBar.style.width = `${progress}%`;
                percentage.textContent = `${Math.floor(progress)}%`;

                if (progress < 30) {
                    status.textContent = 'Preparing file...';
                } else if (progress < 70) {
                    status.textContent = 'Uploading to server...';
                } else {
                    status.textContent = 'Finalizing...';
                }

                speed.textContent = `${Math.floor(Math.random() * 1500) + 500} KB/s`;
                const remaining = Math.floor((100 - progress) / 5);
                time.textContent = remaining <= 0 ? 'Almost done' : `${remaining}s remaining`;

            }, 300);
        }
    });

    return api.post('/instruct-cases/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then((response) => {
            fileInput.value = '';
            Swal.close();

            populateForm(response.data, fileName);

            // Show success Swal
            Swal.fire({
                title: '<span class="text-gradient">Upload Complete!</span>',
                html: `...`, // Your success modal content
                showConfirmButton: false,
                showCancelButton: false,
                background: 'rgba(255, 255, 255, 0.98)',
                backdrop: `...`,
                customClass: {
                    popup: 'result-modal',
                    title: 'result-title',
                    htmlContainer: 'result-content-container'
                }
            });

            return response.data;
        })
        .catch((error) => {
            fileInput.value = '';

            // Show error Swal
            Swal.fire({
                title: '<span class="text-gradient">Upload Failed</span>',
                html: `...`, // Your error modal content
                showConfirmButton: false,
                showCancelButton: false,
                background: 'rgba(255, 255, 255, 0.98)',
                backdrop: `...`,
                customClass: {
                    popup: 'result-modal',
                    title: 'result-title',
                    htmlContainer: 'result-content-container'
                }
            });

            throw error;
        });
}
