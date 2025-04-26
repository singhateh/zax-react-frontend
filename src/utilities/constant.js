export const STATUS_CLASSES = {
    Available: 'bg-green-200 text-green-800',
    Booked: 'bg-red-200 text-red-800',
    ReBooked: 'bg-purple-200 text-purple-800',
    Reserved: 'bg-blue-200 text-blue-800',
    Completed: 'bg-teal-200 text-teal-800',
    Cancelled: 'bg-gray-300 text-gray-700',
    DNA: 'bg-yellow-200 text-yellow-800',
    Rescheduled: 'bg-orange-200 text-orange-800',
    Blocked: 'bg-gray-400 text-gray-800',
    Hold: 'bg-pink-200 text-pink-800',
    Deleted: 'bg-gray-900 text-gray-100',
    Incomplete: 'bg-indigo-200 text-indigo-800',
    Appointed: 'bg-cyan-200 text-cyan-800',
};


export const genders = ([
    { value: '0', label: 'Male' },
    { value: '1', label: 'Female' },
    { value: '2', label: 'Other' }
]);


export const recommendedReportingTool = ([
    { value: 'ANY', label: 'ANY' },
    { value: 'ZAX', label: 'ZAX' },
    { value: 'GRIP', label: 'GRIP' },
    { value: 'WARP', label: 'WARP' },
]);


export const appointmentTobeModeDates = ([
    { value: 'accident_date', label: 'Accident Date' },
    { value: 'current_date', label: 'Current Date' },
    { value: 'fixed_date', label: 'Fixed Date' }
]);

export const appointmentTobeModeDays = ([
    { value: 'by_day', label: 'By Day' },
    { value: 'by_week', label: 'By Week' },
]);


export const getTitle = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Master', label: 'Master' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
    { value: 'Rev', label: 'Rev' },
    { value: 'Other', label: 'Other' }
];


export const getQualifications = () => [
    'BCh',
    'BChir',
    'BM',
    'BMedSci',
    'BPharm',
    'BS',
    'BSc',
    'ChB',
    'CPH',
    'DA',
    'DCh',
    'DCH',
    'DCP'
];


export const getQualificationOptions = (
    [
        { value: 'BCh', label: 'BCh' },
        { value: 'BChir', label: 'BChir' },
        { value: 'BM', label: 'BM' },
        { value: 'BMedSci', label: 'BMedSci' },
        { value: 'BPharm', label: 'BPharm' },
        { value: 'BS', label: 'BS' },
        { value: 'BSc', label: 'BSc' },
        { value: 'ChB', label: 'ChB' },
        { value: 'CPH', label: 'CPH' },
        { value: 'DA', label: 'DA' },
        { value: 'DCh', label: 'DCh' },
        { value: 'DCH', label: 'DCH' },
        { value: 'DCP', label: 'DCP' }
    ]
);


// Add this helper function somewhere in your component file
export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return badgeStyle('green');
        case 'pending':
            return badgeStyle('yellow');
        case 'hold':
            return badgeStyle('orange');
        case 'inactive':
            return badgeStyle('red');
        default:
            return badgeStyle('gray'); // For unknown/null statuses
    }
}

export const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'critical':
        case 'urgent':
            return badgeStyle('red');
        case 'high':
        case 'major':
        case 'important':
            return badgeStyle('orange');
        case 'medium':
        case 'normal':
            return badgeStyle('yellow');
        case 'low':
        case 'minor':
            return badgeStyle('green');
        default:
            return badgeStyle('gray'); // Unknown/null priority
    }
};


// Example badgeStyle function (make sure you have this) 
export const badgeStyle = (color) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    // Define a broader range of color classes
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        orange: 'bg-orange-400 text-white',
        red: 'bg-red-100 text-red-800',
        gray: 'bg-gray-100 text-gray-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
        teal: 'bg-teal-100 text-teal-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        lime: 'bg-lime-100 text-lime-800',
        amber: 'bg-amber-100 text-amber-800',
        cyan: 'bg-cyan-100 text-cyan-800',
        white: 'bg-white text-black', // Special handling for white background with black text
        transparent: 'bg-transparent text-black border border-gray-300', // Transparent background with border
        // Add more colors as needed, it's easy to expand this object
    };

    // Ensure the color is a valid string and falls back to 'gray' if invalid
    const normalizedColor = color ? color.toLowerCase() : 'gray';

    // Return the badge style, defaulting to 'gray' if the color is not valid
    return `${baseClasses} ${colorClasses[normalizedColor] || colorClasses.gray}`;
};


export const bgStyle = (color) => {
    const baseClasses = '';

    // Define a broader range of color classes
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        orange: 'bg-orange-400 text-white',
        red: 'bg-red-100 text-red-800',
        gray: 'bg-gray-100 text-gray-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
        teal: 'bg-teal-100 text-teal-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        lime: 'bg-lime-100 text-lime-800',
        amber: 'bg-amber-100 text-amber-800',
        cyan: 'bg-cyan-100 text-cyan-800',
        white: 'bg-white text-black', // Special handling for white background with black text
        transparent: 'bg-transparent text-black border border-gray-300', // Transparent background with border
        // Add more colors as needed, it's easy to expand this object
    };

    // Ensure the color is a valid string and falls back to 'gray' if invalid
    const normalizedColor = color ? color.toLowerCase() : 'gray';

    // Return the badge style, defaulting to 'gray' if the color is not valid
    return `${baseClasses} ${colorClasses[normalizedColor] || colorClasses.gray}`;
};



export const removeApiPrefix = (url) => {
    return url.replace(/^api\//, ''); // Removes 'api/' from the start
};


// dateUtils.js
export const formatDate = (dateInput, fallback = '') => {
    try {
        const date = dateInput ? new Date(dateInput) : new Date();
        if (isNaN(date.getTime())) return fallback;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Always returns YYYY-MM-DD
    } catch {
        return fallback;
    }
};

// For display formatting (optional)
export const formatDisplayDate = (dateInput, fallback = 'N/A') => {
    const dateStr = formatDate(dateInput);
    if (dateStr === fallback) return fallback;

    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};


export const formatCurrency = (value) => {
    // Handle null/undefined/empty values
    if (value === null || value === undefined || value === '') return '£0.00';

    // Convert string numbers to numbers
    const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);

    // Check if the conversion resulted in a valid number
    if (isNaN(numericValue)) return '£0.00';

    // Format as GBP currency with 2 decimal places
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numericValue);
};


export const formatAddress = (parts) => {
    return parts
        .map(val => val?.trim())
        .filter(Boolean)
        .join(', ');
}


export const handleSelectChange = (field, setFormData) => (selectedOption) => {
    const selectedValue = selectedOption?.value ?? (selectedOption?.target?.value || null);
    setFormData(prev => ({
        ...prev,
        [field]: selectedValue || ''
    }));
};