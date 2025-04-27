import React, { useEffect, useState } from 'react';
import { SaveIcon, X } from 'lucide-react';
import Swal from 'sweetalert2';
import SortableTable from '../components/SortableTable';
import { getStatusColor, removeApiPrefix } from '../utilities/constant';
import api from '../services/api';
import { DOCTOR_STATUS } from '../constants';
import ActionDoctorDropdown from './ZaxCal/ManageCase/ActionDoctorDropdown';
import { FaBed, FaEdit, FaLink, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { goToDoctorProfile } from '../utilities/navigationUtils';

const Doctors = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [Doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selecteddoctor, setSelecteddoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();




  const formatCode = (code) => {
    if (!code) return 'N/A';

    return (
      <span className="inline-block max-w-[80px] truncate" title={code}>
        {code}
      </span>
    );
  }


  const actionItems = (doctor) => [
    {
      icon: <FaEdit size={18} />,
      title: "Edit Doctor",
      action: () => handleEditSlot(doctor), // Fixed: wrapped in function
      show: true
    },
    {
      icon: <FaLink size={18} />,
      title: "Suspend Doctor",
      action: () => handleSuspendDoctor(doctor), // Fixed: wrapped in function
      show: !!doctor.suspend_link // Convert to boolean
    },
    {
      icon: <FaBed size={18} />,
      title: "Profile",
      action: () => goToDoctorProfile(navigate, doctor), // Fixed: wrapped in function
      show: !!doctor.profile_link // Convert to boolean
    },
    {
      icon: <FaTrashAlt size={18} />,
      title: "Delete",
      action: () => handleDeleteDoctor(doctor), // Fixed: wrapped in function
      className: "hover:text-red-500",
      show: true
    }
  ].filter(item => item.show !== false); // Filter out hidden items

  const columns = [
    { key: 'number', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'registration_number', label: 'Registration ID' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Gender' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Actions' },
  ];

  const formatSlotData = (doctor) => {
    return {
      id: doctor.id,
      number: formatCode(doctor.number),
      name: doctor.name,
      registration_number: doctor.registration_number,
      email: doctor.email,
      gender: doctor.gender,
      status: (
        <span className={getStatusColor(doctor.status)}>
          {doctor.status || 'N/A'}
        </span>
      ),
      action: (
        <div className="flex space-x-2">
          {doctor.status !== DOCTOR_STATUS.ACCEPTED && (
            <>
              <button
                onClick={() => confirmAction(
                  'Approve Doctor?',
                  'This will grant full access to the doctor.',
                  'Approve'
                ).then(confirmed => confirmed && handleApproveDoctor(doctor))}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Approve
              </button>
              <button
                onClick={() => confirmAction(
                  'Reject Doctor?',
                  'This will reject the doctor application.',
                  'Reject'
                ).then(confirmed => confirmed && handleRejectDoctor(doctor))}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                Reject
              </button>
            </>
          )}
          <ActionDoctorDropdown
            doctor={doctor}
            actionItems={actionItems(doctor)}
          />
        </div>
      ),
    };
  };

  const fetchDoctors = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/doctor/experts', {
        params: { page, limit: itemsPerPage },
      });
      const doctorData = response.data.data.map(formatSlotData);

      setDoctors((prevDoctor) => [...prevDoctor, ...doctorData]);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error('Error fetching Doctors:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDoctors(currentPage); // Fetch venues for the current page
  }, [currentPage]);


  const handleAddSlot = () => {
    setModalOpen(true);
    setSelecteddoctor(null);
  };


  const handleEditSlot = (doctor) => {
    setSelecteddoctor(null);

    setTimeout(() => {
      setSelecteddoctor(doctor);
      setModalOpen(true);
    }, 0);
  };


  const handleDeleteDoctor = (doctor) => {

    const doctorId = doctor.id; // Get the doctor ID from the parameter

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
          await api.delete(`doctor/experts/${doctorId}`);

          setDoctors((prevDoctor) => {
            const updatedDoctors = prevDoctor.filter((doctor) => doctor.id !== doctorId);
            console.log(updatedDoctors);
            return updatedDoctors;
          });

          // Swal.fire('Deleted!', 'Your doctor has been deleted.', 'success');
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Slot deleted successfully!',
            showConfirmButton: false,
            timer: 3000,
          });
        } catch (error) {
          console.error('Error deleting doctor:', error);
          Swal.fire('Failed!', 'There was an issue deleting the doctor.', 'error');
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
          const updatedData = Doctors.filter(item => !selectedIds.includes(item.id));

          // Update the state with the new filtered data
          setDoctors(updatedData);

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

  const confirmAction = async (title, text, confirmText = 'Confirm') => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    return result.isConfirmed;
  };

  const handleApproveDoctor = async (doctor) => {
    const shouldProceed = await confirmAction(
      'Approve Doctor?',
      'Are you sure you want to approve this doctor?',
      'Yes, Approve'
    );
    if (!shouldProceed) return;

    try {
      await api.put(removeApiPrefix(doctor.approve_link));
      await Swal.fire('Approved!', 'Doctor has been approved successfully.', 'success');
      fetchDoctors();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Approval failed. Please try again.', 'error');
    }
  };

  const handleRejectDoctor = async (doctor) => {
    const shouldProceed = await confirmAction(
      'Reject Doctor?',
      'Are you sure you want to reject this doctor?',
      'Yes, Reject'
    );
    if (!shouldProceed) return;

    try {
      await api.put(removeApiPrefix(doctor.reject_url));
      await Swal.fire('Rejected!', 'Doctor has been rejected successfully.', 'success');
      fetchDoctors();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Rejection failed. Please try again.', 'error');
    }
  };

  const handleSuspendDoctor = async (doctor) => {
    const shouldProceed = await confirmAction(
      'Suspend Doctor?',
      'Are you sure you want to suspend this doctor?',
      'Yes, Suspend'
    );
    if (!shouldProceed) return;

    try {
      await api.put(removeApiPrefix(doctor.suspend_link));
      await Swal.fire('Suspended!', 'Doctor has been suspended successfully.', 'success');
      fetchDoctors();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Suspension failed. Please try again.', 'error');
    }
  };

  // For view profile (no confirmation needed)
  const handleViewDoctorProfile = (doctor) => {
    navigate(`/doctors/${doctor.id}`);
  };

  // For pending action
  const handlePendingDoctorAction = async (doctor) => {
    const shouldProceed = await confirmAction(
      'Update Pending Status?',
      'Are you sure you want to update this doctor\'s pending status?',
      'Yes, Update'
    );
    if (!shouldProceed) return;

    try {
      await api.put(removeApiPrefix(doctor.pending_page_link));
      await Swal.fire('Updated!', 'Doctor status has been updated successfully.', 'success');
      fetchDoctors();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to update status. Please try again.', 'error');
    }
  };


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  return (
    <div className="container1 mx-auto p-6 mt-20 w-full">
      <button
        onClick={handleAddSlot}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New Doctor
      </button>
      <SortableTable
        columns={columns}
        data={Doctors}
        checkboxColumn={true}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        handleDeleteMultiple={handleDeleteMultiple}
      />
      {/* <AgencyForm isOpen={isModalOpen} setModalOpen={setModalOpen}
        type={'Doctor'}
        formatSlotData={formatSlotData}
        title={'Create new Doctor'} footerButtons={footerButtons}
        setDoctors={setDoctors}
        doctor={selecteddoctor} /> */}
    </div>
  );
};

export default Doctors;
