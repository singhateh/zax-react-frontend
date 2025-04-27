import React, { useEffect, useState } from 'react';
import AgencyForm from './AgencyForm';
import { SaveIcon, X } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import SortableTable from '../../components/SortableTable';
import { getStatusColor } from '../../utilities/constant';

const Agencies = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [solicitors, setSolicitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedagencySolicitor, setSelectedagencySolicitor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);


  const formatAddress = (address) => {
    if (!address) return 'N/A';

    return (
      <span className="inline-block max-w-[200px] truncate" title={address}>
        {address}
      </span>
    );
  }

  const columns = [
    { key: 'number', label: 'Code' },
    { key: 'company_name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'postcode', label: 'PostCode' },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
    { key: 'created_by', label: 'Created By' },
    { key: 'action', label: 'Actions' },
  ];


  const formatSlotData = (agencySolicitor) => {

    return {
      id: agencySolicitor.id,
      number: agencySolicitor.number,
      company_name: agencySolicitor.company_name,
      country: agencySolicitor.country,
      postcode: agencySolicitor.postcode,
      address: formatAddress(agencySolicitor.address),
      status: (
        <span className={getStatusColor(agencySolicitor.status)}>
          {agencySolicitor.status || 'N/A'}
        </span>
      ),
      date: (
        <div className="text-sm">
          <div className="font-medium">{agencySolicitor.created_at}</div>
        </div>
      ),
      created_by: agencySolicitor?.created_by ?? "",
      // Action buttons
      action: (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSlot(agencySolicitor)}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteSlot(agencySolicitor.id)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    };
  };


  const fetchSolicitors = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/agencies', {
        params: { page, limit: itemsPerPage },
      });
      const agencySolicitorData = response.data.data.map(formatSlotData);

      setSolicitors((prevSolicitors) => [...prevSolicitors, ...agencySolicitorData]);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error('Error fetching solicitors:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSolicitors(currentPage); // Fetch venues for the current page
  }, [currentPage]);


  const handleAddSlot = () => {
    setModalOpen(true);
    setSelectedagencySolicitor(null);
  };


  const handleEditSlot = (agencySolicitor) => {
    setSelectedagencySolicitor(null);

    setTimeout(() => {
      setSelectedagencySolicitor(agencySolicitor);
      setModalOpen(true);
    }, 0);
  };


  const handleDeleteSlot = (agencySolicitorId) => {
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
          await api.delete(`doctor/solicitors/${agencySolicitorId}`);

          setSolicitors((prevSolicitors) => {
            const updatedSolicitors = prevSolicitors.filter((agencySolicitor) => agencySolicitor.id !== agencySolicitorId);
            console.log(updatedSolicitors);
            return updatedSolicitors;
          });

          // Swal.fire('Deleted!', 'Your agencySolicitor has been deleted.', 'success');
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Slot deleted successfully!',
            showConfirmButton: false,
            timer: 3000,
          });
        } catch (error) {
          console.error('Error deleting agencySolicitor:', error);
          Swal.fire('Failed!', 'There was an issue deleting the agencySolicitor.', 'error');
        }
      }
    });
  };


  const handleDeleteMultiple = (selectedIds) => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Optionally, make an API call to delete rows from the backend
          // const response = await api.delete('/delete-items', { data: { ids: selectedIds } });

          // For the sake of this example, I'm deleting rows from local state
          const updatedData = solicitors.filter(item => !selectedIds.includes(item.id));

          // Update the state with the new filtered data
          setSolicitors(updatedData);

          // Show success notification using SweetAlert
          Swal.fire(
            'Deleted!',
            'Your selected items have been deleted.',
            'success'
          );
        } catch (error) {
          // Show error notification using SweetAlert
          console.error('Error deleting items:', error);
          Swal.fire(
            'Failed!',
            'There was an issue deleting the items.',
            'error'
          );
        }
      }
    });
  };


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const footerButtons = [
    {
      label: 'Save',
      icon: <SaveIcon size={16} />,
      onClick: () => "",
      color: 'bg-blue-500',
    },
    {
      label: 'Cancel',
      icon: <X size={16} />,
      onClick: () => setModalOpen(false),
      color: 'bg-red-500',
    }
  ];

  return (
    <div className="container1 mx-auto p-6 mt-20 w-full">
      <button
        onClick={handleAddSlot}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New Agency
      </button>
      <SortableTable
        columns={columns}
        data={solicitors}
        checkboxColumn={true}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        handleDeleteMultiple={handleDeleteMultiple}
      />
      <AgencyForm isOpen={isModalOpen} setModalOpen={setModalOpen}
        type={'Agency'}
        formatSlotData={formatSlotData}
        title={'Create new Solicitor'} footerButtons={footerButtons}
        setSolicitors={setSolicitors}
        agencySolicitor={selectedagencySolicitor} />
    </div>
  );
};

export default Agencies;
