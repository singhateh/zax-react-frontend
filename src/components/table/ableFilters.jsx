export const TableFilters = ({
    searchOption,
    setSearchOption,
    searchQuery,
    setSearchQuery
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Options */}
                <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            checked={searchOption === 'agency'}
                            onChange={() => setSearchOption('agency')}
                        />
                        <span className="ml-2 text-gray-700">Agency</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            checked={searchOption === 'solicitor'}
                            onChange={() => setSearchOption('solicitor')}
                        />
                        <span className="ml-2 text-gray-700">Solicitor</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-blue-600"
                            checked={searchOption === 'both'}
                            onChange={() => setSearchOption('both')}
                        />
                        <span className="ml-2 text-gray-700">Both</span>
                    </label>
                </div>
            </div>
        </div>
    );
};