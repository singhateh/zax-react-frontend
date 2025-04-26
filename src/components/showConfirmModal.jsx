import Swal from 'sweetalert2';

export const showConfirmModal = async ({
    title = 'Confirm Action',
    text = 'Are you sure you want to proceed?',
    confirmButtonText = 'Yes, Proceed',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#d32f2f',
    cancelButtonColor = '#9e9e9e',
    onConfirm = async () => { },  // Make onConfirm async to handle API request
    onCancel = () => { },
    isLoading = false,  // Loading state (used to show loading spinner)
}) => {
    // Show the confirmation modal
    const result = await Swal.fire({
        title: `<strong class="text-sm font-medium text-gray-800">${title}</strong>`,
        html: `<p class="text-xs text-gray-600">${text}</p>`,
        icon: isLoading ? 'info' : 'warning',  // Info icon when loading
        showCancelButton: true,  // Show Cancel button
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: cancelButtonColor,
        confirmButtonText: isLoading
            ? 'Please wait...'  // Change text to 'Please wait...' when loading
            : `<i class="fas fa-check-circle"></i> ${confirmButtonText}`,
        cancelButtonText: `<i class="fas fa-times"></i> ${cancelButtonText}`,
        customClass: {
            popup: 'rounded-lg bg-white shadow-sm p-4 w-72',
            title: 'text-sm text-center font-semibold text-gray-800',
            cancelButton: 'text-sm py-2 px-4 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition-all duration-150',
            confirmButton: 'text-sm py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-150',
        },
        width: '18rem',  // Set width for compact size
        padding: '12px',
        backdrop: true,  // Enable backdrop (darkened background)
        animation: 'slide-from-top',  // Smooth slide animation
        allowOutsideClick: false,  // Prevent clicking outside to close
        didOpen: () => {
            Swal.getPopup().style.transition = 'all 0.3s ease-in-out';
            Swal.getPopup().style.transform = 'scale(1.05)';  // Scale-up effect when modal opens
            if (isLoading) {
                Swal.showLoading();  // Show loading spinner when isLoading is true
            }
        },
        willClose: () => {
            Swal.getPopup().style.transition = 'all 0.3s ease-out';
            Swal.getPopup().style.transform = 'scale(0.95)';  // Scale-down effect when modal closes
        }
    });

    // Execute onConfirm only if the user confirms the action
    if (result.isConfirmed) {
        // Show loading spinner while API request is being processed
        Swal.showLoading();  // Show loading spinner

        try {
            // Wait for the API request to finish
            await onConfirm();  // Call the onConfirm function (API request)
            // Once API call is done, show success message and close the modal
            await Swal.fire({
                icon: 'success',
                title: 'Action completed successfully!',
                showConfirmButton: false,
                timer: 2000,  // Show success message for 2 seconds
                toast: true,  // Show as a toast notification
            });
            Swal.close();  // Close the modal manually after showing the success message
        } catch (error) {
            // Handle error (if any)
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong!',
                text: error?.message || 'Please try again.',
                showConfirmButton: true,
            });
        }
    } else if (result.isDismissed) {
        onCancel();  // Handle cancellation (call the onCancel function)
    }

    return result;  // Return the result object from Swal.fire
};
