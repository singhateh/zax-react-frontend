// venueHelpers.js

import { FaMapPin, FaMap, FaMapSigns } from 'react-icons/fa';

export const venueNames = (venue) => {
    return (
        <div className="space-y-1">
            <label
                style={{
                    width: '10px',
                    height: '10px',
                    display: 'inline-block',
                    backgroundColor: venue.venue_color_code || '#000',
                    marginRight: '5px',
                }}
            ></label>
            {venue.venue_name} <br />
            <FaMapPin size={12} className="inline-block text-gray-600 mr-1" /> {venue.address?.address_1} <br />
            <FaMap size={12} className="inline-block text-gray-600 mr-1" /> {venue.address?.address_2} <br />
            <FaMapSigns size={12} className="inline-block text-gray-600 mr-1" /> {venue.address?.address_3} <br />
            {venue.address?.town} - {venue.address?.postcode}
        </div>
    );
};


import { FaUserCircle, FaEnvelope, FaBriefcase, FaPhone } from 'react-icons/fa';

export const bookingContact = (venue) => {
    return (
        <div className="space-y-1">
            <FaUserCircle size={12} className="inline-block text-gray-600 mr-1" /> {venue.contact_name} <br />
            <FaEnvelope size={12} className="inline-block text-gray-600 mr-1" /> {venue.contact_email} <br />
            <FaBriefcase size={12} className="inline-block text-gray-600 mr-1" /> {venue.contact_work} <br />
            <FaPhone size={12} className="inline-block text-gray-600 mr-1" /> {venue.contact_phone}
        </div>
    );
};


import { FaWheelchair, FaChild, FaCheckCircle, FaPeopleArrows, FaUserTag } from 'react-icons/fa';
import { MdBadge } from 'react-icons/md';

export const venueInfo = (venue, size = 20) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <span
                    className="px-2 py-1 text-white text-xs font-medium rounded-md"
                    style={{ backgroundColor: "rgb(46, 106, 190)" }}
                    title={venue.venue_type === "Fixed" ? "Fixed Venue" : "Mobile Venue"}
                >
                    {venue.venue_type.charAt(0).toUpperCase()}
                </span>
                <span
                    className="px-2 py-1 text-white text-xs font-medium rounded-md"
                    style={{ backgroundColor: "rgb(46, 106, 190)" }}
                    title={venue.postcode_area === "Urban" ? "Urban Location" : "Rural Location"}
                >
                    {venue.postcode_area.charAt(0).toUpperCase()}
                </span>
            </div>

            <div className="flex gap-2">
                {venue.disabled_access === "Yes" && (
                    <span className="tooltip" title="Disabled Access">
                        <FaWheelchair size={size} className="text-gray-700" />
                    </span>
                )}
                {venue.can_children_attend === "Yes" && (
                    <span className="tooltip" title="Children Friendly Venue">
                        <FaChild size={size} className="text-gray-700" />
                    </span>
                )}
            </div>

            <div className="flex gap-2">
                {venue.medco_definition === "Inappropriate" && (
                    <span className="tooltip text-orange-500" title="MedCo Standard: Inappropriate">
                        <FaChild size={size} />
                    </span>
                )}
                {venue.medco_definition === "Best_Practice" && (
                    <span className="tooltip text-orange-500" title="MedCo Standard: Best Practice">
                        <MdBadge size={size} />
                    </span>
                )}
                {venue.medco_definition === "Acceptable" && (
                    <span className="tooltip text-orange-500" title="MedCo Standard: Acceptable">
                        <FaCheckCircle size={size} />
                    </span>
                )}
            </div>

            <div className="flex gap-2">
                {venue.waiting_facility === "Yes" && (
                    <span className="tooltip" title="Waiting Facility Available">
                        <FaPeopleArrows size={size} className="text-gray-700" />
                    </span>
                )}
                {venue.receptionist === "Yes" && (
                    <span className="tooltip" title="Receptionist Available">
                        <FaUserTag size={size} className="text-gray-700" />
                    </span>
                )}
            </div>
        </div>
    );
};


export const venueDetailsInline = (venue, size = 10, align = 'left') => {
    return (
        <div>
            <label className="font-medium text-sm">{venue.venue_name}</label> <br />
            <strong className="text-red-500 font-semibold text-xs">
                {venue.address?.town} - {venue.address?.postcode}
            </strong>
            <br />
            <div className={`flex justify-${align} gap-1 flex-wrap mt-1`}>
                <span
                    className="px-1.5 py-0.5 text-white text-[10px] font-medium rounded bg-blue-500"
                    title={venue.venue_type === "Fixed" ? "Fixed Venue" : "Mobile Venue"}
                >
                    {venue.venue_type.charAt(0).toUpperCase()}
                </span>
                <span
                    className="px-1.5 py-0.5 text-white text-[10px] font-medium rounded bg-green-500"
                    title={venue.postcode_area === "Urban" ? "Urban Location" : "Rural Location"}
                >
                    {venue.postcode_area.charAt(0).toUpperCase()}
                </span>

                {venue.disabled_access === "Yes" && (
                    <span className="tooltip px-1.5 py-0.5 bg-gray-500 rounded" title="Disabled Access">
                        <FaWheelchair size={size} className="text-white" />
                    </span>
                )}
                {venue.can_children_attend === "Yes" && (
                    <span className="tooltip px-1.5 py-0.5 bg-yellow-500 rounded" title="Children Friendly Venue">
                        <FaChild size={size} className="text-white" />
                    </span>
                )}
                {venue.medco_definition === "Inappropriate" && (
                    <span className="tooltip px-1.5 py-0.5 bg-red-500 rounded" title="MedCo Standard: Inappropriate">
                        <FaChild size={size} className="text-white" />
                    </span>
                )}
                {venue.medco_definition === "Best_Practice" && (
                    <span className="tooltip px-1.5 py-0.5 bg-purple-500 rounded" title="MedCo Standard: Best Practice">
                        <MdBadge size={size} className="text-white" />
                    </span>
                )}
                {venue.medco_definition === "Acceptable" && (
                    <span className="tooltip px-1.5 py-0.5 bg-green-700 rounded" title="MedCo Standard: Acceptable">
                        <FaCheckCircle size={size} className="text-white" />
                    </span>
                )}
                {venue.waiting_facility === "Yes" && (
                    <span className="tooltip px-1.5 py-0.5 bg-blue-700 rounded" title="Waiting Facility Available">
                        <FaPeopleArrows size={size} className="text-white" />
                    </span>
                )}
                {venue.receptionist === "Yes" && (
                    <span className="tooltip px-1.5 py-0.5 bg-orange-500 rounded" title="Receptionist Available">
                        <FaUserTag size={size} className="text-white" />
                    </span>
                )}
            </div>
        </div>
    );
};

