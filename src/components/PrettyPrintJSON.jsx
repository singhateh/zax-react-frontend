import React from 'react';

const PrettyPrintJSON = ({ data }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-md overflow-auto">
            <pre className="text-sm text-gray-800 font-mono">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export default PrettyPrintJSON;
