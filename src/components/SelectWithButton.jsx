import Select from "react-select";

const customStyles = (size) => ({
    control: (provided, state) => ({
        ...provided,
        height: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: 0,
        borderColor: state.isFocused
            ? (state.isInvalid ? '#EF4444' : '#3B82F6')
            : (state.isInvalid ? '#EF4444' : '#D1D5DB'),
        boxShadow: 'none',
        paddingLeft: 7,
        paddingRight: 7,
        fontSize: '0.865rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingBottom: 0,
        WebkitFlexWrap: 'nowrap',
        flexWrap: 'nowrap',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        fontSize: '0.865rem',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
});

const SelectWithButton = ({
    label,
    name,
    isLoading,
    options = [],
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    size = 32,
    errors,
    placeholder = "Select..",
    isClearable = true,
}) => {
    const hasError = errors && errors[name];

    const modifiedOptions = [
        { label: placeholder, value: '' },
        ...options,
    ];

    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-12';
        return 'h-14';
    };

    const heightClass = getHeightClass(size);

    return (
        <div className="mb-2 w-full relative z-[0]">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="w-full flex items-center">
                <div className={`w-full ${heightClass}`}>
                    <Select
                        value={value}
                        onChange={onChange}
                        options={modifiedOptions}
                        classNamePrefix="select"
                        placeholder={placeholder}
                        isSearchable
                        isClearable={isClearable}
                        styles={customStyles(size)}
                        menuPortalTarget={document.body}
                        menuPosition="absolute"
                    />
                </div>
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
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
        </div>
    );
};

export default SelectWithButton;
