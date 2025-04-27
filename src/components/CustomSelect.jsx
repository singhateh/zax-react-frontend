import React from 'react';
import Select from 'react-select';

const CustomSelect = ({
    id,
    value,
    onChange,
    options,
    placeholder,
    styles = {},
    className = '',
    ...rest
}) => {
    return (
        <Select
            id={id}
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            className={`w-full ${className}`} // Full width and custom class
            styles={{
                control: (base, state) => ({
                    ...base,
                    borderRadius: '8px',
                    border: state.isFocused ? '2px solid #007BFF' : '1px solid #E5E7EB',
                    padding: '2px 3px',
                    outline: 'none', // ✅ Remove focus ring
                    boxShadow: 'none', // ✅ Remove focus glow
                    ...styles.control, // Allow external control styling
                }),
                menu: (base) => ({
                    ...base,
                    borderRadius: '8px',
                    border: '1px solid #007BFF',
                    zIndex: 9999,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    ...styles.menu,
                }),
                menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                }),
                option: (base, { isFocused }) => ({
                    ...base,
                    padding: '8px',
                    backgroundColor: isFocused ? '#007BFF' : '#fff',
                    color: isFocused ? '#fff' : '#333',
                    cursor: 'pointer',
                    ...styles.option,
                }),
                singleValue: (base) => ({
                    ...base,
                    color: '#4B5563',
                    ...styles.singleValue,
                }),
                ...styles,
            }}
            menuPortalTarget={document.body}
            {...rest}
        />
    );
};

export default CustomSelect;
