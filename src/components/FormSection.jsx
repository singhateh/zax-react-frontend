export const FormSection = ({ title, children, note }) => {
    return (
        <div className="mb-8 border border-gray-200 rounded">
            <div className="bg-yellow-600 text-white font-medium px-4 py-2 rounded-t">
                {title}
            </div>
            <div className="p-4 bg-white">
                {children}
                {note && (
                    <div className="text-red-600 text-sm mt-2 font-semibold">
                        {note}
                    </div>
                )}
            </div>
        </div>
    );
};