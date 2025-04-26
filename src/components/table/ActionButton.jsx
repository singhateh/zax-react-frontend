export const ActionButton = ({
    isSelected,
    onClick,
    mobileLabel = "Select",
    desktopLabel = "Select",
    selectedMobileLabel = "Selected",
    selectedDesktopLabel = "Selected"
}) => {
    return (
        <button
            onClick={onClick}
            className={`
          w-full md:w-auto 
          px-3 py-1.5 md:px-4 md:py-2 
          rounded-lg text-sm font-medium 
          transition-colors
          flex justify-center md:justify-end
          ${isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
        `}
        >
            <span className="md:hidden">
                {isSelected ? selectedMobileLabel : mobileLabel}
            </span>
            <span className="hidden md:inline">
                {isSelected ? selectedDesktopLabel : desktopLabel}
            </span>
        </button>
    );
};