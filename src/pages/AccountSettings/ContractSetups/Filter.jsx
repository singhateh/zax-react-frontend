import React, { useState } from 'react';
import CustomCheckbox from '../../../components/CustomCheckbox';
import { DOCTOR_STATUS } from '../../../constants';
import { ChevronDown, ChevronRight } from 'lucide-react'; // or any icons you prefer


function Filter({
    isMobile,
    searchOption,
    searchQuery,
    setSearchOption,
    setSearchQuery,
    handleSearch,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    displayWithLinks,
    handleDisplayWithLinks,
    displayWithPaymentTerms,
    showExpiredOnly,
    handleShowExpiredOnly,
    handleDisplayWithPaymentTerms,
    hasActiveFilters,
    handleSearchOption
}) {


    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className={`bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 mb-6 ${isMobile ? 'mt-20' : ''}`}>
            <div className="flex flex-col gap-5">

                {/* 🔍 Search Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search agencies or solicitors..."
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Radio Filters */}
                    <div className="flex flex-wrap gap-3">
                        {['Agency', 'Solicitor', ''].map((option) => (
                            <label key={option} className="inline-flex items-center gap-2 text-sm sm:text-base cursor-pointer">
                                <input
                                    type="radio"
                                    className="hidden peer"
                                    checked={searchOption === option}
                                    onChange={() => handleSearchOption(option)}
                                />
                                <div className="w-5 h-5 border-2 rounded-full border-gray-300 peer-checked:border-blue-500 flex items-center justify-center">
                                    <div className={`w-3 h-3 rounded-full bg-blue-500 transition-opacity ${searchOption === option ? 'opacity-100' : 'opacity-0'}`} />
                                </div>
                                <span className="capitalize">{option || 'All'}</span>
                            </label>
                        ))}
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-4 border-gray-100">
                    {/* ✅ Checkbox Options Panel */}
                    <div>
                        <button
                            onClick={() => setShowCheckboxes(prev => !prev)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-800"
                        >
                            {showCheckboxes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            Display Options
                        </button>

                        {showCheckboxes && (
                            <div className="flex flex-wrap gap-3 mt-3">
                                <CustomCheckbox
                                    id="display-links"
                                    label="Display with Links"
                                    isChecked={displayWithLinks}
                                    onChange={handleDisplayWithLinks}
                                />
                                <CustomCheckbox
                                    id="display-payment-terms"
                                    label="Display with Payment Terms"
                                    isChecked={displayWithPaymentTerms}
                                    onChange={handleDisplayWithPaymentTerms}
                                />
                                <CustomCheckbox
                                    id="show-expired"
                                    label="Show Expired Only"
                                    isChecked={showExpiredOnly}
                                    onChange={handleShowExpiredOnly}
                                />
                            </div>
                        )}
                    </div>

                    {/* ✅ Filter Fields Panel */}
                    <div>
                        <button
                            onClick={() => setShowFilters(prev => !prev)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-800"
                        >
                            {showFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            Filter Fields
                        </button>

                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.entries(DOCTOR_STATUS).map(([key, val]) => (
                                        <option key={key} value={key}>{val}</option>
                                    ))}
                                </select>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 🏷️ Active Filters */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {searchQuery && (
                            <Tag label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery('')} />
                        )}
                        {searchOption && (
                            <Tag label={`Type: ${searchOption || 'All'}`} onRemove={() => setSearchOption('')} />
                        )}
                        {statusFilter && (
                            <Tag label={`Status: ${DOCTOR_STATUS[statusFilter]}`} onRemove={() => setStatusFilter('')} />
                        )}
                        {(startDate || endDate) && (
                            <Tag
                                label={`Date: ${startDate || '...'} to ${endDate || '...'}`}
                                onRemove={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                            />
                        )}
                        {displayWithLinks && <Tag label="With Links" onRemove={() => handleDisplayWithLinks(false)} />}
                        {displayWithPaymentTerms && <Tag label="With Payment Terms" onRemove={() => handleDisplayWithPaymentTerms(false)} />}
                        {showExpiredOnly && <Tag label="Expired Only" onRemove={() => handleShowExpiredOnly(false)} />}
                    </div>
                )}
            </div>
        </div>
    );
}

// 💠 Filter Tag Component
function Tag({ label, onRemove }) {
    return (
        <div className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full">
            <span>{label}</span>
            <button onClick={onRemove} className="text-gray-500 hover:text-gray-700 text-sm font-bold">&times;</button>
        </div>
    );
}

export default Filter;
