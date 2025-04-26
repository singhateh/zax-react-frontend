export default function Training() {
    return (
        <div className="space-y-4 border p-4 rounded-xl shadow bg-white">
            <h2 className="text-xl font-semibold">Training</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Course Name</label>
                    <input type="text" className="mt-1 w-full rounded border-gray-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date Completed</label>
                    <input type="date" className="mt-1 w-full rounded border-gray-300" />
                </div>
            </div>
        </div>
    );
}
