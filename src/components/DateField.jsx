import { CalendarCheck2Icon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

const DateField = ({ label, name, selected, size = '25', onChange, errors, dateFormat = 'dd/mm/yyyy' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (selected && selected instanceof Date && !isNaN(selected)) {
            setInputValue(selected.toLocaleDateString("en-GB"));
        } else {
            setInputValue('');
        }

    }, [selected]);

    const handleIconClick = () => {
        setIsOpen(!isOpen); // Toggle dropdown when icon is clicked
    };

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Validate the date format (dd/mm/yyyy)
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (dateRegex.test(value) || value === '') {
            setInputValue(value); // Update the input value

            // Only parse the date if it matches the pattern
            if (dateRegex.test(value)) {
                const [day, month, year] = value.split('/').map((num) => parseInt(num, 10));
                const date = new Date(year, month - 1, day); // Correct month indexing (0-11)

                if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                    onChange(date);
                }
            }
        }
    };

    const handleDateChange = (date) => {
        onChange(date);
        console.log(date);
        setInputValue(date ? date.toLocaleDateString("en-GB") : '');
        setIsOpen(false); // Close the calendar after selection
    };

    const handleInputClick = () => {
        setIsOpen(true); // Open the dropdown when the input is clicked
    };

    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-16';
        return 'h-12';
    };

    const hasError = errors && errors[name];

    return (
        <div className="mb-2 w-full relative z-30">
            <label className={`block text-sm truncate font-medium text-gray-700 mb-1 ${hasError ? 'text-red-500' : ''}`}>
                {label}
            </label>
            <div className="w-full relative z-50">
                <DatePicker
                    selected={selected}
                    name={name}
                    onChange={handleDateChange}
                    dateFormat={dateFormat}
                    className={`w-full rounded-0 border ${hasError ? 'border-red-500' : 'border-gray-300'}
                    ${getHeightClass(size)}
                    bg-white px-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 pl-3`}
                    wrapperClassName="w-full"
                    open={isOpen}
                    onClickOutside={() => setIsOpen(false)} // Close dropdown when clicking outside
                    allowSameDay
                    placeholderText={dateFormat}
                    value={inputValue}
                    onChangeRaw={handleInputChange} // Allow manual input entry
                    menuPortalTarget={document.body}
                    menuPosition="absolute"
                    styles={{
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,  // High z-index for the dropdown menu
                        }),
                    }}
                    onClick={handleInputClick} // Open the calendar when the input is clicked
                />
                {/* Calendar icon */}
                <CalendarCheck2Icon
                    onClick={handleIconClick}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer z-10"
                />
                {hasError && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
        </div>
    );
};

export default DateField;
