import Select from "react-select";
import { customStyles } from "../utilities/styles";
const SelectField = ({
    label,
    name,
    value,
    options = [],
    onChange,
    errors,
    size = 32,
    placeholder = "Select..",
    isClearable = true,
    ...props
}) => {
    const hasError = errors && errors[name];

    const getSelectedOption = () => {
        return options.find(option => option.value === value) || null;
    };

    const modifiedOptions = [
        { label: placeholder, value: '' },
        ...options,
    ];

    const getHeightClass = (size) => {
        // Tailwind class based on size prop
        if (size <= 32) return 'h-8'; // Small size
        if (size <= 64) return 'h-10'; // Medium size
        return 'h-12'; // Default larger size
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
                value={getSelectedOption()}
                options={modifiedOptions}
                onChange={onChange}
                styles={customStyles(size)} // Pass size to customStyles
                menuPortalTarget={document.body}
                menuPosition="absolute"
                className={`text-sm w-full ${getHeightClass(size)} ${hasError ? 'border-red-500 border' : 'border-gray-300'} rounded-0 focus:ring-1 focus:ring-blue-100 focus:outline-none`}
                isClearable={isClearable}
                placeholder={placeholder}
                {...props}
            />
            {hasError && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );
};

export default SelectField;
