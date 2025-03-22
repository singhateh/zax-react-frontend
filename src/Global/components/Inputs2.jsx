import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

export const SelectInput = ({
  options,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        className="text-xs sm:text-sm md:text-base"
        placeholder="Select.."
        styles={{
          control: (base) => ({
            ...base,
            border: "1px solid #ccc",
            boxShadow: "none",
            height: "28px",
            minHeight: "8px",
            fontSize: "12px",
            "&:hover": { borderColor: "#007bff" },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#007bff" : "white",
            color: state.isFocused ? "white" : "black",
            fontSize: "12px",
          }),
          dropdownIndicator: (base) => ({
            ...base,
            padding: "4px",
          }),
        }}
      />
    </div>
  );
};

export const TextInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-2 sm:px-4 py-1 border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white h-7
                 text-xs sm:text-sm md:text-base ${className}`}
    />
  );
};

export const DateInput = ({
  value,
  onChange,
  className = "",
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <input
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white
                   text-xs sm:text-sm md:text-base h-7"
      />
    </div>
  );
};

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white
                   text-xs sm:text-sm md:text-base h-7"
      />
    </div>
  );
};

export const CheckboxInput = ({
  checked,
  onChange,
  className = "",
  required = false,
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        // className="appearance-none bg-white w-4 sm:w-5 md:w-6 sm:h-5 md:h-6 checked:bg-blue-600 text-blue-600  accent-blue-600 checked:border-transparen  focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer h-8"
        className="w-6 h-6 border border-gray-400 rounded cursor-pointer transition-all 
        checked:border-transparent checked:ring-2 checked:ring-blue-500 
        focus:ring-2 focus:ring-blue-500 relative"
      />
    </div>
  );
};

export const IconButton = ({
  icon: Icon,
  text,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-1 sm:py-2 font-semibold text-white
        transition-all duration-300 ease-in-out
        text-xs sm:text-sm md:text-base
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
        }
        ${className}`}
    >
      {Icon && <Icon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />}{" "}
      {/* Icon Resizing */}
      <span>{text}</span>
    </button>
  );
};
