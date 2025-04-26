import Swal from 'sweetalert2';

/**
 * Show a styled loading modal with optional cancel button
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string} options.text - Modal description
 * @param {boolean} options.showCancelButton - Show cancel button or not
 * @param {Function} options.onCancel - Callback when cancel is clicked
 */
export const showLoadingModal = ({
    title = 'Processing...',
    text = 'Please wait while we confirm your appointment.',
    showCancelButton = true,
    onCancel = () => { },
} = {}) => {
    return Swal.fire({
        title: `<div class="text-gray-800 text-base font-semibold">${title}</div>`,
        html: `<div class="text-sm text-gray-600 mt-1">${text}</div>`,
        allowOutsideClick: false,
        showConfirmButton: false,
        showCancelButton,
        cancelButtonText: '<i class="fas fa-times-circle mr-1"></i> Cancel',
        cancelButtonColor: '#9e9e9e',
        customClass: {
            popup: 'rounded-xl shadow-lg p-6 bg-white w-[18rem]',
            cancelButton:
                'text-sm px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-all duration-150',
        },
        didOpen: () => {
            Swal.showLoading();
        },
        willClose: () => {
            onCancel();
        },
        width: '18rem',
        background: '#fff',
    });
};
