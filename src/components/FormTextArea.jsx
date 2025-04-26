export const FormTextArea = ({ label, value, onChange, placeholder, rows = 3, className = '' }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                {label}
            </label>
            <textarea
                className={`w-full border rounded px-3 py-2 text-sm ${className}`}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            ></textarea>
        </div>
    );
};