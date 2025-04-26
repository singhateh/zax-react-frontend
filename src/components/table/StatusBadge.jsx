// components/table/StatusBadge.jsx
export const StatusBadge = ({ status }) => {
    if (status === 'N/A') return <span className="text-gray-500">N/A</span>;

    const statusClasses = {
        '✔': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-blue-100 text-blue-800',
        'Rejected': 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};