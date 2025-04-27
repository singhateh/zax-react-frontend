import React, { useState, useEffect } from 'react';
import SortableTable from "../../components/SortableTable";
import VenueForm from './Venues/VenueForm';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { bookingContact, venueInfo, venueNames } from './Venues/venueHelpers';

const Venues = () => {
  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'venueName', label: 'Venue Name' },
    { key: 'contact', label: 'Contact' },
    { key: 'info', label: 'Info' },
    { key: 'parking', label: 'Parking' },
    { key: 'specialInstruction', label: 'Instruction' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [experts, setExperts] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 10; // Items per page (set to 10 initially)
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true); // Open modal to edit
  };

  const handleDeleteVenue = (venueId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make API call to delete the venue
          await api.delete(`doctor/venues/${venueId}`);

          // Use the functional update to ensure React sees the change
          setVenues((prevVenues) => {
            const updatedVenues = prevVenues.filter((venue) => venue.id !== venueId);
            return updatedVenues;
          });

          Swal.fire('Deleted!', 'Your venue has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting venue:', error);
          Swal.fire('Failed!', 'There was an issue deleting the venue.', 'error');
        }
      }
    });
  };

  const formatVenueData = (venue) => {
    return {
      id: venue.id,
      image: venue.image_url || 'https://via.placeholder.com/150',
      venueName: venueNames(venue),
      contact: bookingContact(venue),
      info: venueInfo(venue),
      parking: venue?.parking ? venue.parking.charAt(0).toUpperCase() + venue.parking.slice(1) : "None",
      specialInstruction: venue.special_instruction,
      status: venue.status,
      action: (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditVenue(venue)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteVenue(venue.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    };
  };

  const fetchVenues = async (page = 1) => {
    setLoading(true);
    try {
      // Fetch data with pagination
      const response = await api.get('doctor/venues', {
        params: { page, limit: itemsPerPage }, // Sending page and limit as query parameters
      });
      const venueData = response.data.venues.map(formatVenueData);

      // Update venues and total pages
      setVenues((prevVenues) => [...prevVenues, ...venueData]); // Append to avoid overwriting
      setExperts(response.data.experts);
      setTotalPages(response.data.pagination.total_pages); // Total number of pages
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues when the current page changes
  useEffect(() => {
    fetchVenues(currentPage); // Fetch venues for the current page
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddSlot = async () => {
    setModalOpen(true);
    setSelectedVenue(null);
  };

  return (
    <div className="container1 mx-auto p-6 mt-20 w-full">
      <button
        onClick={handleAddSlot}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New Venue
      </button>

      {/* Pass pagination data to the SortableTable */}
      <SortableTable
        columns={columns}
        data={venues}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
      />

      {/* Venue Form Modal */}
      <VenueForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        setVenues={setVenues}
        formatVenueData={formatVenueData}
        title={'Create new venue'}
        venue={selectedVenue}
        experts={experts}
      />
    </div>
  );
};

export default Venues;
