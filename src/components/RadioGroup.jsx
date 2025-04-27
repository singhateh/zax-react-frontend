function RadioGroup({ label, name, options = [], value, onChange }) {
    const normalizedOptions = options?.map(option =>
        typeof option === "object" ? option : { label: option, value: option }
    );

    return (
        <div>
            <label className="block font-medium text-sm truncate mb-2">{label}</label>
            <div className="flex gap-4">
                {normalizedOptions.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="peer hidden"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-300 flex items-center justify-center transition-all duration-200">
                            <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                        </div>
                        <span className="truncate">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default RadioGroup;
