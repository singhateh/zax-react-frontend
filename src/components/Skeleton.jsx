import React from 'react';

// Reusable Skeleton Loader Component
const Skeleton = ({ type = 'text', count = 1, width = '100%', height = '20px', className = '' }) => {
    const skeletons = Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${className} animate-pulse`}>
            {type === 'text' && (
                <div
                    className={`bg-gray-300 rounded ${width} ${height} mb-2`}
                    style={{ width, height }}
                ></div>
            )}
            {type === 'circle' && (
                <div
                    className={`bg-gray-300 rounded-full ${width} ${height} mb-2`}
                    style={{ width, height }}
                ></div>
            )}
            {type === 'rect' && (
                <div
                    className={`bg-gray-300 rounded ${width} ${height} mb-2`}
                    style={{ width, height }}
                ></div>
            )}
        </div>
    ));

    return <>{skeletons}</>;
};

export default Skeleton;
