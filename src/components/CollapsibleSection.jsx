import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleSection = ({
    title,
    children,
    defaultOpen = true,
    icon, // Custom icon to display before title
    iconPosition = "left", // 'left' or 'right' (relative to title)
    customOpenIcon, // Custom open state icon
    customClosedIcon // Custom closed state icon
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Default icons
    const OpenIcon = customOpenIcon || ChevronUp;
    const ClosedIcon = customClosedIcon || ChevronDown;


    return (
        <div className="bg-gray-100 rounded-lg shadow-md mb-4 relative1 z-0">
            <div
                className="flex items-center justify-between cursor-pointer p-4 border-b border-gray-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {icon && iconPosition === "left" && (
                        <div className="text-gray-500">
                            {typeof icon === "function" ? icon({ isOpen }) : icon}
                        </div>
                    )}
                    <h2 className="text-md font-semibold text-gray-700">{title}</h2>
                    {icon && iconPosition === "right" && (
                        <div className="text-gray-500">
                            {typeof icon === "function" ? icon({ isOpen }) : icon}
                        </div>
                    )}
                </div>

                {isOpen ? (
                    <OpenIcon className="w-5 h-5 text-gray-500 shrink-0" />
                ) : (
                    <ClosedIcon className="w-5 h-5 text-gray-500 shrink-0" />
                )}
            </div>

            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-4 relative1 z-0">{children}</div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
