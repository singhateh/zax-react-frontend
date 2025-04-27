import { Layers } from "lucide-react";
import Skeleton from "../../components/Skeleton";

// InstructLevelSection.jsx
const InstructLevelSection = ({ levels, formData, handleInputChange, loading }) => {
    return (
        <div >
            {loading ? (
                <Skeleton type="rect" count={3} height="30px" />
            ) : (
                <>
                    <div className="flex flex-wrap gap-4">
                        {levels.map((level, idx) => (
                            <label
                                key={idx}
                                className={`flex items-center gap-3 text-sm cursor-pointer rounded-lg py-2 px-4 transition-all duration-300 border-2 ${formData.level_id === level.id
                                    ? 'bg-amber-400 border-amber-500 text-white shadow-lg'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="level_id"
                                    value={level.id}
                                    onChange={handleInputChange}
                                    checked={formData.level_id === level.id}
                                    className="peer hidden"
                                />
                                <span
                                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${formData.level_id === level.id
                                        ? 'bg-white border-white'
                                        : 'bg-gray-100 border-gray-400'
                                        }`}
                                >
                                    <span
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${formData.level_id === level.id
                                            ? 'bg-amber-400 scale-100'
                                            : 'bg-transparent scale-0'
                                            }`}
                                    />
                                </span>
                                <span className={`${formData.level_id === level.id ? 'text-white' : ''}`}>
                                    {level.name}
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                        This level allows instructing cases to experts by an agency (Primary Agency), Instructor, or Expert.
                    </div>
                </>
            )}
        </div>
    );
};

export default InstructLevelSection;
