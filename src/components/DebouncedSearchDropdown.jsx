import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react'; // or your icon library

const DebouncedSearchDropdown = ({
    label = 'Search',
    name,
    errors,
    placeholder = 'Search...',
    minSearchLength = 3,
    debounceTime = 300,
    searchFunction,
    displayKey = 'name',
    valueKey = 'id',
    initialValue = '',
    onSelect,
    className = '',
    inputClassName = '',
    dropdownClassName = '',
    itemClassName = '',
    noResultsText = 'No results found',
    size = '25',
    ...props
}) => {

    const hasError = errors && errors[name];

    const getHeightClass = (size) => {
        if (size <= 32) return 'h-8';
        if (size <= 64) return 'h-16';
        return 'h-12';
    };

    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Custom debounce function
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Debounced search handler
    const handleSearch = useCallback(
        debounce(async (term) => {
            if (term.trim().length >= minSearchLength) {
                setIsLoading(true);
                try {
                    const data = await searchFunction(term);
                    setResults(data || []);
                    setIsDropdownOpen(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsDropdownOpen(false);
            }
        }, debounceTime),
        [searchFunction, minSearchLength, debounceTime]
    );

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    // Handle item selection
    const handleSelect = (item) => {
        const displayValue = item[displayKey] || item;
        setSearchTerm(displayValue);
        setResults([]);
        setIsDropdownOpen(false);
        onSelect && onSelect(item);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsDropdownOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={`mb-4 relative ${className}`} {...props}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (results.length > 0) setIsDropdownOpen(true);
                    }}
                    placeholder={placeholder}
                    className={`w-full border rounded-0 pl-10 text-sm px-4 focus:outline-none transition-all 
                        duration-200 ${inputClassName}  ${getHeightClass(size)} ${hasError ? 'border-red-500 border' : 'border-gray-300'}`}
                />
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                {isLoading && (
                    <div className="absolute right-3 top-2 h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                )}
            </div>

            {isDropdownOpen && (
                <ul
                    className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg 
                        max-h-60 overflow-auto ${dropdownClassName}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {results.length > 0 ? (
                        results.map((item) => (
                            <li
                                key={item[valueKey] || item}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${itemClassName}`}
                                onClick={() => handleSelect(item)}
                            >
                                {item[displayKey] || item}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">{noResultsText}</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default DebouncedSearchDropdown;