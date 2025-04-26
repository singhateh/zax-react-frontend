import React from 'react';

const CustomCheckbox = ({ id, isChecked, onChange, label, name }) => {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id={id} // Use dynamic id here
                name={name} // Use dynamic name here
                checked={isChecked}
                onChange={onChange}
                className="hidden peer"
            />
            <label
                htmlFor={id} // Use dynamic id here
                className="flex items-center cursor-pointer text-sm text-gray-800 select-none"
            >
                <span className="relative inline-block w-5 h-5 mr-2">
                    <span
                        className={`absolute inset-0 flex items-center justify-center rounded-sm border border-gray-300 
                            ${isChecked ? 'bg-green-500 border-green-500' : 'bg-gray-200'}`}
                    ></span>
                    {isChecked && (
                        <svg
                            className="w-3 h-3 text-white absolute top-1 left-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </span>
                {label}
            </label>
        </div>
    );
};

export default CustomCheckbox;
