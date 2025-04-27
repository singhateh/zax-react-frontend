import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Search, Edit, Trash2, Eye, Plus, SaveIcon, X } from 'lucide-react';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import SelectField from '../../components/SelectField';
import SortableTable from '../../components/SortableTable';
import { ALERT_ROUTES } from '../../constants/apiRoutes';
import api from '../../services/api';
import { badgeStyle, formatDisplayDate, handleSelectChange } from '../../utilities/constant';
import DebouncedSearchDropdown from '../../components/DebouncedSearchDropdown';

// Lazy loaded components
const AlertDetails = lazy(() => import('./Alerts/AlertDetails'));

const initialFormData = {
  instruct_case_id: '',
  tab_name: '',
  priority: '',
  color: '',
  message: ''
};

const ZaxAlert = () => {
  // State declarations
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [claimantOptions, setClaimantOptions] = useState([]);
  const [priorityColors, setPriorityColors] = useState([]);
  const [priorityLevels, setPriorityLevels] = useState([]);
  const [reportTabSections, setReportTabSections] = useState([]);
  const [filteredClaimants, setFilteredClaimants] = useState([]);
  const [loading, setLoading] = useState(false); // Single loading state
  const [errors, setErrors] = useState({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [filters, setFilters] = useState({
    displayWithLinks: false,
    displayWithPaymentTerms: false,
    status: '',
    startDate: '',
    endDate: '',
    showExpiredOnly: false
  });

  const [pagination, setPagination] = useState({
    perPage: 5,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Refs for stable values and cleanup
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Columns configuration
  const columns = [
    { key: 'tab', label: 'Tab' },
    { key: 'message', label: 'Message' },
    { key: 'claimant', label: 'Claimant' },
    { key: 'priority', label: 'Priority' },
    { key: 'created_at', label: 'Created At' },
    { key: 'action', label: 'Actions' }
  ];

  // Memoized components to prevent unnecessary re-renders
  const CustomName = React.memo(({ alert }) => {
    if (!alert.claimant) return null;
    const claimant = alert.claimant;

    return (
      <div className="flex items-start space-x-2">
        <div>
          <div className="font-semibold">{claimant?.name || "N/A"}</div>
          <div className="text-sm text-gray-600 space-y-1">
            {alert?.address || "Address not available"}
            {claimant?.mobile && <div>{claimant.mobile}</div>}
          </div>
          <div className="mt-1 space-y-1 text-xs">
            {claimant?.dob && <div className="text-red-500">Dob: {claimant.dob}</div>}
            {claimant?.dna_email && <div className="text-blue-500">DNA Email: {claimant.dna_email}</div>}
            {claimant?.report_email && <div className="text-orange-500">Reports Email: {claimant.report_email}</div>}
          </div>
        </div>
      </div>
    );
  });

  const CustomMessage = React.memo(({ alert }) => {
    if (!alert) return null;
    return (
      <div
        className="text-sm text-gray-700 line-clamp-2 max-w-[200px] sm:max-w-xs overflow-hidden"
        dangerouslySetInnerHTML={{ __html: alert.message }}
      />
    );
  });

  const AlertActions = React.memo(({ alert }) => (
    <div className="flex flex-wrap gap-0">
      <button
        onClick={() => handleViewAlert(alert)}
        className="btn btn-xs btn-flat btn-default"
        title={'View alert'}
      >
        <Eye size={16} className="contract-icon-xs sm:w-7 sm:h-7 md:w-7 md:h-7" />
      </button>
      <button
        onClick={() => handleEdit(alert)}
        className="btn btn-xs btn-flat btn-default"
        title={'Edit alert'}
      >
        <Edit size={16} className="contract-icon-xs sm:w-7 sm:h-7 md:w-7 md:h-7 text-blue-600" />
      </button>
      <button
        onClick={() => handleDelete(alert.id)}
        className="btn btn-xs btn-flat btn-default"
        title={'Delete alert'}
      >
        <Trash2 size={16} className="contract-icon-xs sm:w-7 sm:h-7 md:w-7 md:h-7 text-red-600" />
      </button>
    </div>
  ));

  // Stable callback for formatting data with null checks
  const formatDataCallback = useCallback((alert) => {
    if (!alert) return null;

    return {
      id: alert.id || '',
      tab: alert.tabName || '',
      message: alert ? <CustomMessage alert={alert} /> : null,
      claimant: alert ? <CustomName alert={alert} /> : null,
      priority: (
        <span className={badgeStyle(alert?.color)}>
          {alert?.priority || 'N/A'}
        </span>
      ),
      created_at: alert?.created_at ? formatDisplayDate(alert.created_at) : '',
      action: alert ? <AlertActions alert={alert} /> : null,
    };
  }, []);

  // Improved version with better error handling
  const fetchData = useCallback(async (page = 1) => {
    // Skip if component is unmounted
    if (!isMountedRef.current) return;

    try {
      setLoading(true);

      // Cancel previous request if exists
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const alertsResponse = await api.get(ALERT_ROUTES.GET_ALL, {
        params: {
          page,
          per_page: pagination.perPage,
          status: filters.status,
          start_date: filters.startDate,
          end_date: filters.endDate,
          expired_only: filters.showExpiredOnly
        },
        signal: controller.signal
      });

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      // Validate response structure
      if (!alertsResponse?.data?.data) {
        throw new Error('Invalid response structure');
      }

      const {
        data,
        pagination: paginationData,
        getPriorityColor,
        priorityLevel,
        reportTabSections
      } = alertsResponse.data;

      // Process only if we have valid data
      if (Array.isArray(data)) {
        setAlerts(data.map(formatDataCallback).filter(Boolean));
        setPriorityColors(getPriorityColor);
        setReportTabSections(reportTabSections);
        setPriorityLevels(priorityLevel);

        setPagination(prev => ({
          ...prev,
          totalPages: paginationData?.last_page || prev.totalPages,
          totalItems: paginationData?.total || prev.totalItems,
          currentPage: page,
          perPage: paginationData?.per_page || prev.perPage
        }));
      }

    } catch (error) {
      // Only show error toast for actual errors, not aborted requests
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error('Fetch error:', error);

        // Don't show error toast for initial load if it's likely a connection issue
        if (page !== 1 || error.message !== 'Network Error') {
          // showErrorToast('Failed to fetch alerts');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [
    pagination.perPage,
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.showExpiredOnly
  ]);

  // Initial data load with retry mechanism
  useEffect(() => {
    isMountedRef.current = true;
    let retryCount = 0;
    const maxRetries = 2;

    const loadData = async () => {
      try {
        await fetchData(pagination.currentPage);
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadData, 1000 * retryCount); // Exponential backoff
        }
      }
    };

    loadData();

    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [fetchData, pagination.currentPage]);

  // Filter claimants with debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredClaimants(
        claimantOptions.filter(option =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, claimantOptions]);

  const handleViewAlert = (alert) => {
    setIsDetailOpen(true);
    setSelectedAlert(alert);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isEdit = !!selectedAlert;

      const dataToSend = isEdit
        ? { ...formData, id: selectedAlert.id }
        : formData;

      const response = isEdit
        ? await api.put(ALERT_ROUTES.UPDATE(selectedAlert.id), dataToSend)
        : await api.post(ALERT_ROUTES.CREATE, dataToSend);

      const updatedData = response.data?.data;
      const formattedData = formatDataCallback(updatedData);

      setAlerts((prev) =>
        isEdit
          ? prev.map((a) => (a.id === formattedData.id ? formattedData : a))
          : [formattedData, ...prev]
      );

      closeModal();
      showSuccessToast(`Alert ${isEdit ? 'updated' : 'created'} successfully`);

    } catch (error) {
      console.error('Error submitting alert:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showErrorToast('Something went wrong while submitting the alert.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete(ALERT_ROUTES.DELETE(id));
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        showSuccessToast('Alert deleted successfully');
      } catch (error) {
        console.error('Error deleting alert:', error);
        showErrorToast('Failed to delete alert');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (alert) => {
    setFormData({
      ...alert,
      tab_name: alert.tabName
    });
    setSelectedAlert(alert);
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const searchClaimants = async (term) => {
    try {
      const response = await api.get(ALERT_ROUTES.SEARCH_CLAIMANTS, {
        params: { search: term }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching claimants:', error);
      return [];
    }
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setErrors({});
    setSelectedAlert(null);
  };

  const showSuccessToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  };

  const showErrorToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  // Derived values
  const priorityOptions = Object.entries(priorityLevels).map(([value, label]) => ({
    label,
    value,
  }));

  const reportTabSectionOptions = Object.entries(reportTabSections).map(([value, label]) => ({
    label,
    value,
  }));

  const priorityColorOptions = Object.entries(priorityColors).map(([value, label]) => ({
    label,
    value,
  }));

  const footerButtons = [
    {
      label: 'Save Alert',
      icon: <SaveIcon size={16} />,
      onClick: handleSubmit,
      color: 'bg-blue-600 hover:bg-blue-700',
      disabled: loading
    },
    {
      label: 'Cancel',
      icon: <X size={16} />,
      onClick: closeModal,
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <div className="mt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          <Plus size={18} />
          Create Alert
        </button>
      </div>

      <SortableTable
        data={alerts}
        columns={columns}
        loading={loading}
        checkboxColumn
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.perPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        serverSidePagination
        onPageChange={(page) => {
          setPagination(prev => ({ ...prev, currentPage: page }));
        }}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeModal}
        title={selectedAlert ? 'Edit Alert' : 'Create Alert'}
        size='custom'
        customWidth='800px'
        footer={footerButtons}
      >
        <DebouncedSearchDropdown
          label="Select Claimant"
          name='instruct_case_id'
          initialValue={
            formData.instruct_case_id && formData.claimant?.name
              ? formData.claimant?.name
              : ''
          }
          placeholder="Search for a claimant"
          searchFunction={searchClaimants}
          onSelect={(claimant) => setFormData(prev => ({
            ...prev,
            instruct_case_id: claimant.id,
            claimant
          }))}
          displayKey="name"
          valueKey="id"
          minSearchLength={2}
          debounceTime={300}
          errors={errors}
        />

        <SelectField
          name="tab_name"
          label={'Select Tab'}
          value={formData.tab_name}
          options={reportTabSectionOptions}
          onChange={handleSelectChange('tab_name', setFormData)}
          errors={errors}
        />

        <SelectField
          name="priority"
          label={'Select Priority'}
          value={formData.priority}
          options={priorityOptions}
          onChange={handleSelectChange('priority', setFormData)}
          errors={errors}
        />

        <SelectField
          name="color"
          label={'Select Color'}
          value={formData.color}
          options={priorityColorOptions}
          onChange={handleSelectChange('color', setFormData)}
          errors={errors}
        />

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message:
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
            rows={3}
            placeholder="Enter your message here..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message[0]}</p>}
        </div>
      </Modal>

      {isDetailOpen && (
        <Suspense fallback={
          null}>
          <AlertDetails
            alert={selectedAlert}
            isDetailOpen={isDetailOpen}
            setIsDetailOpen={setIsDetailOpen}
          />
        </Suspense>
      )}
    </div>
  );
};

export default React.memo(ZaxAlert);