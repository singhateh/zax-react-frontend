const InputField = ({ label, name, className = 'bg-white', size = '25', styles, errors, ...props }) => {
    const hasError = errors && errors[name];

    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-16';
        return 'h-12';
    };

    return (
        <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 truncate max-w-full">{label}</label>

            <input
                name={name}
                className={`w-full rounded-0 border text-sm px-4 focus:outline-none transition-all duration-200
      ${hasError ? 'border-red-500' : 'border-gray-300'}
      ${className} 
      ${getHeightClass(size)}`}
                {...props}
            />

            {hasError && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );
};

export default InputField;
