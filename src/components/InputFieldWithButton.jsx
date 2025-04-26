const InputFieldWithButton = ({
    label,
    name,
    value,
    className = 'bg-white',
    size = '25',
    styles,
    errors,
    buttonLabel,
    onButtonClick,
    isLoading,
    error,
    ...props
}) => {
    const hasError = errors && errors[name];

    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-12';
        return 'h-14';
    };

    const heightClass = getHeightClass(size);

    return (
        <div className="mb-2 w-full relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="w-full flex items-center">
                <input
                    name={name}
                    className={`w-full rounded-none border text-sm px-4 focus:outline-none transition-all duration-200
                        ${hasError ? 'border-red-500' : 'border-gray-300'}
                        ${className} 
                        ${heightClass}`}
                    style={styles}
                    {...props}
                    value={value}
                />
                <button
                    onClick={onButtonClick}
                    type="button"
                    className={`ml-[-1px] px-4 cursor-pointer bg-blue-500 text-white text-sm shadow-md hover:bg-blue-600 transition-all duration-200 ${heightClass}`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-1">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span>Loading</span>
                        </div>
                    ) : (
                        buttonLabel
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default InputFieldWithButton;
