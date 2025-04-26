import React from 'react';
import classNames from 'classnames';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    icon = null,          // Icon component/element
    iconPosition = 'left', // 'left' or 'right'
    ...props
}) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
        ghost: 'bg-transparent text-current hover:bg-gray-100 disabled:opacity-50',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={classNames(
                baseClasses,
                variantClasses[variant],
                className,
                { 'opacity-50 cursor-not-allowed': disabled }
            )}
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