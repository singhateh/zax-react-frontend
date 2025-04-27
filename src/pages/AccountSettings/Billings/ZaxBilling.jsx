import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Edit, Trash2, Eye, Plus, Download, Printer, FileText, Calendar, ChevronDown, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import SortableTable from '../../../components/SortableTable';
import { formatCurrency, formatDisplayDate } from '../../../utilities/constant';
import api from '../../../services/api';
import { BILLING_ROUTES } from '../../../constants/apiRoutes';
import Modal from '../../../components/Modal';
import DateField from '../../../components/DateField';
import SelectField from '../../../components/SelectField';
// import 'react-datepicker/dist/react-datepicker.css';

const ZaxBilling = () => {
    // State declarations
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: null,
        endDate: null,
        month: ''
    });

    const [pagination, setPagination] = useState({
        perPage: 10,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    // Refs for stable values and cleanup
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Columns configuration
    const columns = [
        { key: 'month', label: 'Month', sortable: true },
        { key: 'invoice_no', label: 'Invoice No', sortable: true },
        { key: 'invoice_date', label: 'Invoice Date', sortable: true },
        { key: 'net_value', label: 'Net Value', sortable: true, align: 'right' },
        { key: 'vat', label: 'VAT 20%', sortable: true, align: 'right' },
        { key: 'gross', label: 'Gross', sortable: true, align: 'right' },
        { key: 'balance', label: 'Balance', sortable: true, align: 'right' },
        { key: 'due_date', label: 'Due Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'file', label: 'File' },
        { key: 'action', label: 'Actions', align: 'center' }
    ];

    // Status badge component
    const StatusBadge = React.memo(({ status }) => {
        const statusColors = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800',
            draft: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.draft}`}>
                {status?.toUpperCase() || 'UNKNOWN'}
            </span>
        );
    });

    // File download component
    const FileDownload = React.memo(({ file }) => {
        if (!file) return <span className="text-gray-400">No file</span>;

        return (
            <button
                onClick={() => window.open(file.url, '_blank')}
                className="flex items-center text-blue-600 hover:text-blue-800"
            >
                <FileText className="w-4 h-4 mr-1" />
                Download
            </button>
        );
    });

    // Action buttons component
    const InvoiceActions = React.memo(({ invoice }) => (
        <div className="flex justify-center space-x-2">
            <button
                onClick={() => handleViewInvoice(invoice)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="View invoice"
            >
                <Eye size={18} />
            </button>
            <button
                onClick={() => handleEditInvoice(invoice)}
                className="p-1 text-green-600 hover:text-green-800"
                title="Edit invoice"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => handleDeleteInvoice(invoice.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Delete invoice"
            >
                <Trash2 size={18} />
            </button>
        </div>
    ));

    // Format data for table
    const formatDataCallback = useCallback((invoice) => ({
        ...invoice,
        month: invoice.month || 'N/A',
        invoice_no: invoice.invoice_no || 'N/A',
        invoice_date: formatDisplayDate(invoice.invoice_date),
        net_value: formatCurrency(invoice.net_value),
        vat: formatCurrency(invoice.vat),
        gross: formatCurrency(invoice.gross),
        balance: formatCurrency(invoice.balance),
        due_date: formatDisplayDate(invoice.due_date),
        status: <StatusBadge status={invoice.status} />,
        file: <FileDownload file={invoice.file} />,
        action: <InvoiceActions invoice={invoice} />
    }), []);

    // Fetch invoices data
    const fetchData = useCallback(async (page = 1) => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);

            // Cancel previous request if exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const params = {
                page,
                per_page: pagination.perPage,
                status: filters.status,
                start_date: filters.startDate?.toISOString().split('T')[0],
                end_date: filters.endDate?.toISOString().split('T')[0],
                month: filters.month
            };

            const response = await api.get(BILLING_ROUTES.GET_ALL, {
                params,
                signal: controller.signal
            });

            if (!isMountedRef.current) return;

            const { data, pagination: paginationData } = response.data;

            setInvoices(data.map(formatDataCallback));
            setPagination(prev => ({
                ...prev,
                totalPages: paginationData?.last_page,
                totalItems: paginationData?.total,
                currentPage: page,
                perPage: paginationData?.per_page
            }));

        } catch (error) {
            if (error.name !== 'AbortError' && isMountedRef.current) {
                console.error('Error fetching invoices:', error);
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
        filters.month
    ]);

    // Main data fetching effect
    useEffect(() => {
        isMountedRef.current = true;
        fetchData(pagination.currentPage);

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    // Handlers
    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        // Implement view functionality
    };

    const handleEditInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsFormOpen(true);
    };

    const handleDeleteInvoice = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Invoice?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(BILLING_ROUTES.DELETE(id));
                setInvoices(prev => prev.filter(inv => inv.id !== id));
                showSuccessToast('Invoice deleted successfully');
            } catch (error) {
                console.error('Error deleting invoice:', error);
                showErrorToast('Failed to delete invoice');
            }
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            status: '',
            startDate: null,
            endDate: null,
            month: ''
        });
    };

    // Helper functions
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

    // Status options for filter
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'draft', label: 'Draft' }
    ];

    // Month options for filter
    const monthOptions = [
        { value: '', label: 'All Months' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        // ... rest of months
    ];

    return (
        <div className="mt-20">
            {/* Header with filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Billing Invoices</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} />
                            New Invoice
                        </button>

                        <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Printer size={18} />
                            Print
                        </button>

                        <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Filter controls */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SelectField
                        label={'Status'}
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={statusOptions}
                    />


                    <SelectField
                        label={'Month'}
                        value={filters.month}
                        onChange={(e) => handleFilterChange('month', e.target.value)}
                        options={monthOptions}
                    />


                    <DateField
                        label={'From Date'}
                        selected={filters.startDate}
                        onChange={(date) => handleFilterChange('startDate', date)}
                        selectsStart
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        placeholderText="Select start date"
                    />


                    <DateField
                        label={'To Date'}
                        selected={filters.endDate}
                        onChange={(date) => handleFilterChange('endDate', date)}
                        selectsEnd
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        minDate={filters.startDate}
                        placeholderText="Select end date"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={resetFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <SortableTable
                    data={invoices}
                    columns={columns}
                    loading={loading}
                    currentPage={pagination.currentPage}
                    itemsPerPage={pagination.perPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={(page) => {
                        setPagination(prev => ({ ...prev, currentPage: page }));
                        fetchData(page);
                    }}
                    onPerPageChange={(perPage) => {
                        setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
                    }}
                    serverSidePagination
                    className="border-0"
                />
            </div>

            {/* Invoice Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                size="xl"
            >
                {/* Implement your invoice form here */}
                <div className="space-y-4">
                    <p>Invoice form would go here with all necessary fields</p>
                </div>
            </Modal>
        </div >
    );
};

export default React.memo(ZaxBilling);