import Select from "react-select";

const daysOfWeek = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
];

const customStyles = (size) => ({
    control: (provided, state) => ({
        ...provided,
        minHeight: `${size}px`,
        height: `${size}px`, // Dynamically set height based on `size` prop
        borderRadius: 0,
        borderColor: state.isFocused
            ? (state.isInvalid ? '#EF4444' : '#3B82F6')
            : (state.isInvalid ? '#EF4444' : '#D1D5DB'),
        boxShadow: 'none',
        paddingLeft: 7,
        paddingRight: 7,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center', // Vertically center the text
        justifyContent: 'flex-start', // Ensure text is aligned at the start, not in the middle
        paddingTop: 0,  // Remove any additional padding to avoid shifting
        paddingBottom: 0, // Same as above
        WebkitFlexWrap: 'none',  // For Safari and older Webkit browsers
        flexWrap: 'none',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        fontSize: '0.875rem',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
});

const SelectFieldDays = ({
    label = "Days of the Week",
    name = "days",
    value,
    onChange,
    errors = {},
    placeholder = "Select day(s)...",
    isClearable = true,
    isMulti = true,
    size = 32, // Default size of the input
}) => {
    const hasError = errors[name];

    const getSelected = () => {
        if (isMulti) {
            return daysOfWeek.filter(opt => Array.isArray(value) && value.includes(opt.value));
        } else {
            return daysOfWeek.find(opt => opt.value === value) || null;
        }
    };

    const handleChange = (selected) => {
        if (isMulti) {
            onChange(selected ? selected.map(opt => opt.value) : []);
        } else {
            onChange(selected ? selected.value : '');
        }
    };

    return (
        <div className="mb-2 relative z-[0]">
            <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${hasError ? 'text-red-500' : ''}`}
            >
                {label}
            </label>
            <Select
                name={name}
                value={getSelected()}
                options={daysOfWeek}
                onChange={handleChange}
                isMulti={isMulti}
                styles={customStyles(size)} // Pass the dynamic size to customStyles
                menuPortalTarget={document.body}
                menuPosition="absolute"
                className={`text-sm w-full ${hasError ? 'border-red-500 border' : 'border-gray-300'}  rounded-0 focus:ring-1 focus:ring-blue-100 focus:outline-none`}
                placeholder={placeholder}
                isClearable={isClearable}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );
};

export default SelectFieldDays;
