import React, { useState, useEffect, useCallback } from "react";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";
import { customStyles } from "../utilities/styles";


const SelectFieldWithSearch = ({
    label,
    name,
    value,
    formData,
    onChange,
    errors,
    size = 32,
    placeholder = "Search...",
    isClearable = true,
    optionData,
    fetchData,
    filterData,
    valueKey = "id",
    labelKey = "company_name",
    ...props
}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const hasError = errors && errors[name];

    // Update selected option based on formData
    useEffect(() => {
        if (value && formData && formData[name]) {
            const selected = optionData.find(option => option.value === formData[name]);
            if (selected) {
                setSelectedOption({ value: selected.value, label: selected.label });
            } else {
                setSelectedOption(null);
            }
        }
    }, [value, formData, name, optionData]);

    // Get height class based on size
    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-10';
        return 'h-12';
    };

    // Debounced loading of options for AsyncSelect
    const debouncedLoadOptions = useCallback(
        debounce(async (inputValue, callback) => {
            try {
                const response = await fetchData(inputValue);
                const filteredOptions = filterData(response, inputValue, formData, valueKey, labelKey);
                callback(filteredOptions);
            } catch (error) {
                console.error("Error fetching options:", error);
                callback([]);
            }
        }, 500),
        [fetchData, filterData, formData, valueKey, labelKey]
    );

    // Handle change in selected option
    const handleChange = (selected) => {
        const selectedLabel = selected ? selected.label : '';
        setSelectedOption(selected);

        onChange({
            target: {
                name,
                value: selected ? selected.value : '',
                label: selectedLabel,
            },
        });
    };

    return (
        <div className="mb-2 relative z-[0]">
            <label className={`block text-sm font-medium mb-1 ${hasError ? 'text-red-500' : 'text-gray-700'}`}>
                {label}
            </label>
            <AsyncSelect
                name={name}
                value={selectedOption}
                loadOptions={debouncedLoadOptions}
                onChange={handleChange}
                styles={customStyles(size)}
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

export default SelectFieldWithSearch;
