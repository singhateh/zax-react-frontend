import React from 'react';

const SpinnerIcon = () => (
    <svg
        className="animate-spin h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
    </svg>
);

const SubmitButtonWithSpinner = ({
    onClick,
    isSubmitting,
    label = 'Save Changes',
    icon = '💾',
    iconPosition = 'start', // or 'end'
    className = 'bg-yellow-500 hover:bg-yellow-600 text-white',
    wrapperClassName = 'flex justify-end mt-6',
}) => {
    return (
        <div className={wrapperClassName}>
            <button
                onClick={onClick}
                disabled={isSubmitting}
                className={`cursor-pointer text-sm font-medium px-4 py-2 rounded shadow flex items-center gap-2 ${className}`}
            >
                {isSubmitting && <SpinnerIcon />}
                {iconPosition === 'start' && icon} {label}
                {iconPosition === 'end' && icon}
            </button>
        </div>
    );
};

export default SubmitButtonWithSpinner;
