import React from 'react';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    icon = null,
    iconPosition = 'left',
    ...props
}) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
        ghost: 'bg-transparent text-current hover:bg-gray-100 focus:ring-gray-300 disabled:opacity-50',
    };

    const buttonClasses = [
        baseClasses,
        variantClasses[variant],
        className,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            disabled={disabled}
            className={buttonClasses}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
                <span className="flex-shrink-0">{icon}</span>
            )}
        </button>
    );
};

export default Button;