import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import SortableTable from '../../../components/SortableTable';
import { getStatusColor } from '../../../utilities/constant';
import { FaCloudUploadAlt, FaEye, FaLink, FaMoneyCheck, FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { DOCTOR_STATUS } from '../../../constants';
import { CheckCheckIcon, X } from 'lucide-react';
import Modal from '../../../components/Modal';
import PaymentSetup from '../PaymentSetup';
import DocumentUploadForm from './DocumentUploadForm';
import Filter from './Filter';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import PrettyPrintJSON from '../../../components/PrettyPrintJSON';

const API_BASE_URL = "doctor/contracts";

const ContractsPage = () => {
    const [entities, setEntities] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractDocuments, setContractDocuments] = useState([]);
    const [searchOption, setSearchOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentTab, setPaymentTab] = useState(null);
    const [selectedAgencySolicitor, setSelectedAgencySolicitor] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const hasActiveFilters = searchQuery || searchOption || filters.status || filters.startDate || filters.endDate || filters.showExpiredOnly;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'action', label: 'Actions' }
    ];

    const CustomName = ({ agencySolicitor }) => {
        if (!agencySolicitor) return null;

        return (
            <div className="flex items-start space-x-2">
                <div>
                    <div className="font-semibold">{agencySolicitor?.company_name || "N/A"}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                        {agencySolicitor?.address || "Address not available"}
                        {agencySolicitor?.mobile_phone && <div>{agencySolicitor.mobile_phone}</div>}
                    </div>
                    <div className="mt-1 space-y-1 text-xs">
                        {agencySolicitor?.appointment_email && (
                            <div className="text-red-500">Appt Email: {agencySolicitor.appointment_email}</div>
                        )}
                        {agencySolicitor?.dna_email && (
                            <div className="text-blue-500">DNA Email: {agencySolicitor.dna_email}</div>
                        )}
                        {agencySolicitor?.report_email && (
                            <div className="text-orange-500">Reports Email: {agencySolicitor.report_email}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ContractActions = ({ agencySolicitor }) => (
        <div className="flex flex-wrap gap-1">
            {agencySolicitor.contract ? (
                <>
                    <button
                        onClick={() => handleViewPaymentSetup(agencySolicitor.id, agencySolicitor.type)}
                        className="btn btn-xs btn-flat btn-default"
                        title={filters.displayWithPaymentTerms ? 'View Expert Payment Terms' :
                            (agencySolicitor?.contract_payment_count ?
                                'Expert Payment Terms Already Setup' :
                                'Setup Expert Payment Terms')}
                    >
                        <FaMoneyCheck
                            size={16}
                            className={`contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8 ${agencySolicitor?.contract_payment_count ? 'text-green-600' : 'text-red-600'}`}
                        />
                    </button>

                    {filters.displayWithLinks && (
                        <button
                            className="btn btn-xs btn-flat btn-default"
                            onClick={() => handleTerminate(agencySolicitor.id)}
                            title={`Terminate ${agencySolicitor.company_name} Contract`}
                        >
                            <FaLink size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500" />
                        </button>
                    )}

                    <button
                        className="btn btn-xs btn-flat btn-default"
                        onClick={() => handleUploadDocument(agencySolicitor.contract.id)}
                        title="Contract Upload Documents"
                    >
                        <FaCloudUploadAlt size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8 text-cyan-500" />
                    </button>
                    <button
                        className="btn btn-xs btn-flat btn-default"
                        onClick={() => handleViewDocument(agencySolicitor.contract.id)}
                        title="View Uploaded Documents"
                    >
                        <FaEye size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </button>

                    {agencySolicitor.contract.status === DOCTOR_STATUS.HOLD ? (
                        <button
                            className="btn btn-xs btn-flat"
                            onClick={() => handleReactivate(agencySolicitor.id)}
                            title="Activate Contract"
                        >
                            <FaPlayCircle size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8 text-orange-500" />
                        </button>
                    ) : (
                        <button
                            className="btn btn-xs btn-flat btn-default"
                            onClick={() => handlePause(agencySolicitor.id)}
                            title="Pause Contract Temporarily"
                        >
                            <FaPauseCircle size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-500" />
                        </button>
                    )}
                </>
            ) : (
                <button
                    onClick={() => handleAccept(agencySolicitor)}
                    className="btn btn-xs btn-flat btn-default"
                    title="Accept Contract"
                >
                    <div className="flex gap-2">
                        <CheckCheckIcon size={16} className="contract-icon-xs sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        Accept Contract
                    </div>
                </button>
            )}
        </div>
    );

    const formatDataCallback = useCallback((agencySolicitor) => ({
        id: agencySolicitor.id,
        name: <CustomName agencySolicitor={agencySolicitor} />,
        type: (
            <span className={agencySolicitor.type === 'Solicitor' ? 'text-orange-600 font-medium' : 'text-primary font-medium'}>
                {agencySolicitor.type}
            </span>
        ),
        status: (
            <span className={getStatusColor(agencySolicitor.contract_status)}>
                {agencySolicitor.contract_status || 'N/A'}
            </span>
        ),
        action: <ContractActions agencySolicitor={agencySolicitor} />,
    }), []);

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(API_BASE_URL, {
                params: {
                    page,
                    per_page: pagination.perPage,
                    search: searchQuery,
                    filter: searchOption,
                    status: filters.status,
                    start_date: filters.startDate,
                    end_date: filters.endDate,
                    expired_only: filters.showExpiredOnly
                }
            });

            const { data, pagination: paginationData, contract_types } = response.data;
            setEntities(data.map(formatDataCallback));

            setContractTypes(contract_types);
            setPagination(prev => ({
                ...prev,
                totalPages: paginationData.last_page,
                totalItems: paginationData.total,
                currentPage: paginationData.current_page,
                perPage: paginationData.per_page
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
            showErrorToast(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [pagination.perPage, searchQuery, searchOption, filters, formatDataCallback]);

    useEffect(() => {
        fetchData(pagination.currentPage);
    }, [fetchData, pagination.currentPage]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchData(1);
    };

    const handleSearchOption = (option) => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        // fetchData(1);
        setSearchOption(option)
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

    const showConfirmationDialog = async (options) => {
        return Swal.fire({
            icon: options.icon || 'question',
            title: options.title,
            text: options.text,
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'Confirm',
            cancelButtonText: options.cancelText || 'Cancel',
            reverseButtons: true,
            ...options
        });
    };

    const handleStatusChange = async (id, action, successMessage) => {
        const result = await showConfirmationDialog({
            title: `Are you sure?`,
            text: `You want to ${action} this contract`,
            icon: 'warning'
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                const response = await api.post(`${API_BASE_URL}/${action}/${id}`);
                const { data } = response.data;

                setEntities(prev =>
                    prev.map(entity =>
                        entity.id === id ? formatDataCallback(data) : entity
                    )
                );
                showSuccessToast(successMessage);
            } catch (error) {
                showErrorToast(error.response?.data?.message || `Failed to ${action} contract`);
            }
        }
    };

    const handleAccept = (agencySolicitorData) => {
        handleStatusChange(
            agencySolicitorData.id,
            'accept',
            'Contract accepted successfully'
        );
    };

    const handleTerminate = (id) => {
        handleStatusChange(
            id,
            'terminate',
            'Contract terminated successfully'
        );
    };

    const handleReactivate = (id) => {
        handleStatusChange(
            id,
            'reactivate',
            'Contract reactivated successfully'
        );
    };

    const handlePause = (id) => {
        handleStatusChange(
            id,
            'pause',
            'Contract paused successfully'
        );
    };

    const handleViewPaymentSetup = (id, mode) => {
        const tabName = mode === 'Solicitor' ? 'Instructor Payments' : `${mode} Payments`;
        setPaymentTab(tabName);
        setSelectedAgencySolicitor(id);
        setIsModalOpen(true);
    };

    const handleUploadDocument = (id) => {
        setSelectedContract(id);
        setIsUploadModalOpen(true);
        setIsViewMode(false);
    };

    const handleViewDocument = async (id) => {
        try {
            setIsLoading(true);
            setSelectedContract(id);
            setIsUploadModalOpen(true);
            setIsViewMode(true);
            setContractDocuments([]);

            const response = await api.post(`${API_BASE_URL}/${id}/upload`, { mode: true });

            const documents = Array.isArray(response.data?.data) ? response.data.data :
                Array.isArray(response.data) ? response.data : [];

            setContractDocuments(documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError(error.response?.data?.message || 'Failed to fetch documents');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleDisplayWithPaymentTerms = () => {
        setFilters(prev => ({ ...prev, displayWithPaymentTerms: !prev.displayWithPaymentTerms }));
    };

    const handleDisplayWithLinks = () => {
        setFilters(prev => ({ ...prev, displayWithLinks: !prev.displayWithLinks }));
    };

    const handleShowExpiredOnly = () => {
        setFilters(prev => ({ ...prev, showExpiredOnly: !prev.showExpiredOnly }));
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setIsUploadModalOpen(false);
    };

    const footerButtons = [
        {
            label: 'Cancel',
            icon: <X size={16} />,
            onClick: closeModal,
            color: 'bg-red-500',
        }
    ];

    if (error) {
        return (
            <div className="p-6 text-center text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto p-0 md:p-6 lg:p-8 bg-gray-50 min-1h-screen">
            <Filter
                isMobile={isMobile}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSearchOption={setSearchOption}
                handleSearchOption={handleSearchOption}
                searchOption={searchOption}
                hasActiveFilters={hasActiveFilters}
                handleDisplayWithPaymentTerms={handleDisplayWithPaymentTerms}
                displayWithPaymentTerms={filters.displayWithPaymentTerms}
                handleDisplayWithLinks={handleDisplayWithLinks}
                displayWithLinks={filters.displayWithLinks}
                handleSearch={handleSearch}
                setStatusFilter={(status) => setFilters(prev => ({ ...prev, status }))}
                statusFilter={filters.status}
                setStartDate={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                startDate={filters.startDate}
                setEndDate={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                endDate={filters.endDate}
                handleShowExpiredOnly={handleShowExpiredOnly}
                showExpiredOnly={filters.showExpiredOnly}
            />

            {/* <PrettyPrintJSON data={entities} /> */}

            <SortableTable
                data={entities}
                columns={columns}
                loading={loading}
                checkboxColumn
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.perPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                handlePageChange={handlePageChange}
                onPerPageChange={(limit) => {
                    setPagination(prev => ({ ...prev, perPage: limit, currentPage: 1 }));
                }}
                serverSidePagination
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={"Payment Setup"}
                footer={footerButtons}
                size="custom"
                customWidth="1200px"
                overlayClassName="bg-black bg-opacity-50 backdrop-blur-sm"
            >
                <PaymentSetup
                    paymentTab={paymentTab}
                    agencySolicitorId={selectedAgencySolicitor}
                    onError={(error) => {
                        console.error("Payment Setup Error:", error);
                        Swal.fire({
                            title: "Error",
                            text: error.message || "Failed to load payment setup",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }}
                />
            </Modal>

            <DocumentUploadForm
                contractTypes={contractTypes}
                isUploadModalOpen={isUploadModalOpen}
                closeModal={closeModal}
                selectedContract={selectedContract}
                documents={contractDocuments}
                setContractDocuments={setContractDocuments}
                setIsViewMode={setIsViewMode}
                isViewMode={isViewMode}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ContractsPage;